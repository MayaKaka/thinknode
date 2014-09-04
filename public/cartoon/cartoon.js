
define(function (require, exports, module) {
	"use strict";
	   
var cartoon = jQuery.cartoon = {
	
// Base Classes	
	Class: require('Class'),
	Ticker: require('Ticker'),

// Display Classes
	DisplayObject: require('DisplayObject'),
	Container: require('Container'),
	Canvas: require('Canvas'),
	Bitmap: require('Bitmap'),
	Shape: require('Shape'),
	Text: require('Text'),
	
// Animation Classes
	Sprite: require('Sprite'),
	Timeline:  require('Timeline'),
	ParticleSystem: require('ParticleSystem'),
	BoneAnimation: require('BoneAnimation')
	
};

var createDisplayObject = function(props){
	if (!props) {
		props = { type: 'DisplayObject' };
	}			
		
	var type = props.type || 'DisplayObject',
		object = null;
	
	if (this instanceof jQuery) {
		props.elem = this[0]; 
	}
		
	if (cartoon[type]) {
		object = new cartoon[type](props);
	}

	return object;
};

if (jQuery) {
	jQuery.extend({
		cartoon: createDisplayObject
	});
	
	jQuery.fn.extend({
		cartoon: createDisplayObject
	});
}

return cartoon;
});