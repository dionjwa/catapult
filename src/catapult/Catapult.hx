package catapult;

typedef WatchedFile = {
	var md5 :String;
	var type :String;
	var relativePath :String;
	var absolutePath :String;
	var manifestKey :String;
}

typedef FileDef = {
	var path :String;
	var md5 :String;
}

typedef ManifestData = {
	var md5 :String;
	var assets :Array<WatchedFile>;
	var id :String;
	var relativePath :String;
}

typedef ServedManifestData = {
	var md5 :String;
	var assets :Array<FileDef>;
	var id :String;
}

typedef FileChangedMessage = {>FileDef,
	var type :String;
	var manifest :String;
}

typedef ODSDataChangedMessage = {>FileChangedMessage,
	var data :Dynamic;
}
