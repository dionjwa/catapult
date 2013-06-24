(function () { "use strict";
var $estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
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
}
var HxOverrides = function() { }
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var Lambda = function() { }
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
}
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
}
var List = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,first: function() {
		if(this.h == null) return null; else return this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,__class__: List
}
var IMap = function() { }
IMap.__name__ = ["IMap"];
IMap.prototype = {
	__class__: IMap
}
var Reflect = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
var Std = function() { }
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	addSub: function(s,pos,len) {
		this.b += len == null?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len);
	}
	,__class__: StringBuf
}
var StringTools = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	if(quotes) return s.split("\"").join("&quot;").split("'").join("&#039;"); else return s;
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&quot;").join("\"").split("&#039;").join("'").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
var Sys = function() { }
Sys.__name__ = ["Sys"];
Sys.args = function() {
	return js.Node.process.argv;
}
Sys.getEnv = function(key) {
	return Reflect.field(js.Node.process.env,key);
}
Sys.environment = function() {
	return js.Node.process.env;
}
Sys.time = function() {
	return new Date().getTime() / 1000;
}
var ValueType = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
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
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
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
		var c = v.__class__;
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
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
var XmlType = { __ename__ : ["XmlType"], __constructs__ : [] }
var Xml = function() {
};
Xml.__name__ = ["Xml"];
Xml.parse = function(str) {
	return haxe.xml.Parser.parse(str);
}
Xml.createElement = function(name) {
	var r = new Xml();
	r.nodeType = Xml.Element;
	r._children = new Array();
	r._attributes = new haxe.ds.StringMap();
	r.set_nodeName(name);
	return r;
}
Xml.createPCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.PCData;
	r.set_nodeValue(data);
	return r;
}
Xml.createCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.CData;
	r.set_nodeValue(data);
	return r;
}
Xml.createComment = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Comment;
	r.set_nodeValue(data);
	return r;
}
Xml.createDocType = function(data) {
	var r = new Xml();
	r.nodeType = Xml.DocType;
	r.set_nodeValue(data);
	return r;
}
Xml.createProcessingInstruction = function(data) {
	var r = new Xml();
	r.nodeType = Xml.ProcessingInstruction;
	r.set_nodeValue(data);
	return r;
}
Xml.createDocument = function() {
	var r = new Xml();
	r.nodeType = Xml.Document;
	r._children = new Array();
	return r;
}
Xml.prototype = {
	toString: function() {
		if(this.nodeType == Xml.PCData) return StringTools.htmlEscape(this._nodeValue);
		if(this.nodeType == Xml.CData) return "<![CDATA[" + this._nodeValue + "]]>";
		if(this.nodeType == Xml.Comment) return "<!--" + this._nodeValue + "-->";
		if(this.nodeType == Xml.DocType) return "<!DOCTYPE " + this._nodeValue + ">";
		if(this.nodeType == Xml.ProcessingInstruction) return "<?" + this._nodeValue + "?>";
		var s = new StringBuf();
		if(this.nodeType == Xml.Element) {
			s.b += "<";
			s.b += Std.string(this._nodeName);
			var $it0 = this._attributes.keys();
			while( $it0.hasNext() ) {
				var k = $it0.next();
				s.b += " ";
				s.b += Std.string(k);
				s.b += "=\"";
				s.b += Std.string(this._attributes.get(k));
				s.b += "\"";
			}
			if(this._children.length == 0) {
				s.b += "/>";
				return s.b;
			}
			s.b += ">";
		}
		var $it1 = this.iterator();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			s.b += Std.string(x.toString());
		}
		if(this.nodeType == Xml.Element) {
			s.b += "</";
			s.b += Std.string(this._nodeName);
			s.b += ">";
		}
		return s.b;
	}
	,addChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.push(x);
	}
	,firstElement: function() {
		if(this._children == null) throw "bad nodetype";
		var cur = 0;
		var l = this._children.length;
		while(cur < l) {
			var n = this._children[cur];
			if(n.nodeType == Xml.Element) return n;
			cur++;
		}
		return null;
	}
	,elementsNamed: function(name) {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				if(n.nodeType == Xml.Element && n._nodeName == name) break;
				k++;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				k++;
				if(n.nodeType == Xml.Element && n._nodeName == name) {
					this.cur = k;
					return n;
				}
			}
			return null;
		}};
	}
	,iterator: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			return this.cur < this.x.length;
		}, next : function() {
			return this.x[this.cur++];
		}};
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.exists(att);
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.set(att,value);
	}
	,get: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.get(att);
	}
	,set_nodeValue: function(v) {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue = v;
	}
	,set_nodeName: function(n) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName = n;
	}
	,get_nodeName: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName;
	}
	,__class__: Xml
}
var catapult = {}
catapult.Catapult = function() { }
catapult.Catapult.__name__ = ["catapult","Catapult"];
catapult.OdsType = { __ename__ : ["catapult","OdsType"], __constructs__ : ["OdsBool","OdsString","OdsInt","OdsFloat","OdsNull"] }
catapult.OdsType.OdsBool = ["OdsBool",0];
catapult.OdsType.OdsBool.toString = $estr;
catapult.OdsType.OdsBool.__enum__ = catapult.OdsType;
catapult.OdsType.OdsString = ["OdsString",1];
catapult.OdsType.OdsString.toString = $estr;
catapult.OdsType.OdsString.__enum__ = catapult.OdsType;
catapult.OdsType.OdsInt = ["OdsInt",2];
catapult.OdsType.OdsInt.toString = $estr;
catapult.OdsType.OdsInt.__enum__ = catapult.OdsType;
catapult.OdsType.OdsFloat = ["OdsFloat",3];
catapult.OdsType.OdsFloat.toString = $estr;
catapult.OdsType.OdsFloat.__enum__ = catapult.OdsType;
catapult.OdsType.OdsNull = ["OdsNull",4];
catapult.OdsType.OdsNull.toString = $estr;
catapult.OdsType.OdsNull.__enum__ = catapult.OdsType;
catapult.OdsRuntimeParser = function() { }
catapult.OdsRuntimeParser.__name__ = ["catapult","OdsRuntimeParser"];
catapult.OdsRuntimeParser.getType = function(s) {
	s = StringTools.trim(s);
	if(s == null || s == "") return catapult.OdsType.OdsNull; else if(catapult.OdsRuntimeParser.isInt.match(s)) return catapult.OdsType.OdsInt; else if(catapult.OdsRuntimeParser.isFloat.match(s)) return catapult.OdsType.OdsFloat; else if(catapult.OdsRuntimeParser.isBoolean.match(s)) return catapult.OdsType.OdsBool; else return catapult.OdsType.OdsString;
}
catapult.OdsRuntimeParser.parse = function(filePath) {
	var sheets = new haxe.ds.StringMap();
	var ods1 = new ods.OdsChecker();
	ods1.loadODS(new haxe.io.StringInput(sys.io.File.getContent(filePath)));
	var _g = 0;
	var _g1 = ods1.getSheets();
	while(_g < _g1.length) {
		var sheetkey = _g1[_g];
		++_g;
		var objects = new Array();
		sheets.set(sheetkey,objects);
		var lines = ods1.getLines(sheetkey);
		var keys = null;
		var types = [];
		var itemIndex = -1;
		while( lines.hasNext() ) {
			var line = lines.next();
			if(keys == null) keys = line; else if(line[0] == "$EOF") break; else {
				itemIndex++;
				var obj = { };
				objects.push(obj);
				var _g3 = 0;
				var _g2 = line.length;
				while(_g3 < _g2) {
					var i = _g3++;
					if(i == 0) {
						obj[keys[i]] = [line[i],itemIndex];
						continue;
					}
					if(types[i] == null || types[i] == catapult.OdsType.OdsNull || types[i] == catapult.OdsType.OdsInt) types[i] = catapult.OdsRuntimeParser.getType(line[i]);
					var _g4 = types[i];
					switch(_g4[1]) {
					case 0:
						obj[keys[i]] = line[i] == "true";
						break;
					case 2:
						obj[keys[i]] = Std.parseInt(line[i]);
						break;
					case 3:
						obj[keys[i]] = Std.parseFloat(line[i]);
						break;
					case 1:
						obj[keys[i]] = line[i];
						break;
					case 4:
						obj[keys[i]] = null;
						break;
					}
				}
			}
		}
	}
	return sheets;
}
catapult.Server = function() {
	this._manifests = new haxe.ds.StringMap();
	this.init();
};
catapult.Server.__name__ = ["catapult","Server"];
catapult.Server.getLocalIp = function() {
	var en1 = js.Node.os.networkInterfaces().en1;
	if(en1 != null) {
		var _g = 0;
		while(_g < en1.length) {
			var n = en1[_g];
			++_g;
			if(n.family == "IPv4") return n.address;
		}
	}
	return "127.0.0.1";
}
catapult.Server.main = function() {
	mconsole.Console.start();
	new catapult.Server();
}
catapult.Server.fileFilter = function(filePath) {
	return filePath != null && !(StringTools.startsWith(js.Node.path.basename(filePath),".") || StringTools.endsWith(filePath,"cache"));
}
catapult.Server.prototype = {
	watchFile: function(file,fireChangedEvent,retry,retryCount) {
		if(retryCount == null) retryCount = 0;
		if(retry == null) retry = false;
		if(fireChangedEvent == null) fireChangedEvent = false;
		var _g = this;
		js.Node.fs.exists(file.absolutePath,function(exists) {
			if(exists) {
				var options = { persistent : true};
				var watcher = js.Node.fs.watch(file.absolutePath,options,function(event,ignored) {
					mconsole.Console.info({ log : "file_changed", event : event, path : file.absolutePath},{ fileName : "Server.hx", lineNumber : 553, className : "catapult.Server", methodName : "watchFile"});
					if(event == "rename") {
						mconsole.Console.warn(file.absolutePath + " renamed.",{ fileName : "Server.hx", lineNumber : 555, className : "catapult.Server", methodName : "watchFile"});
						if(js.Node.fs.existsSync(file.absolutePath)) _g.watchFile(file); else haxe.Timer.delay(function() {
							_g.watchFile(file,true,true,0);
						},catapult.Server.RETRY_INTERVAL_MS);
					} else if(js.Node.fs.statSync(file.absolutePath).size > 0) _g.onFileChanged(file); else {
					}
				});
				file.md5 = sys.FileSystem.signature(file.absolutePath);
			} else if(retry) {
				if(retryCount > 100) {
					if(mconsole.Console.hasConsole) mconsole.Console.callConsole("warn",["Retry count > 100, not retrying anymore"]);
					mconsole.Console.print(mconsole.LogLevel.warn,["Retry count > 100, not retrying anymore"],{ fileName : "Server.hx", lineNumber : 588, className : "catapult.Server", methodName : "watchFile"});
				} else haxe.Timer.delay(function() {
					_g.watchFile(file,fireChangedEvent,retry,retryCount + 1);
				},catapult.Server.RETRY_INTERVAL_MS);
			}
		});
	}
	,setupFileWatching: function(rootPath) {
		mconsole.Console.info("Watching rootPath: " + rootPath,{ fileName : "Server.hx", lineNumber : 499, className : "catapult.Server", methodName : "setupFileWatching"});
		if(this._files == null) this._files = new haxe.ds.StringMap();
		if(!(js.Node.fs.existsSync(rootPath) && sys.FileSystem.isDirectory(rootPath))) throw rootPath + " doesn't exist";
		var baseName = js.Node.path.basename(rootPath);
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
			var absoluteFilePath = js.Node.path.join(rootPath == null?"":rootPath,relativeFilePath == null?"":relativeFilePath,"");
			var fileBlob = { manifestKey : baseName, md5 : sys.FileSystem.signature(absoluteFilePath), relativePath : relativeFilePath, absolutePath : absoluteFilePath, bytes : js.Node.fs.statSync(absoluteFilePath).size};
			this._files.set(sys.FileSystem.join(baseName,fileBlob.relativePath,null),fileBlob);
			fileBlob;
			fileArray.push(fileBlob);
			this.watchFile(fileBlob);
			numFilesWatched++;
		}
		mconsole.Console.info("Watching " + numFilesWatched + " files in " + rootPath,{ fileName : "Server.hx", lineNumber : 539, className : "catapult.Server", methodName : "setupFileWatching"});
	}
	,onFileChanged: function(file) {
		var _g = this;
		if(file.relativePath == ".catapult") {
			if(mconsole.Console.hasConsole) mconsole.Console.callConsole("warn",[".catapult changed, reloading config!!"]);
			mconsole.Console.print(mconsole.LogLevel.warn,[".catapult changed, reloading config!!"],{ fileName : "Server.hx", lineNumber : 421, className : "catapult.Server", methodName : "onFileChanged"});
			this.loadConfig();
			return;
		}
		file.md5 = sys.FileSystem.signature(file.absolutePath);
		file.bytes = js.Node.fs.statSync(file.absolutePath).size;
		if(this._manifests.exists(file.manifestKey)) this._manifests.get(file.manifestKey).md5 = null;
		var message = { type : "file_changed", name : file.relativePath, md5 : file.md5, manifest : file.manifestKey, bytes : file.bytes};
		var messageString = js.Node.stringify(message,null,"\t");
		var _g1 = 0;
		var _g11 = this._websocketServer.connections;
		while(_g1 < _g11.length) {
			var connection = _g11[_g1];
			++_g1;
			connection.sendUTF(messageString);
		}
		if(StringTools.endsWith(file.relativePath,".ods")) {
			if(mconsole.Console.hasConsole) mconsole.Console.callConsole("info",["LibreOffice spreadsheet changed, sending json data."]);
			mconsole.Console.print(mconsole.LogLevel.info,["LibreOffice spreadsheet changed, sending json data."],{ fileName : "Server.hx", lineNumber : 443, className : "catapult.Server", methodName : "onFileChanged"});
			var update = function() {
				var data = catapult.OdsRuntimeParser.parse(file.absolutePath);
				var dataMessage = message;
				dataMessage.type = "file_changed_ods";
				dataMessage.data = data;
				var dataMessageString = js.Node.stringify(dataMessage,null,"\t");
				var _g1 = 0;
				var _g2 = _g._websocketServer.connections;
				while(_g1 < _g2.length) {
					var connection = _g2[_g1];
					++_g1;
					connection.sendUTF(dataMessageString);
				}
			};
			if(js.Node.fs.statSync(file.absolutePath).size == 0) js.Node.setTimeout(update,100); else update();
		}
		if(this._config.commands != null) {
			var _g1 = 0;
			var _g11 = this._config.commands;
			while(_g1 < _g11.length) {
				var commandData = _g11[_g1];
				++_g1;
				if(StringTools.endsWith(file.relativePath,commandData.suffix)) {
					var commandProcess = js.Node.childProcess.spawn(commandData.command,commandData.args != null?commandData.args:[]);
					commandProcess.stdout.on("data",function(data) {
						mconsole.Console.info("stdout: " + data,{ fileName : "Server.hx", lineNumber : 479, className : "catapult.Server", methodName : "onFileChanged"});
					});
					commandProcess.stderr.on("data",function(data) {
						mconsole.Console.info("stderr: " + data,{ fileName : "Server.hx", lineNumber : 485, className : "catapult.Server", methodName : "onFileChanged"});
					});
					commandProcess.on("close",function(code) {
						mconsole.Console.info("child process exited with code " + code,{ fileName : "Server.hx", lineNumber : 490, className : "catapult.Server", methodName : "onFileChanged"});
					});
				}
			}
		}
	}
	,onWebsocketRequest: function(request) {
		mconsole.Console.info("request.requestedProtocols: " + Std.string(request.requestedProtocols),{ fileName : "Server.hx", lineNumber : 402, className : "catapult.Server", methodName : "onWebsocketRequest"});
		var protocol = null;
		var connection = request.accept(protocol,request.origin);
		var onError = function(error) {
			mconsole.Console.error(" Peer " + connection.remoteAddress + " error: " + error,null,{ fileName : "Server.hx", lineNumber : 407, className : "catapult.Server", methodName : "onWebsocketRequest"});
		};
		connection.on("error",onError);
		connection.once("close",function(reasonCode,description) {
			mconsole.Console.info(Std.string(new Date()) + " client at \"" + connection.remoteAddress + "\" disconnected.",{ fileName : "Server.hx", lineNumber : 412, className : "catapult.Server", methodName : "onWebsocketRequest"});
			connection.removeListener("error",onError);
		});
	}
	,onConnectFailed: function(error) {
		mconsole.Console.error("WebSocketServer connection failed: " + Std.string(error),null,{ fileName : "Server.hx", lineNumber : 397, className : "catapult.Server", methodName : "onConnectFailed"});
	}
	,serveOds: function(req,res) {
		if(!StringTools.endsWith(req.url,".ods")) return false;
		var urlObj = js.Node.url.parse(req.url,true);
		var firstPathToken = HxOverrides.substr(urlObj.pathname,1,null).split("/")[0];
		var filePath = urlObj.pathname;
		if(filePath.charAt(0) == "/") filePath = HxOverrides.substr(filePath,1,null);
		if(!this._files.exists(filePath)) {
			mconsole.Console.error("Requested " + filePath + ", but no file exists",null,{ fileName : "Server.hx", lineNumber : 378, className : "catapult.Server", methodName : "serveOds"});
			res.writeHead(404,{ 'Content-Type' : "text/plain"});
			res.end("Requested " + filePath + ", but no file exists.\n\tAll files:\n\t\t" + Lambda.array({ iterator : (function(_e) {
				return function() {
					return _e.keys();
				};
			})(this._files)}).join("\n\t\t"));
			return true;
		}
		var fileBlob = this._files.get(filePath);
		var data = catapult.OdsRuntimeParser.parse(fileBlob.absolutePath);
		res.writeHead(200,{ 'Content-Type' : "application/json"});
		mconsole.Console.log("Serving : " + js.Node.stringify(data,null,"\t"),{ fileName : "Server.hx", lineNumber : 389, className : "catapult.Server", methodName : "serveOds"});
		res.end(js.Node.stringify(data,null,"\t"));
		return true;
	}
	,serveManifests: function(req,res) {
		if(req.url != "/manifests.json") return false;
		var result = { manifests : { }};
		var manifests = new Array();
		var $it0 = this._manifests.keys();
		while( $it0.hasNext() ) {
			var manifestKey = $it0.next();
			var manifest = this.getServedManifest(manifestKey);
			result.manifests[manifestKey] = manifest;
		}
		res.writeHead(200,{ 'Content-Type' : "application/json"});
		mconsole.Console.log("Manifests: " + js.Node.stringify(result,null,"\t"),{ fileName : "Server.hx", lineNumber : 357, className : "catapult.Server", methodName : "serveManifests"});
		res.end(js.Node.stringify(result,null,"\t"));
		return true;
	}
	,getServedManifest: function(manifestKey) {
		if(!this._manifests.exists(manifestKey)) {
			mconsole.Console.error("No manifest for key=" + manifestKey,null,{ fileName : "Server.hx", lineNumber : 319, className : "catapult.Server", methodName : "getServedManifest"});
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
			var _g = 0;
			var _g1 = this._manifests.get(manifestKey).assets;
			while(_g < _g1.length) {
				var f = _g1[_g];
				++_g;
				s.b += Std.string(f.md5);
			}
			this._manifests.get(manifestKey).md5 = js.Node.crypto.createHash("md5").update(s.b).digest("hex");
		}
		var manifest = { assets : files, id : manifestKey, md5 : this._manifests.get(manifestKey).md5};
		return manifest;
	}
	,serveManifest: function(req,res) {
		if(!StringTools.endsWith(req.url,"/manifest.json")) return false;
		var pathToken = StringTools.replace(req.url,"manifest.json","");
		pathToken = StringTools.replace(pathToken,"/","");
		if(!this._manifests.exists(pathToken)) {
			res.writeHead(404,{ 'Content-Type' : "text/plain"});
			var manifestKeys = Lambda.array({ iterator : (function(_e) {
				return function() {
					return _e.keys();
				};
			})(this._manifests)});
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
		res.end(js.Node.stringify(manifestData,null,"\t"));
		return true;
	}
	,serveFile: function(req,res) {
		var _g = this;
		var urlObj = js.Node.url.parse(req.url,true);
		var firstPathToken = HxOverrides.substr(urlObj.pathname,1,null).split("/")[0];
		var fileKey = HxOverrides.substr(urlObj.pathname,1,null);
		if(this._files.exists(fileKey)) {
			var fileBlob = this._files.get(fileKey);
			var manifest = this._manifests.get(fileBlob.manifestKey);
			var serverKey = manifest.id;
			var staticServer = this._servedFolders.get(serverKey);
			mconsole.Console.assert(staticServer != null,{ message : "staticServer != null", urlObj : urlObj, fileBlob : fileBlob, manifest : manifest, _servedFolders : this._servedFolders},{ fileName : "Server.hx", lineNumber : 232, className : "catapult.Server", methodName : "serveFile"});
			var tokens = urlObj.pathname.split(js.Node.path.sep).filter(function(s) {
				return s != null && s.length > 0;
			});
			var filePath = tokens.join(js.Node.path.sep);
			var absoluteFilePath = js.Node.path.join(staticServer.root,fileBlob.relativePath);
			js.Node.fs.exists(absoluteFilePath,function(exists) {
				if(exists) {
					mconsole.Console.info("Served: " + absoluteFilePath,{ fileName : "Server.hx", lineNumber : 243, className : "catapult.Server", methodName : "serveFile"});
					staticServer.serveFile(fileBlob.relativePath,200,null,req,res);
				} else {
					mconsole.Console.warn(absoluteFilePath + " not found.",{ fileName : "Server.hx", lineNumber : 248, className : "catapult.Server", methodName : "serveFile"});
					res.writeHead(404);
					res.end();
				}
			});
		} else if(fileKey == "" || fileKey == "/") {
			if(mconsole.Console.hasConsole) mconsole.Console.callConsole("info",["Defaulting to index.html"]);
			mconsole.Console.print(mconsole.LogLevel.info,["Defaulting to index.html"],{ fileName : "Server.hx", lineNumber : 259, className : "catapult.Server", methodName : "serveFile"});
			this._defaultStaticServer.serveFile("/index.html",200,{ },req,res);
		} else this._defaultStaticServer.serve(req,res,function(err,result) {
			if(err) {
				if(mconsole.Console.hasConsole) mconsole.Console.callConsole("warn",[err]);
				mconsole.Console.print(mconsole.LogLevel.warn,[err],{ fileName : "Server.hx", lineNumber : 267, className : "catapult.Server", methodName : "serveFile"});
				mconsole.Console.info(Std.string(urlObj) + "",{ fileName : "Server.hx", lineNumber : 268, className : "catapult.Server", methodName : "serveFile"});
				mconsole.Console.info(Std.string(new Date()) + " Received request for " + req.url,{ fileName : "Server.hx", lineNumber : 269, className : "catapult.Server", methodName : "serveFile"});
				res.writeHead(404,{ 'Content-Type' : "text/plain"});
				var manifestKeys = Lambda.array({ iterator : (function(_e) {
					return function() {
						return _e.keys();
					};
				})(_g._manifests)});
				var _g2 = 0;
				var _g1 = manifestKeys.length;
				while(_g2 < _g1) {
					var i = _g2++;
					manifestKeys[i] = "http://<host>:" + _g._config.port + "/" + manifestKeys[i] + "/manifest.json";
				}
				res.end("No manifest at that path found (firstPathToken=" + firstPathToken + "), possible served folders are [" + Lambda.array({ iterator : (function(_e1) {
					return function() {
						return _e1.keys();
					};
				})(_g._servedFolders)}).join(", ") + "]");
			} else mconsole.Console.info("Served: " + _g._defaultStaticServer.root + urlObj.pathname,{ fileName : "Server.hx", lineNumber : 281, className : "catapult.Server", methodName : "serveFile"});
		});
		return true;
	}
	,onHttpRequest: function(req,res) {
		if(req.url == "/favicon.ico") {
			res.writeHead(404);
			res.end();
			return;
		}
		if(this.serveManifest(req,res)) return;
		if(this.serveManifests(req,res)) return;
		if(this.serveOds(req,res)) return;
		this.serveFile(req,res);
	}
	,init: function() {
		var _g = this;
		var program = js.Node.require("commander");
		program.version("Blink Asset Server 0.1.  Serving up flaming hot assets since 1903.\n Run in the root of your game project.").option("-c, --config <config>","Use a non-default config file (defaults to \".catapult\") ",String,".catapult").parse(js.Node.process.argv);
		program.command("init").description("Creates a blank .catapult config file").action(function(env) {
			_g.createBlankCatapultFile();
			if(mconsole.Console.hasConsole) mconsole.Console.callConsole("info",["Created config file .catapult"]);
			mconsole.Console.print(mconsole.LogLevel.info,["Created config file .catapult"],{ fileName : "Server.hx", lineNumber : 182, className : "catapult.Server", methodName : "init"});
		});
		this._configPath = program.config;
		mconsole.Console.info("Config path=" + this._configPath,{ fileName : "Server.hx", lineNumber : 185, className : "catapult.Server", methodName : "init"});
		this.loadConfig();
		this.watchFile({ md5 : "", bytes : 0, relativePath : this._configPath, absolutePath : this._configPath, manifestKey : ""});
	}
	,loadConfig: function() {
		var _g = this;
		if(js.Node.fs.existsSync(this._configPath)) {
			var content = sys.io.File.getContent(this._configPath);
			try {
				this._config = js.Node.parse(content);
			} catch( e ) {
				mconsole.Console.error({ log : "Could not parse json config file=" + this._configPath, err : e, content : content},null,{ fileName : "Server.hx", lineNumber : 110, className : "catapult.Server", methodName : "loadConfig"});
				js.Node.process.exit(1);
			}
		} else {
			mconsole.Console.warn("No catapult config file detected at " + this._configPath,{ fileName : "Server.hx", lineNumber : 116, className : "catapult.Server", methodName : "loadConfig"});
			if(mconsole.Console.hasConsole) mconsole.Console.callConsole("warn",["Please run node catapult.js init"]);
			mconsole.Console.print(mconsole.LogLevel.warn,["Please run node catapult.js init"],{ fileName : "Server.hx", lineNumber : 117, className : "catapult.Server", methodName : "loadConfig"});
			js.Node.process.exit(1);
		}
		this._servedFolders = new haxe.ds.StringMap();
		var manifests;
		if(Reflect.hasField(this._config,"manifests")) manifests = this._config.manifests; else manifests = [];
		if(manifests != null) {
			var _g1 = 0;
			while(_g1 < manifests.length) {
				var manifest = manifests[_g1];
				++_g1;
				var staticServer = js.node.NodeStatic.Server(manifest.path);
				mconsole.Console.assert(staticServer != null,"staticServer != null",{ fileName : "Server.hx", lineNumber : 127, className : "catapult.Server", methodName : "loadConfig"});
				this._servedFolders.set(manifest.id,staticServer);
				this.setupFileWatching(manifest.path);
			}
		}
		if(Reflect.hasField(this._config,"paths_to_watch_for_file_changes")) {
			var _g1 = 0;
			var _g11 = this._config.paths_to_watch_for_file_changes;
			while(_g1 < _g11.length) {
				var path = _g11[_g1];
				++_g1;
				this.setupFileWatching(path);
			}
		}
		this._defaultStaticServer = js.node.NodeStatic.Server(this._config.file_server_path);
		mconsole.Console.info("Serving static files from " + this._config.file_server_path,{ fileName : "Server.hx", lineNumber : 142, className : "catapult.Server", methodName : "loadConfig"});
		if(this._httpServer == null) {
			var http = js.Node.http;
			this._httpServer = http.createServer($bind(this,this.onHttpRequest));
			this._httpServer.listen(this._config.port,this._config.address,function() {
				mconsole.Console.info(Std.string(new Date()) + " Blink server available at:\n    [http://" + _g._config.address + ":" + _g._config.port + "]\n    [ws://" + _g._config.address + ":" + _g._config.port + "]",{ fileName : "Server.hx", lineNumber : 152, className : "catapult.Server", methodName : "loadConfig"});
			});
		}
		if(this._websocketServer == null) {
			var WebSocketServer = js.Node.require("websocket").server;
			var serverConfig = { httpServer : this._httpServer, autoAcceptConnections : false};
			this._websocketServer = new WebSocketServer();
			this._websocketServer.on("connectFailed",$bind(this,this.onConnectFailed));
			this._websocketServer.on("request",$bind(this,this.onWebsocketRequest));
			this._websocketServer.mount(serverConfig);
		}
	}
	,createBlankCatapultFile: function() {
		sys.io.File.saveContent(".catapult","{\n\t\n\t\t\t\"file_server\":\"deploy/web/targets\",\n\t\t\t\"manifests\" : [\n\t\t\t\t{\"name\" : \"bootstrap\", \"path\" : \"demo/assets/bootstrap\"}\n\t\t\t],\n\t\t\t\"paths_to_watch_for_file_changes\" : [\n\t\t\t\t\"src\",\n\t\t\t\t\"deploy/web\"\n\t\t\t],\n\t\t\t\"commands\" : [\n\t\t\t\t{\n\t\t\t\t\t\"suffix\" : \".hx\",\n\t\t\t\t\t\"command\": \"haxe\",\n\t\t\t\t\t\"args\":[\"demo/client.hxml\"]\n\t\t\t\t}\n\t\t\t]\n\t\t}");
	}
	,__class__: catapult.Server
}
var format = {}
format.tools = {}
format.tools.Adler32 = function() {
	this.a1 = 1;
	this.a2 = 0;
};
format.tools.Adler32.__name__ = ["format","tools","Adler32"];
format.tools.Adler32.read = function(i) {
	var a = new format.tools.Adler32();
	var a2a = i.readByte();
	var a2b = i.readByte();
	var a1a = i.readByte();
	var a1b = i.readByte();
	a.a1 = a1a << 8 | a1b;
	a.a2 = a2a << 8 | a2b;
	return a;
}
format.tools.Adler32.prototype = {
	equals: function(a) {
		return a.a1 == this.a1 && a.a2 == this.a2;
	}
	,update: function(b,pos,len) {
		var a1 = this.a1;
		var a2 = this.a2;
		var _g1 = pos;
		var _g = pos + len;
		while(_g1 < _g) {
			var p = _g1++;
			var c = b.b[p];
			a1 = (a1 + c) % 65521;
			a2 = (a2 + a1) % 65521;
		}
		this.a1 = a1;
		this.a2 = a2;
	}
	,__class__: format.tools.Adler32
}
format.tools.Huffman = { __ename__ : ["format","tools","Huffman"], __constructs__ : ["Found","NeedBit","NeedBits"] }
format.tools.Huffman.Found = function(i) { var $x = ["Found",0,i]; $x.__enum__ = format.tools.Huffman; $x.toString = $estr; return $x; }
format.tools.Huffman.NeedBit = function(left,right) { var $x = ["NeedBit",1,left,right]; $x.__enum__ = format.tools.Huffman; $x.toString = $estr; return $x; }
format.tools.Huffman.NeedBits = function(n,table) { var $x = ["NeedBits",2,n,table]; $x.__enum__ = format.tools.Huffman; $x.toString = $estr; return $x; }
format.tools.HuffTools = function() {
};
format.tools.HuffTools.__name__ = ["format","tools","HuffTools"];
format.tools.HuffTools.prototype = {
	make: function(lengths,pos,nlengths,maxbits) {
		var counts = new Array();
		var tmp = new Array();
		if(maxbits > 32) throw "Invalid huffman";
		var _g = 0;
		while(_g < maxbits) {
			var i = _g++;
			counts.push(0);
			tmp.push(0);
		}
		var _g = 0;
		while(_g < nlengths) {
			var i = _g++;
			var p = lengths[i + pos];
			if(p >= maxbits) throw "Invalid huffman";
			counts[p]++;
		}
		var code = 0;
		var _g1 = 1;
		var _g = maxbits - 1;
		while(_g1 < _g) {
			var i = _g1++;
			code = code + counts[i] << 1;
			tmp[i] = code;
		}
		var bits = new haxe.ds.IntMap();
		var _g = 0;
		while(_g < nlengths) {
			var i = _g++;
			var l = lengths[i + pos];
			if(l != 0) {
				var n = tmp[l - 1];
				tmp[l - 1] = n + 1;
				bits.set(n << 5 | l,i);
			}
		}
		return this.treeCompress(format.tools.Huffman.NeedBit(this.treeMake(bits,maxbits,0,1),this.treeMake(bits,maxbits,1,1)));
	}
	,treeMake: function(bits,maxbits,v,len) {
		if(len > maxbits) throw "Invalid huffman";
		var idx = v << 5 | len;
		if(bits.exists(idx)) return format.tools.Huffman.Found(bits.get(idx));
		v <<= 1;
		len += 1;
		return format.tools.Huffman.NeedBit(this.treeMake(bits,maxbits,v,len),this.treeMake(bits,maxbits,v | 1,len));
	}
	,treeWalk: function(table,p,cd,d,t) {
		switch(t[1]) {
		case 1:
			var b = t[3];
			var a = t[2];
			if(d > 0) {
				this.treeWalk(table,p,cd + 1,d - 1,a);
				this.treeWalk(table,p | 1 << cd,cd + 1,d - 1,b);
			} else table[p] = this.treeCompress(t);
			break;
		default:
			table[p] = this.treeCompress(t);
		}
	}
	,treeCompress: function(t) {
		var d = this.treeDepth(t);
		if(d == 0) return t;
		if(d == 1) switch(t[1]) {
		case 1:
			var b = t[3];
			var a = t[2];
			return format.tools.Huffman.NeedBit(this.treeCompress(a),this.treeCompress(b));
		default:
			throw "assert";
		}
		var size = 1 << d;
		var table = new Array();
		var _g = 0;
		while(_g < size) {
			var i = _g++;
			table.push(format.tools.Huffman.Found(-1));
		}
		this.treeWalk(table,0,0,d,t);
		return format.tools.Huffman.NeedBits(d,table);
	}
	,treeDepth: function(t) {
		switch(t[1]) {
		case 0:
			return 0;
		case 2:
			throw "assert";
			break;
		case 1:
			var b = t[3];
			var a = t[2];
			var da = this.treeDepth(a);
			var db = this.treeDepth(b);
			return 1 + (da < db?da:db);
		}
	}
	,__class__: format.tools.HuffTools
}
format.tools.Inflate = function() { }
format.tools.Inflate.__name__ = ["format","tools","Inflate"];
format.tools.Inflate.run = function(bytes) {
	return format.tools.InflateImpl.run(new haxe.io.BytesInput(bytes));
}
format.tools._InflateImpl = {}
format.tools._InflateImpl.Window = function(hasCrc) {
	this.buffer = haxe.io.Bytes.alloc(65536);
	this.pos = 0;
	if(hasCrc) this.crc = new format.tools.Adler32();
};
format.tools._InflateImpl.Window.__name__ = ["format","tools","_InflateImpl","Window"];
format.tools._InflateImpl.Window.prototype = {
	checksum: function() {
		if(this.crc != null) this.crc.update(this.buffer,0,this.pos);
		return this.crc;
	}
	,available: function() {
		return this.pos;
	}
	,getLastChar: function() {
		return this.buffer.b[this.pos - 1];
	}
	,addByte: function(c) {
		if(this.pos == 65536) this.slide();
		this.buffer.b[this.pos] = c;
		this.pos++;
	}
	,addBytes: function(b,p,len) {
		if(this.pos + len > 65536) this.slide();
		this.buffer.blit(this.pos,b,p,len);
		this.pos += len;
	}
	,slide: function() {
		if(this.crc != null) this.crc.update(this.buffer,0,32768);
		var b = haxe.io.Bytes.alloc(65536);
		this.pos -= 32768;
		b.blit(0,this.buffer,32768,this.pos);
		this.buffer = b;
	}
	,__class__: format.tools._InflateImpl.Window
}
format.tools._InflateImpl.State = { __ename__ : ["format","tools","_InflateImpl","State"], __constructs__ : ["Head","Block","CData","Flat","Crc","Dist","DistOne","Done"] }
format.tools._InflateImpl.State.Head = ["Head",0];
format.tools._InflateImpl.State.Head.toString = $estr;
format.tools._InflateImpl.State.Head.__enum__ = format.tools._InflateImpl.State;
format.tools._InflateImpl.State.Block = ["Block",1];
format.tools._InflateImpl.State.Block.toString = $estr;
format.tools._InflateImpl.State.Block.__enum__ = format.tools._InflateImpl.State;
format.tools._InflateImpl.State.CData = ["CData",2];
format.tools._InflateImpl.State.CData.toString = $estr;
format.tools._InflateImpl.State.CData.__enum__ = format.tools._InflateImpl.State;
format.tools._InflateImpl.State.Flat = ["Flat",3];
format.tools._InflateImpl.State.Flat.toString = $estr;
format.tools._InflateImpl.State.Flat.__enum__ = format.tools._InflateImpl.State;
format.tools._InflateImpl.State.Crc = ["Crc",4];
format.tools._InflateImpl.State.Crc.toString = $estr;
format.tools._InflateImpl.State.Crc.__enum__ = format.tools._InflateImpl.State;
format.tools._InflateImpl.State.Dist = ["Dist",5];
format.tools._InflateImpl.State.Dist.toString = $estr;
format.tools._InflateImpl.State.Dist.__enum__ = format.tools._InflateImpl.State;
format.tools._InflateImpl.State.DistOne = ["DistOne",6];
format.tools._InflateImpl.State.DistOne.toString = $estr;
format.tools._InflateImpl.State.DistOne.__enum__ = format.tools._InflateImpl.State;
format.tools._InflateImpl.State.Done = ["Done",7];
format.tools._InflateImpl.State.Done.toString = $estr;
format.tools._InflateImpl.State.Done.__enum__ = format.tools._InflateImpl.State;
format.tools.InflateImpl = function(i,header,crc) {
	if(crc == null) crc = true;
	if(header == null) header = true;
	this["final"] = false;
	this.htools = new format.tools.HuffTools();
	this.huffman = this.buildFixedHuffman();
	this.huffdist = null;
	this.len = 0;
	this.dist = 0;
	if(header) this.state = format.tools._InflateImpl.State.Head; else this.state = format.tools._InflateImpl.State.Block;
	this.input = i;
	this.bits = 0;
	this.nbits = 0;
	this.needed = 0;
	this.output = null;
	this.outpos = 0;
	this.lengths = new Array();
	var _g = 0;
	while(_g < 19) {
		var i1 = _g++;
		this.lengths.push(-1);
	}
	this.window = new format.tools._InflateImpl.Window(crc);
};
format.tools.InflateImpl.__name__ = ["format","tools","InflateImpl"];
format.tools.InflateImpl.run = function(i,bufsize) {
	if(bufsize == null) bufsize = 65536;
	var buf = haxe.io.Bytes.alloc(bufsize);
	var output = new haxe.io.BytesBuffer();
	var inflate = new format.tools.InflateImpl(i);
	while(true) {
		var len = inflate.readBytes(buf,0,bufsize);
		output.addBytes(buf,0,len);
		if(len < bufsize) break;
	}
	return output.getBytes();
}
format.tools.InflateImpl.prototype = {
	inflateLoop: function() {
		var _g = this;
		switch(_g.state[1]) {
		case 0:
			var cmf = this.input.readByte();
			var cm = cmf & 15;
			var cinfo = cmf >> 4;
			if(cm != 8 || cinfo != 7) throw "Invalid data";
			var flg = this.input.readByte();
			var fdict = (flg & 32) != 0;
			if(((cmf << 8) + flg) % 31 != 0) throw "Invalid data";
			if(fdict) throw "Unsupported dictionary";
			this.state = format.tools._InflateImpl.State.Block;
			return true;
		case 4:
			var calc = this.window.checksum();
			if(calc == null) {
				this.state = format.tools._InflateImpl.State.Done;
				return true;
			}
			var crc = format.tools.Adler32.read(this.input);
			if(!calc.equals(crc)) throw "Invalid CRC";
			this.state = format.tools._InflateImpl.State.Done;
			return true;
		case 7:
			return false;
		case 1:
			this["final"] = this.getBit();
			var _g1 = this.getBits(2);
			switch(_g1) {
			case 0:
				this.len = this.input.readUInt16();
				var nlen = this.input.readUInt16();
				if(nlen != 65535 - this.len) throw "Invalid data";
				this.state = format.tools._InflateImpl.State.Flat;
				var r = this.inflateLoop();
				this.resetBits();
				return r;
			case 1:
				this.huffman = this.buildFixedHuffman();
				this.huffdist = null;
				this.state = format.tools._InflateImpl.State.CData;
				return true;
			case 2:
				var hlit = this.getBits(5) + 257;
				var hdist = this.getBits(5) + 1;
				var hclen = this.getBits(4) + 4;
				var _g2 = 0;
				while(_g2 < hclen) {
					var i = _g2++;
					this.lengths[format.tools.InflateImpl.CODE_LENGTHS_POS[i]] = this.getBits(3);
				}
				var _g2 = hclen;
				while(_g2 < 19) {
					var i = _g2++;
					this.lengths[format.tools.InflateImpl.CODE_LENGTHS_POS[i]] = 0;
				}
				this.huffman = this.htools.make(this.lengths,0,19,8);
				var lengths = new Array();
				var _g3 = 0;
				var _g2 = hlit + hdist;
				while(_g3 < _g2) {
					var i = _g3++;
					lengths.push(0);
				}
				this.inflateLengths(lengths,hlit + hdist);
				this.huffdist = this.htools.make(lengths,hlit,hdist,16);
				this.huffman = this.htools.make(lengths,0,hlit,16);
				this.state = format.tools._InflateImpl.State.CData;
				return true;
			default:
				throw "Invalid data";
			}
			break;
		case 3:
			var rlen;
			if(this.len < this.needed) rlen = this.len; else rlen = this.needed;
			var bytes = this.input.read(rlen);
			this.len -= rlen;
			this.addBytes(bytes,0,rlen);
			if(this.len == 0) {
				if(this["final"]) this.state = format.tools._InflateImpl.State.Crc; else this.state = format.tools._InflateImpl.State.Block;
			}
			return this.needed > 0;
		case 6:
			var rlen;
			if(this.len < this.needed) rlen = this.len; else rlen = this.needed;
			this.addDistOne(rlen);
			this.len -= rlen;
			if(this.len == 0) this.state = format.tools._InflateImpl.State.CData;
			return this.needed > 0;
		case 5:
			while(this.len > 0 && this.needed > 0) {
				var rdist;
				if(this.len < this.dist) rdist = this.len; else rdist = this.dist;
				var rlen;
				if(this.needed < rdist) rlen = this.needed; else rlen = rdist;
				this.addDist(this.dist,rlen);
				this.len -= rlen;
			}
			if(this.len == 0) this.state = format.tools._InflateImpl.State.CData;
			return this.needed > 0;
		case 2:
			var n = this.applyHuffman(this.huffman);
			if(n < 256) {
				this.addByte(n);
				return this.needed > 0;
			} else if(n == 256) {
				if(this["final"]) this.state = format.tools._InflateImpl.State.Crc; else this.state = format.tools._InflateImpl.State.Block;
				return true;
			} else {
				n -= 257;
				var extra_bits = format.tools.InflateImpl.LEN_EXTRA_BITS_TBL[n];
				if(extra_bits == -1) throw "Invalid data";
				this.len = format.tools.InflateImpl.LEN_BASE_VAL_TBL[n] + this.getBits(extra_bits);
				var dist_code;
				if(this.huffdist == null) dist_code = this.getRevBits(5); else dist_code = this.applyHuffman(this.huffdist);
				extra_bits = format.tools.InflateImpl.DIST_EXTRA_BITS_TBL[dist_code];
				if(extra_bits == -1) throw "Invalid data";
				this.dist = format.tools.InflateImpl.DIST_BASE_VAL_TBL[dist_code] + this.getBits(extra_bits);
				if(this.dist > this.window.available()) throw "Invalid data";
				if(this.dist == 1) this.state = format.tools._InflateImpl.State.DistOne; else this.state = format.tools._InflateImpl.State.Dist;
				return true;
			}
			break;
		}
	}
	,inflateLengths: function(a,max) {
		var i = 0;
		var prev = 0;
		while(i < max) {
			var n = this.applyHuffman(this.huffman);
			switch(n) {
			case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:case 8:case 9:case 10:case 11:case 12:case 13:case 14:case 15:
				prev = n;
				a[i] = n;
				i++;
				break;
			case 16:
				var end = i + 3 + this.getBits(2);
				if(end > max) throw "Invalid data";
				while(i < end) {
					a[i] = prev;
					i++;
				}
				break;
			case 17:
				i += 3 + this.getBits(3);
				if(i > max) throw "Invalid data";
				break;
			case 18:
				i += 11 + this.getBits(7);
				if(i > max) throw "Invalid data";
				break;
			default:
				throw "Invalid data";
			}
		}
	}
	,applyHuffman: function(h) {
		switch(h[1]) {
		case 0:
			var n = h[2];
			return n;
		case 1:
			var b = h[3];
			var a = h[2];
			return this.applyHuffman(this.getBit()?b:a);
		case 2:
			var tbl = h[3];
			var n = h[2];
			return this.applyHuffman(tbl[this.getBits(n)]);
		}
	}
	,addDist: function(d,len) {
		this.addBytes(this.window.buffer,this.window.pos - d,len);
	}
	,addDistOne: function(n) {
		var c = this.window.getLastChar();
		var _g = 0;
		while(_g < n) {
			var i = _g++;
			this.addByte(c);
		}
	}
	,addByte: function(b) {
		this.window.addByte(b);
		this.output.b[this.outpos] = b;
		this.needed--;
		this.outpos++;
	}
	,addBytes: function(b,p,len) {
		this.window.addBytes(b,p,len);
		this.output.blit(this.outpos,b,p,len);
		this.needed -= len;
		this.outpos += len;
	}
	,resetBits: function() {
		this.bits = 0;
		this.nbits = 0;
	}
	,getRevBits: function(n) {
		if(n == 0) return 0; else if(this.getBit()) return 1 << n - 1 | this.getRevBits(n - 1); else return this.getRevBits(n - 1);
	}
	,getBit: function() {
		if(this.nbits == 0) {
			this.nbits = 8;
			this.bits = this.input.readByte();
		}
		var b = (this.bits & 1) == 1;
		this.nbits--;
		this.bits >>= 1;
		return b;
	}
	,getBits: function(n) {
		while(this.nbits < n) {
			this.bits |= this.input.readByte() << this.nbits;
			this.nbits += 8;
		}
		var b = this.bits & (1 << n) - 1;
		this.nbits -= n;
		this.bits >>= n;
		return b;
	}
	,readBytes: function(b,pos,len) {
		this.needed = len;
		this.outpos = pos;
		this.output = b;
		if(len > 0) while(this.inflateLoop()) {
		}
		return len - this.needed;
	}
	,buildFixedHuffman: function() {
		if(format.tools.InflateImpl.FIXED_HUFFMAN != null) return format.tools.InflateImpl.FIXED_HUFFMAN;
		var a = new Array();
		var _g = 0;
		while(_g < 288) {
			var n = _g++;
			a.push(n <= 143?8:n <= 255?9:n <= 279?7:8);
		}
		format.tools.InflateImpl.FIXED_HUFFMAN = this.htools.make(a,0,288,10);
		return format.tools.InflateImpl.FIXED_HUFFMAN;
	}
	,__class__: format.tools.InflateImpl
}
var haxe = {}
haxe.StackItem = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] }
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.CallStack = function() { }
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
}
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
}
haxe.Json = function() { }
haxe.Json.__name__ = ["haxe","Json"];
haxe.Json.stringify = function(obj,replacer,insertion) {
	return js.Node.stringify(obj,replacer,insertion);
}
haxe.Json.parse = function(jsonString) {
	return js.Node.parse(jsonString);
}
haxe.Log = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Timer = function(time_ms) {
	var me = this;
	var fn = function() {
		Reflect.field(me,"run").apply(me,[]);
	};
	this.id = haxe.Timer.arr.length;
	haxe.Timer.arr[this.id] = this;
	this.timerId = js.Node.setInterval(fn,time_ms,[]);
};
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
}
haxe.Timer.stamp = function() {
	return Sys.time();
}
haxe.Timer.prototype = {
	run: function() {
	}
	,stop: function() {
		if(this.id == null) return;
		js.Node.clearInterval(this.timerId);
		haxe.Timer.arr[this.id] = null;
		if(this.id > 100 && this.id == haxe.Timer.arr.length - 1) {
			var p = this.id - 1;
			while(p >= 0 && haxe.Timer.arr[p] == null) p--;
			haxe.Timer.arr = haxe.Timer.arr.slice(0,p + 1);
		}
		this.id = null;
	}
	,__class__: haxe.Timer
}
haxe.crypto = {}
haxe.crypto.Adler32 = function() {
	this.a1 = 1;
	this.a2 = 0;
};
haxe.crypto.Adler32.__name__ = ["haxe","crypto","Adler32"];
haxe.crypto.Adler32.read = function(i) {
	var a = new haxe.crypto.Adler32();
	var a2a = i.readByte();
	var a2b = i.readByte();
	var a1a = i.readByte();
	var a1b = i.readByte();
	a.a1 = a1a << 8 | a1b;
	a.a2 = a2a << 8 | a2b;
	return a;
}
haxe.crypto.Adler32.prototype = {
	equals: function(a) {
		return a.a1 == this.a1 && a.a2 == this.a2;
	}
	,update: function(b,pos,len) {
		var a1 = this.a1;
		var a2 = this.a2;
		var _g1 = pos;
		var _g = pos + len;
		while(_g1 < _g) {
			var p = _g1++;
			var c = b.b[p];
			a1 = (a1 + c) % 65521;
			a2 = (a2 + a1) % 65521;
		}
		this.a1 = a1;
		this.a2 = a2;
	}
	,__class__: haxe.crypto.Adler32
}
haxe.ds = {}
haxe.ds.IntMap = function() {
	this.h = { };
};
haxe.ds.IntMap.__name__ = ["haxe","ds","IntMap"];
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,get: function(key) {
		return this.h[key];
	}
	,set: function(key,value) {
		this.h[key] = value;
	}
	,__class__: haxe.ds.IntMap
}
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,__class__: haxe.ds.StringMap
}
haxe.io = {}
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	return new haxe.io.Bytes(length,new Buffer(length));
}
haxe.io.Bytes.ofString = function(s) {
	var nb = new Buffer(s,"utf8");
	return new haxe.io.Bytes(nb.length,nb);
}
haxe.io.Bytes.ofData = function(b) {
	return new haxe.io.Bytes(b.length,b);
}
haxe.io.Bytes.prototype = {
	getData: function() {
		return this.b;
	}
	,toString: function() {
		return this.readString(0,this.length);
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
				var c2 = b[i++];
				var c3 = b[i++];
				s += fcc((c & 15) << 18 | (c2 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
			}
		}
		return s;
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
	,sub: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var nb = new Buffer(len);
		var slice = this.b.slice(pos,pos + len);
		slice.copy(nb,0,0,len);
		return new haxe.io.Bytes(len,nb);
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw haxe.io.Error.OutsideBounds;
		src.b.copy(this.b,pos,srcpos,srcpos + len);
	}
	,set: function(pos,v) {
		this.b[pos] = v;
	}
	,get: function(pos) {
		return this.b[pos];
	}
	,__class__: haxe.io.Bytes
}
haxe.io.BytesBuffer = function() {
	this.b = new Array();
};
haxe.io.BytesBuffer.__name__ = ["haxe","io","BytesBuffer"];
haxe.io.BytesBuffer.prototype = {
	getBytes: function() {
		var nb = new Buffer(this.b);
		var bytes = new haxe.io.Bytes(nb.length,nb);
		this.b = null;
		return bytes;
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
	,addByte: function($byte) {
		this.b.push($byte);
	}
	,__class__: haxe.io.BytesBuffer
}
haxe.io.Input = function() { }
haxe.io.Input.__name__ = ["haxe","io","Input"];
haxe.io.Input.prototype = {
	readString: function(len) {
		var b = haxe.io.Bytes.alloc(len);
		this.readFullBytes(b,0,len);
		return b.toString();
	}
	,readInt32: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var ch4 = this.readByte();
		if(this.bigEndian) return ch4 | ch3 << 8 | ch2 << 16 | ch1 << 24; else return ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
	}
	,readUInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		if(this.bigEndian) return ch2 | ch1 << 8; else return ch1 | ch2 << 8;
	}
	,readInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var n;
		if(this.bigEndian) n = ch2 | ch1 << 8; else n = ch1 | ch2 << 8;
		if((n & 32768) != 0) return n - 65536;
		return n;
	}
	,read: function(nbytes) {
		var s = haxe.io.Bytes.alloc(nbytes);
		var p = 0;
		while(nbytes > 0) {
			var k = this.readBytes(s,p,nbytes);
			if(k == 0) throw haxe.io.Error.Blocked;
			p += k;
			nbytes -= k;
		}
		return s;
	}
	,readFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.readBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,readBytes: function(s,pos,len) {
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) throw haxe.io.Error.OutsideBounds;
		while(k > 0) {
			b[pos] = this.readByte();
			pos++;
			k--;
		}
		return len;
	}
	,readByte: function() {
		throw "Not implemented";
	}
	,__class__: haxe.io.Input
}
haxe.io.BytesInput = function(b,pos,len) {
	if(pos == null) pos = 0;
	if(len == null) len = b.length - pos;
	if(pos < 0 || len < 0 || pos + len > b.length) throw haxe.io.Error.OutsideBounds;
	this.b = b.b;
	this.pos = pos;
	this.len = len;
	this.totlen = len;
};
haxe.io.BytesInput.__name__ = ["haxe","io","BytesInput"];
haxe.io.BytesInput.__super__ = haxe.io.Input;
haxe.io.BytesInput.prototype = $extend(haxe.io.Input.prototype,{
	readBytes: function(buf,pos,len) {
		if(pos < 0 || len < 0 || pos + len > buf.length) throw haxe.io.Error.OutsideBounds;
		if(this.len == 0 && len > 0) throw new haxe.io.Eof();
		if(this.len < len) len = this.len;
		var b1 = this.b;
		var b2 = buf.b;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b2[pos + i] = b1[this.pos + i];
		}
		this.pos += len;
		this.len -= len;
		return len;
	}
	,readByte: function() {
		if(this.len == 0) throw new haxe.io.Eof();
		this.len--;
		return this.b[this.pos++];
	}
	,__class__: haxe.io.BytesInput
});
haxe.io.Eof = function() {
};
haxe.io.Eof.__name__ = ["haxe","io","Eof"];
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
}
haxe.io.Error = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] }
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; }
haxe.io.Output = function() { }
haxe.io.Output.__name__ = ["haxe","io","Output"];
haxe.io.StringInput = function(s) {
	haxe.io.BytesInput.call(this,haxe.io.Bytes.ofString(s));
};
haxe.io.StringInput.__name__ = ["haxe","io","StringInput"];
haxe.io.StringInput.__super__ = haxe.io.BytesInput;
haxe.io.StringInput.prototype = $extend(haxe.io.BytesInput.prototype,{
	__class__: haxe.io.StringInput
});
haxe.xml = {}
haxe.xml._Fast = {}
haxe.xml._Fast.NodeAccess = function(x) {
	this.__x = x;
};
haxe.xml._Fast.NodeAccess.__name__ = ["haxe","xml","_Fast","NodeAccess"];
haxe.xml._Fast.NodeAccess.prototype = {
	resolve: function(name) {
		var x = this.__x.elementsNamed(name).next();
		if(x == null) {
			var xname;
			if(this.__x.nodeType == Xml.Document) xname = "Document"; else xname = this.__x.get_nodeName();
			throw xname + " is missing element " + name;
		}
		return new haxe.xml.Fast(x);
	}
	,__class__: haxe.xml._Fast.NodeAccess
}
haxe.xml._Fast.AttribAccess = function(x) {
	this.__x = x;
};
haxe.xml._Fast.AttribAccess.__name__ = ["haxe","xml","_Fast","AttribAccess"];
haxe.xml._Fast.AttribAccess.prototype = {
	resolve: function(name) {
		if(this.__x.nodeType == Xml.Document) throw "Cannot access document attribute " + name;
		var v = this.__x.get(name);
		if(v == null) throw this.__x.get_nodeName() + " is missing attribute " + name;
		return v;
	}
	,__class__: haxe.xml._Fast.AttribAccess
}
haxe.xml._Fast.HasAttribAccess = function(x) {
	this.__x = x;
};
haxe.xml._Fast.HasAttribAccess.__name__ = ["haxe","xml","_Fast","HasAttribAccess"];
haxe.xml._Fast.HasAttribAccess.prototype = {
	__class__: haxe.xml._Fast.HasAttribAccess
}
haxe.xml._Fast.HasNodeAccess = function(x) {
	this.__x = x;
};
haxe.xml._Fast.HasNodeAccess.__name__ = ["haxe","xml","_Fast","HasNodeAccess"];
haxe.xml._Fast.HasNodeAccess.prototype = {
	__class__: haxe.xml._Fast.HasNodeAccess
}
haxe.xml._Fast.NodeListAccess = function(x) {
	this.__x = x;
};
haxe.xml._Fast.NodeListAccess.__name__ = ["haxe","xml","_Fast","NodeListAccess"];
haxe.xml._Fast.NodeListAccess.prototype = {
	resolve: function(name) {
		var l = new List();
		var $it0 = this.__x.elementsNamed(name);
		while( $it0.hasNext() ) {
			var x = $it0.next();
			l.add(new haxe.xml.Fast(x));
		}
		return l;
	}
	,__class__: haxe.xml._Fast.NodeListAccess
}
haxe.xml.Fast = function(x) {
	if(x.nodeType != Xml.Document && x.nodeType != Xml.Element) throw "Invalid nodeType " + Std.string(x.nodeType);
	this.x = x;
	this.node = new haxe.xml._Fast.NodeAccess(x);
	this.nodes = new haxe.xml._Fast.NodeListAccess(x);
	this.att = new haxe.xml._Fast.AttribAccess(x);
	this.has = new haxe.xml._Fast.HasAttribAccess(x);
	this.hasNode = new haxe.xml._Fast.HasNodeAccess(x);
};
haxe.xml.Fast.__name__ = ["haxe","xml","Fast"];
haxe.xml.Fast.prototype = {
	__class__: haxe.xml.Fast
}
haxe.xml.Parser = function() { }
haxe.xml.Parser.__name__ = ["haxe","xml","Parser"];
haxe.xml.Parser.parse = function(str) {
	var doc = Xml.createDocument();
	haxe.xml.Parser.doParse(str,0,doc);
	return doc;
}
haxe.xml.Parser.doParse = function(str,p,parent) {
	if(p == null) p = 0;
	var xml = null;
	var state = 1;
	var next = 1;
	var aname = null;
	var start = 0;
	var nsubs = 0;
	var nbrackets = 0;
	var c = str.charCodeAt(p);
	var buf = new StringBuf();
	while(!(c != c)) {
		switch(state) {
		case 0:
			switch(c) {
			case 10:case 13:case 9:case 32:
				break;
			default:
				state = next;
				continue;
			}
			break;
		case 1:
			switch(c) {
			case 60:
				state = 0;
				next = 2;
				break;
			default:
				start = p;
				state = 13;
				continue;
			}
			break;
		case 13:
			if(c == 60) {
				var child = Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start));
				buf = new StringBuf();
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			} else if(c == 38) {
				buf.addSub(str,start,p - start);
				state = 18;
				next = 13;
				start = p + 1;
			}
			break;
		case 17:
			if(c == 93 && str.charCodeAt(p + 1) == 93 && str.charCodeAt(p + 2) == 62) {
				var child = Xml.createCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 2:
			switch(c) {
			case 33:
				if(str.charCodeAt(p + 1) == 91) {
					p += 2;
					if(HxOverrides.substr(str,p,6).toUpperCase() != "CDATA[") throw "Expected <![CDATA[";
					p += 5;
					state = 17;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) == 68 || str.charCodeAt(p + 1) == 100) {
					if(HxOverrides.substr(str,p + 2,6).toUpperCase() != "OCTYPE") throw "Expected <!DOCTYPE";
					p += 8;
					state = 16;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) != 45 || str.charCodeAt(p + 2) != 45) throw "Expected <!--"; else {
					p += 2;
					state = 15;
					start = p + 1;
				}
				break;
			case 63:
				state = 14;
				start = p;
				break;
			case 47:
				if(parent == null) throw "Expected node name";
				start = p + 1;
				state = 0;
				next = 10;
				break;
			default:
				state = 3;
				start = p;
				continue;
			}
			break;
		case 3:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(p == start) throw "Expected node name";
				xml = Xml.createElement(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml);
				state = 0;
				next = 4;
				continue;
			}
			break;
		case 4:
			switch(c) {
			case 47:
				state = 11;
				nsubs++;
				break;
			case 62:
				state = 9;
				nsubs++;
				break;
			default:
				state = 5;
				start = p;
				continue;
			}
			break;
		case 5:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				var tmp;
				if(start == p) throw "Expected attribute name";
				tmp = HxOverrides.substr(str,start,p - start);
				aname = tmp;
				if(xml.exists(aname)) throw "Duplicate attribute";
				state = 0;
				next = 6;
				continue;
			}
			break;
		case 6:
			switch(c) {
			case 61:
				state = 0;
				next = 7;
				break;
			default:
				throw "Expected =";
			}
			break;
		case 7:
			switch(c) {
			case 34:case 39:
				state = 8;
				start = p;
				break;
			default:
				throw "Expected \"";
			}
			break;
		case 8:
			if(c == str.charCodeAt(start)) {
				var val = HxOverrides.substr(str,start + 1,p - start - 1);
				xml.set(aname,val);
				state = 0;
				next = 4;
			}
			break;
		case 9:
			p = haxe.xml.Parser.doParse(str,p,xml);
			start = p;
			state = 1;
			break;
		case 11:
			switch(c) {
			case 62:
				state = 1;
				break;
			default:
				throw "Expected >";
			}
			break;
		case 12:
			switch(c) {
			case 62:
				if(nsubs == 0) parent.addChild(Xml.createPCData(""));
				return p;
			default:
				throw "Expected >";
			}
			break;
		case 10:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(start == p) throw "Expected node name";
				var v = HxOverrides.substr(str,start,p - start);
				if(v != parent.get_nodeName()) throw "Expected </" + parent.get_nodeName() + ">";
				state = 0;
				next = 12;
				continue;
			}
			break;
		case 15:
			if(c == 45 && str.charCodeAt(p + 1) == 45 && str.charCodeAt(p + 2) == 62) {
				parent.addChild(Xml.createComment(HxOverrides.substr(str,start,p - start)));
				p += 2;
				state = 1;
			}
			break;
		case 16:
			if(c == 91) nbrackets++; else if(c == 93) nbrackets--; else if(c == 62 && nbrackets == 0) {
				parent.addChild(Xml.createDocType(HxOverrides.substr(str,start,p - start)));
				state = 1;
			}
			break;
		case 14:
			if(c == 63 && str.charCodeAt(p + 1) == 62) {
				p++;
				var str1 = HxOverrides.substr(str,start + 1,p - start - 2);
				parent.addChild(Xml.createProcessingInstruction(str1));
				state = 1;
			}
			break;
		case 18:
			if(c == 59) {
				var s = HxOverrides.substr(str,start,p - start);
				if(s.charCodeAt(0) == 35) {
					var i;
					if(s.charCodeAt(1) == 120) i = Std.parseInt("0" + HxOverrides.substr(s,1,s.length - 1)); else i = Std.parseInt(HxOverrides.substr(s,1,s.length - 1));
					buf.b += Std.string(String.fromCharCode(i));
				} else if(!haxe.xml.Parser.escapes.exists(s)) buf.b += Std.string("&" + s + ";"); else buf.b += Std.string(haxe.xml.Parser.escapes.get(s));
				start = p + 1;
				state = next;
			}
			break;
		}
		c = str.charCodeAt(++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) parent.addChild(Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start)));
		return p;
	}
	throw "Unexpected end";
}
haxe.zip = {}
haxe.zip.ExtraField = { __ename__ : ["haxe","zip","ExtraField"], __constructs__ : ["FUnknown","FInfoZipUnicodePath","FUtf8"] }
haxe.zip.ExtraField.FUnknown = function(tag,bytes) { var $x = ["FUnknown",0,tag,bytes]; $x.__enum__ = haxe.zip.ExtraField; $x.toString = $estr; return $x; }
haxe.zip.ExtraField.FInfoZipUnicodePath = function(name,crc) { var $x = ["FInfoZipUnicodePath",1,name,crc]; $x.__enum__ = haxe.zip.ExtraField; $x.toString = $estr; return $x; }
haxe.zip.ExtraField.FUtf8 = ["FUtf8",2];
haxe.zip.ExtraField.FUtf8.toString = $estr;
haxe.zip.ExtraField.FUtf8.__enum__ = haxe.zip.ExtraField;
haxe.zip.Huffman = { __ename__ : ["haxe","zip","Huffman"], __constructs__ : ["Found","NeedBit","NeedBits"] }
haxe.zip.Huffman.Found = function(i) { var $x = ["Found",0,i]; $x.__enum__ = haxe.zip.Huffman; $x.toString = $estr; return $x; }
haxe.zip.Huffman.NeedBit = function(left,right) { var $x = ["NeedBit",1,left,right]; $x.__enum__ = haxe.zip.Huffman; $x.toString = $estr; return $x; }
haxe.zip.Huffman.NeedBits = function(n,table) { var $x = ["NeedBits",2,n,table]; $x.__enum__ = haxe.zip.Huffman; $x.toString = $estr; return $x; }
haxe.zip.HuffTools = function() {
};
haxe.zip.HuffTools.__name__ = ["haxe","zip","HuffTools"];
haxe.zip.HuffTools.prototype = {
	make: function(lengths,pos,nlengths,maxbits) {
		var counts = new Array();
		var tmp = new Array();
		if(maxbits > 32) throw "Invalid huffman";
		var _g = 0;
		while(_g < maxbits) {
			var i = _g++;
			counts.push(0);
			tmp.push(0);
		}
		var _g = 0;
		while(_g < nlengths) {
			var i = _g++;
			var p = lengths[i + pos];
			if(p >= maxbits) throw "Invalid huffman";
			counts[p]++;
		}
		var code = 0;
		var _g1 = 1;
		var _g = maxbits - 1;
		while(_g1 < _g) {
			var i = _g1++;
			code = code + counts[i] << 1;
			tmp[i] = code;
		}
		var bits = new haxe.ds.IntMap();
		var _g = 0;
		while(_g < nlengths) {
			var i = _g++;
			var l = lengths[i + pos];
			if(l != 0) {
				var n = tmp[l - 1];
				tmp[l - 1] = n + 1;
				bits.set(n << 5 | l,i);
			}
		}
		return this.treeCompress(haxe.zip.Huffman.NeedBit(this.treeMake(bits,maxbits,0,1),this.treeMake(bits,maxbits,1,1)));
	}
	,treeMake: function(bits,maxbits,v,len) {
		if(len > maxbits) throw "Invalid huffman";
		var idx = v << 5 | len;
		if(bits.exists(idx)) return haxe.zip.Huffman.Found(bits.get(idx));
		v <<= 1;
		len += 1;
		return haxe.zip.Huffman.NeedBit(this.treeMake(bits,maxbits,v,len),this.treeMake(bits,maxbits,v | 1,len));
	}
	,treeWalk: function(table,p,cd,d,t) {
		switch(t[1]) {
		case 1:
			var b = t[3];
			var a = t[2];
			if(d > 0) {
				this.treeWalk(table,p,cd + 1,d - 1,a);
				this.treeWalk(table,p | 1 << cd,cd + 1,d - 1,b);
			} else table[p] = this.treeCompress(t);
			break;
		default:
			table[p] = this.treeCompress(t);
		}
	}
	,treeCompress: function(t) {
		var d = this.treeDepth(t);
		if(d == 0) return t;
		if(d == 1) switch(t[1]) {
		case 1:
			var b = t[3];
			var a = t[2];
			return haxe.zip.Huffman.NeedBit(this.treeCompress(a),this.treeCompress(b));
		default:
			throw "assert";
		}
		var size = 1 << d;
		var table = new Array();
		var _g = 0;
		while(_g < size) {
			var i = _g++;
			table.push(haxe.zip.Huffman.Found(-1));
		}
		this.treeWalk(table,0,0,d,t);
		return haxe.zip.Huffman.NeedBits(d,table);
	}
	,treeDepth: function(t) {
		switch(t[1]) {
		case 0:
			return 0;
		case 2:
			throw "assert";
			break;
		case 1:
			var b = t[3];
			var a = t[2];
			var da = this.treeDepth(a);
			var db = this.treeDepth(b);
			return 1 + (da < db?da:db);
		}
	}
	,__class__: haxe.zip.HuffTools
}
haxe.zip._InflateImpl = {}
haxe.zip._InflateImpl.Window = function(hasCrc) {
	this.buffer = haxe.io.Bytes.alloc(65536);
	this.pos = 0;
	if(hasCrc) this.crc = new haxe.crypto.Adler32();
};
haxe.zip._InflateImpl.Window.__name__ = ["haxe","zip","_InflateImpl","Window"];
haxe.zip._InflateImpl.Window.prototype = {
	checksum: function() {
		if(this.crc != null) this.crc.update(this.buffer,0,this.pos);
		return this.crc;
	}
	,available: function() {
		return this.pos;
	}
	,getLastChar: function() {
		return this.buffer.b[this.pos - 1];
	}
	,addByte: function(c) {
		if(this.pos == 65536) this.slide();
		this.buffer.b[this.pos] = c;
		this.pos++;
	}
	,addBytes: function(b,p,len) {
		if(this.pos + len > 65536) this.slide();
		this.buffer.blit(this.pos,b,p,len);
		this.pos += len;
	}
	,slide: function() {
		if(this.crc != null) this.crc.update(this.buffer,0,32768);
		var b = haxe.io.Bytes.alloc(65536);
		this.pos -= 32768;
		b.blit(0,this.buffer,32768,this.pos);
		this.buffer = b;
	}
	,__class__: haxe.zip._InflateImpl.Window
}
haxe.zip._InflateImpl.State = { __ename__ : ["haxe","zip","_InflateImpl","State"], __constructs__ : ["Head","Block","CData","Flat","Crc","Dist","DistOne","Done"] }
haxe.zip._InflateImpl.State.Head = ["Head",0];
haxe.zip._InflateImpl.State.Head.toString = $estr;
haxe.zip._InflateImpl.State.Head.__enum__ = haxe.zip._InflateImpl.State;
haxe.zip._InflateImpl.State.Block = ["Block",1];
haxe.zip._InflateImpl.State.Block.toString = $estr;
haxe.zip._InflateImpl.State.Block.__enum__ = haxe.zip._InflateImpl.State;
haxe.zip._InflateImpl.State.CData = ["CData",2];
haxe.zip._InflateImpl.State.CData.toString = $estr;
haxe.zip._InflateImpl.State.CData.__enum__ = haxe.zip._InflateImpl.State;
haxe.zip._InflateImpl.State.Flat = ["Flat",3];
haxe.zip._InflateImpl.State.Flat.toString = $estr;
haxe.zip._InflateImpl.State.Flat.__enum__ = haxe.zip._InflateImpl.State;
haxe.zip._InflateImpl.State.Crc = ["Crc",4];
haxe.zip._InflateImpl.State.Crc.toString = $estr;
haxe.zip._InflateImpl.State.Crc.__enum__ = haxe.zip._InflateImpl.State;
haxe.zip._InflateImpl.State.Dist = ["Dist",5];
haxe.zip._InflateImpl.State.Dist.toString = $estr;
haxe.zip._InflateImpl.State.Dist.__enum__ = haxe.zip._InflateImpl.State;
haxe.zip._InflateImpl.State.DistOne = ["DistOne",6];
haxe.zip._InflateImpl.State.DistOne.toString = $estr;
haxe.zip._InflateImpl.State.DistOne.__enum__ = haxe.zip._InflateImpl.State;
haxe.zip._InflateImpl.State.Done = ["Done",7];
haxe.zip._InflateImpl.State.Done.toString = $estr;
haxe.zip._InflateImpl.State.Done.__enum__ = haxe.zip._InflateImpl.State;
haxe.zip.InflateImpl = function(i,header,crc) {
	if(crc == null) crc = true;
	if(header == null) header = true;
	this["final"] = false;
	this.htools = new haxe.zip.HuffTools();
	this.huffman = this.buildFixedHuffman();
	this.huffdist = null;
	this.len = 0;
	this.dist = 0;
	if(header) this.state = haxe.zip._InflateImpl.State.Head; else this.state = haxe.zip._InflateImpl.State.Block;
	this.input = i;
	this.bits = 0;
	this.nbits = 0;
	this.needed = 0;
	this.output = null;
	this.outpos = 0;
	this.lengths = new Array();
	var _g = 0;
	while(_g < 19) {
		var i1 = _g++;
		this.lengths.push(-1);
	}
	this.window = new haxe.zip._InflateImpl.Window(crc);
};
haxe.zip.InflateImpl.__name__ = ["haxe","zip","InflateImpl"];
haxe.zip.InflateImpl.prototype = {
	inflateLoop: function() {
		var _g = this;
		switch(_g.state[1]) {
		case 0:
			var cmf = this.input.readByte();
			var cm = cmf & 15;
			var cinfo = cmf >> 4;
			if(cm != 8 || cinfo != 7) throw "Invalid data";
			var flg = this.input.readByte();
			var fdict = (flg & 32) != 0;
			if(((cmf << 8) + flg) % 31 != 0) throw "Invalid data";
			if(fdict) throw "Unsupported dictionary";
			this.state = haxe.zip._InflateImpl.State.Block;
			return true;
		case 4:
			var calc = this.window.checksum();
			if(calc == null) {
				this.state = haxe.zip._InflateImpl.State.Done;
				return true;
			}
			var crc = haxe.crypto.Adler32.read(this.input);
			if(!calc.equals(crc)) throw "Invalid CRC";
			this.state = haxe.zip._InflateImpl.State.Done;
			return true;
		case 7:
			return false;
		case 1:
			this["final"] = this.getBit();
			var _g1 = this.getBits(2);
			switch(_g1) {
			case 0:
				this.len = this.input.readUInt16();
				var nlen = this.input.readUInt16();
				if(nlen != 65535 - this.len) throw "Invalid data";
				this.state = haxe.zip._InflateImpl.State.Flat;
				var r = this.inflateLoop();
				this.resetBits();
				return r;
			case 1:
				this.huffman = this.buildFixedHuffman();
				this.huffdist = null;
				this.state = haxe.zip._InflateImpl.State.CData;
				return true;
			case 2:
				var hlit = this.getBits(5) + 257;
				var hdist = this.getBits(5) + 1;
				var hclen = this.getBits(4) + 4;
				var _g2 = 0;
				while(_g2 < hclen) {
					var i = _g2++;
					this.lengths[haxe.zip.InflateImpl.CODE_LENGTHS_POS[i]] = this.getBits(3);
				}
				var _g2 = hclen;
				while(_g2 < 19) {
					var i = _g2++;
					this.lengths[haxe.zip.InflateImpl.CODE_LENGTHS_POS[i]] = 0;
				}
				this.huffman = this.htools.make(this.lengths,0,19,8);
				var lengths = new Array();
				var _g3 = 0;
				var _g2 = hlit + hdist;
				while(_g3 < _g2) {
					var i = _g3++;
					lengths.push(0);
				}
				this.inflateLengths(lengths,hlit + hdist);
				this.huffdist = this.htools.make(lengths,hlit,hdist,16);
				this.huffman = this.htools.make(lengths,0,hlit,16);
				this.state = haxe.zip._InflateImpl.State.CData;
				return true;
			default:
				throw "Invalid data";
			}
			break;
		case 3:
			var rlen;
			if(this.len < this.needed) rlen = this.len; else rlen = this.needed;
			var bytes = this.input.read(rlen);
			this.len -= rlen;
			this.addBytes(bytes,0,rlen);
			if(this.len == 0) {
				if(this["final"]) this.state = haxe.zip._InflateImpl.State.Crc; else this.state = haxe.zip._InflateImpl.State.Block;
			}
			return this.needed > 0;
		case 6:
			var rlen;
			if(this.len < this.needed) rlen = this.len; else rlen = this.needed;
			this.addDistOne(rlen);
			this.len -= rlen;
			if(this.len == 0) this.state = haxe.zip._InflateImpl.State.CData;
			return this.needed > 0;
		case 5:
			while(this.len > 0 && this.needed > 0) {
				var rdist;
				if(this.len < this.dist) rdist = this.len; else rdist = this.dist;
				var rlen;
				if(this.needed < rdist) rlen = this.needed; else rlen = rdist;
				this.addDist(this.dist,rlen);
				this.len -= rlen;
			}
			if(this.len == 0) this.state = haxe.zip._InflateImpl.State.CData;
			return this.needed > 0;
		case 2:
			var n = this.applyHuffman(this.huffman);
			if(n < 256) {
				this.addByte(n);
				return this.needed > 0;
			} else if(n == 256) {
				if(this["final"]) this.state = haxe.zip._InflateImpl.State.Crc; else this.state = haxe.zip._InflateImpl.State.Block;
				return true;
			} else {
				n -= 257;
				var extra_bits = haxe.zip.InflateImpl.LEN_EXTRA_BITS_TBL[n];
				if(extra_bits == -1) throw "Invalid data";
				this.len = haxe.zip.InflateImpl.LEN_BASE_VAL_TBL[n] + this.getBits(extra_bits);
				var dist_code;
				if(this.huffdist == null) dist_code = this.getRevBits(5); else dist_code = this.applyHuffman(this.huffdist);
				extra_bits = haxe.zip.InflateImpl.DIST_EXTRA_BITS_TBL[dist_code];
				if(extra_bits == -1) throw "Invalid data";
				this.dist = haxe.zip.InflateImpl.DIST_BASE_VAL_TBL[dist_code] + this.getBits(extra_bits);
				if(this.dist > this.window.available()) throw "Invalid data";
				if(this.dist == 1) this.state = haxe.zip._InflateImpl.State.DistOne; else this.state = haxe.zip._InflateImpl.State.Dist;
				return true;
			}
			break;
		}
	}
	,inflateLengths: function(a,max) {
		var i = 0;
		var prev = 0;
		while(i < max) {
			var n = this.applyHuffman(this.huffman);
			switch(n) {
			case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:case 8:case 9:case 10:case 11:case 12:case 13:case 14:case 15:
				prev = n;
				a[i] = n;
				i++;
				break;
			case 16:
				var end = i + 3 + this.getBits(2);
				if(end > max) throw "Invalid data";
				while(i < end) {
					a[i] = prev;
					i++;
				}
				break;
			case 17:
				i += 3 + this.getBits(3);
				if(i > max) throw "Invalid data";
				break;
			case 18:
				i += 11 + this.getBits(7);
				if(i > max) throw "Invalid data";
				break;
			default:
				throw "Invalid data";
			}
		}
	}
	,applyHuffman: function(h) {
		switch(h[1]) {
		case 0:
			var n = h[2];
			return n;
		case 1:
			var b = h[3];
			var a = h[2];
			return this.applyHuffman(this.getBit()?b:a);
		case 2:
			var tbl = h[3];
			var n = h[2];
			return this.applyHuffman(tbl[this.getBits(n)]);
		}
	}
	,addDist: function(d,len) {
		this.addBytes(this.window.buffer,this.window.pos - d,len);
	}
	,addDistOne: function(n) {
		var c = this.window.getLastChar();
		var _g = 0;
		while(_g < n) {
			var i = _g++;
			this.addByte(c);
		}
	}
	,addByte: function(b) {
		this.window.addByte(b);
		this.output.b[this.outpos] = b;
		this.needed--;
		this.outpos++;
	}
	,addBytes: function(b,p,len) {
		this.window.addBytes(b,p,len);
		this.output.blit(this.outpos,b,p,len);
		this.needed -= len;
		this.outpos += len;
	}
	,resetBits: function() {
		this.bits = 0;
		this.nbits = 0;
	}
	,getRevBits: function(n) {
		if(n == 0) return 0; else if(this.getBit()) return 1 << n - 1 | this.getRevBits(n - 1); else return this.getRevBits(n - 1);
	}
	,getBit: function() {
		if(this.nbits == 0) {
			this.nbits = 8;
			this.bits = this.input.readByte();
		}
		var b = (this.bits & 1) == 1;
		this.nbits--;
		this.bits >>= 1;
		return b;
	}
	,getBits: function(n) {
		while(this.nbits < n) {
			this.bits |= this.input.readByte() << this.nbits;
			this.nbits += 8;
		}
		var b = this.bits & (1 << n) - 1;
		this.nbits -= n;
		this.bits >>= n;
		return b;
	}
	,readBytes: function(b,pos,len) {
		this.needed = len;
		this.outpos = pos;
		this.output = b;
		if(len > 0) while(this.inflateLoop()) {
		}
		return len - this.needed;
	}
	,buildFixedHuffman: function() {
		if(haxe.zip.InflateImpl.FIXED_HUFFMAN != null) return haxe.zip.InflateImpl.FIXED_HUFFMAN;
		var a = new Array();
		var _g = 0;
		while(_g < 288) {
			var n = _g++;
			a.push(n <= 143?8:n <= 255?9:n <= 279?7:8);
		}
		haxe.zip.InflateImpl.FIXED_HUFFMAN = this.htools.make(a,0,288,10);
		return haxe.zip.InflateImpl.FIXED_HUFFMAN;
	}
	,__class__: haxe.zip.InflateImpl
}
haxe.zip.Reader = function(i) {
	this.i = i;
};
haxe.zip.Reader.__name__ = ["haxe","zip","Reader"];
haxe.zip.Reader.prototype = {
	read: function() {
		var l = new List();
		var buf = null;
		var tmp = null;
		while(true) {
			var e = this.readEntryHeader();
			if(e == null) break;
			if(e.dataSize < 0) {
				var bufSize = 65536;
				if(tmp == null) tmp = haxe.io.Bytes.alloc(bufSize);
				var out = new haxe.io.BytesBuffer();
				var z = new haxe.zip.InflateImpl(this.i,false,false);
				while(true) {
					var n = z.readBytes(tmp,0,bufSize);
					out.addBytes(tmp,0,n);
					if(n < bufSize) break;
				}
				e.data = out.getBytes();
				e.crc32 = this.i.readInt32();
				if(e.crc32 == 134695760) e.crc32 = this.i.readInt32();
				e.dataSize = this.i.readInt32();
				e.fileSize = this.i.readInt32();
				e.dataSize = e.fileSize;
				e.compressed = false;
			} else e.data = this.i.read(e.dataSize);
			l.add(e);
		}
		return l;
	}
	,readEntryHeader: function() {
		var i = this.i;
		var h = i.readInt32();
		if(h == 33639248 || h == 101010256) return null;
		if(h != 67324752) throw "Invalid Zip Data";
		var version = i.readUInt16();
		var flags = i.readUInt16();
		var utf8 = (flags & 2048) != 0;
		if((flags & 63479) != 0) throw "Unsupported flags " + flags;
		var compression = i.readUInt16();
		var compressed = compression != 0;
		if(compressed && compression != 8) throw "Unsupported compression " + compression;
		var mtime = this.readZipDate();
		var crc32 = i.readInt32();
		var csize = i.readInt32();
		var usize = i.readInt32();
		var fnamelen = i.readInt16();
		var elen = i.readInt16();
		var fname = i.readString(fnamelen);
		var fields = this.readExtraFields(elen);
		if(utf8) fields.push(haxe.zip.ExtraField.FUtf8);
		var data = null;
		if((flags & 8) != 0) csize = -1;
		return { fileName : fname, fileSize : usize, fileTime : mtime, compressed : compressed, dataSize : csize, data : data, crc32 : crc32, extraFields : fields};
	}
	,readExtraFields: function(length) {
		var fields = new List();
		while(length > 0) {
			if(length < 4) throw "Invalid extra fields data";
			var tag = this.i.readUInt16();
			var len = this.i.readUInt16();
			if(length < len) throw "Invalid extra fields data";
			switch(tag) {
			case 28789:
				var version = this.i.readByte();
				if(version != 1) {
					var data = new haxe.io.BytesBuffer();
					data.b.push(version);
					data.add(this.i.read(len - 1));
					fields.add(haxe.zip.ExtraField.FUnknown(tag,data.getBytes()));
				} else {
					var crc = this.i.readInt32();
					var name = this.i.read(len - 5).toString();
					fields.add(haxe.zip.ExtraField.FInfoZipUnicodePath(name,crc));
				}
				break;
			default:
				fields.add(haxe.zip.ExtraField.FUnknown(tag,this.i.read(len)));
			}
			length -= 4 + len;
		}
		return fields;
	}
	,readZipDate: function() {
		var t = this.i.readUInt16();
		var hour = t >> 11 & 31;
		var min = t >> 5 & 63;
		var sec = t & 31;
		var d = this.i.readUInt16();
		var year = d >> 9;
		var month = d >> 5 & 15;
		var day = d & 31;
		return new Date(year + 1980,month - 1,day,hour,min,sec << 1);
	}
	,__class__: haxe.zip.Reader
}
var js = {}
js.Boot = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
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
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
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
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
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
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					if(cl == Array) return o.__enum__ == null;
					return true;
				}
				if(js.Boot.__interfLoop(o.__class__,cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
}
js.NodeC = function() { }
js.NodeC.__name__ = ["js","NodeC"];
js.Node = function() { }
js.Node.__name__ = ["js","Node"];
js.Node.newSocket = function(options) {
	return new js.Node.net.Socket(options);
}
js.node = {}
js.node.NodeStatic = function() { }
js.node.NodeStatic.__name__ = ["js","node","NodeStatic"];
js.node.NodeStatic.Server = function(pathToServe) {
	var watchedFolder = pathToServe;
	var node_static = require('node-static');
	return new node_static.Server(watchedFolder);
}
var mconsole = {}
mconsole.PrinterBase = function() {
	this.printPosition = true;
	this.printLineNumbers = true;
};
mconsole.PrinterBase.__name__ = ["mconsole","PrinterBase"];
mconsole.PrinterBase.prototype = {
	printLine: function(color,line,pos) {
		throw "method not implemented in ConsolePrinterBase";
	}
	,print: function(level,params,indent,pos) {
		params = params.slice();
		var _g1 = 0;
		var _g = params.length;
		while(_g1 < _g) {
			var i = _g1++;
			params[i] = Std.string(params[i]);
		}
		var message = params.join(", ");
		var nextPosition = "@ " + pos.className + "." + pos.methodName;
		var nextLineNumber = Std.string(pos.lineNumber);
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
	,__class__: mconsole.PrinterBase
}
mconsole.Printer = function() { }
mconsole.Printer.__name__ = ["mconsole","Printer"];
mconsole.Printer.prototype = {
	__class__: mconsole.Printer
}
mconsole.LogPrinter = function(output) {
	this.output = output;
	mconsole.PrinterBase.call(this);
	require('source-map-support').install();
};
mconsole.LogPrinter.__name__ = ["mconsole","LogPrinter"];
mconsole.LogPrinter.__interfaces__ = [mconsole.Printer];
mconsole.LogPrinter.__super__ = mconsole.PrinterBase;
mconsole.LogPrinter.prototype = $extend(mconsole.PrinterBase.prototype,{
	printLine: function(color,line,pos) {
		switch(color[1]) {
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
		this.output(line,pos);
	}
	,print: function(level,params,indent,pos) {
		params = params.slice();
		var _g1 = 0;
		var _g = params.length;
		while(_g1 < _g) {
			var i = _g1++;
			params[i] = Std.string(params[i]);
		}
		var message = params.join(", ");
		this.position = "@ " + pos.className + "." + pos.methodName;
		this.lineNumber = Std.string(pos.lineNumber);
		pos.fileName = this.position;
		var indentStr = "  " + StringTools.lpad(""," ",indent * 2);
		message = indentStr + message.split("\n").join("\n" + indentStr);
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
		this.printLine(color,message,pos);
	}
	,__class__: mconsole.LogPrinter
});
mconsole.Console = function() { }
mconsole.Console.__name__ = ["mconsole","Console"];
mconsole.Console.start = function() {
	if(mconsole.Console.running) return;
	mconsole.Console.running = true;
	mconsole.Console.previousTrace = haxe.Log.trace;
	haxe.Log.trace = mconsole.Console.haxeTrace;
	if(mconsole.Console.hasConsole) {
	} else {
	}
}
mconsole.Console.stop = function() {
	if(!mconsole.Console.running) return;
	mconsole.Console.running = false;
	haxe.Log.trace = mconsole.Console.previousTrace;
	mconsole.Console.previousTrace = null;
}
mconsole.Console.addPrinter = function(printer) {
	mconsole.Console.removePrinter(printer);
	mconsole.Console.printers.push(printer);
}
mconsole.Console.removePrinter = function(printer) {
	HxOverrides.remove(mconsole.Console.printers,printer);
}
mconsole.Console.haxeTrace = function(value,pos) {
	var params = pos.customParams;
	if(params == null) params = [];
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
}
mconsole.Console.print = function(level,params,pos) {
	var _g = 0;
	var _g1 = mconsole.Console.printers;
	while(_g < _g1.length) {
		var printer = _g1[_g];
		++_g;
		printer.print(level,params,mconsole.Console.groupDepth,pos);
	}
}
mconsole.Console.log = function(message,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("log",[message]);
	mconsole.Console.print(mconsole.LogLevel.log,[message],pos);
}
mconsole.Console.info = function(message,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("info",[message]);
	mconsole.Console.print(mconsole.LogLevel.info,[message],pos);
}
mconsole.Console.debug = function(message,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("debug",[message]);
	mconsole.Console.print(mconsole.LogLevel.debug,[message],pos);
}
mconsole.Console.warn = function(message,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("warn",[message]);
	mconsole.Console.print(mconsole.LogLevel.warn,[message],pos);
}
mconsole.Console.error = function(message,stack,pos) {
	if(stack == null) stack = haxe.CallStack.callStack();
	var stackTrace;
	if(stack.length > 0) stackTrace = "\n" + mconsole.StackHelper.toString(stack); else stackTrace = "";
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("error",[message]);
	mconsole.Console.print(mconsole.LogLevel.error,["Error: " + Std.string(message) + stackTrace],pos);
}
mconsole.Console.trace = function(pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("trace",[]);
	var stack = mconsole.StackHelper.toString(haxe.CallStack.callStack());
	mconsole.Console.print(mconsole.LogLevel.error,["Stack trace:\n" + stack],pos);
}
mconsole.Console.assert = function(expression,message,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("assert",[expression,message]);
	if(!expression) {
		var stack = mconsole.StackHelper.toString(haxe.CallStack.callStack());
		mconsole.Console.print(mconsole.LogLevel.error,["Assertion failed: " + Std.string(message) + "\n" + stack],pos);
		throw message;
	}
}
mconsole.Console.count = function(title,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("count",[title]);
	var position = pos.fileName + ":" + pos.lineNumber;
	var count;
	if(mconsole.Console.counts.exists(position)) count = mconsole.Console.counts.get(position) + 1; else count = 1;
	mconsole.Console.counts.set(position,count);
	mconsole.Console.print(mconsole.LogLevel.log,[title + ": " + count],pos);
}
mconsole.Console.group = function(message,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("group",[message]);
	mconsole.Console.print(mconsole.LogLevel.log,[message],pos);
	mconsole.Console.groupDepth += 1;
}
mconsole.Console.groupEnd = function(pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("groupEnd",[]);
	if(mconsole.Console.groupDepth > 0) mconsole.Console.groupDepth -= 1;
}
mconsole.Console.time = function(name,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("time",[name]);
	mconsole.Console.times.set(name,haxe.Timer.stamp());
}
mconsole.Console.timeEnd = function(name,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("timeEnd",[name]);
	if(mconsole.Console.times.exists(name)) {
		mconsole.Console.print(mconsole.LogLevel.log,[name + ": " + ((haxe.Timer.stamp() - mconsole.Console.times.get(name)) * 1000 | 0) + "ms"],pos);
		mconsole.Console.times.remove(name);
	}
}
mconsole.Console.markTimeline = function(label,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("markTimeline",[label]);
}
mconsole.Console.profile = function(title,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("profile",[title]);
}
mconsole.Console.profileEnd = function(title,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("profileEnd",[title]);
}
mconsole.Console.enterDebugger = function() {
	debugger;
}
mconsole.Console.detectConsole = function() {
	return false;
}
mconsole.Console.callConsole = function(method,params) {
	if(console[method] != null) {
		if(method == "log" && js.Boot.__instanceof(params[0],Xml)) method = mconsole.Console.dirxml;
		Function.prototype.bind.call(console[method],console).apply(console,mconsole.Console.toConsoleValues(params));
	}
}
mconsole.Console.toConsoleValues = function(params) {
	var _g1 = 0;
	var _g = params.length;
	while(_g1 < _g) {
		var i = _g1++;
		params[i] = mconsole.Console.toConsoleValue(params[i]);
	}
	return params;
}
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
			$native[Std.string(key)] = mconsole.Console.toConsoleValue(map.get(key));
		}
		return $native;
	} else {
		var _g = Type["typeof"](value);
		switch(_g[1]) {
		case 7:
			var e = _g[2];
			var $native = [];
			var name = Type.getEnumName(e) + "." + Type.enumConstructor(value);
			var params = Type.enumParameters(value);
			if(params.length > 0) {
				$native.push(name + "(");
				var _g2 = 0;
				var _g1 = params.length;
				while(_g2 < _g1) {
					var i = _g2++;
					$native.push(mconsole.Console.toConsoleValue(params[i]));
				}
				$native.push(")");
			} else return [name];
			return $native;
		default:
		}
		if(typeName == "Array" || typeName == "List" || typeName == "haxe.FastList") {
			var $native = [];
			var iterable = value;
			var $it1 = $iterator(iterable)();
			while( $it1.hasNext() ) {
				var i = $it1.next();
				$native.push(mconsole.Console.toConsoleValue(i));
			}
			return $native;
		}
	}
	return value;
}
mconsole.LogLevel = { __ename__ : ["mconsole","LogLevel"], __constructs__ : ["log","info","debug","warn","error"] }
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
mconsole.ConsoleColor = { __ename__ : ["mconsole","ConsoleColor"], __constructs__ : ["none","white","blue","green","yellow","red"] }
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
mconsole.StackHelper = function() { }
mconsole.StackHelper.__name__ = ["mconsole","StackHelper"];
mconsole.StackHelper.createFilters = function() {
	var filters = new haxe.ds.StringMap();
	filters.set("@ mconsole.ConsoleRedirect.haxeTrace:59",true);
	return filters;
}
mconsole.StackHelper.toString = function(stack) {
	return "null";
}
mconsole.StackItemHelper = function() { }
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
		return "Lambda(" + v + ")";
	case 2:
		var line = item[4];
		var file = item[3];
		var s = item[2];
		return (s == null?file.split("::").join(".") + ":" + line:mconsole.StackItemHelper.toString(s)) + ":" + line;
	case 0:
		return "(anonymous function)";
	}
}
mconsole.Style = function() { }
mconsole.Style.__name__ = ["mconsole","Style"];
mconsole.Style.style = function(string,start,stop) {
	if(mconsole.Style.clicolor) return "[" + start + "m" + string + "[" + stop + "m"; else return string;
}
mconsole.Style.bold = function(s) {
	return mconsole.Style.style(s,1,22);
}
mconsole.Style.italic = function(s) {
	return mconsole.Style.style(s,3,23);
}
mconsole.Style.underline = function(s) {
	return mconsole.Style.style(s,4,24);
}
mconsole.Style.inverse = function(s) {
	return mconsole.Style.style(s,7,27);
}
mconsole.Style.white = function(s) {
	return mconsole.Style.style(s,37,39);
}
mconsole.Style.grey = function(s) {
	return mconsole.Style.style(s,90,39);
}
mconsole.Style.black = function(s) {
	return mconsole.Style.style(s,30,39);
}
mconsole.Style.blue = function(s) {
	return mconsole.Style.style(s,34,39);
}
mconsole.Style.cyan = function(s) {
	return mconsole.Style.style(s,36,39);
}
mconsole.Style.green = function(s) {
	return mconsole.Style.style(s,32,39);
}
mconsole.Style.magenta = function(s) {
	return mconsole.Style.style(s,35,39);
}
mconsole.Style.red = function(s) {
	return mconsole.Style.style(s,31,39);
}
mconsole.Style.yellow = function(s) {
	return mconsole.Style.style(s,33,39);
}
var ods = {}
ods.Rule = { __ename__ : ["ods","Rule"], __constructs__ : ["RSkip","RBlank","RInt","RBool","RFloat","RText","RReg","RValues","REnum","RMap","RArray","RCustom"] }
ods.Rule.RSkip = ["RSkip",0];
ods.Rule.RSkip.toString = $estr;
ods.Rule.RSkip.__enum__ = ods.Rule;
ods.Rule.RBlank = ["RBlank",1];
ods.Rule.RBlank.toString = $estr;
ods.Rule.RBlank.__enum__ = ods.Rule;
ods.Rule.RInt = ["RInt",2];
ods.Rule.RInt.toString = $estr;
ods.Rule.RInt.__enum__ = ods.Rule;
ods.Rule.RBool = ["RBool",3];
ods.Rule.RBool.toString = $estr;
ods.Rule.RBool.__enum__ = ods.Rule;
ods.Rule.RFloat = ["RFloat",4];
ods.Rule.RFloat.toString = $estr;
ods.Rule.RFloat.__enum__ = ods.Rule;
ods.Rule.RText = ["RText",5];
ods.Rule.RText.toString = $estr;
ods.Rule.RText.__enum__ = ods.Rule;
ods.Rule.RReg = function(e) { var $x = ["RReg",6,e]; $x.__enum__ = ods.Rule; $x.toString = $estr; return $x; }
ods.Rule.RValues = function(v,indexes) { var $x = ["RValues",7,v,indexes]; $x.__enum__ = ods.Rule; $x.toString = $estr; return $x; }
ods.Rule.REnum = function(v,e) { var $x = ["REnum",8,v,e]; $x.__enum__ = ods.Rule; $x.toString = $estr; return $x; }
ods.Rule.RMap = function(v,values) { var $x = ["RMap",9,v,values]; $x.__enum__ = ods.Rule; $x.toString = $estr; return $x; }
ods.Rule.RArray = function(sep,rule) { var $x = ["RArray",10,sep,rule]; $x.__enum__ = ods.Rule; $x.toString = $estr; return $x; }
ods.Rule.RCustom = function(name,parser) { var $x = ["RCustom",11,name,parser]; $x.__enum__ = ods.Rule; $x.toString = $estr; return $x; }
ods.Column = { __ename__ : ["ods","Column"], __constructs__ : ["A","N","R","Opt","All"] }
ods.Column.A = function(name,r) { var $x = ["A",0,name,r]; $x.__enum__ = ods.Column; $x.toString = $estr; return $x; }
ods.Column.N = function(name,r) { var $x = ["N",1,name,r]; $x.__enum__ = ods.Column; $x.toString = $estr; return $x; }
ods.Column.R = function(r) { var $x = ["R",2,r]; $x.__enum__ = ods.Column; $x.toString = $estr; return $x; }
ods.Column.Opt = function(c) { var $x = ["Opt",3,c]; $x.__enum__ = ods.Column; $x.toString = $estr; return $x; }
ods.Column.All = function(c) { var $x = ["All",4,c]; $x.__enum__ = ods.Column; $x.toString = $estr; return $x; }
ods.Document = { __ename__ : ["ods","Document"], __constructs__ : ["DList","DLine","DMany","DOpt","DChoice","DGroup","DWhileNot"] }
ods.Document.DList = function(l) { var $x = ["DList",0,l]; $x.__enum__ = ods.Document; $x.toString = $estr; return $x; }
ods.Document.DLine = function(r) { var $x = ["DLine",1,r]; $x.__enum__ = ods.Document; $x.toString = $estr; return $x; }
ods.Document.DMany = function(l) { var $x = ["DMany",2,l]; $x.__enum__ = ods.Document; $x.toString = $estr; return $x; }
ods.Document.DOpt = function(l) { var $x = ["DOpt",3,l]; $x.__enum__ = ods.Document; $x.toString = $estr; return $x; }
ods.Document.DChoice = function(l) { var $x = ["DChoice",4,l]; $x.__enum__ = ods.Document; $x.toString = $estr; return $x; }
ods.Document.DGroup = function(r,sub) { var $x = ["DGroup",5,r,sub]; $x.__enum__ = ods.Document; $x.toString = $estr; return $x; }
ods.Document.DWhileNot = function(cond,d) { var $x = ["DWhileNot",6,cond,d]; $x.__enum__ = ods.Document; $x.toString = $estr; return $x; }
ods.Check = { __ename__ : ["ods","Check"], __constructs__ : ["CMatch","CExpected","CInvalid","CCustom"] }
ods.Check.CMatch = ["CMatch",0];
ods.Check.CMatch.toString = $estr;
ods.Check.CMatch.__enum__ = ods.Check;
ods.Check.CExpected = function(l,row) { var $x = ["CExpected",1,l,row]; $x.__enum__ = ods.Check; $x.toString = $estr; return $x; }
ods.Check.CInvalid = function(v,l,r,row,col) { var $x = ["CInvalid",2,v,l,r,row,col]; $x.__enum__ = ods.Check; $x.toString = $estr; return $x; }
ods.Check.CCustom = function(v,l,msg,row,col) { var $x = ["CCustom",3,v,l,msg,row,col]; $x.__enum__ = ods.Check; $x.toString = $estr; return $x; }
ods.CustomError = { __ename__ : ["ods","CustomError"], __constructs__ : ["CustomMessage"] }
ods.CustomError.CustomMessage = function(msg) { var $x = ["CustomMessage",0,msg]; $x.__enum__ = ods.CustomError; $x.toString = $estr; return $x; }
ods.OdsChecker = function() {
	this.sheets = new haxe.ds.StringMap();
};
ods.OdsChecker.__name__ = ["ods","OdsChecker"];
ods.OdsChecker.prototype = {
	checkRec: function(doc,hasMany) {
		switch(doc[1]) {
		case 0:
			var l = doc[2];
			var save = this.save();
			var _g = 0;
			while(_g < l.length) {
				var d = l[_g];
				++_g;
				if(!this.checkRec(d,hasMany)) {
					this.restore(save);
					return false;
				}
			}
			break;
		case 1:
			var r = doc[2];
			return this.checkLine(r,hasMany);
		case 2:
			var d = doc[2];
			while(this.checkRec(d,true)) {
			}
			break;
		case 3:
			var d = doc[2];
			this.checkRec(d,hasMany);
			break;
		case 4:
			var l = doc[2];
			var save = this.save();
			var _g = 0;
			while(_g < l.length) {
				var d = l[_g];
				++_g;
				if(this.checkRec(d,hasMany)) return true;
				this.restore(save);
				save = this.save();
			}
			return false;
		case 5:
			var sub = doc[3];
			var r = doc[2];
			var save = this.save();
			var prev = this.status.obj;
			this.status.out = new Array();
			if(!this.checkLine(r,hasMany)) {
				this.restore(save);
				return false;
			}
			var x = this.status.out.shift();
			var obj = Reflect.field(this.status.obj,r.name);
			if(hasMany) {
				var o = obj;
				obj = o[o.length - 1];
			}
			this.status.obj = obj;
			if(!this.checkRec(sub,false)) {
				this.restore(save);
				return false;
			}
			var _g = 0;
			var _g1 = this.status.out;
			while(_g < _g1.length) {
				var o = _g1[_g];
				++_g;
				x.addChild(o);
			}
			this.status.out = save.out;
			this.status.out.push(x);
			this.status.obj = prev;
			break;
		case 6:
			var d = doc[3];
			var cond = doc[2];
			while(!this.checkRec(cond,false)) {
				this.lastError = ods.Check.CMatch;
				if(!this.checkRec(d,true)) return false;
			}
			break;
		}
		return true;
	}
	,checkLine: function(l,hasMany) {
		var row = this.status.rows[0];
		if(row == null) {
			this.error(ods.Check.CExpected(l,this.status.curRow));
			return false;
		}
		var cols = row.nodes.resolve("table:table-cell");
		var n = 0;
		var cur = null;
		var curCol = -1;
		var x;
		if(l.name == null) x = Xml.createDocument(); else x = Xml.createElement(l.name);
		var rindex = 0;
		var rblank = ods.Column.R(ods.Rule.RBlank);
		var obj = { };
		try {
			while(true) {
				n--;
				curCol++;
				if(n <= 0) {
					cur = cols.pop();
					if(cur == null) n = 10000; else {
						var repeat = cur.x.get("table:number-columns-repeated");
						if(repeat == null) n = 1; else n = Std.parseInt(repeat);
					}
				}
				var v;
				if(cur == null) v = ""; else v = this.extractText(cur,this.status.curRow);
				var rule = l.cols[rindex];
				if(rule == null) {
					if(cur == null) throw "__break__";
					rule = rblank;
					curCol += n - 1;
					n = 1;
				}
				var r = this.checkColumn(rule,v,x,obj);
				if(r != null) {
					if(this.customMessage != null) {
						this.error(ods.Check.CCustom(v,l,this.customMessage,this.status.curRow,curCol));
						this.customMessage = null;
					} else this.error(ods.Check.CInvalid(v,l,r,this.status.curRow,curCol));
					return false;
				}
				switch(rule[1]) {
				case 4:
					if(cur == null) throw "__break__";
					curCol += n - 1;
					n = 1;
					break;
				default:
					rindex++;
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		var repeat = row.x.get("table:number-rows-repeated");
		if(repeat != null) {
			if(this.status.rowRepeat == 0) this.status.rowRepeat = Std.parseInt(repeat); else {
				this.status.rowRepeat--;
				if(this.status.rowRepeat == 1 || l.name == null) {
					this.status.rows.shift();
					this.status.rowRepeat = 0;
				}
			}
		} else this.status.rows.shift();
		if(l.name != null) {
			this.status.out.push(x);
			if(hasMany) {
				var f = Reflect.field(this.status.obj,l.name);
				if(f == null) {
					f = [];
					this.status.obj[l.name] = f;
				}
				f.push(obj);
			} else this.status.obj[l.name] = obj;
		}
		this.status.curRow++;
		return true;
	}
	,extractTextContent: function(html,e,line) {
		if(e.nodeType == Xml.Element) {
			var _g = e.get_nodeName();
			switch(_g) {
			case "text:s":
				html.b += "\n";
				break;
			case "text:span":
				var $it0 = e.iterator();
				while( $it0.hasNext() ) {
					var x = $it0.next();
					this.extractTextContent(html,x,line);
				}
				break;
			default:
				throw "assert " + e.get_nodeName() + " at line " + line;
			}
		} else html.b += Std.string(e.toString());
	}
	,extractText: function(cell,line) {
		var html = new StringBuf();
		var first = true;
		var $it0 = cell.x.iterator();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			if(x.get_nodeName() == "office:annotation") continue; else if(x.get_nodeName() != "text:p") throw "assert " + x.get_nodeName() + " at line " + line; else {
				if(first) first = false; else html.b += "\n";
				var $it1 = x.iterator();
				while( $it1.hasNext() ) {
					var e = $it1.next();
					this.extractTextContent(html,e,line);
				}
			}
		}
		var v = StringTools.htmlUnescape(html.b);
		v = v.split("&apos;").join("'").split("&quot;").join("\"");
		return v;
	}
	,checkColumn: function(c,v,x,obj) {
		switch(c[1]) {
		case 2:
			var r = c[2];
			if(r != ods.Rule.RSkip && this.checkRule(r,v) == null) return r;
			break;
		case 3:
			var c1 = c[2];
			var r = this.checkColumn(c1,v,x,obj);
			if(r != null && v != "") return r;
			break;
		case 0:
			var r = c[3];
			var name = c[2];
			var k = this.checkRule(r,v);
			if(k == null) return r;
			var v1 = x.get(name);
			if(v1 == null) v1 = ""; else v1 += ";";
			x.set(name,v1 + Std.string(k));
			this.addField(obj,name,k);
			break;
		case 1:
			var r = c[3];
			var name = c[2];
			var k = this.checkRule(r,v);
			if(k == null) return r;
			var n = Xml.createElement(name);
			n.addChild(Xml.createPCData(StringTools.htmlEscape(Std.string(k))));
			x.addChild(n);
			this.addField(obj,name,k);
			break;
		case 4:
			var c1 = c[2];
			return this.checkColumn(c1,v,x,obj);
		}
		return null;
	}
	,addField: function(obj,name,v) {
		if(Reflect.hasField(obj,name)) {
			var f = Reflect.field(obj,name);
			if(!js.Boot.__instanceof(f,Array)) {
				f = [f,v];
				obj[name] = f;
			} else {
				var a = f;
				a.push(v);
			}
		} else obj[name] = v;
	}
	,checkRule: function(r,v) {
		switch(r[1]) {
		case 0:
			return null;
		case 1:
			if(ods.OdsChecker.eblank.match(v)) return ""; else return null;
			break;
		case 2:
			v = v.split(" ").join("");
			if(ods.OdsChecker.eint.match(v)) return Std.parseInt(v); else return null;
			break;
		case 3:
			if(v == "true" || v == "1") return true;
			if(v == "false" || v == "0") return false;
			return null;
		case 4:
			if(ods.OdsChecker.efloat.match(v)) return Std.parseFloat(v.split(",").join(".")); else return null;
			break;
		case 5:
			v = StringTools.trim(v);
			if(v == "") return null; else return v;
			break;
		case 6:
			var e = r[2];
			if(e.match(v)) return v; else return null;
			break;
		case 7:
			var idx = r[3];
			var vl = r[2];
			v = StringTools.trim(v);
			var _g1 = 0;
			var _g = vl.length;
			while(_g1 < _g) {
				var i = _g1++;
				if(v == vl[i]) {
					if(idx) return i;
					return v;
				}
			}
			return null;
		case 8:
			var e = r[3];
			var vl = r[2];
			v = StringTools.trim(v);
			var _g1 = 0;
			var _g = vl.length;
			while(_g1 < _g) {
				var i = _g1++;
				if(v == vl[i]) return Type.createEnumIndex(e,i);
			}
			return null;
		case 9:
			var values = r[3];
			var vl = r[2];
			v = StringTools.trim(v);
			var _g1 = 0;
			var _g = vl.length;
			while(_g1 < _g) {
				var i = _g1++;
				if(v == vl[i]) return values[i];
			}
			return null;
		case 10:
			var r1 = r[3];
			var sep = r[2];
			var a = new Array();
			if(v != "") {
				var _g = 0;
				var _g1 = v.split(sep);
				while(_g < _g1.length) {
					var v1 = _g1[_g];
					++_g;
					var v2 = this.checkRule(r1,StringTools.trim(v1));
					if(v2 == null) return null;
					a.push(v2);
				}
			}
			return a;
		case 11:
			var parser = r[3];
			try {
				return parser(v);
			} catch( e ) {
				if( js.Boot.__instanceof(e,ods.CustomError) ) {
					switch(e[1]) {
					case 0:
						var msg = e[2];
						this.customMessage = msg;
						break;
					}
					return null;
				} else throw(e);
			}
			break;
		}
		return null;
	}
	,error: function(e) {
		if(this.errorPos(e) > this.errorPos(this.lastError)) this.lastError = e;
	}
	,errorPos: function(e) {
		switch(e[1]) {
		case 0:
			return -1;
		case 1:
			var r = e[3];
			return r << 16;
		case 2:
			var c = e[6];
			var r = e[5];
			return (r << 16) + c;
		case 3:
			var c = e[6];
			var r = e[5];
			return (r << 16) + c;
		}
	}
	,columnName: function(c) {
		var s = "";
		do {
			s += String.fromCharCode(65 + c % 26);
			c = c / 26 | 0;
		} while(c > 0);
		return s;
	}
	,restore: function(s) {
		this.status.curRow = s.curRow;
		this.status.rows = s.rows;
		this.status.out = s.out;
		this.status.rowRepeat = s.rowRepeat;
		this.status.obj = s.obj;
	}
	,save: function() {
		var odup = { };
		var _g = 0;
		var _g1 = Reflect.fields(this.status.obj);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			var v = Reflect.field(this.status.obj,f);
			if(js.Boot.__instanceof(v,Array)) {
				var a = v;
				odup[f] = a.slice();
			} else odup[f] = v;
		}
		return { curRow : this.status.curRow, rows : this.status.rows.slice(), out : this.status.out.slice(), rowRepeat : this.status.rowRepeat, obj : odup};
	}
	,errorString: function(e) {
		switch(e[1]) {
		case 0:
			return "No Error";
		case 1:
			var row = e[3];
			var l = e[2];
			return "line " + row + " expected " + (l.name == null?Std.string(l.cols):l.name);
		case 2:
			var col = e[6];
			var row = e[5];
			var r = e[4];
			var l = e[3];
			var v = e[2];
			var inf = this.smartMatching(v,r);
			var rule = this.ruleString(inf.r);
			return "at " + this.columnName(col) + row + " '" + inf.v + "' should be " + rule + (l.name == null?"":" (" + l.name + ")");
		case 3:
			var col = e[6];
			var row = e[5];
			var msg = e[4];
			var l = e[3];
			var v = e[2];
			return "at " + this.columnName(col) + row + " '" + v + "' " + msg + (l.name == null?"":" (" + l.name + ")");
		}
	}
	,smartMatching: function(v,r) {
		switch(r[1]) {
		case 10:
			var r1 = r[3];
			var sep = r[2];
			var _g = 0;
			var _g1 = v.split(sep);
			while(_g < _g1.length) {
				var v1 = _g1[_g];
				++_g;
				var v2 = StringTools.trim(v1);
				if(this.checkRule(r1,v2) == null) return { v : v2, r : r1};
			}
			break;
		default:
		}
		return { v : v, r : r};
	}
	,ruleString: function(r) {
		switch(r[1]) {
		case 0:
			return "skip";
		case 1:
			return "blank";
		case 2:
			return "int";
		case 3:
			return "bool";
		case 4:
			return "float";
		case 5:
			return "text";
		case 6:
			return "regexp";
		case 7:
			var vl = r[2];
			return "one of these : (" + Lambda.map(vl,function(v) {
				return "'" + v + "'";
			}).join(",") + ")";
		case 8:
			var vl = r[2];
			return "one of these : (" + Lambda.map(vl,function(v) {
				return "'" + v + "'";
			}).join(",") + ")";
		case 9:
			var vl = r[2];
			return "one of these : (" + Lambda.map(vl,function(v) {
				return "'" + v + "'";
			}).join(",") + ")";
		case 10:
			var r1 = r[3];
			var sep = r[2];
			return "an array of " + this.ruleString(r1) + " separated by '" + sep + "'";
		case 11:
			var name = r[2];
			return name;
		}
	}
	,hasProperEnding: function(doc) {
		switch(doc[1]) {
		case 3:case 2:
			return false;
		case 1:
			return true;
		case 5:
			var d = doc[3];
			return this.hasProperEnding(d);
		case 4:
			var a = doc[2];
			var v = a.length > 0;
			var _g = 0;
			while(_g < a.length) {
				var x = a[_g];
				++_g;
				if(!this.hasProperEnding(x)) {
					v = false;
					break;
				}
			}
			return v;
		case 0:
			var a = doc[2];
			return a.length > 0 && this.hasProperEnding(a[a.length - 1]);
		case 6:
			var d = doc[2];
			return this.hasProperEnding(d);
		}
	}
	,getLines: function(sheet) {
		var s = this.sheets.get(sheet);
		if(s == null) throw "Sheet does not exists '" + sheet + "'";
		var rows = s.nodes.resolve("table:table-row");
		var repeat = 0;
		var line = 0;
		var me = this;
		return { hasNext : function() {
			return rows.length > 0 || repeat > 0;
		}, next : function() {
			var r;
			line++;
			if(repeat == 0) {
				r = rows.pop();
				var repeatVal = r.x.get("table:number-rows-repeated");
				if(repeatVal != null) {
					repeat = Std.parseInt(repeatVal) - 1;
					rows.push(r);
				}
			} else {
				r = rows.first();
				if(--repeat == 0) rows.pop();
			}
			var cols = [];
			var $it0 = r.nodes.resolve("table:table-cell").iterator();
			while( $it0.hasNext() ) {
				var c = $it0.next();
				var repeat1 = c.x.get("table:number-columns-repeated");
				if(repeat1 == null) cols.push(me.extractText(c,line)); else {
					var t = me.extractText(c,line);
					var _g1 = 0;
					var _g = Std.parseInt(repeat1);
					while(_g1 < _g) {
						var i = _g1++;
						cols.push(t);
					}
				}
			}
			return cols;
		}};
	}
	,check: function(sheet,doc) {
		var s = this.sheets.get(sheet);
		if(s == null) throw "Sheet does not exists '" + sheet + "'";
		this.status = { curRow : 1, rows : Lambda.array(s.nodes.resolve("table:table-row")), rowRepeat : 0, out : new Array(), obj : { }};
		this.lastError = ods.Check.CMatch;
		if(!this.checkRec(doc,false)) throw "In '" + sheet + "' " + this.errorString(this.lastError);
		if(this.status.rows.length > 0 && !this.hasProperEnding(doc)) throw "In '" + sheet + "' " + this.errorString(this.lastError) + " (maybe extra data ?)";
		var x = Xml.createDocument();
		var _g = 0;
		var _g1 = this.status.out;
		while(_g < _g1.length) {
			var o = _g1[_g];
			++_g;
			x.addChild(o);
		}
		return { x : x, o : this.status.obj};
	}
	,getSheets: function() {
		return Lambda.array({ iterator : (function(_e) {
			return function() {
				return _e.keys();
			};
		})(this.sheets)});
	}
	,hasSheet: function(s) {
		return this.sheets.exists(s);
	}
	,load: function(x) {
		if(x.nodeType == Xml.Document) x = x.firstElement();
		this.root = x;
		var x1 = new haxe.xml.Fast(x);
		var sx = x1.node.resolve("office:body").node.resolve("office:spreadsheet");
		var $it0 = sx.nodes.resolve("table:table").iterator();
		while( $it0.hasNext() ) {
			var s = $it0.next();
			this.sheets.set(s.att.resolve("table:name"),s);
		}
	}
	,loadODS: function(i) {
		var content = null;
		var $it0 = new haxe.zip.Reader(i).read().iterator();
		while( $it0.hasNext() ) {
			var e = $it0.next();
			if(e.fileName == "content.xml") {
				content = e;
				break;
			}
		}
		var data;
		if(content.compressed) data = format.tools.Inflate.run(content.data); else data = content.data;
		this.load(Xml.parse(data.toString()));
	}
	,__class__: ods.OdsChecker
}
var sys = {}
sys.FileSystem = function() { }
sys.FileSystem.__name__ = ["sys","FileSystem"];
sys.FileSystem.exists = function(path) {
	return js.Node.fs.existsSync(path);
}
sys.FileSystem.rename = function(path,newpath) {
	js.Node.fs.renameSync(path,newpath);
}
sys.FileSystem.stat = function(path) {
	return js.Node.fs.statSync(path);
}
sys.FileSystem.fullPath = function(relpath) {
	return js.Node.path.resolve(null,relpath);
}
sys.FileSystem.isDirectory = function(path) {
	if(!js.Node.fs.existsSync(path)) throw "Path doesn't exist: " + path;
	if(js.Node.fs.statSync(path).isSymbolicLink()) return false; else return js.Node.fs.statSync(path).isDirectory();
}
sys.FileSystem.createDirectory = function(path) {
	js.Node.fs.mkdirSync(path);
}
sys.FileSystem.deleteFile = function(path) {
	js.Node.fs.unlinkSync(path);
}
sys.FileSystem.deleteDirectory = function(path) {
	js.Node.fs.rmdirSync(path);
}
sys.FileSystem.readDirectory = function(path) {
	return js.Node.fs.readdirSync(path);
}
sys.FileSystem.signature = function(path) {
	var shasum = js.Node.crypto.createHash("md5");
	shasum.update(js.Node.fs.readFileSync(path));
	return shasum.digest("hex");
}
sys.FileSystem.join = function(p1,p2,p3) {
	return js.Node.path.join(p1 == null?"":p1,p2 == null?"":p2,p3 == null?"":p3);
}
sys.FileSystem.readRecursive = function(path,filter) {
	var files = sys.FileSystem.readRecursiveInternal(path,null,filter);
	if(files == null) return []; else return files;
}
sys.FileSystem.readRecursiveInternal = function(root,dir,filter) {
	if(dir == null) dir = "";
	if(root == null) return null;
	var dirPath = js.Node.path.join(root == null?"":root,dir == null?"":dir,"");
	if(!(js.Node.fs.existsSync(dirPath) && sys.FileSystem.isDirectory(dirPath))) return null;
	var result = [];
	var _g = 0;
	var _g1 = js.Node.fs.readdirSync(dirPath);
	while(_g < _g1.length) {
		var file = _g1[_g];
		++_g;
		var fullPath = js.Node.path.join(dirPath == null?"":dirPath,file == null?"":file,"");
		var relPath;
		if(dir == "") relPath = file; else relPath = js.Node.path.join(dir == null?"":dir,file == null?"":file,"");
		if(js.Node.fs.existsSync(fullPath)) {
			if(sys.FileSystem.isDirectory(fullPath)) {
				if(fullPath.charCodeAt(fullPath.length - 1) == 47) fullPath = HxOverrides.substr(fullPath,0,-1);
				if(filter != null && !filter(relPath)) continue;
				var recursedResults = sys.FileSystem.readRecursiveInternal(root,relPath,filter);
				if(recursedResults != null && recursedResults.length > 0) result = result.concat(recursedResults);
			} else if(filter == null || filter(relPath)) result.push(relPath);
		}
	}
	return result;
}
sys.io = {}
sys.io.File = function() { }
sys.io.File.__name__ = ["sys","io","File"];
sys.io.File.append = function(path,binary) {
	throw "Not implemented";
	return null;
}
sys.io.File.copy = function(src,dst) {
	var content = js.Node.fs.readFileSync(src);
	js.Node.fs.writeFileSync(dst,content);
}
sys.io.File.getContent = function(path) {
	return js.Node.fs.readFileSync(path);
}
sys.io.File.saveContent = function(path,content) {
	js.Node.fs.writeFileSync(path,content);
}
sys.io.File.write = function(path,binary) {
	throw "Not implemented";
	return null;
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = String;
String.__name__ = ["String"];
Array.prototype.__class__ = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
Xml.Element = "element";
Xml.PCData = "pcdata";
Xml.CData = "cdata";
Xml.Comment = "comment";
Xml.DocType = "doctype";
Xml.ProcessingInstruction = "processingInstruction";
Xml.Document = "document";
js.Node.__filename = __filename;
js.Node.__dirname = __dirname;
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
js.Node.util = js.Node.require("util");
js.Node.fs = js.Node.require("fs");
js.Node.net = js.Node.require("net");
js.Node.http = js.Node.require("http");
js.Node.https = js.Node.require("https");
js.Node.path = js.Node.require("path");
js.Node.url = js.Node.require("url");
js.Node.os = js.Node.require("os");
js.Node.crypto = js.Node.require("crypto");
js.Node.dns = js.Node.require("dns");
js.Node.queryString = js.Node.require("querystring");
js.Node.assert = js.Node.require("assert");
js.Node.childProcess = js.Node.require("child_process");
js.Node.vm = js.Node.require("vm");
js.Node.tls = js.Node.require("tls");
js.Node.dgram = js.Node.require("dgram");
js.Node.assert = js.Node.require("assert");
js.Node.repl = js.Node.require("repl");
js.Node.cluster = js.Node.require("cluster");
catapult.Catapult.FILE_CHANGED_MESSAGE_NAME = "file_changed";
catapult.Catapult.FILE_CHANGED_MESSAGE_NAME_ODS = "file_changed_ods";
catapult.OdsRuntimeParser.isBoolean = new EReg("^(true)|(false)$","i");
catapult.OdsRuntimeParser.isInt = new EReg("^[0-9]+$","");
catapult.OdsRuntimeParser.isFloat = new EReg("^[0-9]+\\.[0-9]+$","");
catapult.Server.RETRY_INTERVAL_MS = 50;
format.tools._InflateImpl.Window.SIZE = 32768;
format.tools._InflateImpl.Window.BUFSIZE = 65536;
format.tools.InflateImpl.LEN_EXTRA_BITS_TBL = [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,-1,-1];
format.tools.InflateImpl.LEN_BASE_VAL_TBL = [3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
format.tools.InflateImpl.DIST_EXTRA_BITS_TBL = [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,-1,-1];
format.tools.InflateImpl.DIST_BASE_VAL_TBL = [1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
format.tools.InflateImpl.CODE_LENGTHS_POS = [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
haxe.Timer.arr = new Array();
haxe.xml.Parser.escapes = (function($this) {
	var $r;
	var h = new haxe.ds.StringMap();
	h.set("lt","<");
	h.set("gt",">");
	h.set("amp","&");
	h.set("quot","\"");
	h.set("apos","'");
	h.set("nbsp",String.fromCharCode(160));
	$r = h;
	return $r;
}(this));
haxe.zip.InflateImpl.LEN_EXTRA_BITS_TBL = [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,-1,-1];
haxe.zip.InflateImpl.LEN_BASE_VAL_TBL = [3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
haxe.zip.InflateImpl.DIST_EXTRA_BITS_TBL = [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,-1,-1];
haxe.zip.InflateImpl.DIST_BASE_VAL_TBL = [1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
haxe.zip.InflateImpl.CODE_LENGTHS_POS = [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
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
mconsole.Console.defaultPrinter = new mconsole.LogPrinter(haxe.Log.trace);
mconsole.Console.printers = [mconsole.Console.defaultPrinter];
mconsole.Console.groupDepth = 0;
mconsole.Console.times = new haxe.ds.StringMap();
mconsole.Console.counts = new haxe.ds.StringMap();
mconsole.Console.running = false;
mconsole.Console.dirxml = "dirxml";
mconsole.Console.hasConsole = mconsole.Console.detectConsole();
mconsole.StackHelper.filters = mconsole.StackHelper.createFilters();
mconsole.Style.clicolor = Sys.getEnv("CLICOLOR") == "1";
ods.OdsChecker.eblank = new EReg("^[ \r\n\t]*$","");
ods.OdsChecker.eint = new EReg("^(-?[0-9]+|0x[0-9A-Fa-f]+)$","");
ods.OdsChecker.efloat = new EReg("^-?([0-9]+)|([0-9]*[.,][0-9]+)$","");
catapult.Server.main();
})();

//# sourceMappingURL=catapult.js.map