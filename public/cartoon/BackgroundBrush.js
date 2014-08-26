
define(function (require, exports, module) {

var BackgroundBrush = function() {};

BackgroundBrush.generator = function(ctx, target){
	var color = target.bgColor || 'rgba(0,0,0,0)',
		gradient = target.bgGradient,
		image = target.bgImage,
		fillStyle;
	
	if (image) {
		if (image.complete) {
			fillStyle = ctx.createPattern(image, 'no-repeat');
		}
	} else if (gradient) {
		fillStyle = ctx.createLinearGradient(0, 0, 0, target.height);
		fillStyle.addColorStop(0.0, gradient[1]);
		fillStyle.addColorStop(1.0, gradient[2]);
	} else {
		fillStyle = color;
	}
	return fillStyle;
}

BackgroundBrush.toRGBA = function(color){
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

BackgroundBrush.toColor = function(rgba) {
	var r = rgba.r.toString(16),
		g = rgba.g.toString(16),
		b = rgba.b.toString(16);
	if (r.length===1) r = '0'+r;
	if (g.length===1) g = '0'+g;
	if (b.length===1) b = '0'+b;
	return '#'+r+g+b;
};

if (jQuery) {
	jQuery.extend( jQuery.fx.step, {
		backgroundColor: function( fx ) {
			var elem = fx.elem,
				start = BackgroundBrush.toRGBA(fx.start),
				end = BackgroundBrush.toRGBA(fx.end),
				pos = fx.pos;
			
			var result = {},
				style = elem.style;
				
			for (var i in end) {
				result[i] = Math.floor((end[i] - start[i])*pos + start[i]);
			}
		
			style.backgroundColor = BackgroundBrush.toColor(result);
		}
	});
}

return BackgroundBrush;
});