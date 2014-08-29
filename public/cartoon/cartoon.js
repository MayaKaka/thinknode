
define(function (require, exports, module) {
   
var cartoon = jQuery.cartoon = {
	
	Class: require('Class'),
	Ticker: require('Ticker'),
	DisplayObject: require('DisplayObject'),
	Bitmap: require('Bitmap'),
	Sprite: require('Sprite'),
	Container: require('Container'),
	Canvas: require('Canvas'),
	Shape: require('Shape'),
	Text: require('Text'),
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