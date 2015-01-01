package catapult;

import haxe.Json;
import haxe.remoting.JsonRPC;

import catapult.Catapult;

import js.Node;
import js.node.WebSocketServer;
import js.node.NodeStatic;
import mconsole.Console;

import sys.FileSystem;
import sys.io.File;

using StringTools;
using Lambda;

/** When a file of this type is modified, execute the corresponding command */
typedef ManifestBlob = {
	var name :String;
	var path :String;
}

typedef Command = {
	@:optional var command :String;
	@:optional var args :Array<String>;
}

/** When a file of this type is modified, execute the corresponding command */
typedef Trigger = {
	var regex :String;
	@:optional var disabled :Bool;
	@:optional var commands :Array<Command>;
	@:optional var broadcast_event :Dynamic;
	@:optional var on_success_event :Dynamic;
}
//Loaded on startup
typedef Config = {
	var port :Int;
	var address :String;
	var file_server_path :String;
	@:optional var paths_to_watch_for_file_changes :Array<String>;
	@:optional var triggers :Array<Trigger>;
	@:optional var manifests :Array<ManifestBlob>;
}

class Server
{
	var _websocketServers :Array<WebSocketServer>;
	var _files :Map<String, WatchedFile>; //<filePath, WatchedFile>
	var _manifests :Map<String, ManifestData>; //<manifestBaseFolderName, ManifestData>
	var _servedFolders :Map<String, StaticServer>;
	var _defaultStaticServer :StaticServer;
	var _port :Int;
	var _config :Config;
	var _configPath :String;
	// var _httpServer :NodeHttpServer;
	var _currentActiveTriggers :Map<String, Bool>;

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
#if mconsole
		Console.start();
#end
		new Server();
	}

	public function new ()
	{
		_manifests = new Map();
		_currentActiveTriggers = new Map();
		init();
	}

	function createBlankCatapultFile() :Void
	{
		if (FileSystem.exists("catapult.json")){
			Console.error("'catapult.json' file already exists.");
			return;
		}
		File.saveContent("catapult.json", '{

			"port":8000,
			"address":"localhost",
			"file_server":"deploy/web/targets",
			"manifests" : [
				{"name" : "bootstrap", "path" : "demo/assets/bootstrap"}
			],
			"paths_to_watch_for_file_changes" : [
				"src",
				"deploy/web"
			],
			"triggers" : [
				{
					"regex" : ".*hx",
					"command": "haxe",
					"args":["demo/client.hxml"],
					"on_success_event":{"type":"reload"}

				},
				{
					"regex" : ".*.js",
					"broadcast_event":{"type":"reload"}
				}
			]
		}');
	}

	function defaultConfig()
	{
		_config = DEFAULT_CONFIG;
		var files = FileSystem.readDirectory("./");
		for (file in files) {
			if (FileSystem.isDirectory(file)) {
				_config.manifests.push({"name":file, "path":file});
			}
		}
		beginServer();
	}

	function loadConfig() :Bool
	{
		if (_configPath == null) {
			Console.error({log:"Could not parse json config file=null"});
			return false;
		}
		if (FileSystem.exists(_configPath)) {
			var content = File.getContent(_configPath);
			try {
				_config = Json.parse(content);
				// Console.info({log:"Config loaded", config:_config});
			} catch (e :Dynamic) {
				Console.error({log:"Could not parse json config file=" + _configPath, err:e, content:content});
				Node.process.exit(1);
				return false;
			}
		} else {
			Console.warn("No catapult config file detected at " + _configPath);
			Console.warn("Please run catapult init");
			Node.process.exit(1);
			return false;
		}

		beginServer();
		return true;
	}

	function beginServer ()
	{

		//Static file server on the directories from the 'watch' option
		_servedFolders = new Map();
		var manifests :Array<ManifestBlob> = Reflect.hasField(_config, "manifests") ? _config.manifests : [];
		if (manifests != null) {
			for (manifest in manifests) {
				var staticServer = NodeStatic.Server(manifest.path);
				Console.assert(staticServer != null, "staticServer != null");
				_servedFolders.set(manifest.name, staticServer);
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

		if (_config.file_server_path != null) {
			_defaultStaticServer = NodeStatic.Server(_config.file_server_path);
			Console.info("Serving static files from " + _config.file_server_path);
		}

		var httpServers = [];
		if (_websocketServers == null)
		{
			_websocketServers = [];
			//Create the http server
			var http = Node.http;


			var onReady = function() {
				var urlString = Date.now() + ' Catapult server available at:\n    [ws://' + _config.address + ':' + _config.port + ']\n    [ws://' + _config.address + ':' + (_config.port + 1) + ']';
				urlString += '\nUrls:\n    http://' + _config.address + ':' + _config.port + '/manifests.json';
				if (manifests != null) {
					for (manifest in manifests) {
						urlString += '\n    http://' + _config.address + ':' + _config.port + '/' + manifest.path + '/manifest.json';
					}
				}
				Console.info(urlString);
			}


			httpServers.push(http.createServer(onHttpRequest));
			httpServers.push(http.createServer(onHttpRequest));
			httpServers[0].listen(_config.port, _config.address, onReady);
			// httpServers[1].listen(_config.port + 1, _config.address);
			// _httpServer.listen(_config.port, _config.address, onReady);

			_websocketServers = [];
			var serverConfig1 :WebSocketServerConfig = {httpServer:httpServers[0], autoAcceptConnections:false};
			// var serverConfig2 :WebSocketServerConfig = {httpServer:httpServers[0], autoAcceptConnections:false};

			var websocketServer1 = new WebSocketServer();
			websocketServer1.on('connectFailed', onConnectFailed);
			websocketServer1.on('request', onWebsocketRequest);
			websocketServer1.on('message', onWebsocketMessage);
			websocketServer1.mount(serverConfig1);
			_websocketServers.push(websocketServer1);

			// var websocketServer2 = new WebSocketServer();
			// websocketServer2.on('connectFailed', onConnectFailed);
			// websocketServer2.on('request', onWebsocketRequest);
			// websocketServer2.mount(serverConfig2);
			// _websocketServers.push(websocketServer2);
		}

		// if (_websocketServer == null)
		// {
		// 	var serverConfig :WebSocketServerConfig = {httpServer:_httpServer, autoAcceptConnections:false};
		// 	_websocketServer = new WebSocketServer();
		// 	_websocketServer.on('connectFailed', onConnectFailed);
		// 	_websocketServer.on('request', onWebsocketRequest);
		// 	_websocketServer.mount(serverConfig);
		// }
		return true;
	}

	function init () :Void
	{
		//Process the command line args
		//https://github.com/visionmedia/commander.js
		try {
			var program :Dynamic = Node.require('commander');
			program
				.version('Catapult Asset Server 0.2.  Serving up flaming hot assets since 1903.')
				.option('-c, --config <config>', 'Use a non-default config file (defaults to "catapult.json") ', untyped String, "catapult.json")
				.option('-l, --legacy', 'Legacy mode.  Send deprecated non-JSON-RPC messages.');

			program
				.command('serve')
				.description('Starts the file asset server')
				.action(function(env) {
					_configPath = program.config;

					if (FileSystem.exists(Node.process.argv[Node.process.argv.length - 1])) {
						_configPath = Node.process.argv[Node.process.argv.length - 1];
					}

					Console.info("Config path=" + _configPath);
					if (loadConfig()) {
						watchFile({md5:"", bytes:0, relativePath:_configPath, absolutePath:_configPath, manifestKey:""});
					}
				});

			program
				.command('init')
				.description('Creates a blank catapult.json config file')
				.action(function(env) {
					createBlankCatapultFile();
					Console.info('Created config file catapult.json');
				});

			// if (Node.process.argv.length == 2) {
			// 	Node.process.argv.push("--help");
			// }

			// if (FileSystem.exists(Node.process.argv[Node.process.argv.length - 1])) {
			// 	_configPath = Node.process.argv[Node.process.argv.length - 1];
			// 	Console.info("Config path=" + _configPath);
			// 	if (loadConfig()) {
			// 		watchFile({md5:"", bytes:0, relativePath:_configPath, absolutePath:_configPath, manifestKey:""});
			// 	}
			// } else {
			// 	program.parse(Node.process.argv);
			// }
			program.parse(Node.process.argv);

			_configPath = program.config;

			if (FileSystem.exists(_configPath)) {
				loadConfig();
			} else {
				defaultConfig();
			}

			// if (FileSystem.exists(Node.process.argv[Node.process.argv.length - 1])) {
			// 	_configPath = Node.process.argv[Node.process.argv.length - 1];
			// }

			// Console.info("Config path=" + _configPath);
			// if (loadConfig()) {
			// 	watchFile({md5:"", bytes:0, relativePath:_configPath, absolutePath:_configPath, manifestKey:""});
			// }
		} catch (e :Dynamic) {
			_configPath = "catapult.json";
			Console.info("Config path=" + _configPath);
			if (loadConfig()) {
				watchFile({md5:"", bytes:0, relativePath:_configPath, absolutePath:_configPath, manifestKey:""});
			}
		}
	}

	function onHttpRequest (req :NodeHttpServerReq, res :NodeHttpServerResp) :Void
	{
		var queryString = Node.url.parse(req.url);
		Console.info(queryString);

		if (queryString.pathname == "/favicon.ico") {
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

		//Default
		serveFile(req, res);
	}

	function serveFile(req :NodeHttpServerReq, res :NodeHttpServerResp) :Bool
	{
		//Serve the file request
		var urlObj = Node.url.parse(req.url, true);
		var firstPathToken = urlObj.pathname.substr(1).split("/")[0];

		var fileKey = urlObj.pathname.substr(1);
		Console.log("fileKey: " + fileKey + ", _files.exists(fileKey)=" + _files.exists(fileKey));


		if (_files.exists(fileKey)) {
			var fileBlob = _files[fileKey];
			// Console.log({fileBlob:fileBlob});
			var manifest = _manifests[fileBlob.manifestKey];
			// Console.log({manifest:manifest});
			var serverKey = manifest.id;//Node.path.dirname(
			// Console.log({serverKey:serverKey});
			var staticServer :StaticServer = _servedFolders.get(serverKey);
			Console.assert(staticServer != null, {message:"staticServer == null", urlObj:urlObj, fileBlob:fileBlob, manifest:manifest, _servedFolders:_servedFolders});

			var tokens = urlObj.pathname.split(Node.path.sep).filter(function(s :String) return s != null && s.length > 0);
			var filePath = tokens.join(Node.path.sep);

			var absoluteFilePath = Node.path.join(staticServer.root, fileBlob.relativePath);

			Node.fs.exists(absoluteFilePath, function(exists :Bool) :Void {
				if (exists) {
					Console.info('Serving: $absoluteFilePath from ${fileBlob.relativePath} filePath=${filePath}');
					Console.info(staticServer);
					staticServer.serveFile(fileBlob.relativePath, 200, {}, req, res);
					// staticServer.serveFile(fileKey, 200, null, req, res);
					Console.log("served");

					// staticServer.serve(req, res, function(err, result)  {
					// 	if (err) {
					// 		Console.warn(urlObj.pathname + ", err=" + Json.stringify(err));
					// 		Console.info(urlObj + "");
					// 		Console.info(Date.now() + ' Received request for ' + req.url);

					// 		res.writeHead(404, { 'Content-Type': 'text/plain' });
					// 		var manifestKeys = {iterator:_manifests.keys}.array();
					// 		for (i in 0...manifestKeys.length) {
					// 			manifestKeys[i] = "http://<host>:" + _config.port +  "/" + manifestKeys[i] + "/manifest.json";
					// 		}
					// 		res.end("No manifest at that path found (firstPathToken=" + firstPathToken + "), possible served folders are [" + {iterator:_servedFolders.keys}.array().join(", ") + "]");
					// 	} else {
					// 		Console.info('Served: $absoluteFilePath from ${fileBlob.relativePath}');
					// 	}
					// });



				} else {
					Console.warn(absoluteFilePath + " not found.");
					res.writeHead(404);
					res.write("<!DOCTYPE html><html><body><h1>404 File not found</h1></body></html>");
					res.end();
				}
			});
		} else if (_defaultStaticServer != null){
			if (fileKey == "" || fileKey == "/") {
				//change to index.html
				Console.info("Defaulting to index.html");
				var indexPath = Node.path.join(_config.file_server_path, "index.html");
				Node.fs.exists(indexPath,
					function(exists) {
						if (exists) {
							_defaultStaticServer.serveFile('/index.html', 200, {}, req, res);
						} else {
							Console.warn(indexPath + " not found.");
							res.writeHead(404);
							res.write("<!DOCTYPE html><html><body><h1>404 File not found</h1></body></html>");
							res.end();
						}
					});
			} else {
				_defaultStaticServer.serve(req, res, function(err, result)  {
					if (err) {
						Console.warn(urlObj.pathname + ", err=" + err);
						Console.info(urlObj + "");
						Console.info(Date.now() + ' Received request for ' + req.url);

						res.writeHead(404, { 'Content-Type': 'text/plain' });
						var manifestKeys = getManifestKeys();
						for (i in 0...manifestKeys.length) {
							manifestKeys[i] = "http://<host>:" + _config.port +  "/" + manifestKeys[i] + "/manifest.json";
						}
						res.end("No manifest at that path found (firstPathToken=" + firstPathToken + "), possible served folders are [" + getManifestKeys().join(", ") + "]");
					} else {
						Console.info("Served: " + _defaultStaticServer.root + urlObj.pathname);
					}
				});
			}
		} else {
			Console.error('No manifest file found and no _defaultStaticServer');
			res.writeHead(404);
			res.write("<!DOCTYPE html><html><body><h1>404 File not found</h1></body></html>");
			res.end();
		}
		return true;
	}

	function serveManifest(req :NodeHttpServerReq, res :NodeHttpServerResp) :Bool
	{
		var queryString = Node.url.parse(req.url);
		if (!queryString.pathname.endsWith("/manifest.json")) {
			return false;
		}

		var pathToken = queryString.pathname.replace("manifest.json", "");
		pathToken = pathToken.replace("/", "");

		if (!_manifests.exists(pathToken)) {
			res.writeHead(404, { 'Content-Type': 'text/plain' });
			var manifestKeys = getManifestKeys();
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
		var queryString = Node.url.parse(req.url);
		if (queryString.pathname != "/manifests.json") {
			return false;
		}

		// var result :{manifests:{}} = {manifests:{}};
		var manifests = {};
		// var manifests :Dynamic = new Array<ServedManifest>();

		for (manifestKey in _manifests.keys()) {
			var manifest :ServedManifest = getServedManifest(manifestKey);
			Reflect.setField(manifests, manifestKey, manifest);
		}

		var manifestsStringForHash = Json.stringify(manifests);
		var manifestsMd5 = Node.crypto.createHash("md5").update(manifestsStringForHash).digest("hex");
		var result :ServedManifestsMessage = {md5:manifestsMd5, manifests:manifests};
		var resultString = Json.stringify(result, null, "\t");

		res.writeHead(200, { 'Content-Type': 'application/json' });
		// Console.log("Manifests: " + Json.stringify(resultString, null, "\t"));
		res.end(resultString);

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

		connection.on('message', function(message) {
	        if (message.type == 'utf8') {
	            Console.info('Received Message: ' + message.utf8Data);
	        }
	        else if (message.type == 'binary') {
	            Console.info('Received Binary Message of ' + message.binaryData.length + ' bytes');
	        }
	    });

		connection.once('close', function(reasonCode, description) {
			Console.info(Date.now() + ' client at "' + connection.remoteAddress + '" disconnected.');
			connection.removeListener('error', onError);
		});
	}

	function onWebsocketMessage (message :WebSocketMessage) :Void
	{
		if (message.type == 'utf8') {
			try {
				var jsonrpc :RequestDef = Json.parse(message.utf8Data);
				if (jsonrpc.method == "log") {
					Console.info(jsonrpc.params[0]);
				}
			} catch (e :Dynamic) {
				Console.error(e);
			}
		} else {
			Console.info("Binary messages ignored");
		}
	}

	function onFileChanged(file :WatchedFile) :Void
	{
		// Console.info({"log":"onFileChanged", "file":file});
		Console.info("onFileChanged:" + file.relativePath);
		if (file.relativePath == "catapult.json")
		{
			Console.warn("catapult.json changed, reloading config!!");
			loadConfig();
			return;
		}

		function sendMessageToAllClients(msg :String) {
			var clientCount = 0;
			for (webSocketServer in _websocketServers) {
				for (connection in webSocketServer.connections) {
					clientCount++;
				}
			}
			Console.info({log:"Sending to " + clientCount + " clients", msg:msg});
			for (webSocketServer in _websocketServers) {
				for (connection in webSocketServer.connections) {
					connection.sendUTF(msg);
				}
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
		var messageString = Json.stringify(message);
		sendMessageToAllClients(messageString);

		var messageRPC :RequestDef = {method:Catapult.MESSAGE_TYPE_FILE_CHANGED, params:[{name:file.relativePath, md5:file.md5, manifest:file.manifestKey, bytes:file.bytes}], jsonrpc:"2.0"};
		messageString = Json.stringify(messageRPC);
		sendMessageToAllClients(messageString);

		//Custom file change triggers
		if (_config.triggers != null)  {
			for (triggerData in _config.triggers) {
				if (new EReg(triggerData.regex, "").match(file.relativePath)) {
					Console.info("Matches trigger regex" + triggerData.regex);
					if (triggerData.disabled == true) {
						Console.info("...disabled");
						continue;
					}
					if (triggerData.commands != null) {
						if (_currentActiveTriggers.exists(triggerData.regex)) {
							Console.info("Trigger [" + triggerData.regex + "] already processing, ignoring");
							continue;
						}

						_currentActiveTriggers.set(triggerData.regex, true);
						var step = new t9.async.Step();
						var commandArray = [];

						for (commandData in triggerData.commands) {
							commandArray.push(function(err, code) {

								if (err != null) {
									Console.warn("previous command failed.");
									step.cb(err, code);
									return;
								}

								var options = {cwd:Node.process.cwd()};


								var errString = '';

								var commandProcess = Node.child_process.spawn(commandData.command, commandData.args != null ? commandData.args : [], options);

								commandProcess.stdout.on('data', function (data) {
									Console.info('stdout: ' + data);
								});

								commandProcess.stderr.on('data', function (data) {
									Console.info('stderr: ' + data);
									errString += "" + data;
								});

								commandProcess.on('close', function (code :Int) {
									Console.info("'" +  commandData.command + " " + (commandData.args != null ? commandData.args.join(" ") : "") + "' exited with code " + code);
									if (code == 0) {
										step.cb(null, code);
									} else {
										step.cb(code, null);
									}
								});
							});
						}

						commandArray.push(function(err, code) {
							if (code == 0 && triggerData.on_success_event != null) {
								Console.info({"log":"on_success_event", "message":triggerData.on_success_event});
								sendMessageToAllClients(Json.stringify(triggerData.on_success_event, null, "\t"));
							}
							step.cb(null, null);
						});

						commandArray.push(function(err, code) {
							_currentActiveTriggers.remove(triggerData.regex);
						});

						step.chain(commandArray);
					} else { //No commmands, but an on_success_event
						Console.info("Trigger, but no commands");
						if (triggerData.on_success_event != null) {
							Console.info({"log":"on_success_event", "message":triggerData.on_success_event});
							sendMessageToAllClients(Json.stringify(triggerData.on_success_event, null, "\t"));
						}
					}
				}
			}
		}
	}

	function setupFileWatching(rootPath :String) :Void
	{
		Console.info("Watching rootPath: " + rootPath);

		if (_files == null) {
			_files = new Map();
		}

		if (!(FileSystem.exists(rootPath) && FileSystem.isDirectory(rootPath))) {
			throw rootPath + " doesn't exist";
		}

		var baseName = Node.path.basename(rootPath);
		// var baseName = subdir;
		var fileArray = new Array<WatchedFile>();
		_manifests[baseName] = {md5:null, assets:fileArray, id:baseName, relativePath:rootPath};

		var numFilesWatched = 0;
		for (relativeFilePath in FileSystem.readRecursive(rootPath, fileFilter)) {
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
	}

	function watchFile(file :WatchedFile):Void//, fireChangedEvent :Bool = false, retry :Bool = false, retryCount :Int = 0) :Void
	{
		watchFileSuperReliable(file.absolutePath,
			function(?_) {
				onFileChanged(file);
			});
	}

	function getManifestKeys() :Array<String>
	{
		var keys = new Array<String>();
		for(key in _manifests.keys()) {
			keys.push(key);
		}
		return keys;
	}

	static function fileFilter(filePath :String) :Bool
	{
		return filePath != null && !(Node.path.basename(filePath).startsWith(".") || filePath.endsWith("cache"));
	}

	/**
		Watching files in Node is really unreliable: inexplicably changing a file will
		sometimes no longer send change events.  This function switches to polling for
		file changes after the first change.
	 */
	static function watchFileSuperReliable(filePath :String, onFileChanged :String->Void, failureRetryDelayMs :Int = 500) :Void
	{
		var md5 = "";

		var check = function() {
			if (FileSystem.exists(filePath)) {
				var newMd5 = FileSystem.signature(filePath);
				if (newMd5 != md5) {
					md5 = newMd5;
					onFileChanged(filePath);
				}
			}
		}

		var poll :Void->Void = null;
		poll = function() {
			check();
			haxe.Timer.delay(poll, 300);
		}

		Node.fs.exists(filePath,
			function(exists) {
				if (exists) {
					md5 = FileSystem.signature(filePath);

					//It's not persistant. When the file changes, we switch to a more reliable polling.
					//This is not efficient for large numbers of files, so we're assuming that
					//the numbers of modifications will be limited to a small number of files.
					var options :NodeWatchOpt = {"persistent":false};
					var watcher :NodeFSWatcher = Node.fs.watch(filePath, options,
						function(event :String, ?ignored :String) {
							poll();
						});

					watcher.on('error',
						function(err) {
							Console.error({log:"NodeFSWatcher:error, retrying", error:err, path:filePath});
							haxe.Timer.delay(watchFileSuperReliable.bind(filePath, onFileChanged, failureRetryDelayMs * 2), failureRetryDelayMs);
						});
				} else {
					Console.warn("Asked to watch but doesn't exist (but retrying): " + filePath);
					haxe.Timer.delay(watchFileSuperReliable.bind(filePath, onFileChanged, failureRetryDelayMs * 2), failureRetryDelayMs);
				}
			});
	}

	private static var DEFAULT_CONFIG :Dynamic =
		{
			"port":8000,
			"address":"0.0.0.0",
			"file_server":"./",
			"manifests" : [],
			"paths_to_watch_for_file_changes" : [],
			"triggers" : []
		};
}
