
define(function (require, exports, module) {
   
var cartoon = jQuery.cartoon = {
	
	Class: require('Class'),
	Ticker: require('Ticker'),
	DisplayObject: require('DisplayObject'),
	Bitmap: require('Bitmap'),
	Sprite: require('Sprite'),
	Canvas: require('Canvas'),
	Shape: require('Shape'),
	Text: require('Text'),
	ParticleSystem: require('ParticleSystem'),
	BoneAnimation: require('BoneAnimation')
};

var createDisplayObject = function(props){
	if (!props) {
		props = { type: 'DisplayObject' };
	}			
		
	var type = props.type || 'DisplayObject',
		object = null;
		
	if (cartoon[type]) {
		object = new cartoon[type](this instanceof jQuery? this: null, props);
	}

	return object;
};

jQuery.extend({
	cartoon: createDisplayObject
});

jQuery.fn.extend({
	cartoon: createDisplayObject
});

return cartoon;

});