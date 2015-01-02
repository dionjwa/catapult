#!/usr/bin/env node
// Executes nodejs script for serving manifests
var path = require('path');
var assetsPath = process.argv[2] || './';

var catapult = require(path.join(__dirname, '../lib/catapult.js'));

var manifestServer = new catapult.ManifestServer()
	.setManifestsFolder(assetsPath)
	.createServer(8000);
