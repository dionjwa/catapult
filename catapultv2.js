#!/usr/bin/env node

var watch = require('watch');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var util = require('util');

var rootPath = "./";
var options = {"ignoreDotFiles":true};
var files = null;
var file2Manifest = {};
var manifests = {};
var ignoreFiles = {
	"./" : true
}

function getFileMd5(filePath) {
	var shasum = crypto.createHash('md5');
	shasum.update(fs.readFileSync(path.join(rootPath, filePath)));
	return shasum.digest('hex');
}

function addMd5ToManifest(manifestObj) {
	var s = '';
	var manifests = manifestObj["manifests"];
	for(manifestKey in manifests) {
		var manifest = manifests[manifestKey];
		var md5String = '';
		for (f in manifest.assets) {
			md5String += f.md5;
		}
		manifest.md5 = crypto.createHash("md5").update(md5String).digest("hex");
		s += manifest.md5;
	}
	manifestObj.md5 = crypto.createHash("md5").update(s).digest("hex");
}

function createManifest(filehash) {
	var manifests = {};
	for(file in filehash) {
		if(file in ignoreFiles) {
			continue;
		}
		var pathTokens = file.split(path.sep);
		var manifestKey = pathTokens.shift();
		var fullPath = path.join(rootPath, file);

		if(fs.lstatSync(path.join(rootPath, manifestKey)).isDirectory()) {
			if(!(manifestKey in manifests)) {
				manifests[manifestKey] = {"assets":[], "id":manifestKey, "md5":null};
			}
		}
		if (fs.lstatSync(fullPath).isFile()) {
			if (pathTokens.length == 0) {
				//Ignore files in the root folder
				continue;
			}
			manifests[manifestKey]["assets"].push({"name":pathTokens.join("/"), "md5":filehash[file].md5, "bytes":filehash[file].size});
			file2Manifest[file] = manifestKey;
		} else {
		}
	}
	manifests = {"manifests":manifests, "md5":null};
	addMd5ToManifest(manifests);
	return manifests;
}

var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({port: 8080});

wss.on('connection', function connection(ws) {
	console.log("Connection", ws);
	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
	});
});

function broadcastMessage(message) {
	for(var i in wss.clients) {
	    wss.clients[i].send(message);
	}
}


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
							Console.error({log:"NodeFSWatcher:error, retrying", error:err, path:filePath});
							haxe.Timer.delay(watchFileSuperReliable.bind(filePath, onFileChanged, failureRetryDelayMs * 2), failureRetryDelayMs);
						});
				} else {
					Console.warn("Asked to watch but doesn't exist (but retrying): " + filePath);
					haxe.Timer.delay(watchFileSuperReliable.bind(filePath, onFileChanged, failureRetryDelayMs * 2), failureRetryDelayMs);
				}
			});
	}

watch.watchTree(rootPath, options, function (f, curr, prev) {
    if (typeof f == "object" && prev === null && curr === null) {
    	// Finished walking the tree
    	// console.log("finished", f);
    	
    	files = f;
    	// createManifest(files);
    	for(file in files) {
    		if(fs.lstatSync(path.join(rootPath, file)).isFile()) {
    			files[file]['md5'] = getFileMd5(file);
    		}
    	}
    	manifests = createManifest(files);
    	// console.log(util.inspect(manifests, {showHidden: false, depth: null}));
    	console.log(manifests);
    } else if (prev === null) {
	    // f is a new file
	    // console.log("adding ", f);
    } else if (curr.nlink === 0) {
    	// f was removed
    	console.log("removing ", f);
    	delete file2Manifest[f];
    } else {
		// f was changed
		console.log("changed ", f);
		var messageRPC = {method:'file_changed', params:[{name:f, md5:files[f].md5, manifest:file2Manifest[file], bytes:files[f].size}]};
		messageString = JSON.stringify(messageRPC);
		broadcastMessage(messageString);
		// sendMessageToAllClients(messageString);
    }
  });
