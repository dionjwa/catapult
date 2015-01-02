(function ($hx_exports) { "use strict";
var $estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
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
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
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
catapult.Constants = $hx_exports.Constants = function() { };
catapult.Constants.__name__ = ["catapult","Constants"];
catapult.Main = function() { };
catapult.Main.__name__ = ["catapult","Main"];
catapult.Main.main = function() {
	catapult.ManifestFileWatcher;
	catapult.ManifestServer;
	catapult.ManifestWebsocket;
};
catapult.NodeEventEmitter = function() { };
catapult.NodeEventEmitter.__name__ = ["catapult","NodeEventEmitter"];
catapult.NodeEventEmitter.prototype = {
	__class__: catapult.NodeEventEmitter
};
catapult.ManifestFileWatcher = $hx_exports.ManifestFileWatcher = function() {
	var events = js.Node.require("events");
	this._eventEmitter = new events.EventEmitter();
};
catapult.ManifestFileWatcher.__name__ = ["catapult","ManifestFileWatcher"];
catapult.ManifestFileWatcher.__interfaces__ = [catapult.NodeEventEmitter];
catapult.ManifestFileWatcher.watchFileSuperReliable = function(filePath,onFileChanged,failureRetryDelayMs) {
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
				t9.util.Log.error({ log : "NodeFSWatcher:error, retrying", error : err, path : filePath},null,{ fileName : "ManifestFileWatcher.hx", lineNumber : 134, className : "catapult.ManifestFileWatcher", methodName : "watchFileSuperReliable"});
				haxe.Timer.delay((function(f,a1,a2,a3) {
					return function() {
						return f(a1,a2,a3);
					};
				})(catapult.ManifestFileWatcher.watchFileSuperReliable,filePath,onFileChanged,failureRetryDelayMs * 2),failureRetryDelayMs);
			});
		} else {
			t9.util.Log.warn("Asked to watch but doesn't exist (but retrying): " + filePath,null,{ fileName : "ManifestFileWatcher.hx", lineNumber : 138, className : "catapult.ManifestFileWatcher", methodName : "watchFileSuperReliable"});
			haxe.Timer.delay((function(f1,a11,a21,a31) {
				return function() {
					return f1(a11,a21,a31);
				};
			})(catapult.ManifestFileWatcher.watchFileSuperReliable,filePath,onFileChanged,failureRetryDelayMs * 2),failureRetryDelayMs);
		}
	});
};
catapult.ManifestFileWatcher.prototype = {
	setManifestServer: function(manifestServer) {
		this.set_manifestServer(manifestServer);
		return this;
	}
	,addListener: function(event,fn) {
		return this._eventEmitter.addListener(event,fn);
	}
	,on: function(event,fn) {
		return this._eventEmitter.on(event,fn);
	}
	,once: function(event,fn) {
		this._eventEmitter.once(event,fn);
	}
	,removeListener: function(event,listener) {
		this._eventEmitter.removeListener(event,listener);
	}
	,removeAllListeners: function(event) {
		this._eventEmitter.removeAllListeners(event);
	}
	,listeners: function(event) {
		return this._eventEmitter.listeners(event);
	}
	,setMaxListeners: function(m) {
		this._eventEmitter.setMaxListeners(m);
	}
	,emit: function(event,arg1,arg2,arg3) {
		this._eventEmitter.emit(event,arg1,arg2,arg3);
	}
	,watchManifestFiles: function() {
		var _g4 = this;
		var manifests = this.manifestServer.get_manifests().manifests;
		var root = this.manifestServer.manifestsPath;
		var _g = 0;
		var _g1 = Reflect.fields(manifests);
		while(_g < _g1.length) {
			var directory = _g1[_g];
			++_g;
			var directoryAbsPath = js.Node.require("path").join(root,directory);
			var manifest = [Reflect.field(manifests,directory)];
			var _g2 = 0;
			var _g3 = manifest[0].assets;
			while(_g2 < _g3.length) {
				var asset = [_g3[_g2]];
				++_g2;
				var assetPathAbs = [js.Node.require("path").join(root,directory,asset[0].name)];
				catapult.ManifestFileWatcher.watchFileSuperReliable(assetPathAbs[0],(function(assetPathAbs,asset,manifest) {
					return function(path) {
						_g4.onFileChange(manifest[0],asset[0],assetPathAbs[0]);
					};
				})(assetPathAbs,asset,manifest));
			}
		}
	}
	,onFileChange: function(manifest,asset,fullPath) {
		var event = { absolutePath : fullPath, manifest : manifest, asset : asset};
		this.emit("catapult.file_changed",event);
	}
	,set_manifestServer: function(manifestServer) {
		this.manifestServer = manifestServer;
		this.watchManifestFiles();
		return manifestServer;
	}
	,__class__: catapult.ManifestFileWatcher
};
catapult.ManifestServer = $hx_exports.ManifestServer = function() {
	this.setManifestsFolder("./");
};
catapult.ManifestServer.__name__ = ["catapult","ManifestServer"];
catapult.ManifestServer.getManifests = function(path) {
	var manifests = { };
	var allManifestsMd5StringBuffer = new StringBuf();
	var _g = 0;
	var _g1 = js.Node.require("fs").readdirSync(path);
	while(_g < _g1.length) {
		var manifestKey = _g1[_g];
		++_g;
		var manifestDirectory = js.Node.require("path").join(path,manifestKey);
		if(js.Node.require("fs").lstatSync(manifestDirectory).isDirectory()) {
			var assets = [];
			var md5StringBuffer = new StringBuf();
			var _g2 = 0;
			var _g3 = sys.FileSystem.readRecursive(manifestDirectory,catapult.ManifestServer.fileFilter);
			while(_g2 < _g3.length) {
				var relativeFilePath = _g3[_g2];
				++_g2;
				var absoluteFilePath = js.Node.require("path").join(manifestDirectory == null?"":manifestDirectory,relativeFilePath == null?"":relativeFilePath,"");
				var fileBlob = { name : relativeFilePath, md5 : sys.FileSystem.signature(absoluteFilePath), bytes : js.Node.require("fs").statSync(absoluteFilePath).size};
				assets.push(fileBlob);
				if(fileBlob.md5 == null) md5StringBuffer.b += "null"; else md5StringBuffer.b += "" + fileBlob.md5;
			}
			var servedManifest = { id : manifestKey, assets : assets, md5 : js.Node.require("crypto").createHash("md5").update(md5StringBuffer.b).digest("hex")};
			if(servedManifest.md5 == null) allManifestsMd5StringBuffer.b += "null"; else allManifestsMd5StringBuffer.b += "" + servedManifest.md5;
			manifests[manifestKey] = servedManifest;
		}
	}
	return { manifests : manifests, md5 : js.Node.require("crypto").createHash("md5").update(allManifestsMd5StringBuffer.b).digest("hex")};
};
catapult.ManifestServer.fileFilter = function(filePath) {
	return filePath != null && !(StringTools.startsWith(js.Node.require("path").basename(filePath),".") || StringTools.endsWith(filePath,"cache"));
};
catapult.ManifestServer.prototype = {
	rebuildManifest: function() {
		this._manifests = null;
	}
	,onFileChanged: function(event) {
		var allManifestsMd5StringBuffer = new StringBuf();
		var _g = 0;
		var _g1 = Reflect.fields(this.get_manifests().manifests);
		while(_g < _g1.length) {
			var manifestKey = _g1[_g];
			++_g;
			var manifest = Reflect.field(this.get_manifests().manifests,manifestKey);
			if(manifest.id == event.manifest.id) {
				var md5StringBuffer = new StringBuf();
				var _g2 = 0;
				var _g3 = manifest.assets;
				while(_g2 < _g3.length) {
					var asset = _g3[_g2];
					++_g2;
					if(asset.name == event.asset.name) {
						var absoluteFilePath = js.Node.require("path").join(this.manifestsPath,manifestKey,asset.name);
						asset.md5 = sys.FileSystem.signature(absoluteFilePath);
						asset.bytes = js.Node.require("fs").statSync(absoluteFilePath).size;
					}
					if(asset.md5 == null) md5StringBuffer.b += "null"; else md5StringBuffer.b += "" + asset.md5;
				}
				manifest.md5 = js.Node.require("crypto").createHash("md5").update(md5StringBuffer.b).digest("hex");
			}
			if(manifest.md5 == null) allManifestsMd5StringBuffer.b += "null"; else allManifestsMd5StringBuffer.b += "" + manifest.md5;
		}
		this.get_manifests().md5 = js.Node.require("crypto").createHash("md5").update(allManifestsMd5StringBuffer.b).digest("hex");
	}
	,createServer: function(port) {
		var _g = this;
		var server = js.Node.require("http").createServer(function(req,res) {
			if(!_g.onHttpRequest(req,res)) {
				res.writeHead(404);
				res.write("<!DOCTYPE html><html><body><h1>Unknown API</h1>" + haxe.Json.stringify(_g.get_manifests(),null,"\t") + "</body></html>");
				res.end();
			}
		});
		server.listen(port,"0.0.0.0",function() {
			haxe.Log.trace("Manifest server listening on 0.0.0.0:" + port,{ fileName : "ManifestServer.hx", lineNumber : 60, className : "catapult.ManifestServer", methodName : "createServer"});
		});
		return server;
	}
	,setManifestsFolder: function(path) {
		this.set_manifestsPath(path);
		this.rebuildManifest();
		return this;
	}
	,getMiddleWare: function() {
		var _g = this;
		return function(req,res,next) {
			if(!_g.onHttpRequest(req,res)) next();
		};
	}
	,onHttpRequest: function(req,res) {
		var queryString = js.Node.require("url").parse(req.url);
		return this.serveManifest(req,res) || this.serveManifests(req,res) || this.serveFile(req,res);
	}
	,serveManifests: function(req,res) {
		var queryString = js.Node.require("url").parse(req.url);
		if(queryString.pathname != "/manifests.json") return false;
		res.writeHead(200,{ 'Content-Type' : "application/json"});
		res.end(haxe.Json.stringify(this.get_manifests(),null,"\t"));
		return true;
	}
	,serveManifest: function(req,res) {
		var queryString = js.Node.require("url").parse(req.url);
		if(!StringTools.endsWith(queryString.pathname,"/manifest.json")) return false;
		var pathToken = StringTools.replace(queryString.pathname,"manifest.json","");
		pathToken = StringTools.replace(pathToken,"/","");
		if(!Reflect.field(this.get_manifests().manifests,pathToken)) {
			res.writeHead(404,{ 'Content-Type' : "text/plain"});
			var manifestKeys = this.getManifestKeys();
			var _g1 = 0;
			var _g = manifestKeys.length;
			while(_g1 < _g) {
				var i = _g1++;
				manifestKeys[i] = "/" + manifestKeys[i] + "/manifest.json";
			}
			res.end("No manifest at that path found, possible manifests are [" + manifestKeys.join(", ") + "]");
			return true;
		}
		var manifestData = { manifest : Reflect.field(this.get_manifests().manifests,pathToken)};
		res.writeHead(200,{ 'Content-Type' : "application/json"});
		res.end(JSON.stringify(manifestData,null,"\t"));
		return true;
	}
	,serveFile: function(req,res) {
		var queryString = js.Node.require("url").parse(req.url);
		var filePath = HxOverrides.substr(queryString.pathname,1,null);
		var pathTokens = filePath.split(js.Node.require("path").sep);
		var manifest = Reflect.field(this.get_manifests().manifests,pathTokens[0]);
		if(manifest == null) return false;
		var fullFilePath = js.Node.require("path").join(this.manifestsPath,filePath);
		if(js.Node.require("fs").existsSync(fullFilePath)) {
			t9.remoting.ServeFile.serveFile(fullFilePath,res);
			return true;
		} else return false;
	}
	,set_manifestsPath: function(path) {
		this.manifestsPath = path;
		return path;
	}
	,get_manifests: function() {
		if(this._manifests == null) this._manifests = catapult.ManifestServer.getManifests(this.manifestsPath);
		return this._manifests;
	}
	,getManifestKeys: function() {
		var keys = new Array();
		var _g = 0;
		var _g1 = Reflect.fields(this.get_manifests().manifests);
		while(_g < _g1.length) {
			var key = _g1[_g];
			++_g;
			keys.push(key);
		}
		return keys;
	}
	,__class__: catapult.ManifestServer
};
catapult.ManifestWebsocket = $hx_exports.ManifestWebsocket = function(server) {
};
catapult.ManifestWebsocket.__name__ = ["catapult","ManifestWebsocket"];
catapult.ManifestWebsocket.prototype = {
	setWebsocketServer: function(server) {
		this._websocketServer = server;
		return this;
	}
	,createWebsocketServer: function(server) {
		var serverConfig = { httpServer : server, autoAcceptConnections : false};
		this._websocketServer = new WebSocketServer();
		this._websocketServer.on("connectFailed",$bind(this,this.onConnectFailed));
		this._websocketServer.on("request",$bind(this,this.onWebsocketRequest));
		this._websocketServer.mount(serverConfig);
		return this;
	}
	,setManifestFileWatcher: function(manifestFileWatcher) {
		this._manifestFileWatcher = manifestFileWatcher;
		this._manifestFileWatcher.on("catapult.file_changed",$bind(this,this.onFileChanged));
		return this;
	}
	,onConnectFailed: function(error) {
		t9.util.Log.error("WebSocketServer connection failed: " + Std.string(error),null,{ fileName : "ManifestWebsocket.hx", lineNumber : 44, className : "catapult.ManifestWebsocket", methodName : "onConnectFailed"});
	}
	,onWebsocketRequest: function(request) {
		t9.util.Log.info("request.requestedProtocols: " + Std.string(request.requestedProtocols),null,{ fileName : "ManifestWebsocket.hx", lineNumber : 49, className : "catapult.ManifestWebsocket", methodName : "onWebsocketRequest"});
		var protocol = null;
		var connection = request.accept(protocol,request.origin);
		var onError = function(error) {
			t9.util.Log.error(" Peer " + connection.remoteAddress + " error: " + error,null,{ fileName : "ManifestWebsocket.hx", lineNumber : 54, className : "catapult.ManifestWebsocket", methodName : "onWebsocketRequest"});
		};
		connection.on("error",onError);
		connection.on("message",function(message) {
			if(message.type == "utf8") t9.util.Log.info("Received Message: " + message.utf8Data,null,{ fileName : "ManifestWebsocket.hx", lineNumber : 60, className : "catapult.ManifestWebsocket", methodName : "onWebsocketRequest"}); else if(message.type == "binary") t9.util.Log.info("Received Binary Message of " + message.binaryData.length + " bytes",null,{ fileName : "ManifestWebsocket.hx", lineNumber : 63, className : "catapult.ManifestWebsocket", methodName : "onWebsocketRequest"});
		});
		connection.once("close",function(reasonCode,description) {
			t9.util.Log.info(Std.string(new Date()) + " client at \"" + connection.remoteAddress + "\" disconnected.",null,{ fileName : "ManifestWebsocket.hx", lineNumber : 68, className : "catapult.ManifestWebsocket", methodName : "onWebsocketRequest"});
			connection.removeListener("error",onError);
		});
	}
	,sendMessageToAllClients: function(msg) {
		var clientCount = 0;
		var _g = 0;
		var _g1 = this._websocketServer.connections;
		while(_g < _g1.length) {
			var connection = _g1[_g];
			++_g;
			clientCount++;
		}
		t9.util.Log.info({ log : "Sending to " + clientCount + " clients", msg : msg},null,{ fileName : "ManifestWebsocket.hx", lineNumber : 79, className : "catapult.ManifestWebsocket", methodName : "sendMessageToAllClients"});
		var _g2 = 0;
		var _g11 = this._websocketServer.connections;
		while(_g2 < _g11.length) {
			var connection1 = _g11[_g2];
			++_g2;
			connection1.sendUTF(msg);
		}
	}
	,onFileChanged: function(event) {
		t9.util.Log.info("onFileChanged:" + Std.string(event),null,{ fileName : "ManifestWebsocket.hx", lineNumber : 87, className : "catapult.ManifestWebsocket", methodName : "onFileChanged"});
		this._manifestFileWatcher.manifestServer.onFileChanged(event);
		var asset = event.asset;
		var messageRPC = { method : "catapult.file_changed", params : [{ name : asset.name, md5 : asset.md5, manifest : event.manifest.id, bytes : asset.bytes}], jsonrpc : "2.0"};
		this.sendMessageToAllClients(JSON.stringify(messageRPC,null,null));
	}
	,__class__: catapult.ManifestWebsocket
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
var t9 = {};
t9.remoting = {};
t9.remoting.ServeFile = function() { };
t9.remoting.ServeFile.__name__ = ["t9","remoting","ServeFile"];
t9.remoting.ServeFile.serveFileRequest = function(request,response,pathRoot) {
	var mime = js.Node.require("mime");
	var uri = js.Node.require("url").parse(request.url).pathname;
	var filename;
	if(pathRoot == null) filename = js.Node.require("path").join(js.Node.process.cwd(),uri); else filename = pathRoot + uri;
	t9.remoting.ServeFile.serveFile(filename,response);
};
t9.remoting.ServeFile.serveFile = function(filePath,response) {
	var mime = js.Node.require("mime");
	js.Node.require("fs").exists(filePath,function(exists) {
		if(!exists) {
			response.writeHead(404,{ 'Content-Type' : "text/plain"});
			response.write("404 Not Found\n");
			response.end();
		}
		if(js.Node.require("fs").statSync(filePath).isDirectory()) filePath += "/index.html";
		js.Node.require("fs").readFile(filePath,{ encoding : null, flag : "r"},function(err,data) {
			if(err != null) {
				response.writeHead(500,{ 'Content-Type' : "text/plain"});
				response.write(err + "\n");
				response.end();
			}
			var contentType = mime.lookup(filePath);
			t9.util.Log.info("Served=" + filePath + ":" + contentType,null,{ fileName : "ServeFile.hx", lineNumber : 39, className : "t9.remoting.ServeFile", methodName : "serveFile"});
			response.writeHead(200,{ 'Content-Type' : contentType});
			response.write(data,"binary");
			response.end();
		});
	});
};
t9.util = {};
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
var WebSocketClient = js.Node.require("websocket").client;
haxe.Log.trace("Console.start",{ fileName : "Log.hx", lineNumber : 43, className : "t9.util.Log", methodName : "__init__"});
mconsole.Console.start();
catapult.Constants.MESSAGE_TYPE_RESTART_ = "catapult.restart";
catapult.Constants.MESSAGE_TYPE_FILE_CHANGED = "catapult.file_changed";
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
catapult.Main.main();
})(typeof window != "undefined" ? window : exports);

//# sourceMappingURL=catapult.js.map