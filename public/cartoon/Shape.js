
define(function (require, exports, module) {
	"use strict";
	   
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
			switch (gradient[0]) {
				case 'top': case 'bottom':
					style = ctx.createLinearGradient(0, 0, 0, this.height);
					break;
				case 'left': case 'right':
					style = ctx.createLinearGradient(0, 0, this.width, 0);
					break;
				case 'left top':
					style = ctx.createLinearGradient(0, 0, this.width, this.height);
					break;
				case 'right top':
					style = ctx.createLinearGradient(this.width, 0, 0, this.height);
					break;
				case 'center':
					var radiusX = this.width/2,
						radiusY = this.height/2;
					style = ctx.createRadialGradient(radiusX, radiusY, 0, radiusX, radiusY, radiusX>radiusY?radiusX:radiusY);
					break;
			}
			style.addColorStop(0.0, gradient[1]);
			style.addColorStop(1.0, gradient[2]);
		} else {
			style = color;
		}
		if (style) {
			ctx.fillStyle = style;
			return true;
		}
		return false;
	},
	
	strokeStyle: function(ctx) {
		var style = this.strokeColor;
		if (style) {
			ctx.strokeStyle = style;
			ctx.lineWidth = this.lineWidth || 1;
			ctx.lineCap = this.lineCap || 'round';
			return true;
		}
		return false;
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