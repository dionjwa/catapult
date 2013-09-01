//
// Flambe - Rapid game development
// https://github.com/aduros/flambe/blob/master/LICENSE.txt

package flambe.platform;

import haxe.Json;

import flambe.util.Assert;

using StringTools;

/** Overrides the actual Flambe version for now. */
class CatapultClient
{
    public var messageSignal (default, null):flambe.util.Signal1<Dynamic>;

    private function new ()
    {
        _loaders = [];
        messageSignal = new flambe.util.Signal1<Dynamic>();
    }

    public function add (loader :BasicAssetPackLoader)
    {
#if !flambe_disable_reloading
        // Only care about packs loaded from the assets directory
        if (loader.manifest.relativeBasePath == "assets") {
            _loaders.push(loader);
        }
#end
    }

    public function remove (loader :BasicAssetPackLoader)
    {
        _loaders.remove(loader);
    }

    private function onError (cause :String)
    {
        Log.warn("Unable to connect to Catapult", ["cause", cause]);
    }

    private function onMessage (message :String)
    {
        Log.info("onMessage on new CatapultClient " + message);
        var message = Json.parse(message);
        switch (message.type) {
        case "file_changed":
            var url = message.name + "?v=" + message.md5;
            url = url.replace("\\", "/"); // Handle backslash paths in Windows
            for (loader in _loaders) {
                loader.reload(url);
            }
        case "restart":
            onRestart();
        }
        messageSignal.emit(message);
    }

    private function onRestart ()
    {
        Assert.fail(); // See subclasses
    }

    private var _loaders :Array<BasicAssetPackLoader>;
}
