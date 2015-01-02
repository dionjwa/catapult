package catapult;

import haxe.Json;
import catapult.Constants;
import js.Node;
import sys.FileSystem;
import t9.remoting.ServeFile;

using StringTools;

@:expose("ManifestServer")
class ManifestServer
{
	public var manifests (get, null):ServedManifestsMessage;
	public var manifestsPath (default, set) :String;
	var _manifests :ServedManifestsMessage;

	public function new ()
	{
		setManifestsFolder("./");
	}

	public function rebuildManifest()
	{
		_manifests = null;
	}

	public function onFileChanged(event :FileChangedEvent)
	{
		var allManifestsMd5StringBuffer = new StringBuf();
		for (manifestKey in Reflect.fields(manifests.manifests)) {
			var manifest :ServedManifest = Reflect.field(manifests.manifests, manifestKey);
			if (manifest.id == event.manifest.id) {
				//Rebuild this one
				var md5StringBuffer = new StringBuf();
				for (asset in manifest.assets) {
					if (asset.name == event.asset.name) {
						var absoluteFilePath = Node.path.join(manifestsPath, manifestKey, asset.name);
						asset.md5 = FileSystem.signature(absoluteFilePath);
						asset.bytes = FileSystem.stat(absoluteFilePath).size;
					}
					md5StringBuffer.add(asset.md5);
				}
				manifest.md5 = Node.crypto.createHash("md5").update(md5StringBuffer.toString()).digest("hex");
			}
			allManifestsMd5StringBuffer.add(manifest.md5);
		}
		manifests.md5 = Node.crypto.createHash("md5").update(allManifestsMd5StringBuffer.toString()).digest("hex");
	}

	public function createServer(port :Int)
	{
		var server :NodeHttpServer = Node.http.createServer(function(req :NodeHttpServerReq, res :NodeHttpServerResp) {
			if(!this.onHttpRequest(req, res)) {
				res.writeHead(404);
				res.write("<!DOCTYPE html><html><body><h1>Unknown API</h1>" + Json.stringify(manifests, null, "\t") + "</body></html>");
				res.end();
			}
		});
		server.listen(port, "0.0.0.0", function() {trace("Manifest server listening on 0.0.0.0:" + port);});
		return server;
	}

	public function setManifestsFolder(path :String)
	{
		set_manifestsPath(path);
		rebuildManifest();
		return this;
	}

	public function getMiddleWare()
	{
		return function(req :NodeHttpServerReq, res :NodeHttpServerResp, next :?String->Void) {
			if (!this.onHttpRequest(req, res)) {
				next();
			}
		};
	}

	public function onHttpRequest (req :NodeHttpServerReq, res :NodeHttpServerResp) :Bool
	{
		var queryString = Node.url.parse(req.url);
		return serveManifest(req, res) || serveManifests(req, res) || serveFile(req, res);
	}

	function serveManifests(req :NodeHttpServerReq, res :NodeHttpServerResp) :Bool
	{
		var queryString = Node.url.parse(req.url);
		if (queryString.pathname != "/manifests.json") {
			return false;
		}
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(Json.stringify(manifests, null, "\t"));
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

		if (!Reflect.field(manifests.manifests, pathToken)) {
			res.writeHead(404, { 'Content-Type': 'text/plain' });
			var manifestKeys = getManifestKeys();
			for (i in 0...manifestKeys.length) {
				manifestKeys[i] = "/" + manifestKeys[i] + "/manifest.json";
			}
			res.end("No manifest at that path found, possible manifests are [" + manifestKeys.join(", ") + "]");
			return true;
		}

		var manifestData :ServedManifestMessage = {manifest:Reflect.field(manifests.manifests, pathToken)};

		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(Json.stringify(manifestData, null, "\t"));

		return true;
	}

	function serveFile(req :NodeHttpServerReq, res :NodeHttpServerResp) :Bool
	{
		var queryString = Node.url.parse(req.url);
		var filePath = queryString.pathname.substr(1);
		var pathTokens = filePath.split(Node.path.sep);
		var manifest = Reflect.field(manifests.manifests, pathTokens[0]);
		if (manifest == null) {
			return false;
		}

		var fullFilePath = Node.path.join(manifestsPath, filePath);
		if (Node.fs.existsSync(fullFilePath)) {
			ServeFile.serveFile(fullFilePath, res);
			return true;
		} else {
			return false;
		}
	}

	function set_manifestsPath(path :String) :String
	{
		this.manifestsPath = path;
		return path;
	}

	function get_manifests():ServedManifestsMessage
	{
		if (_manifests == null) {
			_manifests = getManifests(manifestsPath);
		}
		return _manifests;
	}

	function getManifestKeys() :Array<String>
	{
		var keys = new Array<String>();
		for (key in Reflect.fields(manifests.manifests)) {
			keys.push(key);
		}
		return keys;
	}

	static function getManifests(path :String) :ServedManifestsMessage
	{
		var manifests :Dynamic<ServedManifest> = {};
		var allManifestsMd5StringBuffer = new StringBuf();
		for (manifestKey in Node.fs.readdirSync(path)) {
			var manifestDirectory = Node.path.join(path, manifestKey);
			if(Node.fs.lstatSync(manifestDirectory).isDirectory()) {
				//Create manifest
				var assets :Array<FileDef> = [];
				var md5StringBuffer = new StringBuf();

				for (relativeFilePath in FileSystem.readRecursive(manifestDirectory, fileFilter)) {
					var absoluteFilePath = FileSystem.join(manifestDirectory, relativeFilePath);
					var fileBlob :FileDef =
					{
						name: relativeFilePath,
						md5: FileSystem.signature(absoluteFilePath),
						bytes: FileSystem.stat(absoluteFilePath).size
					};
					assets.push(fileBlob);
					md5StringBuffer.add(fileBlob.md5);
				}
				var servedManifest :ServedManifest = {id:manifestKey, assets:assets, md5:Node.crypto.createHash("md5").update(md5StringBuffer.toString()).digest("hex")};
				allManifestsMd5StringBuffer.add(servedManifest.md5);
				Reflect.setField(manifests, manifestKey, servedManifest);
			}
		}
		return {manifests:manifests, md5:Node.crypto.createHash("md5").update(allManifestsMd5StringBuffer.toString()).digest("hex")};
	}

	static function fileFilter(filePath :String) :Bool
	{
		return filePath != null && !(Node.path.basename(filePath).startsWith(".") || filePath.endsWith("cache"));
	}
}
