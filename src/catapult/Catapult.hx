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

typedef ServedManifestMessage = {
	var manifest :ServedManifest;
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
	inline public static var FILE_CHANGED_MESSAGE_NAME :String = "file_changed"; 
	inline public static var FILE_CHANGED_MESSAGE_NAME_ODS :String = "file_changed_ods";
}
