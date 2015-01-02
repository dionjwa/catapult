package catapult;

typedef FileChangedEvent = {
	var absolutePath :String;
	var manifest :ServedManifest;
	var asset :FileDef;
}

typedef WatchedFile = {
	var md5 :String;
	var bytes :Int;
	var relativePath :String;
	var absolutePath :String;
	var manifestKey :String;
}

typedef FileDef = {
	var name :String;
	var md5 :String;
	var bytes :Int;
}

typedef ManifestData = {
	var md5 :String;
	var assets :Array<WatchedFile>;
	var id :String;
	var relativePath :String;
}

typedef ServedManifest = {
	var md5 :String;
	var assets :Array<FileDef>;
	var id :String;
}

typedef ServedManifestsMessage = {
	var manifests :Dynamic<ServedManifest>;
	var md5 :String;
}

typedef ServedManifestMessage = {
	var manifest :ServedManifest;
}

typedef Message = {
	var type :String;
}

typedef FileChangedMessage = {>FileDef,
	var type :String;
	var manifest :String;
}

@:expose("Constants")
class Constants
{
	inline public static var MESSAGE_TYPE_RESTART_ :String = "catapult.restart";
	inline public static var MESSAGE_TYPE_FILE_CHANGED :String = "catapult.file_changed";
}
