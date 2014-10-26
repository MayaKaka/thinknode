
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
		var light = new THREE.DirectionalLight( 0xffffff );
		// var light = new THREE.PointLight( 0xffffff, 1, 500 );
		
		this._scene.add( light );
		
		return light;
	},
	
	addPlane: function() {
		// 构建图形-平面
		var geometry = new THREE.PlaneGeometry( 200, 200 );
		// 构建平面材质
		var material = new THREE.MeshLambertMaterial( { color: 0xe0e0e0, overdraw: 0.5 } );
		// 生成平面网格
		var plane = new THREE.Mesh( geometry, material );
		
		this._scene.add( plane );
		
		return plane;
	},
	
	addCube: function(data) {
		// 构建图形-立方体
		var geometry = new THREE.BoxGeometry( 100, 100, 100 );
		
		for ( var i = 0; i < geometry.faces.length; i += 2 ) {
			// 设置立方体表面颜色
			var hex = data.color || 0x808080; // Math.random() * 0xffffff;
			geometry.faces[ i ].color.setHex( hex );
			geometry.faces[ i + 1 ].color.setHex( hex );
		}
		// 构建立方体材质
		var material = new THREE.MeshLambertMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
		// 生成立方体网格
		var cube = new THREE.Mesh( geometry, material );
		
		this._scene.add( cube );
		
		return cube;
	},
	
	addSphere: function(data) {
		// 构建图形-球体
		var geometry = new THREE.SphereGeometry( data.radius || 50, 16, 16 );
		// 创建球体表面的材质 
		var material = new THREE.MeshLambertMaterial( { color: data.color || 0xCC0000, overdraw: 0.5 } );
		// 生成球体网格
		var sphere = new THREE.Mesh( geometry, material ); 

		this._scene.add(sphere);
		
		return sphere;
	},
	
	addSprite: function() {
		var program = function( ctx ) {
			ctx.beginPath();
			ctx.arc( 0, 0, 0.5, 0, Math.PI * 2, true );
			ctx.fill();
		}
		// 创建图像表面材质
		var material = new THREE.SpriteCanvasMaterial( { color: 0xff0040, program: program } );
		// 生成图像
		var sprite = new THREE.Sprite( material );
		
		return sprite;
	},
	
	_initRenderer: function() {
		var alpha = false;
		var renderer = new THREE.WebGLRenderer({ canvas: this.elem, antialias: true, alpha: alpha });
		renderer.setSize( this.width, this.height );
		
		this._renderer = renderer;
	},
	
	_initScene: function() {
		var scene = new THREE.Scene();
		var	camera = new THREE.PerspectiveCamera( 70, this.width / this.height, 0.1, 1000 );
		
		camera.position.z = 500;
		
		this._scene = scene;
		this._camera = camera;
	}

});

return GLCanvas;
});