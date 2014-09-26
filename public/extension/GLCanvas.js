
define(function (require, exports, module) {
	"use strict";
	   
var DisplayObject = require('DisplayObject'),
 	THREE = require('../extension/THREE');
 	
var GLCanvas = DisplayObject.extend({
	
	_tagName: 'canvas',
	_gl: null,
	_useElemSize: true,
		
	init: function(props) {
		this._super(props);
		this._gl = this.elem.getContext('webgl') || this.elem.getContext('experimental-webgl');
	},
	
	eachChildren: function(func) {
		var children = this._children;
		
		for (var i=0,l=children.length; i<l; i++) {
			func(children[i], i);
		}
	},
		
	update: function() {
	 	  
	},
	
	draw: function(gl) {		
		drawScene();
	}
});
	
return GLCanvas;
});