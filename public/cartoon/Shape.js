
define(function (require, exports, module) {
   
var DisplayObject = require('DisplayObject'),
	Graphics2D = require('Graphics2D');

var supportIE6Filter = DisplayObject.supportIE6Filter,
	isIE9 = DisplayObject.isIE9;
	
var Shape = DisplayObject.extend({
	
	graphics2D: null,
	
	init: function(elem, props) {
		this._super(elem, props);
		this._initGraphics(props.graphics);
	},
	
	draw: function(ctx) {
		this.graphics2D.draw.call(this, ctx);
	},
	
	_initGraphics: function(graphics) {
		var type = graphics.type,
			graphics2D = type?Graphics2D[type]:graphics;

		if (graphics2D.init && graphics2D.draw) {
			this.graphics2D = graphics2D;
			graphics2D.init.call(this, graphics);
		}
	},
	
	_setColor: function(color) {
		if (color.match(/top|right|bottom|left|center/g)) {
			this._setGradient(color.split(','));
		} else {
			this.color = color;
			this.gradient = null;
				
			if (!this.renderInCanvas) {
				this.elemStyle.backgroundColor = this.color;	
			}
		}
	},
	
	_setGradient: function(gradient) {
		this.gradient = gradient;
			
		if (this.renderInCanvas) return;
		
		var style = this.elemStyle;
		// handle ie6-ie9 gradient filter
		if (supportIE6Filter || isIE9) {
			var filter = style.filter,
				regGradient = /gradient([^)]*)/,
				gradientText = 'gradient(GradientType=0,startColorstr=\''+gradient[1]+'\', endColorstr=\''+gradient[2]+'\'';
				
			style.filter = filter.match(regGradient) ? filter.replace(regGradient, gradientText) : (filter + ' progid:DXImageTransform.Microsoft.'+gradientText+')');	
			
		} else {
			var gradientText = '-linear-gradient('+gradient[0]+', '+gradient[1]+', '+gradient[2]+')';
			
			style.backgroundImage = gradientText;
			style.backgroundImage = '-webkit'+gradientText;
			style.backgroundImage = '-ms'+gradientText;
			style.backgroundImage = '-moz'+gradientText;
		}	
	},
	
	_colorGenerator: function(ctx){
		if (this.gradient) {
			var gradient = ctx.createLinearGradient(0, 0, 0, this.height);
			gradient.addColorStop(0.0, this.gradient[1]);
			gradient.addColorStop(1.0, this.gradient[2]);
			return gradient;
		} else {
			return this.color;
		}
	}
});

Shape.toRGBA = function(color){
	var rgba = {
		r: 0, g: 0, b: 0, a: 1
	};
	
	if (color.indexOf('rgb') > -1) {
		color = color.replace(/rgb\(|rgba\(|\)/g, '');
		color = color.split(',');
		rgba.r = parseInt(color[0]);
		rgba.g = parseInt(color[1]);
		rgba.b = parseInt(color[2]);
		if (color.length === 4) {
			rgba.a = color[3];
		}
	} else if(color.indexOf('#') > -1) {
		if (color.length === 4) {
			rgba.r = color.substring(1,2);
			rgba.g = color.substring(2,3);
			rgba.b = color.substring(3,4);
			rgba.r = parseInt(rgba.r+rgba.r, 16);
			rgba.g = parseInt(rgba.g+rgba.g, 16);
			rgba.b = parseInt(rgba.b+rgba.b, 16);
		} else {
			rgba.r = parseInt(color.substring(1,3), 16);
			rgba.g = parseInt(color.substring(3,5), 16);
			rgba.b = parseInt(color.substring(5,7), 16);
		}
	}
	
	return rgba;
};

Shape.toColor = function(rgba) {
	var r = rgba.r.toString(16),
		g = rgba.g.toString(16),
		b = rgba.b.toString(16);
	if (r.length===1) r = '0'+r;
	if (g.length===1) g = '0'+g;
	if (b.length===1) b = '0'+b;
	return '#'+r+g+b;
};

// jQuery plus
jQuery.extend( jQuery.fx.step, {
	backgroundColor: function( fx ) {
		var elem = fx.elem,
			start = Shape.toRGBA(fx.start),
			end = Shape.toRGBA(fx.end),
			pos = fx.pos;
		
		var result = {},
			style = elem.style;
			
		for (var i in end) {
			result[i] = Math.floor((end[i] - start[i])*pos + start[i]);
		}
	
		style.backgroundColor = Shape.toColor(result);
	}
});

return Shape;
});