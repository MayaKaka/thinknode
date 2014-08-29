
define(function (require, exports, module) {
   
var DisplayObject = require('DisplayObject'),
	Graphics2D = require('Graphics2D');
	
var Shape = DisplayObject.extend({
	
	graphics2D: null,
	snapToPixel: true,
	
	init: function(props) {
		this._super(props);
		this._initGraphics(props.graphics);
	},
	
	draw: function(ctx) {
		if (this.graphics2D) {
			this.graphics2D.draw.call(this, ctx);
		}
	},
	
	fillStyle: function(ctx) {
		var color = this.fillColor,
			gradient = this.fillGradient,
			image = this.fillImage,
			style;		
		if (image) {
			if (image.complete) {
				style = ctx.createPattern(image, 'no-repeat');
			}
		} else if (gradient) {
			style = ctx.createLinearGradient(0, 0, 0, this.height);
			style.addColorStop(0.0, gradient[1]);
			style.addColorStop(1.0, gradient[2]);
		} else {
			style = color;
		}
		return style;
	},
	
	strokeStyle: function(ctx) {
		return this.strokeColor;
	},
		
	_initGraphics: function(graphics) {
		var type = graphics.type,
			graphics2D = type? Graphics2D.get(type): graphics;

		if (graphics2D && graphics2D.init && graphics2D.draw) {
			this.graphics2D = graphics2D;
			graphics2D.init.call(this, graphics);
		}
	}
});

return Shape;
});