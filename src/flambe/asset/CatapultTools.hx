package flambe.asset;

import catapult.Catapult;

import flambe.asset.AssetEntry;

import haxe.Http;
import haxe.Json;

import js.Browser;
import js.html.WebSocket;
import js.html.MessageEvent;

using StringTools;
using flambe.util.Strings;

typedef Err=Dynamic;

typedef ODSItem = {
	var id :String;
}

typedef ODSData = {
	var h :Map<String, Array<ODSItem>>;
}

class CatapultTools
{
	/** You can change this to use a different server, e.g. replace a web downloaded version with local changes */
	/** Make sure you append a trailing backslash */
	public static var baseHttpAddress :String = "http://localhost:8000/";
	
	public static var catapultWebsocket :WebSocket = {
		var wsAddress = baseHttpAddress.replace("http:", "ws:");
		Console.info({log:"wsAddress: " + wsAddress});
		var ws = new WebSocket(wsAddress);
		ws.onerror = function(err) {
			Console.error({log:"websocket err", err:err});
		}
		ws.onopen = function(e :js.html.EventListener) {
			Console.info({log:"websocket open", e:e});
		}
		ws.onmessage = function(msg :MessageEvent) {
			Console.info({log:"websocket msg", msg:msg.data});
		}
		ws.onclose = function(e :js.html.EventListener) {
			Console.error({log:"websocket close", e:e});
		}
		ws;
	};
	
	public static function addWebsocketListener(listener :MessageEvent->Void) :Void
	{
		var previousOnMessage = catapultWebsocket.onmessage;
		catapultWebsocket.onmessage = function(msg :MessageEvent) {
			previousOnMessage(msg);
			listener(msg);
		}
	}
	
	public static function listenForManifestChanges (loadEntry :String->AssetEntry->Void, manifest :Manifest) :Void
	{
		addWebsocketListener(function(msg :MessageEvent) {
			
			var message :FileChangedMessage = Json.parse(msg.data);
			
			if (message.type == Catapult.FILE_CHANGED_MESSAGE_NAME) 
			{
				var assetType = inferType(message.name);
				if (assetType == Image || assetType == Audio) 
				{
					if (message.manifest == manifest.name)
					{
						var assetEntry = new AssetEntry(
							message.name.removeFileExtension(), 
							baseHttpAddress + message.manifest + "/" + message.name + "?md5=" + message.md5, 
							inferType(message.name), 
							message.bytes);
						Console.info({log:"Reloading", assetEntry:assetEntry});
						loadEntry(assetEntry.url, assetEntry);
					}
					else
					{
						Console.info({log:"Asset not for this manifest", message:message, manifestId:manifest.name});
					}
					
				} 
				else if (message.name.endsWith("js"))
				{
					Console.info({log:"Reloading2 because change in javascript detected", message:message});
					Browser.location.reload();
				}
			}
		});
	}
	
	public static function listenForODSChanges (listener :Dynamic->Void) :Void
	{
		addWebsocketListener(function(msg :MessageEvent) {
			
			var message :FileChangedMessage = Json.parse(msg.data);
			
			if (message.type == Catapult.FILE_CHANGED_MESSAGE_NAME_ODS) 
			{
				var odsDataMessage :ODSDataChangedMessage = cast message;
				listener(odsDataMessage);
			}
		});
	}
	
	public static function updateODSDataOnServerChange (id :String, staticData :Array<ODSItem>, ?changed:Void->Void) :Void
	{
		listenForODSChanges(function(msg :ODSDataChangedMessage) :Void {
			Console.info({log:"ODSDataChangedMessage", msg:msg});
			var newData :Array<ODSItem> = Reflect.field(msg.data.h, "$" +id);
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
		});
	}
	
	
	// public static function pollForManifestChanges (loadEntry :String->AssetEntry->Void, manifest :Manifest, ?pollIntervalSeconds:Float = 1) :Void
	// {
	// 	var currentManifest :ServedManifest = null;
	// 	var assetMap :Map<String, FileDef> = new Map<String, FileDef>();
		
	// 	// var handleManifestChanged = function(newManifest :Manifest) {
	// 	// }
		
	// 	var pollFunction = null;
		
	// 	pollFunction = function() :Void 
	// 	{
	// 		var http = new Http(baseHttpAddress + manifest.name + "/manifest.json");
	// 		http.async = false;
	// 		http.onData = function(data)
	// 		{
	// 			var manifestMessage :ServedManifestMessage = Json.parse(data);
	// 			Console.info({log:"Manifest polling", manifestMessage:manifestMessage});
				
				
	// 			if (currentManifest == null || currentManifest.md5 != manifestMessage.manifest.md5)
	// 			{
	// 				currentManifest = manifestMessage.manifest;
					
	// 				for(asset in currentManifest.assets)
	// 				{
	// 					if (!assetMap.exists(asset.name) || assetMap.get(asset.name).md5 != asset.md5)
	// 					{
	// 						var assetEntry = new AssetEntry(
	// 							asset.name.removeFileExtension(), 
	// 							baseHttpAddress + "/" + manifest.name + "/" + asset.name + "?md5=" + asset.md5, 
	// 							inferType(asset.name), 
	// 							asset.bytes);
	// 						Console.info({log:"Reloading", assetEntry:assetEntry});
	// 						loadEntry(assetEntry.url, assetEntry);
	// 						assetMap.set(assetEntry.name, asset);
	// 					}
	// 				}
	// 			}
	// 			else
	// 			{
	// 				Console.info({log:"No manifest change"});	
	// 			}
				
	// 			haxe.Timer.delay(pollFunction, 1000);
				
	// 		}
			
	// 		http.onError = function(err)
	// 		{
	// 			Console.error({log:"Manifest polling error", err:err});
	// 		}
			
	// 		http.request();
	// 	}
		
		
	// 	// pollFunction();
		
	// 	// haxe.Serializer.USE_ENUM_INDEX=true;
		
	// 	// getWebsocketClient().registerMessageHandler(function(msg :AssetUpdated) :Void {
	// 	// 	Log.info("Received AssetUpdated: ", ["msg", Std.string(msg)]);
	// 	// 	var foundEntry = false;
	// 	// 	for (entry in manifest) {
	// 	// 		if (entry.name == msg.asset.name) {
	// 	// 			Log.info("Reloading asset entry:", ["updatedAssetEntry", msg.asset]);
	// 	// 			loadEntry(msg.asset.url, msg.asset);
	// 	// 			foundEntry = true;
	// 	// 			break;
	// 	// 		}
	// 	// 	}
	// 	// 	if (!foundEntry) {
	// 	// 		Log.warn("No AssetEntry matching", ["name", msg.asset.name]);
	// 	// 	}
	// 	// });
	// }
	
	public static function getManifest (manifestId :String, cb:Manifest->Err->Void) :Void
	{
		var http = new Http(baseHttpAddress + manifestId + "/manifest.json");
		http.onData = function(data) 
		{
			var manifestMessage :ServedManifestMessage = Json.parse(data);
			Console.log({manifestMessage:manifestMessage});
			
			var manifestData :ServedManifest = manifestMessage.manifest;
			
			var manifest = new Manifest(manifestData.id);
			if (manifestData.assets == null)
			{
				cb(null, "manifestData.assets == null");
			}
			
			for (asset in manifestData.assets) {
				
				var name = asset.name;
				var type = Manifest.inferType(name);
				if (type == Image || type == Audio) {
					// If this an asset that not all platforms may support, trim the extension from
					// the name. We'll only load one of the assets if this creates a name collision.
					name = name.removeFileExtension();
				}
				
				manifest.add(name, baseHttpAddress + manifestId + "/" + asset.name + "?md5=" + asset.md5, 0, type); 
			}
			cb(manifest, null);
		}
		
		http.onError = function(err) 
		{
			cb(null, err);
		}
		
		http.request(false);
	}
	
	private static function inferType (url :String) :AssetType
	{
		var extension = url.split("?")[0].getFileExtension();
		if (extension != null) {
			switch (extension.toLowerCase()) {
				case "png", "jpg", "gif": return Image;
				case "ogg", "m4a", "mp3", "wav": return Audio;
			}
		}
		return Data;
	}
}
