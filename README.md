[haxe]:http://http://haxe.org
[haxe3]:http://haxe.org/manual/haxe3
[flambe]:http://lib.haxe.org/p/flambe
[wafl]:https://github.com/aduros/flambe/wiki/Wafl
[nodejs]:http://nodejs.org/
[hxods]:https://github.com/ncannasse/hxods

# Catapult: Automatic asset updater and server.

Why: decrease the game development iteration loop to be as short as possible.

How: Catapult detects changes in assets, source, and game data files, and is available to notify the game client is different ways: a pushed notification via websockets, or through http polling.

The game client can then download new assets, or perform other functions, e.g.

- Download and reload image textures so that as soon as you save a texture file your game client can reload it at runtime.
- Download parsed Json of spreadsheet data ([hxods format][hxods]).
- Reload the game client (e.g. an HTML5 game upon detection of source code change).

The main goal is to see changes in your game as soon as any change is detected for super-fast iteration.

## Installation

### Install via npm

	npm install catapult

Install the demo folder

	git clone --recursive git://github.com/dionjwa/catapult.git

And run the catapult server with with: 

	catapult --config=catapult/demo/.catapult_js

Then in a browser go to:

	http://localhost:8000	
	
	
Then open the "test.ods" file in LibreOffice.  You can edit the x, y, and scale values, and the images will be automatically updated.

Open up an image editor, and change the flameling.png.  Saves changes will be automatically loaded.

See demo/web/client.js for an example HTML5 implementation of a catapult client.

### Flambe demo

Build the client with 

	haxe demo/client.hxml
	
Then run the server with
	
	catapult --config=demo/.catapult_flambe
	
	
See demo/src/demo/FlambeClient.hx for an example Flambe implementation of a catapult client.

![screenshot](demo/catapult_demo.png)


Also, change assets such as images and see instant client updates:

![screenshot](demo/catapult_demo2.png)
	


Also, try these URLs in your web browser to see the data format of the asset manifests, and spreadsheet data returned:

	http://localhost:8000/manifests.json
	http://localhost:8000/bootstrap/stuff/test.ods
	http://localhost:8000/bootstrap/stuff/gamedata.json
	http://localhost:8000/bootstrap/manifest.json
	
## Building your own client 

The catapult server is platform agnostic: you can simply poll the asset server from any client using http requests. 
