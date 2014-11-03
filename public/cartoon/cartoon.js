
define(function (require, exports, module) {
	"use strict";
	   
var cartoon = {
	
	// 基础组件
	Class: require('Class'),
	Ticker: require('Ticker'),
	Loader: require('Loader'),
	Preload: require('Preload'),
	// 渲染组件
	StyleSheet: require('StyleSheet'),
	DisplayObject: require('DisplayObject'),
	Container: require('Container'),
	Canvas: require('Canvas'),
	Graphics2D: require('Graphics2D'),
	Shape: require('Shape'),
	Filter: require('Filter'),
	Bitmap: require('Bitmap'),
	Text: require('Text'),
	// 动画组件
	Tween: require('Tween'),
	Timeline:  require('Timeline'),
	Sprite: require('Sprite'),
	ParticleEmitter: require('ParticleEmitter'),
	ParticleSystem: require('ParticleSystem'),
	SkeletalAnimation: require('SkeletalAnimation')
	
};

return cartoon;
});