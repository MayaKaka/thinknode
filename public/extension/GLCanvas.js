
define(function (require, exports, module) {
	"use strict";
	   
var DisplayObject = require('DisplayObject'),
	THREE = require('../extension/THREE');
	
var GLCanvas = DisplayObject.extend({
	
	_tagName: 'canvas',
	_useElemSize: true,
		
	init: function(props) {
		this._super(props);
		this._initRenderer();
		this._initScene();
	},
	
	update: function(delta) {
		var renderer = this._renderer,
			scene = this._scene,
			camera = this._camera;
			
		renderer.render( scene, camera );
	},
	
	addLight: function() {
		
	},
	
	addCube: function() {
		var geometry = new THREE.BoxGeometry(1,1,1);
		var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		var cube = new THREE.Mesh( geometry, material );
		
		this._scene.add( cube );
		
		return cube;
	},
	
	_initRenderer: function() {
		var renderer = new THREE.WebGLRenderer({ canvas: this.elem, alpha: true });
		renderer.setSize( this.width, this.height );
		
		this._renderer = renderer;
	},
	
	_initScene: function() {
		var scene = new THREE.Scene();
		var	camera = new THREE.PerspectiveCamera( 70, this.width / this.height, 0.1, 1000 );
		
		camera.position.z = 5;
		
		this._scene = scene;
		this._camera = camera;
	}

});

return GLCanvas;
});