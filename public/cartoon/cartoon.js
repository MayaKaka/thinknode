
define(function (require, exports, module) {
	"use strict";
	   
var cartoon = {
	
	// 基础组件
	Class: require('Class'),
	Ticker: require('Ticker'),
	// 渲染组件
	DisplayObject: require('DisplayObject'),
	Container: require('Container'),
	Canvas: require('Canvas'),
	Shape: require('Shape'),
	Bitmap: require('Bitmap'),
	Text: require('Text'),
	// 动画组件
	Tween: require('Tween'),
	Timeline:  require('Timeline'),
	Sprite: require('Sprite'),
	ParticleSystem: require('ParticleSystem'),
	BoneAnimation: require('BoneAnimation')
	
};

return cartoon;
});