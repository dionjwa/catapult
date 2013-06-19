String.prototype.endsWith = function(suffix) 
{
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var images = {};
var imageWidth = 128;
var imageHeight = 128;
var imageData = null;
var imageUrl = 'http://localhost:8000/bootstrap/images/flameling.png';

function updateImages(data, customUrl) 
{
	imageData = data;
	
	var url = imageUrl;
	
	if (customUrl != null)
	{
		url = customUrl;
	}
	
	//Create the dom element to hold them
	// console.log("updating images");
	var imageContainer = document.getElementById("image_container");
	
	var map = data.h;
	var items = map.$items;
	
	for (var i=0; i<items.length; i++) 
	{
		var item = items[i];
		var imageId = "image_" + i;
		var imageDiv = document.getElementById(imageId);
		if (imageDiv == null) 
		{
			imageDiv = document.createElement('div');
			imageDiv.style.position = 'absolute';
			imageDiv.id = imageId;
			imageContainer.appendChild(imageDiv);
			
			var image = new Image();
			imageDiv.appendChild(image);
			image.src=url;
		}
		
		var image = imageDiv.children.item(0);
		
		if (customUrl != null)
		{
			image.src=url;
		}
		
		imageDiv.style.left = item.x + "px";
		imageDiv.style.top = item.y + "px";
		image.style.width = (item.scale * imageWidth) + "px";
		image.style.height = (item.scale * imageHeight) + "px";
	}
}


var connection = new WebSocket('ws://localhost:8000');

// When the connection is open, send some data to the server
connection.onopen = function () 
{
	console.log("Websocket opened");
	// connection.send('Ping'); // Send the message 'Ping' to the server
};

// Log errors
connection.onerror = function (error) 
{
	console.log('WebSocket Error ' + error);
};



// Log messages from the server
connection.onmessage = function (e) 
{
	console.log('Websocket message received:\n' + e.data);
	
	var jsonMessage = JSON.parse(e.data);
	
	if (jsonMessage.type == "file_changed") 
	{
		if (jsonMessage.name.endsWith(".js")) 
		{
			window.location.reload();
		} 
		else if (jsonMessage.name.endsWith(".png")) 
		{
			if (jsonMessage.name.endsWith("flameling.png"))
			{
				console.log("Updating image");
				updateImages(imageData, imageUrl + "?md5=" + jsonMessage.md5);
			}
		}
	}
	
	if (jsonMessage.type == "file_changed_ods" && jsonMessage.name == "stuff/test.ods") {
		updateImages(jsonMessage.data);
	}
};

//Request the initial spreadsheet data to show the image layout
var request=new XMLHttpRequest();
request.open("GET", "http://localhost:8000/bootstrap/stuff/test.ods", false);
request.send(null);
updateImages(JSON.parse(request.responseText));
