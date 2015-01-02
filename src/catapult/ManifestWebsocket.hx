package catapult;

import haxe.Json;
import haxe.remoting.JsonRPC;
import catapult.Constants;
import js.Node;
import js.node.WebSocketServer;

@:expose("ManifestWebsocket")
class ManifestWebsocket
{
	var _websocketServer :WebSocketServer;
	var _manifestFileWatcher :ManifestFileWatcher;

	public function new (server :NodeNetServer)
	{
	}

	public function setWebsocketServer(server :WebSocketServer)
	{
		_websocketServer = server;
		return this;
	}

	public function createWebsocketServer(server :NodeHttpServer)
	{
		var serverConfig :WebSocketServerConfig = {httpServer:server, autoAcceptConnections:false};
		_websocketServer = new WebSocketServer();
		_websocketServer.on('connectFailed', onConnectFailed);
		_websocketServer.on('request', onWebsocketRequest);
		_websocketServer.mount(serverConfig);
		return this;
	}

	public function setManifestFileWatcher(manifestFileWatcher :ManifestFileWatcher)
	{
		_manifestFileWatcher = manifestFileWatcher;
		_manifestFileWatcher.on(Constants.MESSAGE_TYPE_FILE_CHANGED, onFileChanged);
		return this;
	}

	function onConnectFailed (error :Dynamic) :Void
	{
		Log.error("WebSocketServer connection failed: " + error);
	}

	function onWebsocketRequest (request :WebSocketRequest) :Void
	{
		Log.info("request.requestedProtocols: " + request.requestedProtocols);
		var protocol :String = null; ////For now, accept all requests.  This could be limited if required.
		var connection = request.accept(protocol, request.origin);

		var onError = function(error) {
			Log.error(' Peer ' + connection.remoteAddress + ' error: ' + error);
		}
		connection.on('error', onError);

		connection.on('message', function(message) {
	        if (message.type == 'utf8') {
	            Log.info('Received Message: ' + message.utf8Data);
	        }
	        else if (message.type == 'binary') {
	            Log.info('Received Binary Message of ' + message.binaryData.length + ' bytes');
	        }
	    });

		connection.once('close', function(reasonCode, description) {
			Log.info(Date.now() + ' client at "' + connection.remoteAddress + '" disconnected.');
			connection.removeListener('error', onError);
		});
	}

	function sendMessageToAllClients(msg :String)
	{
		var clientCount = 0;
		for (connection in _websocketServer.connections) {
			clientCount++;
		}
		Log.info({log:"Sending to " + clientCount + " clients", msg:msg});
		for (connection in _websocketServer.connections) {
			connection.sendUTF(msg);
		}
	}

	function onFileChanged(event :FileChangedEvent) :Void
	{
		Log.info("onFileChanged:" + event);

		//Refresh the ManifestServer, this updated the md5 values efficiently
		//Plus we want to do this before firing a websocket event so that the
		//data is refreshed before the client makes new requests
		_manifestFileWatcher.manifestServer.onFileChanged(event);

		var asset = event.asset;
		var messageRPC :RequestDef = {method:Constants.MESSAGE_TYPE_FILE_CHANGED, params:[{name:asset.name, md5:asset.md5, manifest:event.manifest.id, bytes:asset.bytes}], jsonrpc:"2.0"};
		sendMessageToAllClients(Json.stringify(messageRPC));
	}
}
