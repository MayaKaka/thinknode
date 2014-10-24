
define(function (require, exports, module) {
	"use strict";

var EventDispatcher = require('EventDispatcher');

var Loader = EventDispatcher.extend({
	
	_resources: null,
	_loadQueue: null,
	_loadQueueLength: -1,
	
	init: function() {
		this._resources = {};
		this._loadQueue = [];
	},
	
	load: function(manifest) {
		var len = this._loadQueueLength
				= manifest.length;
		
		for (var i=0; i<len; i++) {
			this._loadQueue.push({
				type: 'image',
				url: manifest[i]
			});
		}
		
		if (len) {
			this._loadNext();	
		}
	},
	
	loadFile: function(res) {
		if (res.type === 'image') {
			this._loadImage(res);
		}
	},
	
	getItem: function(url) {
		return this._resources[url];
	},
	
	addItem: function(url, file) {
		this._resources[url] = file;		
	},
	
	_loadComplete: function(file) {
		var progress = 1 - this._loadQueue.length / this._loadQueueLength;
		
		this.trigger({
			type: 'progress', progress: progress, file: file
		})
		
		if (progress < 1) {
			this._loadNext();
		} else {
			this.trigger({ type: 'complete' });
		}
	},
	
	_loadNext: function() {
		this.loadFile(this._loadQueue.shift());
	},
	
	_loadImage: function(res) {
		var self = this,
			image = new Image();
		
		image.src = res.url;
		image.onload = function(){
			self._loadComplete(image);
		};
		
		this.addItem(res.url, image);
	},
	
	_loadScript: function() {
		
	},
	
	_loadJSON: function() {
		
	}

});

return Loader;
});