package catapult;

import catapult.Constants;

import js.Node;

import sys.FileSystem;

using StringTools;

@:expose("ManifestFileWatcher")
class ManifestFileWatcher
	implements NodeEventEmitter
{
	public var manifestServer (default, set) :ManifestServer;
	var _eventEmitter :NodeEventEmitter;

	public function new ()
	{
		var events = Node.require('events');
		_eventEmitter = untyped __js__('new events.EventEmitter()');
	}

	public function setManifestServer(manifestServer :ManifestServer)
	{
		set_manifestServer(manifestServer);
		return this;
	}

	public function addListener(event:String,fn:NodeListener):Dynamic
	{
		return _eventEmitter.addListener(event, fn);
	}
	public function on(event:String,fn:NodeListener):Dynamic
	{
		return _eventEmitter.on(event, fn);
	}
	public function once(event:String,fn:NodeListener):Void
	{
		_eventEmitter.once(event, fn);
	}
	public function removeListener(event:String,listener:NodeListener):Void
	{
		_eventEmitter.removeListener(event, listener);
	}
	public function removeAllListeners(event:String):Void
	{
		_eventEmitter.removeAllListeners(event);
	}
	public function listeners(event:String):Array<NodeListener>
	{
		return _eventEmitter.listeners(event);
	}
	public function setMaxListeners(m:Int):Void
	{
		_eventEmitter.setMaxListeners(m);
	}
	public function emit(event:String,?arg1:Dynamic,?arg2:Dynamic,?arg3:Dynamic):Void
	{
		_eventEmitter.emit(event, arg1, arg2, arg3);
	}

	function watchManifestFiles()
	{
		var manifests = manifestServer.manifests.manifests;
		var root = manifestServer.manifestsPath;
		for(directory in Reflect.fields(manifests)) {
			var directoryAbsPath = Node.path.join(root, directory);
			var manifest :ServedManifest = Reflect.field(manifests, directory);
			for(asset in manifest.assets) {
				var assetPathAbs = Node.path.join(root, directory, asset.name);
				// trace(assetPathAbs);
				watchFileSuperReliable(assetPathAbs, function(path) {
					onFileChange(manifest, asset, assetPathAbs);
				});
			}
		}
	}

	function onFileChange(manifest :ServedManifest, asset :FileDef, fullPath :String)
	{
		var event :FileChangedEvent = {absolutePath:fullPath, manifest:manifest, asset:asset};
		emit(Constants.MESSAGE_TYPE_FILE_CHANGED, event);
	}

	function set_manifestServer(manifestServer :ManifestServer)
	{
		this.manifestServer = manifestServer;
		watchManifestFiles();
		return manifestServer;
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
							Log.error({log:"NodeFSWatcher:error, retrying", error:err, path:filePath});
							haxe.Timer.delay(watchFileSuperReliable.bind(filePath, onFileChanged, failureRetryDelayMs * 2), failureRetryDelayMs);
						});
				} else {
					Log.warn("Asked to watch but doesn't exist (but retrying): " + filePath);
					haxe.Timer.delay(watchFileSuperReliable.bind(filePath, onFileChanged, failureRetryDelayMs * 2), failureRetryDelayMs);
				}
			});
	}
}

interface NodeEventEmitter
{
	public function addListener(event:String,fn:NodeListener):Dynamic;
	public function on(event:String,fn:NodeListener):Dynamic;
	public function once(event:String,fn:NodeListener):Void;
	public function removeListener(event:String,listener:NodeListener):Void;
	public function removeAllListeners(event:String):Void;
	public function listeners(event:String):Array<NodeListener>;
	public function setMaxListeners(m:Int):Void;
	public function emit(event:String,?arg1:Dynamic,?arg2:Dynamic,?arg3:Dynamic):Void;
}
