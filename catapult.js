#!/usr/bin/env node
(function () { "use strict";
var $estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,__class__: EReg
};
var HxOverrides = function() { };
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var IMap = function() { };
IMap.__name__ = ["IMap"];
IMap.prototype = {
	__class__: IMap
};
Math.__name__ = ["Math"];
var Reflect = function() { };
Reflect.__name__ = ["Reflect"];
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
var Std = function() { };
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = ["StringTools"];
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
};
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
var ValueType = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { };
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c;
		if((v instanceof Array) && v.__enum__ == null) c = Array; else c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
Type.enumConstructor = function(e) {
	return e[0];
};
Type.enumParameters = function(e) {
	return e.slice(2);
};
var catapult = {};
catapult.Catapult = function() { };
catapult.Catapult.__name__ = ["catapult","Catapult"];
catapult.Server = function() {
	this._manifests = new haxe.ds.StringMap();
	this._currentActiveTriggers = new haxe.ds.StringMap();
	this.init();
};
catapult.Server.__name__ = ["catapult","Server"];
catapult.Server.getLocalIp = function() {
	var en1 = js.Node.require("os").networkInterfaces().en1;
	if(en1 != null) {
		var _g = 0;
		while(_g < en1.length) {
			var n = en1[_g];
			++_g;
			if(n.family == "IPv4") return n.address;
		}
	}
	return "127.0.0.1";
};
catapult.Server.main = function() {
	mconsole.Console.start();
	new catapult.Server();
};
catapult.Server.fileFilter = function(filePath) {
	return filePath != null && !(StringTools.startsWith(js.Node.require("path").basename(filePath),".") || StringTools.endsWith(filePath,"cache"));
};
catapult.Server.watchFileSuperReliable = function(filePath,onFileChanged,failureRetryDelayMs) {
	if(failureRetryDelayMs == null) failureRetryDelayMs = 500;
	var md5 = "";
	var check = function() {
		if(js.Node.require("fs").existsSync(filePath)) {
			var newMd5 = sys.FileSystem.signature(filePath);
			if(newMd5 != md5) {
				md5 = newMd5;
				onFileChanged(filePath);
			}
		}
	};
	var poll = null;
	poll = function() {
		check();
		haxe.Timer.delay(poll,300);
	};
	js.Node.require("fs").exists(filePath,function(exists) {
		if(exists) {
			md5 = sys.FileSystem.signature(filePath);
			var options = { persistent : false};
			var watcher = js.Node.require("fs").watch(filePath,options,function(event,ignored) {
				poll();
			});
			watcher.on("error",function(err) {
				mconsole.Console.error({ log : "NodeFSWatcher:error, retrying", error : err, path : filePath},null,{ fileName : "Server.hx", lineNumber : 799, className : "catapult.Server", methodName : "watchFileSuperReliable"});
				haxe.Timer.delay((function(f,a1,a2,a3) {
					return function() {
						return f(a1,a2,a3);
					};
				})(catapult.Server.watchFileSuperReliable,filePath,onFileChanged,failureRetryDelayMs * 2),failureRetryDelayMs);
			});
		} else {
			if(mconsole.Console.hasConsole) null;
			mconsole.Console.print(mconsole.LogLevel.warn,["Asked to watch but doesn't exist (but retrying): " + filePath],{ fileName : "Server.hx", lineNumber : 803, className : "catapult.Server", methodName : "watchFileSuperReliable"});
			haxe.Timer.delay((function(f1,a11,a21,a31) {
				return function() {
					return f1(a11,a21,a31);
				};
			})(catapult.Server.watchFileSuperReliable,filePath,onFileChanged,failureRetryDelayMs * 2),failureRetryDelayMs);
		}
	});
};
catapult.Server.prototype = {
	createBlankCatapultFile: function() {
		if(js.Node.require("fs").existsSync("catapult.json")) {
			mconsole.Console.error("'catapult.json' file already exists.",null,{ fileName : "Server.hx", lineNumber : 94, className : "catapult.Server", methodName : "createBlankCatapultFile"});
			return;
		}
		sys.io.File.saveContent("catapult.json","{\n\n\t\t\t\"port\":8000,\n\t\t\t\"address\":\"localhost\",\n\t\t\t\"file_server\":\"deploy/web/targets\",\n\t\t\t\"manifests\" : [\n\t\t\t\t{\"name\" : \"bootstrap\", \"path\" : \"demo/assets/bootstrap\"}\n\t\t\t],\n\t\t\t\"paths_to_watch_for_file_changes\" : [\n\t\t\t\t\"src\",\n\t\t\t\t\"deploy/web\"\n\t\t\t],\n\t\t\t\"triggers\" : [\n\t\t\t\t{\n\t\t\t\t\t\"regex\" : \".*hx\",\n\t\t\t\t\t\"command\": \"haxe\",\n\t\t\t\t\t\"args\":[\"demo/client.hxml\"],\n\t\t\t\t\t\"on_success_event\":{\"type\":\"reload\"}\n\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"regex\" : \".*.js\",\n\t\t\t\t\t\"broadcast_event\":{\"type\":\"reload\"}\n\t\t\t\t}\n\t\t\t]\n\t\t}");
	}
	,defaultConfig: function() {
		this._config = catapult.Server.DEFAULT_CONFIG;
		var files = js.Node.require("fs").readdirSync("./");
		var _g = 0;
		while(_g < files.length) {
			var file = files[_g];
			++_g;
			if(sys.FileSystem.isDirectory(file)) this._config.manifests.push({ name : file, path : file});
		}
		this.beginServer();
	}
	,loadConfig: function() {
		if(this._configPath == null) {
			mconsole.Console.error({ log : "Could not parse json config file=null"},null,{ fileName : "Server.hx", lineNumber : 140, className : "catapult.Server", methodName : "loadConfig"});
			return false;
		}
		if(js.Node.require("fs").existsSync(this._configPath)) {
			var content = sys.io.File.getContent(this._configPath);
			try {
				this._config = JSON.parse(content);
			} catch( e ) {
				mconsole.Console.error({ log : "Could not parse json config file=" + this._configPath, err : e, content : content},null,{ fileName : "Server.hx", lineNumber : 149, className : "catapult.Server", methodName : "loadConfig"});
				js.Node.process.exit(1);
				return false;
			}
		} else {
			if(mconsole.Console.hasConsole) null;
			mconsole.Console.print(mconsole.LogLevel.warn,["No catapult config file detected at " + this._configPath],{ fileName : "Server.hx", lineNumber : 154, className : "catapult.Server", methodName : "loadConfig"});
			if(mconsole.Console.hasConsole) null;
			mconsole.Console.print(mconsole.LogLevel.warn,["Please run catapult init"],{ fileName : "Server.hx", lineNumber : 155, className : "catapult.Server", methodName : "loadConfig"});
			js.Node.process.exit(1);
			return false;
		}
		this.beginServer();
		return true;
	}
	,beginServer: function() {
		var _g = this;
		this._servedFolders = new haxe.ds.StringMap();
		var manifests;
		if(Object.prototype.hasOwnProperty.call(this._config,"manifests")) manifests = this._config.manifests; else manifests = [];
		if(manifests != null) {
			var _g1 = 0;
			while(_g1 < manifests.length) {
				var manifest = manifests[_g1];
				++_g1;
				var staticServer = js.node.NodeStatic.Server(manifest.path);
				mconsole.Console.assert(staticServer != null,"staticServer != null",{ fileName : "Server.hx", lineNumber : 173, className : "catapult.Server", methodName : "beginServer"});
				this._servedFolders.set(manifest.name,staticServer);
				this.setupFileWatching(manifest.path);
			}
		}
		if(Object.prototype.hasOwnProperty.call(this._config,"paths_to_watch_for_file_changes")) {
			var _g2 = 0;
			var _g11 = this._config.paths_to_watch_for_file_changes;
			while(_g2 < _g11.length) {
				var path = _g11[_g2];
				++_g2;
				this.setupFileWatching(path);
			}
		}
		if(this._config.file_server_path != null) {
			this._defaultStaticServer = js.node.NodeStatic.Server(this._config.file_server_path);
			if(mconsole.Console.hasConsole) null;
			mconsole.Console.print(mconsole.LogLevel.info,["Serving static files from " + this._config.file_server_path],{ fileName : "Server.hx", lineNumber : 189, className : "catapult.Server", methodName : "beginServer"});
		}
		var httpServers = [];
		if(this._websocketServers == null) {
			this._websocketServers = [];
			var http = js.Node.require("http");
			var onReady = function() {
				var urlString = Std.string(new Date()) + " Catapult server available at:\n    [ws://" + _g._config.address + ":" + _g._config.port + "]\n    [ws://" + _g._config.address + ":" + (_g._config.port + 1) + "]";
				urlString += "\nUrls:\n    http://" + _g._config.address + ":" + _g._config.port + "/manifests.json";
				if(manifests != null) {
					var _g12 = 0;
					while(_g12 < manifests.length) {
						var manifest1 = manifests[_g12];
						++_g12;
						urlString += "\n    http://" + _g._config.address + ":" + _g._config.port + "/" + manifest1.path + "/manifest.json";
					}
				}
				if(mconsole.Console.hasConsole) null;
				mconsole.Console.print(mconsole.LogLevel.info,[urlString],{ fileName : "Server.hx", lineNumber : 208, className : "catapult.Server", methodName : "beginServer"});
			};
			httpServers.push(http.createServer($bind(this,this.onHttpRequest)));
			httpServers.push(http.createServer($bind(this,this.onHttpRequest)));
			httpServers[0].listen(this._config.port,this._config.address,onReady);
			this._websocketServers = [];
			var serverConfig1 = { httpServer : httpServers[0], autoAcceptConnections : false};
			var websocketServer1 = new WebSocketServer();
			websocketServer1.on("connectFailed",$bind(this,this.onConnectFailed));
			websocketServer1.on("request",$bind(this,this.onWebsocketRequest));
			websocketServer1.on("message",$bind(this,this.onWebsocketMessage));
			websocketServer1.mount(serverConfig1);
			this._websocketServers.push(websocketServer1);
		}
		return true;
	}
	,init: function() {
		var _g = this;
		try {
			var program = js.Node.require("commander");
			program.version("Catapult Asset Server 0.2.  Serving up flaming hot assets since 1903.").option("-c, --config <config>","Use a non-default config file (defaults to \"catapult.json\") ",String,"catapult.json").option("-l, --legacy","Legacy mode.  Send deprecated non-JSON-RPC messages.");
			program.command("serve").description("Starts the file asset server").action(function(env) {
				_g._configPath = program.config;
				if(js.Node.require("fs").existsSync(js.Node.process.argv[js.Node.process.argv.length - 1])) _g._configPath = js.Node.process.argv[js.Node.process.argv.length - 1];
				if(mconsole.Console.hasConsole) null;
				mconsole.Console.print(mconsole.LogLevel.info,["Config path=" + _g._configPath],{ fileName : "Server.hx", lineNumber : 268, className : "catapult.Server", methodName : "init"});
				if(_g.loadConfig()) _g.watchFile({ md5 : "", bytes : 0, relativePath : _g._configPath, absolutePath : _g._configPath, manifestKey : ""});
			});
			program.command("init").description("Creates a blank catapult.json config file").action(function(env1) {
				_g.createBlankCatapultFile();
				if(mconsole.Console.hasConsole) null;
				mconsole.Console.print(mconsole.LogLevel.info,["Created config file catapult.json"],{ fileName : "Server.hx", lineNumber : 279, className : "catapult.Server", methodName : "init"});
			});
			program.parse(js.Node.process.argv);
			this._configPath = program.config;
			if(js.Node.require("fs").existsSync(this._configPath)) this.loadConfig(); else this.defaultConfig();
		} catch( e ) {
			this._configPath = "catapult.json";
			if(mconsole.Console.hasConsole) null;
			mconsole.Console.print(mconsole.LogLevel.info,["Config path=" + this._configPath],{ fileName : "Server.hx", lineNumber : 315, className : "catapult.Server", methodName : "init"});
			if(this.loadConfig()) this.watchFile({ md5 : "", bytes : 0, relativePath : this._configPath, absolutePath : this._configPath, manifestKey : ""});
		}
	}
	,onHttpRequest: function(req,res) {
		var queryString = js.Node.require("url").parse(req.url);
		if(mconsole.Console.hasConsole) null;
		mconsole.Console.print(mconsole.LogLevel.info,[queryString],{ fileName : "Server.hx", lineNumber : 325, className : "catapult.Server", methodName : "onHttpRequest"});
		if(queryString.pathname == "/favicon.ico") {
			res.writeHead(404);
			res.end();
			return;
		}
		if(this.serveManifest(req,res)) return;
		if(this.serveManifests(req,res)) return;
		this.serveFile(req,res);
	}
	,serveFile: function(req,res) {
		var _g = this;
		var urlObj = js.Node.require("url").parse(req.url,true);
		var firstPathToken = HxOverrides.substr(urlObj.pathname,1,null).split("/")[0];
		var fileKey = HxOverrides.substr(urlObj.pathname,1,null);
		mconsole.Console.log("fileKey: " + fileKey + ", _files.exists(fileKey)=" + Std.string(this._files.exists(fileKey)),{ fileName : "Server.hx", lineNumber : 352, className : "catapult.Server", methodName : "serveFile"});
		if(this._files.exists(fileKey)) {
			var fileBlob = this._files.get(fileKey);
			var manifest = this._manifests.get(fileBlob.manifestKey);
			var serverKey = manifest.id;
			var staticServer = this._servedFolders.get(serverKey);
			mconsole.Console.assert(staticServer != null,{ message : "staticServer == null", urlObj : urlObj, fileBlob : fileBlob, manifest : manifest, _servedFolders : this._servedFolders},{ fileName : "Server.hx", lineNumber : 363, className : "catapult.Server", methodName : "serveFile"});
			var tokens = urlObj.pathname.split(js.Node.require("path").sep).filter(function(s) {
				return s != null && s.length > 0;
			});
			var filePath = tokens.join(js.Node.require("path").sep);
			var absoluteFilePath = js.Node.require("path").join(staticServer.root,fileBlob.relativePath);
			js.Node.require("fs").exists(absoluteFilePath,function(exists) {
				if(exists) {
					if(mconsole.Console.hasConsole) null;
					mconsole.Console.print(mconsole.LogLevel.info,["Serving: " + absoluteFilePath + " from " + fileBlob.relativePath + " filePath=" + filePath],{ fileName : "Server.hx", lineNumber : 372, className : "catapult.Server", methodName : "serveFile"});
					if(mconsole.Console.hasConsole) null;
					mconsole.Console.print(mconsole.LogLevel.info,[staticServer],{ fileName : "Server.hx", lineNumber : 373, className : "catapult.Server", methodName : "serveFile"});
					staticServer.serveFile(fileBlob.relativePath,200,{ },req,res);
					if(mconsole.Console.hasConsole) null;
					mconsole.Console.print(mconsole.LogLevel.log,["served"],{ fileName : "Server.hx", lineNumber : 376, className : "catapult.Server", methodName : "serveFile"});
				} else {
					if(mconsole.Console.hasConsole) null;
					mconsole.Console.print(mconsole.LogLevel.warn,[absoluteFilePath + " not found."],{ fileName : "Server.hx", lineNumber : 398, className : "catapult.Server", methodName : "serveFile"});
					res.writeHead(404);
					res.write("<!DOCTYPE html><html><body><h1>404 File not found</h1></body></html>");
					res.end();
				}
			});
		} else if(this._defaultStaticServer != null) {
			if(fileKey == "" || fileKey == "/") {
				if(mconsole.Console.hasConsole) null;
				mconsole.Console.print(mconsole.LogLevel.info,["Defaulting to index.html"],{ fileName : "Server.hx", lineNumber : 407, className : "catapult.Server", methodName : "serveFile"});
				var indexPath = js.Node.require("path").join(this._config.file_server_path,"index.html");
				js.Node.require("fs").exists(indexPath,function(exists1) {
					if(exists1) _g._defaultStaticServer.serveFile("/index.html",200,{ },req,res); else {
						if(mconsole.Console.hasConsole) null;
						mconsole.Console.print(mconsole.LogLevel.warn,[indexPath + " not found."],{ fileName : "Server.hx", lineNumber : 414, className : "catapult.Server", methodName : "serveFile"});
						res.writeHead(404);
						res.write("<!DOCTYPE html><html><body><h1>404 File not found</h1></body></html>");
						res.end();
					}
				});
			} else this._defaultStaticServer.serve(req,res,function(err,result) {
				if(err) {
					if(mconsole.Console.hasConsole) null;
					mconsole.Console.print(mconsole.LogLevel.warn,[urlObj.pathname + ", err=" + (err == null?"null":"" + err)],{ fileName : "Server.hx", lineNumber : 423, className : "catapult.Server", methodName : "serveFile"});
					mconsole.Console.info(Std.string(urlObj) + "",{ fileName : "Server.hx", lineNumber : 424, className : "catapult.Server", methodName : "serveFile"});
					mconsole.Console.info(Std.string(new Date()) + " Received request for " + req.url,{ fileName : "Server.hx", lineNumber : 425, className : "catapult.Server", methodName : "serveFile"});
					res.writeHead(404,{ 'Content-Type' : "text/plain"});
					var manifestKeys = _g.getManifestKeys();
					var _g2 = 0;
					var _g1 = manifestKeys.length;
					while(_g2 < _g1) {
						var i = _g2++;
						manifestKeys[i] = "http://<host>:" + _g._config.port + "/" + manifestKeys[i] + "/manifest.json";
					}
					res.end("No manifest at that path found (firstPathToken=" + firstPathToken + "), possible served folders are [" + _g.getManifestKeys().join(", ") + "]");
				} else {
					if(mconsole.Console.hasConsole) null;
					mconsole.Console.print(mconsole.LogLevel.info,["Served: " + _g._defaultStaticServer.root + urlObj.pathname],{ fileName : "Server.hx", lineNumber : 434, className : "catapult.Server", methodName : "serveFile"});
				}
			});
		} else {
			mconsole.Console.error("No manifest file found and no _defaultStaticServer",null,{ fileName : "Server.hx", lineNumber : 439, className : "catapult.Server", methodName : "serveFile"});
			res.writeHead(404);
			res.write("<!DOCTYPE html><html><body><h1>404 File not found</h1></body></html>");
			res.end();
		}
		return true;
	}
	,serveManifest: function(req,res) {
		var queryString = js.Node.require("url").parse(req.url);
		if(!StringTools.endsWith(queryString.pathname,"/manifest.json")) return false;
		var pathToken = StringTools.replace(queryString.pathname,"manifest.json","");
		pathToken = StringTools.replace(pathToken,"/","");
		if(!this._manifests.exists(pathToken)) {
			res.writeHead(404,{ 'Content-Type' : "text/plain"});
			var manifestKeys = this.getManifestKeys();
			var _g1 = 0;
			var _g = manifestKeys.length;
			while(_g1 < _g) {
				var i = _g1++;
				manifestKeys[i] = "http://<host>:" + this._config.port + "/" + manifestKeys[i] + "/manifest.json";
			}
			res.end("No manifest at that path found, possible manifests are [" + manifestKeys.join(", ") + "]");
			return true;
		}
		var manifestData = { manifest : this.getServedManifest(pathToken)};
		res.writeHead(200,{ 'Content-Type' : "application/json"});
		res.end(JSON.stringify(manifestData,null,"\t"));
		return true;
	}
	,getServedManifest: function(manifestKey) {
		if(!this._manifests.exists(manifestKey)) {
			mconsole.Console.error("No manifest for key=" + manifestKey,null,{ fileName : "Server.hx", lineNumber : 478, className : "catapult.Server", methodName : "getServedManifest"});
			return null;
		}
		var files = new Array();
		var _g = 0;
		var _g1 = this._manifests.get(manifestKey).assets;
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			files.push({ name : f.relativePath, md5 : f.md5, bytes : f.bytes});
		}
		if(this._manifests.get(manifestKey).md5 == null) {
			var s = new StringBuf();
			var _g2 = 0;
			var _g11 = this._manifests.get(manifestKey).assets;
			while(_g2 < _g11.length) {
				var f1 = _g11[_g2];
				++_g2;
				if(f1.md5 == null) s.b += "null"; else s.b += "" + f1.md5;
			}
			this._manifests.get(manifestKey).md5 = js.Node.require("crypto").createHash("md5").update(s.b).digest("hex");
		}
		var manifest = { assets : files, id : manifestKey, md5 : this._manifests.get(manifestKey).md5};
		return manifest;
	}
	,serveManifests: function(req,res) {
		var queryString = js.Node.require("url").parse(req.url);
		if(queryString.pathname != "/manifests.json") return false;
		var manifests = { };
		var $it0 = this._manifests.keys();
		while( $it0.hasNext() ) {
			var manifestKey = $it0.next();
			var manifest = this.getServedManifest(manifestKey);
			manifests[manifestKey] = manifest;
		}
		var manifestsStringForHash = JSON.stringify(manifests,null,null);
		var manifestsMd5 = js.Node.require("crypto").createHash("md5").update(manifestsStringForHash).digest("hex");
		var result = { md5 : manifestsMd5, manifests : manifests};
		var resultString = JSON.stringify(result,null,"\t");
		res.writeHead(200,{ 'Content-Type' : "application/json"});
		res.end(resultString);
		return true;
	}
	,onConnectFailed: function(error) {
		mconsole.Console.error("WebSocketServer connection failed: " + Std.string(error),null,{ fileName : "Server.hx", lineNumber : 531, className : "catapult.Server", methodName : "onConnectFailed"});
	}
	,onWebsocketRequest: function(request) {
		mconsole.Console.info("request.requestedProtocols: " + Std.string(request.requestedProtocols),{ fileName : "Server.hx", lineNumber : 536, className : "catapult.Server", methodName : "onWebsocketRequest"});
		var protocol = null;
		var connection = request.accept(protocol,request.origin);
		var onError = function(error) {
			mconsole.Console.error(" Peer " + connection.remoteAddress + " error: " + error,null,{ fileName : "Server.hx", lineNumber : 541, className : "catapult.Server", methodName : "onWebsocketRequest"});
		};
		connection.on("error",onError);
		connection.on("message",function(message) {
			if(message.type == "utf8") {
				if(mconsole.Console.hasConsole) null;
				mconsole.Console.print(mconsole.LogLevel.info,["Received Message: " + message.utf8Data],{ fileName : "Server.hx", lineNumber : 547, className : "catapult.Server", methodName : "onWebsocketRequest"});
			} else if(message.type == "binary") {
				if(mconsole.Console.hasConsole) null;
				mconsole.Console.print(mconsole.LogLevel.info,["Received Binary Message of " + message.binaryData.length + " bytes"],{ fileName : "Server.hx", lineNumber : 550, className : "catapult.Server", methodName : "onWebsocketRequest"});
			}
		});
		connection.once("close",function(reasonCode,description) {
			mconsole.Console.info(Std.string(new Date()) + " client at \"" + connection.remoteAddress + "\" disconnected.",{ fileName : "Server.hx", lineNumber : 555, className : "catapult.Server", methodName : "onWebsocketRequest"});
			connection.removeListener("error",onError);
		});
	}
	,onWebsocketMessage: function(message) {
		if(message.type == "utf8") try {
			var jsonrpc = JSON.parse(message.utf8Data);
			if(jsonrpc.method == "log") {
				if(mconsole.Console.hasConsole) null;
				mconsole.Console.print(mconsole.LogLevel.info,[jsonrpc.params[0]],{ fileName : "Server.hx", lineNumber : 566, className : "catapult.Server", methodName : "onWebsocketMessage"});
			}
		} catch( e ) {
			mconsole.Console.error(e,null,{ fileName : "Server.hx", lineNumber : 569, className : "catapult.Server", methodName : "onWebsocketMessage"});
		} else {
			if(mconsole.Console.hasConsole) null;
			mconsole.Console.print(mconsole.LogLevel.info,["Binary messages ignored"],{ fileName : "Server.hx", lineNumber : 572, className : "catapult.Server", methodName : "onWebsocketMessage"});
		}
	}
	,onFileChanged: function(file) {
		var _g = this;
		if(mconsole.Console.hasConsole) null;
		mconsole.Console.print(mconsole.LogLevel.info,["onFileChanged:" + file.relativePath],{ fileName : "Server.hx", lineNumber : 579, className : "catapult.Server", methodName : "onFileChanged"});
		if(file.relativePath == "catapult.json") {
			if(mconsole.Console.hasConsole) null;
			mconsole.Console.print(mconsole.LogLevel.warn,["catapult.json changed, reloading config!!"],{ fileName : "Server.hx", lineNumber : 582, className : "catapult.Server", methodName : "onFileChanged"});
			this.loadConfig();
			return;
		}
		var sendMessageToAllClients = function(msg) {
			var clientCount = 0;
			var _g1 = 0;
			var _g2 = _g._websocketServers;
			while(_g1 < _g2.length) {
				var webSocketServer = _g2[_g1];
				++_g1;
				var _g3 = 0;
				var _g4 = webSocketServer.connections;
				while(_g3 < _g4.length) {
					var connection = _g4[_g3];
					++_g3;
					clientCount++;
				}
			}
			if(mconsole.Console.hasConsole) null;
			mconsole.Console.print(mconsole.LogLevel.info,[{ log : "Sending to " + clientCount + " clients", msg : msg}],{ fileName : "Server.hx", lineNumber : 594, className : "catapult.Server", methodName : "onFileChanged"});
			var _g11 = 0;
			var _g21 = _g._websocketServers;
			while(_g11 < _g21.length) {
				var webSocketServer1 = _g21[_g11];
				++_g11;
				var _g31 = 0;
				var _g41 = webSocketServer1.connections;
				while(_g31 < _g41.length) {
					var connection1 = _g41[_g31];
					++_g31;
					connection1.sendUTF(msg);
				}
			}
		};
		file.md5 = sys.FileSystem.signature(file.absolutePath);
		file.bytes = js.Node.require("fs").statSync(file.absolutePath).size;
		if(this._manifests.exists(file.manifestKey)) this._manifests.get(file.manifestKey).md5 = null;
		var message = { type : "file_changed", name : file.relativePath, md5 : file.md5, manifest : file.manifestKey, bytes : file.bytes};
		var messageString = JSON.stringify(message,null,null);
		sendMessageToAllClients(messageString);
		var messageRPC = { method : "file_changed", params : [{ name : file.relativePath, md5 : file.md5, manifest : file.manifestKey, bytes : file.bytes}], jsonrpc : "2.0"};
		messageString = JSON.stringify(messageRPC,null,null);
		sendMessageToAllClients(messageString);
		if(this._config.triggers != null) {
			var _g5 = 0;
			var _g12 = this._config.triggers;
			while(_g5 < _g12.length) {
				var triggerData = [_g12[_g5]];
				++_g5;
				if(new EReg(triggerData[0].regex,"").match(file.relativePath)) {
					if(mconsole.Console.hasConsole) null;
					mconsole.Console.print(mconsole.LogLevel.info,["Matches trigger regex" + triggerData[0].regex],{ fileName : "Server.hx", lineNumber : 623, className : "catapult.Server", methodName : "onFileChanged"});
					if(triggerData[0].disabled == true) {
						if(mconsole.Console.hasConsole) null;
						mconsole.Console.print(mconsole.LogLevel.info,["...disabled"],{ fileName : "Server.hx", lineNumber : 625, className : "catapult.Server", methodName : "onFileChanged"});
						continue;
					}
					if(triggerData[0].commands != null) {
						if(this._currentActiveTriggers.exists(triggerData[0].regex)) {
							if(mconsole.Console.hasConsole) null;
							mconsole.Console.print(mconsole.LogLevel.info,["Trigger [" + triggerData[0].regex + "] already processing, ignoring"],{ fileName : "Server.hx", lineNumber : 630, className : "catapult.Server", methodName : "onFileChanged"});
							continue;
						}
						this._currentActiveTriggers.set(triggerData[0].regex,true);
						var step = [new t9.async.Step()];
						var commandArray = [];
						var _g22 = 0;
						var _g32 = triggerData[0].commands;
						while(_g22 < _g32.length) {
							var commandData = [_g32[_g22]];
							++_g22;
							commandArray.push((function(commandData,step) {
								return function(err,code) {
									if(err != null) {
										if(mconsole.Console.hasConsole) null;
										mconsole.Console.print(mconsole.LogLevel.warn,["previous command failed."],{ fileName : "Server.hx", lineNumber : 642, className : "catapult.Server", methodName : "onFileChanged"});
										step[0].cb(err,code);
										return;
									}
									var options = { cwd : js.Node.process.cwd()};
									var errString = "";
									var commandProcess = js.Node.require("child_process").spawn(commandData[0].command,commandData[0].args != null?commandData[0].args:[],options);
									commandProcess.stdout.on("data",(function() {
										return function(data) {
											if(mconsole.Console.hasConsole) null;
											mconsole.Console.print(mconsole.LogLevel.info,["stdout: " + data],{ fileName : "Server.hx", lineNumber : 655, className : "catapult.Server", methodName : "onFileChanged"});
										};
									})());
									commandProcess.stderr.on("data",(function() {
										return function(data1) {
											if(mconsole.Console.hasConsole) null;
											mconsole.Console.print(mconsole.LogLevel.info,["stderr: " + data1],{ fileName : "Server.hx", lineNumber : 659, className : "catapult.Server", methodName : "onFileChanged"});
											errString += "" + data1;
										};
									})());
									commandProcess.on("close",(function(commandData,step) {
										return function(code1) {
											mconsole.Console.info("'" + commandData[0].command + " " + (commandData[0].args != null?commandData[0].args.join(" "):"") + "' exited with code " + code1,{ fileName : "Server.hx", lineNumber : 664, className : "catapult.Server", methodName : "onFileChanged"});
											if(code1 == 0) step[0].cb(null,code1); else step[0].cb(code1,null);
										};
									})(commandData,step));
								};
							})(commandData,step));
						}
						commandArray.push((function(step,triggerData) {
							return function(err1,code2) {
								if(code2 == 0 && triggerData[0].on_success_event != null) {
									if(mconsole.Console.hasConsole) null;
									mconsole.Console.print(mconsole.LogLevel.info,[{ log : "on_success_event", message : triggerData[0].on_success_event}],{ fileName : "Server.hx", lineNumber : 676, className : "catapult.Server", methodName : "onFileChanged"});
									sendMessageToAllClients(JSON.stringify(triggerData[0].on_success_event,null,"\t"));
								}
								step[0].cb(null,null);
							};
						})(step,triggerData));
						commandArray.push((function(triggerData) {
							return function(err2,code3) {
								_g._currentActiveTriggers.remove(triggerData[0].regex);
							};
						})(triggerData));
						step[0].chain(commandArray);
					} else {
						if(mconsole.Console.hasConsole) null;
						mconsole.Console.print(mconsole.LogLevel.info,["Trigger, but no commands"],{ fileName : "Server.hx", lineNumber : 688, className : "catapult.Server", methodName : "onFileChanged"});
						if(triggerData[0].on_success_event != null) {
							if(mconsole.Console.hasConsole) null;
							mconsole.Console.print(mconsole.LogLevel.info,[{ log : "on_success_event", message : triggerData[0].on_success_event}],{ fileName : "Server.hx", lineNumber : 690, className : "catapult.Server", methodName : "onFileChanged"});
							sendMessageToAllClients(JSON.stringify(triggerData[0].on_success_event,null,"\t"));
						}
					}
				}
			}
		}
	}
	,setupFileWatching: function(rootPath) {
		if(mconsole.Console.hasConsole) null;
		mconsole.Console.print(mconsole.LogLevel.info,["Watching rootPath: " + rootPath],{ fileName : "Server.hx", lineNumber : 701, className : "catapult.Server", methodName : "setupFileWatching"});
		if(this._files == null) this._files = new haxe.ds.StringMap();
		if(!(js.Node.require("fs").existsSync(rootPath) && sys.FileSystem.isDirectory(rootPath))) throw rootPath + " doesn't exist";
		var baseName = js.Node.require("path").basename(rootPath);
		var fileArray = new Array();
		var v = { md5 : null, assets : fileArray, id : baseName, relativePath : rootPath};
		this._manifests.set(baseName,v);
		v;
		var numFilesWatched = 0;
		var _g = 0;
		var _g1 = sys.FileSystem.readRecursive(rootPath,catapult.Server.fileFilter);
		while(_g < _g1.length) {
			var relativeFilePath = _g1[_g];
			++_g;
			var absoluteFilePath = js.Node.require("path").join(rootPath == null?"":rootPath,relativeFilePath == null?"":relativeFilePath,"");
			var fileBlob = { manifestKey : baseName, md5 : sys.FileSystem.signature(absoluteFilePath), relativePath : relativeFilePath, absolutePath : absoluteFilePath, bytes : js.Node.require("fs").statSync(absoluteFilePath).size};
			var k = sys.FileSystem.join(baseName,fileBlob.relativePath,null);
			this._files.set(k,fileBlob);
			fileBlob;
			fileArray.push(fileBlob);
			this.watchFile(fileBlob);
			numFilesWatched++;
		}
		if(mconsole.Console.hasConsole) null;
		mconsole.Console.print(mconsole.LogLevel.info,["Watching " + numFilesWatched + " files in " + rootPath],{ fileName : "Server.hx", lineNumber : 733, className : "catapult.Server", methodName : "setupFileWatching"});
	}
	,watchFile: function(file) {
		var _g = this;
		catapult.Server.watchFileSuperReliable(file.absolutePath,function(_) {
			_g.onFileChanged(file);
		});
	}
	,getManifestKeys: function() {
		var keys = new Array();
		var $it0 = this._manifests.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			keys.push(key);
		}
		return keys;
	}
	,__class__: catapult.Server
};
var haxe = {};
haxe.StackItem = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","LocalFunction"] };
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.LocalFunction = function(v) { var $x = ["LocalFunction",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.CallStack = function() { };
haxe.CallStack.__name__ = ["haxe","CallStack"];
haxe.CallStack.callStack = function() {
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe.StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe.StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe.CallStack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
};
haxe.CallStack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += "\nCalled from ";
		haxe.CallStack.itemToString(b,s);
	}
	return b.b;
};
haxe.CallStack.itemToString = function(b,s) {
	switch(s[1]) {
	case 0:
		b.b += "a C function";
		break;
	case 1:
		var m = s[2];
		b.b += "module ";
		if(m == null) b.b += "null"; else b.b += "" + m;
		break;
	case 2:
		var line = s[4];
		var file = s[3];
		var s1 = s[2];
		if(s1 != null) {
			haxe.CallStack.itemToString(b,s1);
			b.b += " (";
		}
		if(file == null) b.b += "null"; else b.b += "" + file;
		b.b += " line ";
		if(line == null) b.b += "null"; else b.b += "" + line;
		if(s1 != null) b.b += ")";
		break;
	case 3:
		var meth = s[3];
		var cname = s[2];
		if(cname == null) b.b += "null"; else b.b += "" + cname;
		b.b += ".";
		if(meth == null) b.b += "null"; else b.b += "" + meth;
		break;
	case 4:
		var n = s[2];
		b.b += "local function #";
		if(n == null) b.b += "null"; else b.b += "" + n;
		break;
	}
};
haxe.CallStack.makeStack = function(s) {
	if(typeof(s) == "string") {
		var stack = s.split("\n");
		var m = [];
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			m.push(haxe.StackItem.Module(line));
		}
		return m;
	} else return s;
};
haxe.Json = function() { };
haxe.Json.__name__ = ["haxe","Json"];
haxe.Json.stringify = function(obj,replacer,insertion) {
	return JSON.stringify(obj,replacer,insertion);
};
haxe.Json.parse = function(jsonString) {
	return JSON.parse(jsonString);
};
haxe.Log = function() { };
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
};
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
};
haxe.Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe.Timer
};
haxe.ds = {};
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.StringMap
};
haxe.io = {};
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	return new haxe.io.Bytes(length,new Buffer(length));
};
haxe.io.Bytes.ofString = function(s) {
	var nb = new Buffer(s,"utf8");
	return new haxe.io.Bytes(nb.length,nb);
};
haxe.io.Bytes.ofData = function(b) {
	return new haxe.io.Bytes(b.length,b);
};
haxe.io.Bytes.prototype = {
	get: function(pos) {
		return this.b[pos];
	}
	,set: function(pos,v) {
		this.b[pos] = v;
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw haxe.io.Error.OutsideBounds;
		src.b.copy(this.b,pos,srcpos,srcpos + len);
	}
	,sub: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var nb = new Buffer(len);
		var slice = this.b.slice(pos,pos + len);
		slice.copy(nb,0,0,len);
		return new haxe.io.Bytes(len,nb);
	}
	,compare: function(other) {
		var b1 = this.b;
		var b2 = other.b;
		var len;
		if(this.length < other.length) len = this.length; else len = other.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(b1[i] != b2[i]) return b1[i] - b2[i];
		}
		return this.length - other.length;
	}
	,readString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c21 = b[i++];
				var c3 = b[i++];
				s += fcc((c & 15) << 18 | (c21 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
			}
		}
		return s;
	}
	,toString: function() {
		return this.readString(0,this.length);
	}
	,toHex: function() {
		var s = new StringBuf();
		var chars = [];
		var str = "0123456789abcdef";
		var _g1 = 0;
		var _g = str.length;
		while(_g1 < _g) {
			var i = _g1++;
			chars.push(HxOverrides.cca(str,i));
		}
		var _g11 = 0;
		var _g2 = this.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			var c = this.b[i1];
			s.b += String.fromCharCode(chars[c >> 4]);
			s.b += String.fromCharCode(chars[c & 15]);
		}
		return s.b;
	}
	,getData: function() {
		return this.b;
	}
	,__class__: haxe.io.Bytes
};
haxe.io.BytesBuffer = function() {
	this.b = new Array();
};
haxe.io.BytesBuffer.__name__ = ["haxe","io","BytesBuffer"];
haxe.io.BytesBuffer.prototype = {
	addByte: function($byte) {
		this.b.push($byte);
	}
	,add: function(src) {
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = 0;
		var _g = src.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,addBytes: function(src,pos,len) {
		if(pos < 0 || len < 0 || pos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = pos;
		var _g = pos + len;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,getBytes: function() {
		var nb = new Buffer(this.b);
		var bytes = new haxe.io.Bytes(nb.length,nb);
		this.b = null;
		return bytes;
	}
	,__class__: haxe.io.BytesBuffer
};
haxe.io.Eof = function() { };
haxe.io.Eof.__name__ = ["haxe","io","Eof"];
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
};
haxe.io.Error = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; };
haxe.io.Output = function() { };
haxe.io.Output.__name__ = ["haxe","io","Output"];
var js = {};
js.Boot = function() { };
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js.Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js.Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js.Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.NodeC = function() { };
js.NodeC.__name__ = ["js","NodeC"];
js.Node = function() { };
js.Node.__name__ = ["js","Node"];
js.Node.get_assert = function() {
	return js.Node.require("assert");
};
js.Node.get_child_process = function() {
	return js.Node.require("child_process");
};
js.Node.get_cluster = function() {
	return js.Node.require("cluster");
};
js.Node.get_crypto = function() {
	return js.Node.require("crypto");
};
js.Node.get_dgram = function() {
	return js.Node.require("dgram");
};
js.Node.get_dns = function() {
	return js.Node.require("dns");
};
js.Node.get_fs = function() {
	return js.Node.require("fs");
};
js.Node.get_http = function() {
	return js.Node.require("http");
};
js.Node.get_https = function() {
	return js.Node.require("https");
};
js.Node.get_net = function() {
	return js.Node.require("net");
};
js.Node.get_os = function() {
	return js.Node.require("os");
};
js.Node.get_path = function() {
	return js.Node.require("path");
};
js.Node.get_querystring = function() {
	return js.Node.require("querystring");
};
js.Node.get_repl = function() {
	return js.Node.require("repl");
};
js.Node.get_tls = function() {
	return js.Node.require("tls");
};
js.Node.get_url = function() {
	return js.Node.require("url");
};
js.Node.get_util = function() {
	return js.Node.require("util");
};
js.Node.get_vm = function() {
	return js.Node.require("vm");
};
js.Node.get_zlib = function() {
	return js.Node.require("zlib");
};
js.Node.get___filename = function() {
	return __filename;
};
js.Node.get___dirname = function() {
	return __dirname;
};
js.Node.get_json = function() {
	return JSON;
};
js.Node.newSocket = function(options) {
	return new js.Node.net.Socket(options);
};
js.node = {};
js.node.NodeStatic = function() { };
js.node.NodeStatic.__name__ = ["js","node","NodeStatic"];
js.node.NodeStatic.Server = function(pathToServe) {
	var watchedFolder = pathToServe;
	var node_static = require('node-static');
	return new node_static.Server(watchedFolder);
};
var mconsole = {};
mconsole.PrinterBase = function() {
	this.printPosition = true;
	this.printLineNumbers = true;
};
mconsole.PrinterBase.__name__ = ["mconsole","PrinterBase"];
mconsole.PrinterBase.prototype = {
	print: function(level,params,indent,pos) {
		params = params.slice();
		var _g1 = 0;
		var _g = params.length;
		while(_g1 < _g) {
			var i = _g1++;
			params[i] = Std.string(params[i]);
		}
		var message = params.join(", ");
		var nextPosition = "@ " + pos.className + "." + pos.methodName;
		var nextLineNumber;
		if(pos.lineNumber == null) nextLineNumber = "null"; else nextLineNumber = "" + pos.lineNumber;
		var lineColumn = "";
		var emptyLineColumn = "";
		if(this.printPosition) {
			if(nextPosition != this.position) this.printLine(mconsole.ConsoleColor.none,nextPosition,pos);
		}
		if(this.printLineNumbers) {
			emptyLineColumn = StringTools.lpad(""," ",5);
			if(nextPosition != this.position || nextLineNumber != this.lineNumber) lineColumn = StringTools.lpad(nextLineNumber," ",4) + " "; else lineColumn = emptyLineColumn;
		}
		this.position = nextPosition;
		this.lineNumber = nextLineNumber;
		var color;
		switch(level[1]) {
		case 0:
			color = mconsole.ConsoleColor.white;
			break;
		case 1:
			color = mconsole.ConsoleColor.blue;
			break;
		case 2:
			color = mconsole.ConsoleColor.green;
			break;
		case 3:
			color = mconsole.ConsoleColor.yellow;
			break;
		case 4:
			color = mconsole.ConsoleColor.red;
			break;
		}
		var indent1 = StringTools.lpad(""," ",indent * 2);
		message = lineColumn + indent1 + message;
		message = message.split("\n").join("\n" + emptyLineColumn + indent1);
		this.printLine(color,message,pos);
	}
	,printLine: function(color,line,pos) {
		throw "method not implemented in ConsolePrinterBase";
	}
	,__class__: mconsole.PrinterBase
};
mconsole.Printer = function() { };
mconsole.Printer.__name__ = ["mconsole","Printer"];
mconsole.Printer.prototype = {
	__class__: mconsole.Printer
};
mconsole.FilePrinter = function(path,append) {
	if(append == null) append = true;
	var _g = this;
	mconsole.PrinterBase.call(this);
	if(path != null) {
		this.colorize = false;
		this.output = { buffer : []};
		this.output.writeString = function(value) {
			_g.output.buffer.push(value);
		};
		var fs = require('fs');
		var mode;
		if(!fs.existsSync(path) || !append) mode = "w"; else mode = "a";
		var stream = fs.createWriteStream(path,{ flags : mode});
		stream.once("open",function() {
			_g.output.writeString = function(value1) {
				stream.write(value1);
			};
			while(_g.output.buffer.length > 0) stream.write(_g.output.buffer.shift());
		});
		this.output.close = stream.end;
	} else {
		this.colorize = true;
		this.output = { writeString : function(v) {
			console.log(HxOverrides.substr(v,0,v.length - 1));
		}};
	}
};
mconsole.FilePrinter.__name__ = ["mconsole","FilePrinter"];
mconsole.FilePrinter.__interfaces__ = [mconsole.Printer];
mconsole.FilePrinter.__super__ = mconsole.PrinterBase;
mconsole.FilePrinter.prototype = $extend(mconsole.PrinterBase.prototype,{
	printLine: function(color,line,pos) {
		if(this.colorize) switch(color[1]) {
		case 0:
			line = line;
			break;
		case 1:
			line = mconsole.Style.style(line,37,39);
			break;
		case 2:
			line = mconsole.Style.style(line,34,39);
			break;
		case 3:
			line = mconsole.Style.style(line,32,39);
			break;
		case 4:
			line = mconsole.Style.style(line,33,39);
			break;
		case 5:
			line = mconsole.Style.style(line,31,39);
			break;
		}
		this.output.writeString(line + "\n");
	}
	,__class__: mconsole.FilePrinter
});
mconsole.Console = function() { };
mconsole.Console.__name__ = ["mconsole","Console"];
mconsole.Console.start = function() {
	if(mconsole.Console.running) return;
	mconsole.Console.running = true;
	mconsole.Console.previousTrace = haxe.Log.trace;
	haxe.Log.trace = mconsole.Console.haxeTrace;
	if(mconsole.Console.hasConsole) {
	} else {
	}
};
mconsole.Console.stop = function() {
	if(!mconsole.Console.running) return;
	mconsole.Console.running = false;
	haxe.Log.trace = mconsole.Console.previousTrace;
	mconsole.Console.previousTrace = null;
};
mconsole.Console.addPrinter = function(printer) {
	mconsole.Console.removePrinter(printer);
	mconsole.Console.printers.push(printer);
};
mconsole.Console.removePrinter = function(printer) {
	HxOverrides.remove(mconsole.Console.printers,printer);
};
mconsole.Console.haxeTrace = function(value,pos) {
	var params = pos.customParams;
	if(params == null) params = []; else pos.customParams = null;
	var level;
	switch(value) {
	case "log":
		level = mconsole.LogLevel.log;
		break;
	case "warn":
		level = mconsole.LogLevel.warn;
		break;
	case "info":
		level = mconsole.LogLevel.info;
		break;
	case "debug":
		level = mconsole.LogLevel.debug;
		break;
	case "error":
		level = mconsole.LogLevel.error;
		break;
	default:
		params.unshift(value);
		level = mconsole.LogLevel.log;
	}
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole(Std.string(level),params);
	mconsole.Console.print(level,params,pos);
};
mconsole.Console.print = function(level,params,pos) {
	var _g = 0;
	var _g1 = mconsole.Console.printers;
	while(_g < _g1.length) {
		var printer = _g1[_g];
		++_g;
		printer.print(level,params,mconsole.Console.groupDepth,pos);
	}
};
mconsole.Console.log = function(message,pos) {
	if(mconsole.Console.hasConsole) null;
	mconsole.Console.print(mconsole.LogLevel.log,[message],pos);
};
mconsole.Console.info = function(message,pos) {
	if(mconsole.Console.hasConsole) null;
	mconsole.Console.print(mconsole.LogLevel.info,[message],pos);
};
mconsole.Console.debug = function(message,pos) {
	if(mconsole.Console.hasConsole) null;
	mconsole.Console.print(mconsole.LogLevel.debug,[message],pos);
};
mconsole.Console.warn = function(message,pos) {
	if(mconsole.Console.hasConsole) null;
	mconsole.Console.print(mconsole.LogLevel.warn,[message],pos);
};
mconsole.Console.error = function(message,stack,pos) {
	if(stack == null) stack = haxe.CallStack.callStack();
	var stackTrace;
	if(stack.length > 0) stackTrace = "\n" + mconsole.StackHelper.toString(stack); else stackTrace = "";
	if(mconsole.Console.hasConsole) null;
	mconsole.Console.print(mconsole.LogLevel.error,["Error: " + Std.string(message) + stackTrace],pos);
};
mconsole.Console.trace = function(pos) {
	if(mconsole.Console.hasConsole) null;
	var stack = mconsole.StackHelper.toString(haxe.CallStack.callStack());
	mconsole.Console.print(mconsole.LogLevel.error,["Stack trace:\n" + stack],pos);
};
mconsole.Console.assert = function(expression,message,pos) {
	if(mconsole.Console.hasConsole) null;
	if(!expression) {
		var stack = mconsole.StackHelper.toString(haxe.CallStack.callStack());
		mconsole.Console.print(mconsole.LogLevel.error,["Assertion failed: " + Std.string(message) + "\n" + stack],pos);
		throw message;
	}
};
mconsole.Console.count = function(title,pos) {
	if(mconsole.Console.hasConsole) null;
	var position = pos.fileName + ":" + pos.lineNumber;
	var count;
	if(mconsole.Console.counts.exists(position)) count = mconsole.Console.counts.get(position) + 1; else count = 1;
	mconsole.Console.counts.set(position,count);
	mconsole.Console.print(mconsole.LogLevel.log,[title + ": " + count],pos);
};
mconsole.Console.group = function(message,pos) {
	if(mconsole.Console.hasConsole) null;
	mconsole.Console.print(mconsole.LogLevel.log,[message],pos);
	mconsole.Console.groupDepth += 1;
};
mconsole.Console.groupEnd = function(pos) {
	if(mconsole.Console.hasConsole) null;
	if(mconsole.Console.groupDepth > 0) mconsole.Console.groupDepth -= 1;
};
mconsole.Console.time = function(name,pos) {
	if(mconsole.Console.hasConsole) null;
	mconsole.Console.times.set(name,haxe.Timer.stamp());
};
mconsole.Console.timeEnd = function(name,pos) {
	if(mconsole.Console.hasConsole) null;
	if(mconsole.Console.times.exists(name)) {
		mconsole.Console.print(mconsole.LogLevel.log,[name + ": " + Std["int"]((haxe.Timer.stamp() - mconsole.Console.times.get(name)) * 1000) + "ms"],pos);
		mconsole.Console.times.remove(name);
	}
};
mconsole.Console.markTimeline = function(label,pos) {
	if(mconsole.Console.hasConsole) null;
};
mconsole.Console.profile = function(title,pos) {
	if(mconsole.Console.hasConsole) null;
};
mconsole.Console.profileEnd = function(title,pos) {
	if(mconsole.Console.hasConsole) null;
};
mconsole.Console.enterDebugger = function() {
	debugger;
};
mconsole.Console.detectConsole = function() {
	return false;
};
mconsole.Console.callConsole = function(method,params) {
};
mconsole.Console.toConsoleValues = function(params) {
	var _g1 = 0;
	var _g = params.length;
	while(_g1 < _g) {
		var i = _g1++;
		params[i] = mconsole.Console.toConsoleValue(params[i]);
	}
	return params;
};
mconsole.Console.toConsoleValue = function(value) {
	var typeClass = Type.getClass(value);
	var typeName;
	if(typeClass == null) typeName = ""; else typeName = Type.getClassName(typeClass);
	if(typeName == "Xml") {
		var parser = new DOMParser();
		return parser.parseFromString(value.toString(),"text/xml").firstChild;
	} else if(typeName == "Map" || typeName == "StringMap" || typeName == "IntMap") {
		var $native = { };
		var map = value;
		var $it0 = map.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			Reflect.setField($native,Std.string(key),mconsole.Console.toConsoleValue(map.get(key)));
		}
		return $native;
	} else {
		{
			var _g = Type["typeof"](value);
			switch(_g[1]) {
			case 7:
				var e = _g[2];
				var native1 = [];
				var name = Type.getEnumName(e) + "." + Type.enumConstructor(value);
				var params = Type.enumParameters(value);
				if(params.length > 0) {
					native1.push(name + "(");
					var _g2 = 0;
					var _g1 = params.length;
					while(_g2 < _g1) {
						var i = _g2++;
						native1.push(mconsole.Console.toConsoleValue(params[i]));
					}
					native1.push(")");
				} else return [name];
				return native1;
			default:
			}
		}
		if(typeName == "Array" || typeName == "List" || typeName == "haxe.FastList") {
			var native2 = [];
			var iterable = value;
			var $it1 = $iterator(iterable)();
			while( $it1.hasNext() ) {
				var i1 = $it1.next();
				native2.push(mconsole.Console.toConsoleValue(i1));
			}
			return native2;
		}
	}
	return value;
};
mconsole.LogLevel = { __ename__ : ["mconsole","LogLevel"], __constructs__ : ["log","info","debug","warn","error"] };
mconsole.LogLevel.log = ["log",0];
mconsole.LogLevel.log.toString = $estr;
mconsole.LogLevel.log.__enum__ = mconsole.LogLevel;
mconsole.LogLevel.info = ["info",1];
mconsole.LogLevel.info.toString = $estr;
mconsole.LogLevel.info.__enum__ = mconsole.LogLevel;
mconsole.LogLevel.debug = ["debug",2];
mconsole.LogLevel.debug.toString = $estr;
mconsole.LogLevel.debug.__enum__ = mconsole.LogLevel;
mconsole.LogLevel.warn = ["warn",3];
mconsole.LogLevel.warn.toString = $estr;
mconsole.LogLevel.warn.__enum__ = mconsole.LogLevel;
mconsole.LogLevel.error = ["error",4];
mconsole.LogLevel.error.toString = $estr;
mconsole.LogLevel.error.__enum__ = mconsole.LogLevel;
mconsole.ConsoleColor = { __ename__ : ["mconsole","ConsoleColor"], __constructs__ : ["none","white","blue","green","yellow","red"] };
mconsole.ConsoleColor.none = ["none",0];
mconsole.ConsoleColor.none.toString = $estr;
mconsole.ConsoleColor.none.__enum__ = mconsole.ConsoleColor;
mconsole.ConsoleColor.white = ["white",1];
mconsole.ConsoleColor.white.toString = $estr;
mconsole.ConsoleColor.white.__enum__ = mconsole.ConsoleColor;
mconsole.ConsoleColor.blue = ["blue",2];
mconsole.ConsoleColor.blue.toString = $estr;
mconsole.ConsoleColor.blue.__enum__ = mconsole.ConsoleColor;
mconsole.ConsoleColor.green = ["green",3];
mconsole.ConsoleColor.green.toString = $estr;
mconsole.ConsoleColor.green.__enum__ = mconsole.ConsoleColor;
mconsole.ConsoleColor.yellow = ["yellow",4];
mconsole.ConsoleColor.yellow.toString = $estr;
mconsole.ConsoleColor.yellow.__enum__ = mconsole.ConsoleColor;
mconsole.ConsoleColor.red = ["red",5];
mconsole.ConsoleColor.red.toString = $estr;
mconsole.ConsoleColor.red.__enum__ = mconsole.ConsoleColor;
mconsole.StackHelper = function() { };
mconsole.StackHelper.__name__ = ["mconsole","StackHelper"];
mconsole.StackHelper.createFilters = function() {
	var filters = new haxe.ds.StringMap();
	filters.set("@ mconsole.ConsoleRedirect.haxeTrace:59",true);
	return filters;
};
mconsole.StackHelper.toString = function(stack) {
	return "null";
};
mconsole.StackItemHelper = function() { };
mconsole.StackItemHelper.__name__ = ["mconsole","StackItemHelper"];
mconsole.StackItemHelper.toString = function(item,isFirst) {
	if(isFirst == null) isFirst = false;
	switch(item[1]) {
	case 1:
		var module = item[2];
		return module;
	case 3:
		var method = item[3];
		var className = item[2];
		return className + "." + method;
	case 4:
		var v = item[2];
		return "LocalFunction(" + v + ")";
	case 2:
		var line = item[4];
		var file = item[3];
		var s = item[2];
		return (s == null?file.split("::").join(".") + ":" + line:mconsole.StackItemHelper.toString(s)) + ":" + line;
	case 0:
		return "(anonymous function)";
	}
};
mconsole.Style = function() { };
mconsole.Style.__name__ = ["mconsole","Style"];
mconsole.Style.style = function(string,start,stop) {
	if(mconsole.Style.clicolor) return "\x1B[" + start + "m" + string + "\x1B[" + stop + "m"; else return string;
};
mconsole.Style.bold = function(s) {
	return mconsole.Style.style(s,1,22);
};
mconsole.Style.italic = function(s) {
	return mconsole.Style.style(s,3,23);
};
mconsole.Style.underline = function(s) {
	return mconsole.Style.style(s,4,24);
};
mconsole.Style.inverse = function(s) {
	return mconsole.Style.style(s,7,27);
};
mconsole.Style.white = function(s) {
	return mconsole.Style.style(s,37,39);
};
mconsole.Style.grey = function(s) {
	return mconsole.Style.style(s,90,39);
};
mconsole.Style.black = function(s) {
	return mconsole.Style.style(s,30,39);
};
mconsole.Style.blue = function(s) {
	return mconsole.Style.style(s,34,39);
};
mconsole.Style.cyan = function(s) {
	return mconsole.Style.style(s,36,39);
};
mconsole.Style.green = function(s) {
	return mconsole.Style.style(s,32,39);
};
mconsole.Style.magenta = function(s) {
	return mconsole.Style.style(s,35,39);
};
mconsole.Style.red = function(s) {
	return mconsole.Style.style(s,31,39);
};
mconsole.Style.yellow = function(s) {
	return mconsole.Style.style(s,33,39);
};
var sys = {};
sys.FileSystem = function() { };
sys.FileSystem.__name__ = ["sys","FileSystem"];
sys.FileSystem.exists = function(path) {
	return js.Node.require("fs").existsSync(path);
};
sys.FileSystem.rename = function(path,newpath) {
	js.Node.require("fs").renameSync(path,newpath);
};
sys.FileSystem.stat = function(path) {
	return js.Node.require("fs").statSync(path);
};
sys.FileSystem.fullPath = function(relpath) {
	return js.Node.require("path").resolve(null,relpath);
};
sys.FileSystem.isDirectory = function(path) {
	if(!js.Node.require("fs").existsSync(path)) throw "Path doesn't exist: " + path;
	if(js.Node.require("fs").statSync(path).isSymbolicLink()) return false; else return js.Node.require("fs").statSync(path).isDirectory();
};
sys.FileSystem.createDirectory = function(path) {
	js.Node.require("fs").mkdirSync(path);
};
sys.FileSystem.deleteFile = function(path) {
	js.Node.require("fs").unlinkSync(path);
};
sys.FileSystem.deleteDirectory = function(path) {
	js.Node.require("fs").rmdirSync(path);
};
sys.FileSystem.readDirectory = function(path) {
	return js.Node.require("fs").readdirSync(path);
};
sys.FileSystem.signature = function(path) {
	var shasum = js.Node.require("crypto").createHash("md5");
	shasum.update(js.Node.require("fs").readFileSync(path));
	return shasum.digest("hex");
};
sys.FileSystem.join = function(p1,p2,p3) {
	return js.Node.require("path").join(p1 == null?"":p1,p2 == null?"":p2,p3 == null?"":p3);
};
sys.FileSystem.readRecursive = function(path,filter) {
	var files = sys.FileSystem.readRecursiveInternal(path,null,filter);
	if(files == null) return []; else return files;
};
sys.FileSystem.readRecursiveInternal = function(root,dir,filter) {
	if(dir == null) dir = "";
	if(root == null) return null;
	var dirPath = js.Node.require("path").join(root == null?"":root,dir == null?"":dir,"");
	if(!(js.Node.require("fs").existsSync(dirPath) && sys.FileSystem.isDirectory(dirPath))) return null;
	var result = [];
	var _g = 0;
	var _g1 = js.Node.require("fs").readdirSync(dirPath);
	while(_g < _g1.length) {
		var file = _g1[_g];
		++_g;
		var fullPath = js.Node.require("path").join(dirPath == null?"":dirPath,file == null?"":file,"");
		var relPath;
		if(dir == "") relPath = file; else relPath = js.Node.require("path").join(dir == null?"":dir,file == null?"":file,"");
		if(js.Node.require("fs").existsSync(fullPath)) {
			if(sys.FileSystem.isDirectory(fullPath)) {
				if(fullPath.charCodeAt(fullPath.length - 1) == 47) fullPath = HxOverrides.substr(fullPath,0,-1);
				if(filter != null && !filter(relPath)) continue;
				var recursedResults = sys.FileSystem.readRecursiveInternal(root,relPath,filter);
				if(recursedResults != null && recursedResults.length > 0) result = result.concat(recursedResults);
			} else if(filter == null || filter(relPath)) result.push(relPath);
		}
	}
	return result;
};
sys.io = {};
sys.io.File = function() { };
sys.io.File.__name__ = ["sys","io","File"];
sys.io.File.append = function(path,binary) {
	throw "Not implemented";
	return null;
};
sys.io.File.copy = function(src,dst) {
	var content = js.Node.require("fs").readFileSync(src);
	js.Node.require("fs").writeFileSync(dst,content);
};
sys.io.File.getBytes = function(path) {
	var o = js.Node.require("fs").openSync(path,"r");
	var s = js.Node.require("fs").fstatSync(o);
	var len = s.size;
	var pos = 0;
	var bytes = haxe.io.Bytes.alloc(s.size);
	while(len > 0) {
		var r = js.Node.require("fs").readSync(o,bytes.b,pos,len,null);
		pos += r;
		len -= r;
	}
	js.Node.require("fs").closeSync(o);
	return bytes;
};
sys.io.File.getContent = function(path) {
	return js.Node.require("fs").readFileSync(path,sys.io.File.UTF8_ENCODING);
};
sys.io.File.saveContent = function(path,content) {
	js.Node.require("fs").writeFileSync(path,content);
};
sys.io.File.write = function(path,binary) {
	throw "Not implemented";
	return null;
};
var t9 = {};
t9.async = {};
t9.async.Step = function() {
	this._chain = [];
	this._callId = -1;
};
t9.async.Step.__name__ = ["t9","async","Step"];
t9.async.Step.prototype = {
	chain: function(arr) {
		var _g = 0;
		while(_g < arr.length) {
			var f = arr[_g];
			++_g;
			this._chain.push(f);
		}
		this.callNext([]);
	}
	,cb: function(err,result) {
		t9.util.Assert.that(this._chain != null,"_chain == null",null,{ fileName : "Step.hx", lineNumber : 36, className : "t9.async.Step", methodName : "cb"});
		t9.util.Assert.that(this._chain.length > 0,"_chain.length <= 0",null,{ fileName : "Step.hx", lineNumber : 37, className : "t9.async.Step", methodName : "cb"});
		this.callNext([err,err == null?result:null]);
	}
	,cb1: function(result) {
		this.cb(null,result);
	}
	,cb0: function() {
		this.cb(null,null);
	}
	,error: function(err) {
		this.cb(err,null);
	}
	,parallel: function() {
		return this.createCallback(true);
	}
	,group: function() {
		return this.createCallback(false);
	}
	,createCallback: function(isParallel) {
		if(this._groupedCall == null) this._groupedCall = new t9.async.GroupedCall(this._callId,isParallel,$bind(this,this.callNext)); else t9.util.Assert.that(this._groupedCall.isParallel == isParallel,"_groupedCall.isParallel != isParallel",null,{ fileName : "Step.hx", lineNumber : 80, className : "t9.async.Step", methodName : "createCallback"});
		return this._groupedCall.createCallback();
	}
	,callNext: function(args) {
		t9.util.Assert.that(this._chain != null,"_chain != null",null,{ fileName : "Step.hx", lineNumber : 87, className : "t9.async.Step", methodName : "callNext"});
		t9.util.Assert.that(this._chain.length > 0,"_chain.length > 0",null,{ fileName : "Step.hx", lineNumber : 88, className : "t9.async.Step", methodName : "callNext"});
		t9.util.Assert.that(this._chain[0] != null,"_chain[0] != null",null,{ fileName : "Step.hx", lineNumber : 89, className : "t9.async.Step", methodName : "callNext"});
		t9.util.Assert.that(Reflect.isFunction(this._chain[0]),"Reflect.isFunction(_chain[0])",null,{ fileName : "Step.hx", lineNumber : 90, className : "t9.async.Step", methodName : "callNext"});
		this._callId++;
		if(this._groupedCall != null) {
			this._groupedCall.shutdown();
			this._groupedCall = null;
		}
		try {
			Reflect.callMethod(null,this._chain.shift(),args);
		} catch( e ) {
			haxe.Log.trace("Step caught exception: " + Std.string(e) + "\n" + haxe.CallStack.toString(haxe.CallStack.callStack()),{ fileName : "Step.hx", lineNumber : 99, className : "t9.async.Step", methodName : "callNext"});
			if(this._chain != null && this._chain.length > 0) this.callNext([e,null]); else throw e;
		}
	}
	,__class__: t9.async.Step
};
t9.async.GroupedCall = function(callId,isParallel,callNext) {
	this.callId = callId;
	this.isParallel = isParallel;
	this._groupedFunctionIndex = this._pending = 0;
	this._pendingResults = [];
	this.callNext = callNext;
};
t9.async.GroupedCall.__name__ = ["t9","async","GroupedCall"];
t9.async.GroupedCall.prototype = {
	shutdown: function() {
		this._pendingResults = null;
		this.callNext = null;
		this._err = null;
	}
	,createCallback: function() {
		var _g = this;
		var index = this._groupedFunctionIndex++;
		this._pending++;
		return function(err,result) {
			_g._pending--;
			if(_g.finished) return;
			if(err != null || _g._err != null) {
				_g._pendingResults[index] = null;
				if(_g._err == null) _g._err = err;
			} else _g._pendingResults[index] = result;
			if(_g._pending == 0) setImmediate($bind(_g,_g.calledGroupCallback));
		};
	}
	,calledGroupCallback: function() {
		if(this._pending == 0 && !this.finished) {
			this.finished = true;
			if(this.isParallel) {
				this._pendingResults.unshift(this._err);
				this.callNext(this._pendingResults);
			} else this.callNext(this._err == null?[null,this._pendingResults]:[this._err,null]);
		}
	}
	,__class__: t9.async.GroupedCall
};
t9.util = {};
t9.util.Assert = function() { };
t9.util.Assert.__name__ = ["t9","util","Assert"];
t9.util.Assert.that = function(condition,message,extra,pos) {
	if(!condition) t9.util.Assert.fail(message,extra,pos);
};
t9.util.Assert.fail = function(message,extra,pos) {
	var error = "Assertion failed!";
	if(message != null) error += " " + message;
	if(extra != null) mconsole.Console.error([error,extra],null,pos); else mconsole.Console.error(error,null,pos);
	throw error;
};
t9.util.Log = function() { };
t9.util.Log.__name__ = ["t9","util","Log"];
t9.util.Log.count = function(id) {
	mconsole.Console.count(id,{ fileName : "Log.hx", lineNumber : 49, className : "t9.util.Log", methodName : "count"});
};
t9.util.Log.enterDebugger = function() {
	debugger;
};
t9.util.Log.group = function(groupId) {
	if(mconsole.Console.hasConsole) null;
	mconsole.Console.print(mconsole.LogLevel.log,[groupId],{ fileName : "Log.hx", lineNumber : 59, className : "t9.util.Log", methodName : "group"});
	mconsole.Console.groupDepth += 1;
};
t9.util.Log.groupEnd = function() {
	if(mconsole.Console.hasConsole) null;
	if(mconsole.Console.groupDepth > 0) mconsole.Console.groupDepth -= 1;
};
t9.util.Log.time = function(id) {
	if(mconsole.Console.hasConsole) null;
	mconsole.Console.times.set(id,haxe.Timer.stamp());
};
t9.util.Log.timeEnd = function(id) {
	if(mconsole.Console.hasConsole) null;
	if(mconsole.Console.times.exists(id)) {
		mconsole.Console.print(mconsole.LogLevel.log,[id + ": " + Std["int"]((haxe.Timer.stamp() - mconsole.Console.times.get(id)) * 1000) + "ms"],{ fileName : "Log.hx", lineNumber : 74, className : "t9.util.Log", methodName : "timeEnd"});
		mconsole.Console.times.remove(id);
	}
};
t9.util.Log.profile = function(id) {
	if(mconsole.Console.hasConsole) null;
};
t9.util.Log.profileEnd = function(id) {
	if(mconsole.Console.hasConsole) null;
};
t9.util.Log.debug = function(message,extra,pos) {
	if(extra != null) {
		if(mconsole.Console.hasConsole) null;
		mconsole.Console.print(mconsole.LogLevel.debug,[[message,extra]],pos);
	} else {
		if(mconsole.Console.hasConsole) null;
		mconsole.Console.print(mconsole.LogLevel.debug,[message],pos);
	}
};
t9.util.Log.info = function(message,extra,pos) {
	if(extra != null) {
		if(mconsole.Console.hasConsole) null;
		mconsole.Console.print(mconsole.LogLevel.info,[[message,extra]],pos);
	} else {
		if(mconsole.Console.hasConsole) null;
		mconsole.Console.print(mconsole.LogLevel.info,[message],pos);
	}
};
t9.util.Log.warn = function(message,extra,pos) {
	if(extra != null) {
		if(mconsole.Console.hasConsole) null;
		mconsole.Console.print(mconsole.LogLevel.warn,[[message,extra]],pos);
	} else {
		if(mconsole.Console.hasConsole) null;
		mconsole.Console.print(mconsole.LogLevel.warn,[message],pos);
	}
};
t9.util.Log.error = function(message,extra,pos) {
	if(extra != null) mconsole.Console.error([message,extra],null,pos); else mconsole.Console.error(message,null,pos);
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.prototype.__class__ = String;
String.__name__ = ["String"];
Array.__name__ = ["Array"];
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
if(Array.prototype.map == null) Array.prototype.map = function(f) {
	var a = [];
	var _g1 = 0;
	var _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = f(this[i]);
	}
	return a;
};
if(Array.prototype.filter == null) Array.prototype.filter = function(f1) {
	var a1 = [];
	var _g11 = 0;
	var _g2 = this.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		var e = this[i1];
		if(f1(e)) a1.push(e);
	}
	return a1;
};
js.Node.setTimeout = setTimeout;
js.Node.clearTimeout = clearTimeout;
js.Node.setInterval = setInterval;
js.Node.clearInterval = clearInterval;
js.Node.global = global;
js.Node.process = process;
js.Node.require = require;
js.Node.console = console;
js.Node.module = module;
js.Node.stringify = JSON.stringify;
js.Node.parse = JSON.parse;
var version = HxOverrides.substr(js.Node.process.version,1,null).split(".").map(Std.parseInt);
if(version[0] > 0 || version[1] >= 9) {
	js.Node.setImmediate = setImmediate;
	js.Node.clearImmediate = clearImmediate;
}
var WebSocketServer = js.Node.require("websocket").server;
haxe.Log.trace("Console.start",{ fileName : "Log.hx", lineNumber : 43, className : "t9.util.Log", methodName : "__init__"});
mconsole.Console.start();
catapult.Catapult.MESSAGE_TYPE_RESTART_ = "restart";
catapult.Catapult.MESSAGE_TYPE_FILE_CHANGED = "file_changed";
catapult.Catapult.MESSAGE_TYPE_FILE_CHANGED_ODS = "file_changed_ods";
catapult.Server.RETRY_INTERVAL_MS = 50;
catapult.Server.DEFAULT_CONFIG = { port : 8000, address : "0.0.0.0", file_server : "./", manifests : [], paths_to_watch_for_file_changes : [], triggers : []};
js.NodeC.UTF8 = "utf8";
js.NodeC.ASCII = "ascii";
js.NodeC.BINARY = "binary";
js.NodeC.BASE64 = "base64";
js.NodeC.HEX = "hex";
js.NodeC.EVENT_EVENTEMITTER_NEWLISTENER = "newListener";
js.NodeC.EVENT_EVENTEMITTER_ERROR = "error";
js.NodeC.EVENT_STREAM_DATA = "data";
js.NodeC.EVENT_STREAM_END = "end";
js.NodeC.EVENT_STREAM_ERROR = "error";
js.NodeC.EVENT_STREAM_CLOSE = "close";
js.NodeC.EVENT_STREAM_DRAIN = "drain";
js.NodeC.EVENT_STREAM_CONNECT = "connect";
js.NodeC.EVENT_STREAM_SECURE = "secure";
js.NodeC.EVENT_STREAM_TIMEOUT = "timeout";
js.NodeC.EVENT_STREAM_PIPE = "pipe";
js.NodeC.EVENT_PROCESS_EXIT = "exit";
js.NodeC.EVENT_PROCESS_UNCAUGHTEXCEPTION = "uncaughtException";
js.NodeC.EVENT_PROCESS_SIGINT = "SIGINT";
js.NodeC.EVENT_PROCESS_SIGUSR1 = "SIGUSR1";
js.NodeC.EVENT_CHILDPROCESS_EXIT = "exit";
js.NodeC.EVENT_HTTPSERVER_REQUEST = "request";
js.NodeC.EVENT_HTTPSERVER_CONNECTION = "connection";
js.NodeC.EVENT_HTTPSERVER_CLOSE = "close";
js.NodeC.EVENT_HTTPSERVER_UPGRADE = "upgrade";
js.NodeC.EVENT_HTTPSERVER_CLIENTERROR = "clientError";
js.NodeC.EVENT_HTTPSERVERREQUEST_DATA = "data";
js.NodeC.EVENT_HTTPSERVERREQUEST_END = "end";
js.NodeC.EVENT_CLIENTREQUEST_RESPONSE = "response";
js.NodeC.EVENT_CLIENTRESPONSE_DATA = "data";
js.NodeC.EVENT_CLIENTRESPONSE_END = "end";
js.NodeC.EVENT_NETSERVER_CONNECTION = "connection";
js.NodeC.EVENT_NETSERVER_CLOSE = "close";
js.NodeC.FILE_READ = "r";
js.NodeC.FILE_READ_APPEND = "r+";
js.NodeC.FILE_WRITE = "w";
js.NodeC.FILE_WRITE_APPEND = "a+";
js.NodeC.FILE_READWRITE = "a";
js.NodeC.FILE_READWRITE_APPEND = "a+";
mconsole.Console.defaultPrinter = new mconsole.FilePrinter();
mconsole.Console.printers = [mconsole.Console.defaultPrinter];
mconsole.Console.groupDepth = 0;
mconsole.Console.times = new haxe.ds.StringMap();
mconsole.Console.counts = new haxe.ds.StringMap();
mconsole.Console.running = false;
mconsole.Console.dirxml = "dirxml";
mconsole.Console.hasConsole = mconsole.Console.detectConsole();
mconsole.StackHelper.filters = mconsole.StackHelper.createFilters();
mconsole.Style.clicolor = process.env.CLICOLOR == "1";
sys.io.File.UTF8_ENCODING = { encoding : "utf8"};
catapult.Server.main();
})();

//# sourceMappingURL=catapult.js.map