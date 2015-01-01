package catapult;

typedef WatchedFile = {
	var md5 :String;
	// var type :String;
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

typedef ODSData = {
	var h :Map<String, Array<Dynamic>>;
}

typedef ODSDataChangedMessage = {>FileChangedMessage,
	var data :ODSData;
}

class Catapult
{
	inline public static var MESSAGE_TYPE_RESTART_ :String = "restart";
	inline public static var MESSAGE_TYPE_FILE_CHANGED :String = "file_changed";
	inline public static var MESSAGE_TYPE_FILE_CHANGED_ODS :String = "file_changed_ods";
}
