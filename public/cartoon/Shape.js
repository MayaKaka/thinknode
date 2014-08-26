
define(function (require, exports, module) {
   
var DisplayObject = require('DisplayObject'),
	Graphics2D = require('Graphics2D'),
	BackgroundBrush = require('BackgroundBrush');
	
var Shape = DisplayObject.extend({
	
	graphics2D: null,
	bgColor: null,
	bgGradient: null,
	bgImage: null,
	
	init: function(elem, props) {
		this._super(elem, props);
		this._initGraphics(props.graphics);
	},
	
	draw: function(ctx) {
		if (this.graphics2D) {
			this.graphics2D.draw.call(this, ctx);
		}
	},
	
	getFillStyle: function(ctx) {
		return BackgroundBrush.generator(ctx, this);
	},
	
	setBackground: function(graphics) {
		if (graphics.bgImage) {
			this.style('bgImage', graphics.bgImage);
		} else if(graphics.bgGradient) {
			this.style('bgGradient', graphics.bgGradient.split(','));
		} else {
			if (graphics.color.match(/top|right|bottom|left|center/g)) {
				this.style('bgGradient', graphics.color.split(','));
			} else if (graphics.color) {
				this.style('bgColor', graphics.color);
			}
		}
	},
	
	_initGraphics: function(graphics) {
		var type = graphics.type,
			graphics2D = type?Graphics2D[type]:graphics;

		if (graphics2D.init && graphics2D.draw) {
			this.graphics2D = graphics2D;
			graphics2D.init.call(this, graphics);
		}
	}
});

return Shape;
});