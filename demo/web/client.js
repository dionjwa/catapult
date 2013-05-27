String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var images = {};
var imageWidth = 128;
var imageHeight = 128;

function updateImages(data) {
	//Create the dom element to hold them
	// console.log("updating images");
	var imageContainer = document.getElementById("image_container");
	
	var map = data.h;
	var items = map.$items;
	
	for (var i=0; i<items.length; i++) {
		var item = items[i];
		var imageId = "image_" + i;
		var image = document.getElementById(imageId);
		if (image == null) {
			image = new Image();
			image.style.position = 'absolute';
			image.id = imageId;
			image.src=' http://localhost:8000/bootstrap/images/flameling.png';
			imageContainer.appendChild(image);
		}
		
		image.style.left = item.x + "px";
		image.style.top = item.y + "px";
		image.style.width = (item.scale * imageWidth) + "px";
		image.style.height = (item.scale * imageHeight) + "px";
	}
}


var connection = new WebSocket('ws://localhost:8000');

// When the connection is open, send some data to the server
connection.onopen = function () {
	console.log("Websocket opened");
	// connection.send('Ping'); // Send the message 'Ping' to the server
};

// Log errors
connection.onerror = function (error) {
	console.log('WebSocket Error ' + error);
};



// Log messages from the server
connection.onmessage = function (e) {
	// console.log('Websocket message received');
	// console.log('Server: ' + e.data);
	
	var jsonMessage = JSON.parse(e.data);
	
	if (jsonMessage.type == "file_changed") {
		if (jsonMessage.path.endsWith(".js")) {
			window.location.reload();
		}
	}
	
	if (jsonMessage.type == "file_changed_ods" && jsonMessage.path == "stuff/test.ods") {
		updateImages(jsonMessage.data);
	}
};

//Request the initial spreadsheet data to show the image layout
var request=new XMLHttpRequest();
request.open("GET", "http://localhost:8000/bootstrap/stuff/test.ods", false);
request.send(null);
updateImages(JSON.parse(request.responseText));
