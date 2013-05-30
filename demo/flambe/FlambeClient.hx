package flambe;

import flambe.asset.AssetPack;
import flambe.asset.Manifest;
import flambe.input.TouchPoint;
import flambe.display.FillSprite;
import flambe.display.ImageSprite;
import flambe.display.Sprite;
import flambe.Entity;
import flambe.System;
import flambe.script.Script;
import flambe.script.Repeat;
import flambe.script.AnimateBy;

// @:build(ods.Data.build("../assets/bootstrap/stuff/test.ods","items","id"))
@:build(ods.Data.build("demo/assets/bootstrap/stuff/test.ods","items","id"))
enum Item {
}

typedef ItemData = {
	var id : Item;
	var w : Float;
	var scale : Float;
	var x : Float;
	var y : Float;
}

class FlambeClient
{
	// static var DATA = ods.Data.parse("../assets/bootstrap/stuff/test.ods", "items", ItemData);
	static var DATA = ods.Data.parse("demo/assets/bootstrap/stuff/test.ods", "items", ItemData);
	
	
	static var _layer :Entity;
	static var _sprites :Map<String, ImageSprite>;
	
	private static function main ()
	{
		System.init();
		// System.
		
		//Create the remoting Html connection
		var conn = haxe.remoting.HttpAsyncConnection.urlConnect("http://localhost:8000");
		
		//Build and instantiate the proxy class with macros.  
		//The full path to the server class is given as the first argument, but it is NOT compiled into the client by default
		// var manifestProxy = transition9.remoting.Macros.buildAndInstantiateRemoteProxyClass(flambe.server.assets.ManifestService, conn);
		
		flambe.asset.CatapultTools.getManifest("bootstrap", function(m :Manifest) :Void {
			trace("Received manifest: " + m);
		});
		
		// //You can use code completion here
		// manifestProxy.getManifest("bootstrap", function (manifest :flambe.asset.Manifest) {
		// 	// trace('m=' + m);
		// 	var loader = System.loadAssetPack(manifest);
		
		// 	// Add listeners
		// 	loader.success.connect(onSuccess);
		// 	loader.error.connect(function (message) {
		// 		trace("Load error: " + message);
		// 	});
		// 	loader.progressChanged.connect(function () {
		// 		trace("Loading progress... " + loader.progress + " of " + loader.total);
		// 	});
		// });
		
		_sprites = new Map();
		trace("on init DATA: " + untyped JSON.stringify(DATA));
	}
	
	private static function onSuccess (pack :AssetPack)
	{
		System.root.addChild(new Entity()
			.add(new FillSprite(0x303030, System.stage.width, System.stage.height)));
		// flambe.asset.AssetReloader.odsSignal.connect(function(typeId :String,  values :Array<Dynamic>) {
		// 	DATA = cast values;
		// 	trace("on update DATA: " + untyped JSON.stringify(DATA));
		// 	addItems(pack);
		// });
		addItems(pack);
	}
	
	private static function addItems(pack :AssetPack) :Void
	{
		if (_layer == null) {
			_layer = new Entity();
			System.root.addChild(_layer);
		}
		
		var allIds = new Map<String, Bool>();
		for (item in DATA) {
			allIds.set(Type.enumConstructor(item.id), true);
		}
		
		//Remove those sprites not present in the current DATA blob
		for (id in _sprites.keys()) {
			if (!allIds.exists(id)) {
				_sprites.get(id).owner.dispose();
				_sprites.remove(id);
			}
		}
		
		for (item in DATA) {
			var itemName = Type.enumConstructor(item.id);
			var sprite :ImageSprite = null;
			if (_sprites.exists(itemName)) {
				sprite = _sprites.get(itemName);
			} else {
				sprite = new ImageSprite(pack.getTexture("images/flameling"));
				_sprites.set(itemName, sprite);
				sprite.centerAnchor();
				var tentacle = new Entity().add(sprite).add(new Script());
				_layer.addChild(tentacle);
			}
			sprite.x._ = item.x;
			sprite.y._ = item.y;
			sprite.setScale(item.scale);
			sprite.owner.get(Script).run(
				new Repeat(
					new AnimateBy(sprite.rotation, 360 * (item.w > 0 ? 1 : -1), 360/Math.abs(item.w))));
		}
	}
}
