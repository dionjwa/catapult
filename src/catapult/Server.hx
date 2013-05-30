package catapult;

import haxe.Json;

import js.Node;
import js.node.WebSocketNode;
import js.node.NodeStatic;
import mconsole.Console;

import sys.FileSystem;

import catapult.Catapult;

using StringTools;
using Lambda;

class Server 
{
	inline public static var FILE_CHANGED_MESSAGE_NAME :String = "file_changed"; 
	inline public static var FILE_CHANGED_MESSAGE_NAME_ODS :String = "file_changed_ods"; 
	
	var _websocketServer :WebSocketServer;
	var _files :Map<String, WatchedFile>; //<filePath, WatchedFile>
	var _manifests :Map<String, ManifestData>; //<manifestBaseFolderName, ManifestData>
	var _servedFolders :Map<String, StaticServer>;
	var _port :Int;
	
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
	
	function init () :Void
	{
		//Process the command line args
		//https://github.com/visionmedia/commander.js
		var program :Dynamic= Node.require('commander');
		program
			.version('Blink Asset Server 0.1.  Serving up flaming hot assets since 1903.\n Run in the root of your game project.')
			.option('-p, --port <port>', 'specify the http+ws port, defaults to [8000]. ', untyped Number, 8000)
			.option('-d, --watch <watch>', 'Comma separated list of directories to watch, e.g. foo,someFolder/src', function list(val) {
			  return val.split(',');
			})
			.parse(Node.process.argv);
			
		//Static file server on the directories from the 'watch' option
		_servedFolders = new Map();
		var watchedFolders :Array<Dynamic> = program.watch;
		if (watchedFolders != null) {
			for (watchedFolder in watchedFolders) {
				var staticServer = NodeStatic.Server(watchedFolder);
				Console.assert(staticServer != null, "staticServer != null");
				_servedFolders.set(watchedFolder, staticServer);
			}
			setupFileWatching(program.watch);
		} else {
			Console.warn("No folders to watch: run with '--help' option for commands");
		}
	
		//Create the http server
		var http = Node.http;
		var httpServer = http.createServer(onHttpRequest);
		_port = program.port;

		var address = "0.0.0.0";
		httpServer.listen(_port, address, function() {
			Console.info(Date.now() + ' Blink server available at:\n    [http://' + address + ':' + _port + ']\n    [ws://' + address + ':' + _port + ']');
		});
		
		var WebSocketServer = Node.require('websocket').server;
		var serverConfig :WebSocketServerConfig = {httpServer:httpServer, autoAcceptConnections:false};
		_websocketServer = untyped __js__("new WebSocketServer()");
		_websocketServer.on('connectFailed', onConnectFailed);
		_websocketServer.on('request', onWebsocketRequest);
		_websocketServer.mount(serverConfig);
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
		
		if (_files.exists(fileKey)) {
			var fileBlob = _files[fileKey];
			var manifest = _manifests[fileBlob.manifestKey];
			var staticServer :StaticServer = _servedFolders.get(manifest.relativePath);
			
			var tokens = urlObj.pathname.split(Node.path.sep).filter(function(s :String) return s != null && s.length > 0);
			tokens.shift();
			var filePath = tokens.join(Node.path.sep);
			
			Node.fs.exists(Node.path.join(staticServer.root, filePath), function(exists :Bool) :Void {
				if (exists) {
					Console.info("Serving " + filePath);
					staticServer.serveFile(filePath, 200, null, req, res);
				} else {
					Console.warn(filePath + " not found.");
					res.writeHead(404);
					res.end();
				}
			});
		} else {
			Console.info(urlObj + "");
			Console.info(Date.now() + ' Received request for ' + req.url);
			
			res.writeHead(404, { 'Content-Type': 'text/plain' });
			var manifestKeys = {iterator:_manifests.keys}.array();
			for (i in 0...manifestKeys.length) {
				manifestKeys[i] = "http://<host>:" + _port +  "/" + manifestKeys[i] + "/manifest.json";
			}
			res.end("No manifest at that path found (firstPathToken=" + firstPathToken + "), possible served folders are [" + {iterator:_servedFolders.keys}.array().join(", ") + "]");
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
				manifestKeys[i] = "http://<host>:" + _port +  "/" + manifestKeys[i] + "/manifest.json";
			}
			res.end("No manifest at that path found, possible manifests are [" + manifestKeys.join(", ") + "]");
			return true;
		}
		
		var manifest :ServedManifestData = getServedManifest(pathToken);
		
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(Json.stringify({manifest:manifest}, null, "\t"));
		
		return true;
	}
	
	function getServedManifest(manifestKey) :ServedManifestData
	{
		if (!_manifests.exists(manifestKey)) {
			Console.error("No manifest for key=" + manifestKey);
			return null;
		}
		
		var files = new Array<FileDef>();
		
		for (f in _manifests.get(manifestKey).assets) {
			files.push({path:f.relativePath, md5:f.md5});
		}
		
		if (_manifests.get(manifestKey).md5 == null) {
			var s = new StringBuf();
			for (f in _manifests.get(manifestKey).assets) {
				s.add(f.md5);
			}
			_manifests.get(manifestKey).md5 = Node.crypto.createHash("md5").update(s.toString()).digest("hex");
		}
		
		var manifest :ServedManifestData = {assets:files, id:manifestKey, md5:_manifests.get(manifestKey).md5};
		
		return manifest;
	}
	
	function serveManifests(req :NodeHttpServerReq, res :NodeHttpServerResp) :Bool
	{
		if (req.url != "/manifests.json") {
			return false;
		}
		
		var result :{manifests:{}} = {manifests:{}};
		var manifests :Dynamic = new Array<ServedManifestData>(); 
		
		for (manifestKey in _manifests.keys()) {
			var manifest :ServedManifestData = getServedManifest(manifestKey);
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
		
		trace('urlObj.pathname=' + urlObj.pathname);
		var filePath = urlObj.pathname;
		if (filePath.charAt(0) == "/") {
			filePath = filePath.substr(1);
		}
		
		trace('filePath=' + filePath);
		
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
		Console.info("File changed: " + Json.stringify(file, null, "\t"));
		file.md5 = FileSystem.signature(file.absolutePath);
		
		//Invalidate the manifest md5
		if (_manifests.exists(file.manifestKey)) {
			_manifests.get(file.manifestKey).md5 = null;
		}
		
		var message :FileChangedMessage = {type:FILE_CHANGED_MESSAGE_NAME, path:file.relativePath, md5:file.md5, manifest:file.manifestKey};
		var messageString = Json.stringify(message, null, "\t");
		
		for (connection in _websocketServer.connections) {
			connection.sendUTF(messageString);
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
				dataMessage.type = FILE_CHANGED_MESSAGE_NAME_ODS;
				dataMessage.data = data;
				var dataMessageString = Json.stringify(dataMessage, null, "\t");
				
				for (connection in _websocketServer.connections) {
					connection.sendUTF(dataMessageString);
				}
			}
			//Save operations sometimes cause the file size to be 0.  It's probably a copy then rename operation
			if (FileSystem.stat(file.absolutePath).size == 0) {
				Node.setTimeout(update, 100);
			} else {
				update();
			}
		}
	}
	
	function setupFileWatching(paths :Array<String>) :Void
	{
		Console.info("Watching paths: " + paths);
		_files = new Map();
		for (rootPath in paths) {
			
			var baseName = Node.path.basename(rootPath);
			var fileArray = new Array<WatchedFile>();
			_manifests[baseName] = {md5:null, assets:fileArray, id:baseName, relativePath:rootPath};	
			
			var numFilesWatched = 0;
			for (relativeFilePath in FileSystem.readRecursive(rootPath, fileFilter)) {
				var absoluteFilePath = FileSystem.join(rootPath, relativeFilePath);
				
					// var md5 :String;
					// var type :String;
					// var relativePath :String;
					// var absolutePath :String;
					// var manifestKey :String;
				var fileBlob :WatchedFile = 
				{
					manifestKey:baseName, 
					md5:"", 
					relativePath:relativeFilePath, 
					absolutePath:absoluteFilePath, 
					type:""
				};
				//The key is what requests will use to get this file: base name + relative path (given in the manifest)
				_files[FileSystem.join(baseName, fileBlob.relativePath)] =  fileBlob;
				fileArray.push(fileBlob);
				watchFile(fileBlob);
				numFilesWatched++;
			}
			Console.info("Watching " + numFilesWatched + " files in " + rootPath); 
		}
	}
	
	function watchFile(file :WatchedFile) :Void
	{
		Node.fs.exists(file.absolutePath, function(exists) {
			if (exists) {
				var options :NodeWatchOpt = {persistent:true};
				var watcher :NodeFSWatcher = Node.fs.watch(file.absolutePath, options, function(event :String, ?ignored :String) {
					//Some programs save a file with an intermediate rename step.
					//This breaks the NodeFSWatcher, so we have to watch the new file
					if (event == 'rename') {
						watchFile(file);
						Console.warn(file.absolutePath + " renamed.");
					} else {
						onFileChanged(file);
					}
				});
				file.md5 = FileSystem.signature(file.absolutePath);
			}
		});
	}
	
	static function fileFilter(filePath :String) :Bool
	{
		return filePath != null && !(Node.path.basename(filePath).startsWith(".") || filePath.endsWith("cache"));
	}
}
