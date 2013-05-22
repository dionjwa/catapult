[haxe]:http://http://haxe.org
[haxe3]:http://haxe.org/manual/haxe3
[flambe]:http://lib.haxe.org/p/flambe
[wafl]:https://github.com/aduros/flambe/wiki/Wafl
[nodejs]:http://nodejs.org/
[hxods]:https://github.com/ncannasse/hxods

# Catapult: Automatic asset updater and server.

Why: decrease the game development iteration loop to be as tight as possible.

How: Catapult detects changes in assets, source, and game data files, and is available to notify the game client is different ways: a pushed notification via websockets, or through http polling.

The game client can then download new assets, or perform other functions, e.g.

- Download and reload image textures so that as soon as you save a texture file your game client can reload it at runtime.
- Download parsed Json of spreadsheet data ([hxods format][hxods]).
- Reload the game client (e.g. an HTML5 game upon detection of source code change).

The main goal is to see changes in your game as soon as any change is detected for super-fast iteration.

## Installation

Build from source or install via npm (easier).

### Install from source:

The server is at the currently in the experimental stage and is written for [Haxe 3][haxe3], but is platform/language agnostic.  

Clone this repo and add required dependencies:

	git clone --recursive git://github.com/dionjwa/catapult.git
	cd catapult
	npm install websocket
	npm install commander
	npm install node-static
	npm install source-map-support
	haxelib install nodejs_std
	haxelib install nodejs_externs
	haxelib install format
	haxe build.hxml
	
And run with: 

	node build/index.js --watch=demo/assets/bootstrap
	

### Install via npm

	npm install catapult
	
And run with: 

	node node_modules/catapult/index.js --watch=demo/assets/bootstrap
	
### Using the server
	
Then try these URLs in your web browser:

	http://localhost:8000/manifests.json
	http://localhost:8000/bootstrap/stuff/test.ods
	http://localhost:8000/bootstrap/stuff/gamedata.ods
	http://localhost:8000/bootstrap/manifest.json
	
To test the websockets, you need the Chrome web browser.
	
	Install [this plugin](https://chrome.google.com/webstore/detail/simple-websocket-client/pfdhoblngboilpfeibdedpjgfnlcodoo)
	Open the Simple Websocket Client.
	In the URL field, enter "localhost:8000" and click "Open".
	Open demo/assets/bootstrap/stuff/gamedata.json, and change something and save it (e.g. just enter few times for some new lines).
	You should see the websocket message in the Chrome client.

Ideally you'll want to add some client code to poll or query the server or listen to the websocket messages.  I'll be adding some example client reloading using [Flambe][flambe] soon.
	
## Vagrant:

This won't mean much to anyone right now, it's just my own personal notes to getting the vagrant server running.

Server:

	vagrant up
	vagrant ssh -c "sudo rm -rf /Users"
	vagrant ssh -c "sudo mkdir -p /Users/dion/storage/projects/haxelibs/"
	vagrant ssh -c "sudo chown -R vagrant /Users"
	vagrant ssh -c "cd /Users/dion/storage/projects/haxelibs; sudo ln -s /vagrant flambes"
	vagrant ssh
	cd /vagrant
	haxe -v --wait 0.0.0.0:4001
	
Client:

	haxe --cwd /vagrant build.hxml --connect 4000
	
The port 4001 is mapped to port 4000 on the host via the Vagrantfile.
	



