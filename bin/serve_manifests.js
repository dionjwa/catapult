#!/usr/bin/env node
// Executes nodejs script for serving manifests
var path = require('path');
var scriptPath = path.join(process.cwd(), process.argv[2] || 'catapult.js');
var assetsPath = process.argv[3] || './';
var manifests = require(scriptPath);
new manifests.catapult.ManifestServer.create()
	.setManifestsFolder(assetsPath)
	.createServer(8000);