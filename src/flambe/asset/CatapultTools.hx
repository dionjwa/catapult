package flambe.asset;

import catapult.Catapult;

import flambe.asset.AssetEntry;
import flambe.platform.Platform;

import haxe.Http;
import haxe.Json;

import js.Browser;
import js.html.WebSocket;

using flambe.util.Strings;
using StringTools;

typedef Err=Dynamic;

typedef ODSItem = {
	var id :String;
}

class CatapultTools
{

	public static function updateObjectOnChange (object :Dynamic, assetId :String) :Void
	{
		if (getPlatform() == null) {
			Log.error("Unsupported platform");
			return;
		}

		// platform.getCatapultClient().messageSignal.connect(
		// 	function(message) {
		// 		if (message.type == "file_changed") {
		// 			Console.info({log:"ODSDataChangedMessage", msg:message});
		// 			var newData :Array<ODSItem> = Reflect.field(message.data.h, "$" + id);
		// 			if (newData != null)
		// 			{
		// 				Console.info("ODS data changed");
		// 				for (i in 0...newData.length)
		// 				{
		// 					staticData[i] = newData[i];
		// 				}

		// 				if (changed != null)
		// 				{
		// 					changed();
		// 				}
		// 			}
		// 		}
		// 	});
	}

	public static function updateODSDataOnServerChange (id :String, staticData :Array<ODSItem>, ?changed:Void->Void) :Void
	{
		if (getPlatform() == null) {
			Log.error("Unsupported platform");
			return;
		}

		if (getPlatform().getCatapultClient() == null) {
			Log.warn("No catapult client, not sending ODSDataChangedMessage");
			return;
		}

		getPlatform().getCatapultClient().messageSignal.connect(
			function(message) {
				if (message.type == "file_changed_ods") {
					Console.info({log:"ODSDataChangedMessage", msg:message});
					var newData :Array<ODSItem> = Reflect.field(message.data.h, "$" + id);
					if (newData != null)
					{
						Console.info("ODS data changed");
						for (i in 0...newData.length)
						{
							staticData[i] = newData[i];
						}

						if (changed != null)
						{
							changed();
						}
					}
				}
			});
	}

	public static function updateCastleDBOnServerChange (?changed:Void->Void) :Void
	{
		if (getPlatform() == null) {
			Log.error("Unsupported platform");
			return;
		}

		if (getPlatform().getCatapultClient() == null) {
			Log.warn("No catapult client, not sending CastleDB file_changed");
			return;
		}

		getPlatform().getCatapultClient().messageSignal.connect(
			function(message) {
				if (message.type == "file_changed" && message.name.endsWith(".cdb")) {
					// Console.info({log:"CastleDBUpdate", msg:message});
					// turngame.data.Data.load(message.data);
					changed();
				}
			});
	}

	public static function getManifest (manifestId :String, cb:Manifest->Err->Void) :Void
	{
#if nodejs
		var http = new Http("http://localhost:8000/" + manifestId + "/manifest.json");
#else
		var http = new Http("http://" + Browser.location.host  + "/" + manifestId + "/manifest.json");
#end
		http.onData = function(data) {
			var manifestMessage :ServedManifestMessage = Json.parse(data);
			// Console.log({manifestMessage:manifestMessage});

			var manifestData :ServedManifest = manifestMessage.manifest;

			var manifest = new Manifest();
			if (manifestData.assets == null) {
				cb(null, "manifestData.assets == null");
			}

			for (asset in manifestData.assets) {

				var name = asset.name;
				//It's not a public function yet
				var type :AssetFormat = Reflect.callMethod(Manifest, Reflect.field(Manifest, "inferFormat"), [name]);

				if (type == GIF || type == JPG || type == JXR || type == PNG || type == GIF || type == WEBP || type == M4A || type == MP3 || type == OGG  || type == WAV) {
					// If this an asset that not all platforms may support, trim the extension from
					// the name. We'll only load one of the assets if this creates a name collision.
					name = name.removeFileExtension();
				}
#if nodejs
				manifest.add(name, "http://localhost:8000/" + manifestId + "/" + asset.name + "?md5=" + asset.md5, 0, type); 
#else
				manifest.add(name, "http://" + Browser.location.host + "/" + manifestId + "/" + asset.name + "?md5=" + asset.md5, 0, type); 
#end
			}
			cb(manifest, null);
		}

		http.onError = function(err) {
			cb(null, err);
		}

		http.request(false);
	}

	private static function getPlatform() :Platform
	{
		var platform = #if flash
		        flambe.platform.flash.FlashPlatform.instance;
		#elseif nodejs
				flambe.platform.nodejs.NodePlatform.instance;
		#elseif html
		        flambe.platform.html.HtmlPlatform.instance;
		#else
		        null;
		#end
		return platform;
	}
}
