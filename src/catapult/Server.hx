package catapult;

import haxe.Json;

import js.Node;
import js.node.WebSocketNode;
import js.node.NodeStatic;
import mconsole.Console;

import sys.FileSystem;
import sys.io.File;

import catapult.Catapult;

using StringTools;
using Lambda;

/** When a file of this type is modified, execute the corresponding command */
typedef ManifestBlob = {
	var id :String;
	var path :String;
}

/** When a file of this type is modified, execute the corresponding command */
typedef Command = {
	var suffix :String;
	var command :String;
	@:optional var args :Array<String>;
}
//Loaded on startup
typedef Config = {
	var port :Int;
	var address :String;
	var file_server_path :String;
	@:optional var commands :Array<Command>;
	@:optional var manifests :Array<ManifestBlob>;
	@:optional var paths_to_watch_for_file_changes :Array<String>;
}

class Server 
{
	var _websocketServer :WebSocketServer;
	var _files :Map<String, WatchedFile>; //<filePath, WatchedFile>
	var _manifests :Map<String, ManifestData>; //<manifestBaseFolderName, ManifestData>
	var _servedFolders :Map<String, StaticServer>;
	var _defaultStaticServer :StaticServer;
	var _port :Int;
	var _config :Config;
	var _configPath :String;
	var _httpServer :NodeHttpServer;
	
	static var RETRY_INTERVAL_MS :Int = 50;
	
	public static function getLocalIp () :String
	{
		var en1 :Array<NodeNetworkInterface> = Node.os.networkInterfaces().en1;
		if (en1 != null) {
			for (n in en1) {
				if (n.family == "IPv4") {
					return n.address;
				}
			}
		}
		return "127.0.0.1";
	}
	
	public static function main () :Void
	{
		Console.start();
		new Server();
	}
	
	public function new ()
	{
		_manifests = new Map();
		init();
	}
	
	function createBlankCatapultFile() :Void
	{
		File.saveContent(".catapult", '{
	
			"file_server":"deploy/web/targets",
			"manifests" : [
				{"name" : "bootstrap", "path" : "demo/assets/bootstrap"}
			],
			"paths_to_watch_for_file_changes" : [
				"src",
				"deploy/web"
			],
			"commands" : [
				{
					"suffix" : ".hx",
					"command": "haxe",
					"args":["demo/client.hxml"]
				}
			]
		}');
	}
	
	function loadConfig() :Void
	{
		if (FileSystem.exists(_configPath))
		{
			var content = File.getContent(_configPath);
			try {
				_config = Json.parse(content);
				// Console.info({log:"Config loaded", config:_config});
			} catch (e :Dynamic) {
				Console.error({log:"Could not parse json config file=" + _configPath, err:e, content:content});
				Node.process.exit(1);
			}
		} 
		else
		{
			Console.warn("No catapult config file detected at " + _configPath);
			Console.warn("Please run node catapult.js init");
			Node.process.exit(1);
		}
		
		//Static file server on the directories from the 'watch' option
		_servedFolders = new Map();
		var manifests :Array<ManifestBlob> = Reflect.hasField(_config, "manifests") ? _config.manifests : [];
		if (manifests != null) {
			for (manifest in manifests) {
				var staticServer = NodeStatic.Server(manifest.path);
				Console.assert(staticServer != null, "staticServer != null");
				_servedFolders.set(manifest.id, staticServer);
				setupFileWatching(manifest.path);
			}
		}
		
		if (Reflect.hasField(_config, "paths_to_watch_for_file_changes"))
		{
			for (path in _config.paths_to_watch_for_file_changes)
			{
				setupFileWatching(path);
			}
		}
		
		_defaultStaticServer = NodeStatic.Server(_config.file_server_path);
		Console.info("Serving static files from " + _config.file_server_path);
	
		if (_httpServer == null)
		{
			//Create the http server
			var http = Node.http;
			_httpServer = http.createServer(onHttpRequest);
			// _config.port = program.port;
	
			_httpServer.listen(_config.port, _config.address, function() {
				Console.info(Date.now() + ' Blink server available at:\n    [http://' + _config.address + ':' + _config.port + ']\n    [ws://' + _config.address + ':' + _config.port + ']');
			});
		}
		
		if (_websocketServer == null)
		{
			var WebSocketServer = Node.require('websocket').server;
			var serverConfig :WebSocketServerConfig = {httpServer:_httpServer, autoAcceptConnections:false};
			_websocketServer = untyped __js__("new WebSocketServer()");
			_websocketServer.on('connectFailed', onConnectFailed);
			_websocketServer.on('request', onWebsocketRequest);
			_websocketServer.mount(serverConfig);
		}
	}
	
	function init () :Void
	{
		//Process the command line args
		//https://github.com/visionmedia/commander.js
		var program :Dynamic = Node.require('commander');
		program
			.version('Blink Asset Server 0.1.  Serving up flaming hot assets since 1903.\n Run in the root of your game project.')
			.option('-c, --config <config>', 'Use a non-default config file (defaults to ".catapult") ', untyped String, ".catapult")
			.parse(Node.process.argv);

		program
			.command('init')
			.description('Creates a blank .catapult config file')
			.action(function(env) {
				createBlankCatapultFile();
				Console.info('Created config file .catapult');
			});


		_configPath = program.config;
		Console.info("Config path=" + _configPath);
		loadConfig();
		watchFile({md5:"", bytes:0, relativePath:_configPath, absolutePath:_configPath, manifestKey:""});
	}
	
	function onHttpRequest (req :NodeHttpServerReq, res :NodeHttpServerResp) :Void
	{
		if (req.url == "/favicon.ico") {
			res.writeHead(404);
			res.end();
			return;
		}
		
		if (serveManifest(req, res)) {
			return;
		}
		
		if (serveManifests(req, res)) {
			return;
		}
		
		if (serveOds(req, res)) {
			return;
		}
		
		//Default
		serveFile(req, res);
	}
	
	function serveFile(req :NodeHttpServerReq, res :NodeHttpServerResp) :Bool
	{
		//Serve the file request
		var urlObj = Node.url.parse(req.url, true);
		var firstPathToken = urlObj.pathname.substr(1).split("/")[0];
		
		var fileKey = urlObj.pathname.substr(1);
		// Console.log("fileKey: " + fileKey + ", _files.exists(fileKey)=" + _files.exists(fileKey));
		
		if (_files.exists(fileKey)) 
		{
			var fileBlob = _files[fileKey];
			// Console.log({fileBlob:fileBlob});
			var manifest = _manifests[fileBlob.manifestKey];
			// Console.log({manifest:manifest});
			var serverKey = manifest.id;//Node.path.dirname(
			// Console.log({serverKey:serverKey});
			var staticServer :StaticServer = _servedFolders.get(serverKey);
			Console.assert(staticServer != null, {message:"staticServer != null", urlObj:urlObj, fileBlob:fileBlob, manifest:manifest, _servedFolders:_servedFolders});
			
			var tokens = urlObj.pathname.split(Node.path.sep).filter(function(s :String) return s != null && s.length > 0);
			var filePath = tokens.join(Node.path.sep);
			
			var absoluteFilePath = Node.path.join(staticServer.root, fileBlob.relativePath);
			
			Node.fs.exists(absoluteFilePath, function(exists :Bool) :Void {
				if (exists) 
				{
					
					Console.info("Served: " + absoluteFilePath);
					staticServer.serveFile(fileBlob.relativePath, 200, null, req, res);
				} 
				else
				{
					Console.warn(absoluteFilePath + " not found.");
					res.writeHead(404);
					res.end();
				}
			});
		} 
		else 
		{
			if (fileKey == "" || fileKey == "/")
			{
				//change to index.html
				Console.info("Defaulting to index.html");
				_defaultStaticServer.serveFile('/index.html', 200, {}, req, res);
			}
			else 
			{
				_defaultStaticServer.serve(req, res, function(err, result)  {
					if (err) 
					{
						Console.warn(err);
						Console.info(urlObj + "");
						Console.info(Date.now() + ' Received request for ' + req.url);
						
						res.writeHead(404, { 'Content-Type': 'text/plain' });
						var manifestKeys = {iterator:_manifests.keys}.array();
						for (i in 0...manifestKeys.length) 
						{
							manifestKeys[i] = "http://<host>:" + _config.port +  "/" + manifestKeys[i] + "/manifest.json";
						}
						res.end("No manifest at that path found (firstPathToken=" + firstPathToken + "), possible served folders are [" + {iterator:_servedFolders.keys}.array().join(", ") + "]");
					}
					else
					{
						Console.info("Served: " + _defaultStaticServer.root + urlObj.pathname);
					}
				});
			}
		}
		return true;
	}
	
	function serveManifest(req :NodeHttpServerReq, res :NodeHttpServerResp) :Bool
	{
		if (!req.url.endsWith("/manifest.json")) {
			return false;
		}
		
		var pathToken = req.url.replace("manifest.json", "");
		pathToken = pathToken.replace("/", "");
		
		if (!_manifests.exists(pathToken)) {
			res.writeHead(404, { 'Content-Type': 'text/plain' });
			var manifestKeys = {iterator:_manifests.keys}.array();
			for (i in 0...manifestKeys.length) {
				manifestKeys[i] = "http://<host>:" + _config.port +  "/" + manifestKeys[i] + "/manifest.json";
			}
			res.end("No manifest at that path found, possible manifests are [" + manifestKeys.join(", ") + "]");
			return true;
		}
		
		var manifestData :ServedManifestMessage = {manifest:getServedManifest(pathToken)};
		
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(Json.stringify(manifestData, null, "\t"));
		
		return true;
	}
	
	function getServedManifest(manifestKey) :ServedManifest
	{
		if (!_manifests.exists(manifestKey)) {
			Console.error("No manifest for key=" + manifestKey);
			return null;
		}
		
		var files = new Array<FileDef>();
		
		for (f in _manifests.get(manifestKey).assets) {
			files.push({name:f.relativePath, md5:f.md5, bytes:f.bytes});
		}
		
		if (_manifests.get(manifestKey).md5 == null) {
			var s = new StringBuf();
			for (f in _manifests.get(manifestKey).assets) {
				s.add(f.md5);
			}
			_manifests.get(manifestKey).md5 = Node.crypto.createHash("md5").update(s.toString()).digest("hex");
		}
		
		var manifest :ServedManifest = {assets:files, id:manifestKey, md5:_manifests.get(manifestKey).md5};
		
		return manifest;
	}
	
	function serveManifests(req :NodeHttpServerReq, res :NodeHttpServerResp) :Bool
	{
		if (req.url != "/manifests.json") {
			return false;
		}
		
		var result :{manifests:{}} = {manifests:{}};
		var manifests :Dynamic = new Array<ServedManifest>(); 
		
		for (manifestKey in _manifests.keys()) {
			var manifest :ServedManifest = getServedManifest(manifestKey);
			Reflect.setField(result.manifests, manifestKey, manifest);
		}
		
		res.writeHead(200, { 'Content-Type': 'application/json' });
		Console.log("Manifests: " + Json.stringify(result, null, "\t"));
		res.end(Json.stringify(result, null, "\t"));
		
		return true;
	}
	
	function serveOds(req :NodeHttpServerReq, res :NodeHttpServerResp) :Bool
	{
		if (!req.url.endsWith(".ods")) {
			return false;
		}
		
		var urlObj = Node.url.parse(req.url, true);
		var firstPathToken = urlObj.pathname.substr(1).split("/")[0];
		
		var filePath = urlObj.pathname;
		if (filePath.charAt(0) == "/") {
			filePath = filePath.substr(1);
		}
		
		if (!_files.exists(filePath)) {
			Console.error("Requested " + filePath + ", but no file exists");
			res.writeHead(404, { 'Content-Type': 'text/plain' });
			res.end("Requested " + filePath + ", but no file exists.\n\tAll files:\n\t\t" + {iterator:_files.keys}.array().join("\n\t\t"));
			return true;
		}
		
		var fileBlob = _files.get(filePath);
		
		var data = OdsRuntimeParser.parse(fileBlob.absolutePath);
		
		res.writeHead(200, { 'Content-Type': 'application/json' });
		Console.log("Serving : " + Json.stringify(data, null, "\t"));
		res.end(Json.stringify(data, null, "\t"));
		
		return true;
	}
	
	function onConnectFailed (error :Dynamic) :Void
	{
		Console.error("WebSocketServer connection failed: " + error);
	}
	
	function onWebsocketRequest (request :WebSocketRequest) :Void
	{
		Console.info("request.requestedProtocols: " + request.requestedProtocols);
		var protocol :String = null; ////For now, accept all requests.  This could be limited if required.
		var connection = request.accept(protocol, request.origin);
		
		var onError = function(error) {
			Console.error(' Peer ' + connection.remoteAddress + ' error: ' + error);
		}
		connection.on('error', onError);
		
		connection.once('close', function(reasonCode, description) {
			Console.info(Date.now() + ' client at "' + connection.remoteAddress + '" disconnected.');
			connection.removeListener('error', onError);
		});
	}
	
	function onFileChanged(file :WatchedFile) :Void
	{
		if (file.relativePath == ".catapult")
		{
			Console.warn(".catapult changed, reloading config!!");
			loadConfig();
			return;
		}
		
		function sendMessageToAllClients(msg :String) {
			for (connection in _websocketServer.connections) {
				connection.sendUTF(msg);
			}
		}

		// Console.info("File changed: " + Json.stringify(file, null, "\t"));
		file.md5 = FileSystem.signature(file.absolutePath);
		file.bytes = FileSystem.stat(file.absolutePath).size;
		
		//Invalidate the manifest md5
		if (_manifests.exists(file.manifestKey)) {
			_manifests.get(file.manifestKey).md5 = null;
		}
		
		var message :FileChangedMessage = {type:Catapult.MESSAGE_TYPE_FILE_CHANGED, name:file.relativePath, md5:file.md5, manifest:file.manifestKey, bytes:file.bytes};
		var messageString = Json.stringify(message, null, "\t");
		
		sendMessageToAllClients(messageString);

		//Send a reload message on a js file change
		if (file.relativePath.endsWith(".js")) {
			var restartMessage :Message = {type:Catapult.MESSAGE_TYPE_RESTART_};
			messageString = Json.stringify(restartMessage, null, "\t");
			sendMessageToAllClients(messageString);
		}
		
		if (file.relativePath.endsWith(".ods")) {
			Console.info("LibreOffice spreadsheet changed, sending json data.");
			//Send the parsed ODS file
			//Meant for haxe objects defined in a spreadsheet.
			//https://github.com/ncannasse/hxods
			//The updated ODS file is not copied. Should it be?  Probably not since it could be downloaded
			//and this might not be desirable
			var update = function() {
				var data = OdsRuntimeParser.parse(file.absolutePath);
				var dataMessage :ODSDataChangedMessage = cast message;
				dataMessage.type = Catapult.MESSAGE_TYPE_FILE_CHANGED_ODS;
				dataMessage.data = cast data;
				var dataMessageString = Json.stringify(dataMessage, null, "\t");
				sendMessageToAllClients(dataMessageString);
			}
			//Save operations sometimes cause the file size to be 0.  It's probably a copy then rename operation
			if (FileSystem.stat(file.absolutePath).size == 0) {
				Node.setTimeout(update, 100);
			} else {
				update();
			}
		}
		
		//Custom commands
		if (_config.commands != null) 
		{
			for (commandData in _config.commands) 
			{
				if (file.relativePath.endsWith(commandData.suffix))
				{
					var commandProcess = Node.childProcess.spawn(commandData.command, commandData.args != null ? commandData.args : []);
					
					commandProcess.stdout.on('data', function (data) 
					{
						Console.info('stdout: ' + data);
					});
					
					
					commandProcess.stderr.on('data', function (data) 
					{
						Console.info('stderr: ' + data);
					});
					
					commandProcess.on('close', function (code) 
					{
						Console.info('child process exited with code ' + code);
					});
				}
			}
		}
	}
	
	function setupFileWatching(rootPath :String) :Void
	{
		Console.info("Watching rootPath: " + rootPath);
		
		if (_files == null) 
		{
			_files = new Map();
		}
		
		if (!(FileSystem.exists(rootPath) && FileSystem.isDirectory(rootPath)))
		{
			throw rootPath + " doesn't exist";
		}
		
		// for (subdir in FileSystem.readDirectory(rootPath)) 
		// {
		// 	var basePath = FileSystem.join(rootPath, subdir);
		// 	if (FileSystem.isDirectory(basePath)) 
		// 	{
				var baseName = Node.path.basename(rootPath);
				// var baseName = subdir;
				var fileArray = new Array<WatchedFile>();
				_manifests[baseName] = {md5:null, assets:fileArray, id:baseName, relativePath:rootPath};	
				
				var numFilesWatched = 0;
				for (relativeFilePath in FileSystem.readRecursive(rootPath, fileFilter)) 
				{
					var absoluteFilePath = FileSystem.join(rootPath, relativeFilePath);
					var fileBlob :WatchedFile = 
					{
						manifestKey:baseName, 
						md5:FileSystem.signature(absoluteFilePath), 
						relativePath:relativeFilePath, 
						absolutePath:absoluteFilePath, 
						bytes:FileSystem.stat(absoluteFilePath).size
					};
					//The key is what requests will use to get this file: base name + relative path (given in the manifest)
					_files[FileSystem.join(baseName, fileBlob.relativePath)] = fileBlob;
					fileArray.push(fileBlob);
					watchFile(fileBlob);
					numFilesWatched++;
				}
				Console.info("Watching " + numFilesWatched + " files in " + rootPath);
		// 	}
		// }
	}
	
	function watchFile(file :WatchedFile, fireChangedEvent :Bool = false, retry :Bool = false, retryCount :Int = 0) :Void
	{
		Node.fs.exists(file.absolutePath, function(exists) {
			if (exists) {
				// Console.info("Watching: " + file.absolutePath);
				var options :NodeWatchOpt = {persistent:true};
				var watcher :NodeFSWatcher = Node.fs.watch(file.absolutePath, options, function(event :String, ?ignored :String) {
					//Some programs save a file with an intermediate rename step.
					//This breaks the NodeFSWatcher, so we have to watch the new file
					Console.info({log:"file_changed", event:event, path:file.absolutePath});
					if (event == 'rename') {
						Console.warn(file.absolutePath + " renamed.");
						//Sometimes 'renaming' a file means deleting then recreating
						//This means that there is some time between those events where
						//the file doesn't exist.  So retry x times until it does exist.
						if (FileSystem.exists(file.absolutePath))
						{
							watchFile(file);
						}
						else 
						{
							haxe.Timer.delay(function() {watchFile(file, true, true, 0);}, RETRY_INTERVAL_MS);
						}
					} else {
						if (FileSystem.stat(file.absolutePath).size > 0)
						{
							onFileChanged(file);
						}
						else
						{
							// Console.info("Ignoring file change event because bytes==0 " + file.absolutePath); 
						}
					}
				});
				file.md5 = FileSystem.signature(file.absolutePath);
			}
			else
			{
				// Console.warn("Asked to watch but doesn't exits: " + file.absolutePath);
				if (retry)
				{
					// Console.info("Retrying");
					if (retryCount > 100)
					{
						Console.warn("Retry count > 100, not retrying anymore");
					}
					else
					{
						haxe.Timer.delay(function() {watchFile(file, fireChangedEvent, retry, retryCount + 1);}, RETRY_INTERVAL_MS);
						// watchFile(file, fireChangedEvent, retry, retryCount + 1);
					}
				}
			}
		});
	}
	
	static function fileFilter(filePath :String) :Bool
	{
		return filePath != null && !(Node.path.basename(filePath).startsWith(".") || filePath.endsWith("cache"));
	}
}
