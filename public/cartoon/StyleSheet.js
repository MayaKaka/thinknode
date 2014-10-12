
define(function (require, exports, module) {
	
var divStyle = document.createElement('div').style,
	supportTransform = divStyle.transform === '' || divStyle.webkitTransform === '' || divStyle.msTransform === '' || divStyle.MozTransform === '',
	supportIE6Filter = supportTransform? false : divStyle.filter === '',
    isIE9 = navigator.userAgent.indexOf("MSIE 9.0")>0,
    prefix = divStyle.webkitTransform === ''? 'webkit' :
    		 divStyle.WebkitTransform === ''? 'Webkit' :
    		 divStyle.msTransform === ''? 'ms' :
    		 divStyle.MozTransform === ''? 'Moz' : '';
    		 
var StyleSheet = function() {};

StyleSheet.has = function(key) {
	return !!StyleSheet.styles[key];
}

StyleSheet.init = function(target, key) {
	var style = StyleSheet.styles[key];
			
	if (style && style.init) {
		return style.init(target, key);
	}
}

StyleSheet.get = function(target, key) {
	var style = StyleSheet.styles[key];
			
	if (style) {
		return style.get(target, key);
	}
}

StyleSheet.set = function(target, key, value) {
	var style = StyleSheet.styles[key];
			
	if (style) {
		style.set(target, key, value);
	}
}

StyleSheet.step = function(target, key, value) {
	var style = StyleSheet.styles[key];
			
	if (style && style.step) {
		style.step(target, key, value);
	}
}

StyleSheet.commonGetStyle = function(target, key) {
	return target[key];
};

StyleSheet.commonSetStyle = function(target, key, value) {
	target[key] = value;
};

StyleSheet.commonSetElemStyle = function(style, key, value) {
	var suffix = key.charAt(0).toUpperCase() + key.substring(1, key.length);
	style[prefix+suffix] = value;
};

StyleSheet.commonStepStyle = function(target, key, fx) {
	var start = fx.start,
		end = fx.end,
		pos = fx.pos;	
	var result = (end - start) * pos + start;
	target.style(key, result);
};

StyleSheet.commonStepStyles = function(target, key, fx) {
	var start = fx.start,
		end = fx.end,
		pos = fx.pos,
		result = {};
	for (var i in end) {
		result[i] = (end[i] - start[i]) * pos + start[i];
	}
	target.style(key, result);
};

StyleSheet.styles = {
	x: {
		get: StyleSheet.commonGetStyle,
		set: function(target, key, value) {
			StyleSheet.commonSetStyle(target, key, value);
			if (target.renderMode === 0) {
				var style = target.elemStyle;
				style.position = 'absolute';
				style.left = value + 'px';
			}
		},
		step: StyleSheet.commonStepStyle
	},
	
	y: {
		get: StyleSheet.commonGetStyle,
		set: function(target, key, value) {
			StyleSheet.commonSetStyle(target, key, value);
			if (target.renderMode === 0) {
				var style = target.elemStyle;
				style.position = 'absolute';
				style.top = value + 'px';
			}
		},
		step: StyleSheet.commonStepStyle
	},
	
	z: {
		get: StyleSheet.commonGetStyle,
		set: function(target, key, value) {
			StyleSheet.commonSetStyle(target, key, value);
			target.style('transform3d', { perspective: value });
		},
		step: StyleSheet.commonStepStyle
	},
	
	pos: {
		get: function(target, key) {
			return {
				x: target.x,
				y: target.y
			}
		},
		set: function(target, key, value) {
			if (value.x !== undefined) target.x = value.x;
			if (value.y !== undefined) target.y = value.y;
			if (target.renderMode === 0) {
				var style = target.elemStyle;
				style.position = 'absolute';
				style.left = target.x + 'px';
				style.top = target.y + 'px';
			}
		},
		step: StyleSheet.commonStepStyles
	},
	
	width: {
		get: StyleSheet.commonGetStyle,
		set: function(target, key, value) {
			StyleSheet.commonSetStyle(target, key, value);
			if (target.renderMode === 0) {
				if (target._useElemSize) {
					target.elem.width = value;
				} else {
					target.elemStyle.width = value + 'px';
				}
			}
		},
		step: StyleSheet.commonStepStyle
	},
	
	height: {
		get: StyleSheet.commonGetStyle,
		set: function(target, key, value) {
			StyleSheet.commonSetStyle(target, key, value);
			if (target.renderMode === 0) {
				if (target._useElemSize) {
					target.elem.height = value;
				} else {
					target.elemStyle.height = value + 'px';
				}
			}
		},
		step: StyleSheet.commonStepStyle
	},
	
	size: {
		get: function(target, key) {
			return {
				width: target.width,
				height: target.height
			}
		},
		set: function(target, key, value) {
			if (value.width !== undefined) target.width = value.width;
			if (value.height !== undefined) target.height = value.height;
			if (target.renderMode === 0) {
				if (target._useElemSize) {
					var elem = target.elem;
					elem.width = target.width;
					elem.height = target.height;
				} else {
					var style = target.elemStyle;
					style.width = target.width + 'px';
					style.height = target.height + 'px';
				}
			}		
		},
		step: StyleSheet.commonStepStyles
	},
	
	transform: {
		init: function(target, key) {
			target.transform = {
				translateX: 0, translateY: 0,
				rotate: 0, scale: 1,
				scaleX: 1, scaleY: 1,
				skewX: 0, skewY: 0,
				originX: 0.5, originY: 0.5
			};
			return target.transform;
		},
		get: function(target, key) {
			return target.transform || StyleSheet.init(target, key);
		},
		set: function(target, key, value) {
			var t2d = StyleSheet.get(target, key);
			for (var i in value) {
				target._updateTransform(i, value[i]);
			}
			if (target.renderMode === 0) {
				var style = target.elemStyle;
				// handle ie6-ie8 matrix filter
				if (supportIE6Filter) {
					var	elem = target.elem,
						filter = style.filter,
						regMatrix = /Matrix([^)]*)/,
						matrix = target._updateMatrix2D(true),
						matrixText = [ 
							'Matrix('+'M11='+matrix.a,
							'M12='+matrix.b, 'M21='+matrix.c, 'M22='+matrix.d,
							'SizingMethod=\'auto expand\''
						].join(',');	
					style.filter = filter.match(regMatrix) ? filter.replace(regMatrix, matrixText) : ('progid:DXImageTransform.Microsoft.' + matrixText + ') ' + filter);		
					style.marginLeft = t2d.translateX + (elem.clientWidth - elem.offsetWidth) * t2d.originX + 'px';
					style.marginTop = t2d.translateY + (elem.clientHeight - elem.offsetHeight) * t2d.originY + 'px';
				} else {
					StyleSheet.commonSetElemStyle(style, 'transform', target._mergeTransformText(t2d));
					if ('origin' in value || 'originX' in value || 'originY' in value) {
						StyleSheet.commonSetElemStyle(style, 'transformOrigin', t2d.originX*100+'% ' + t2d.originY*100+'%');
					}
				}
			}
		},
		step: StyleSheet.commonStepStyles
	},
	
	transform3d: {
		init: function(target, key) {
			target.transform3d = {
				perspective: 0,
				translateX: 0, translateY: 0, translateZ: 0,
				rotateX: 0, rotateY: 0, rotateZ: 0,
				scaleX: 1, scaleY: 1, scaleZ: 1,
				originX: 0.5, originY: 0.5, originZ: 0.5 
			};

			return target.transform3d;
		},
		get: function(target, key){
			return target.transform3d || StyleSheet.init(target, key);
		},
		set: function(target, key, value) {
			var t3d = StyleSheet.get(target, key);
			for (var i in value) {
				target._updateTransform3D(i, value[i]);
			}
			if (target.renderMode === 0) {
				var style = target.elemStyle;
				StyleSheet.commonSetElemStyle(style, 'transformStyle', 'preserve-3d');
				StyleSheet.commonSetElemStyle(style, 'backfaceVisibility', 'visible');
				StyleSheet.commonSetElemStyle(style, 'transform', target._mergeTransform3DText(t3d));
				if ('originX' in value || 'originY' in value || 'originZ' in value) {
					StyleSheet.commonSetElemStyle(style, 'transformOrigin', t3d.originX*100+'% ' + t3d.originY*100+'%');
				}
			};
		},
		step: StyleSheet.commonStepStyles
	},
	
	visible: {
		get: StyleSheet.commonGetStyle,
		set: function(target, key, value) {
			StyleSheet.commonSetStyle(target, key, value);		
			if (target.renderMode === 0) {
				target.elemStyle.display = value? 'block': 'none';
			}
		}
	},
		
	overflow: {
		get: StyleSheet.commonGetStyle,
		set: function(target, key, value) {
			StyleSheet.commonSetStyle(target, key, value);
			if (!target.renderMode) {
				target.elemStyle.overflow = value;
			}
		}
	},
	
	alpha: {
		get: StyleSheet.commonGetStyle,
		set: function(target, key, value) {
			StyleSheet.commonSetStyle(target, key, value);
			if (target.renderMode === 0) {
				var style = target.elemStyle;
				// handle ie6-ie8 alpha filter
				if (supportIE6Filter) {
					var filter = style.filter,
						regAlpha = /alpha\(opacity=([^)]*)/,
						alphaText = 'alpha(opacity=' + value*100;
					style.filter = filter.match(regAlpha) ? filter.replace(regAlpha, alphaText) : (filter + ' '+alphaText+')');	
				} else {
					style.opacity = value;
				}
			}
		},
		step: StyleSheet.commonStepStyle
	},
	
	shadow: {
		get: StyleSheet.commonGetStyle,
		set: function(target, key, value) {
			if (typeof(value) === 'string') {
				value = value.split('px ');
				value = {
					offsetX: parseFloat(value[0]),
					offsetY: parseFloat(value[1]),
					blur: parseFloat(value[2]),
					color: value[3]
				}
			}
			StyleSheet.commonSetStyle(target, key, value);
			if (target.renderMode === 0) {
				target.elemStyle.boxShadow = value.offsetX+'px '+value.offsetY+'px '+value.blur+'px '+value.color;
			}
		},
		step: StyleSheet.commonStepStyles
	},
	
	fill: {
		get: function(target, key) {
			return target.fillColor || target.fillGradient || target.fillImage;
		},
		set: function(target, key, value) {
			if (value.match(/^\#|^rgb|^rgba|black|red|green|blue|yellow|orange|pink|purple|gray/)) {				
				target.style('fillColor', value);
			} else if (value.match(/^top|^right|^bottom|^left|^center/)) {
				target.style('fillGradient', value);
			} else if (value.match(/\.jpg$|\.png$|\.gif$/)) { 
				target.style('fillImage', value);
			}
		},
		step: function(target, key, fx) {
			var value = fx.end;
			if (value.match(/^\#|^rgb|^rgba|black|red|green|blue|yellow|orange|pink|purple|gray/)) {				
				target._stepStyle('fillColor', fx);
			} else if (value.match(/^top|^right|^bottom|^left|^center/)) {
				target._stepStyle('fillGradient', fx);
			}
		}
	},
	
	fillColor: {
		get: StyleSheet.commonGetStyle,
		set: function(target, key, value) {
			target.fillGradient = target.fillImage = null;
			StyleSheet.commonSetStyle(target, key, value);

			if (target.renderMode === 0) {
				target.elemStyle.backgroundColor = value;
				target.elemStyle.backgroundImage = '';
			}
		},
		step: function(target, key, fx) {
			var start = StyleSheet.toRGBA(fx.start),
				end = StyleSheet.toRGBA(fx.end),
				pos = fx.pos,
				result = {};
			for (var i in end) {
				result[i] = Math.floor((end[i] - start[i]) * pos + start[i]);
			}
			target.style(key, StyleSheet.toColor(result));
		}
	},	
	
	fillGradient: {
		get: StyleSheet.commonGetStyle,
		set: function(target, key, value) {
			target.fillColor = target.fillImage = null;
			if (typeof(value) === 'string') {
				value = StyleSheet.toGradient(value);
			}
			StyleSheet.commonSetStyle(target, key, value);
			if (target.renderMode === 0) {
				var style = target.elemStyle,
					gradientText;
				// handle ie6-ie9 gradient filter
				if (supportIE6Filter || isIE9) {
					var filter = style.filter,
						regGradient = /gradient([^)]*)/;
					gradientText = 'gradient(GradientType=0,startColorstr=\''+value[1]+'\', endColorstr=\''+value[2]+'\'';
					style.filter = filter.match(regGradient) ? filter.replace(regGradient, gradientText) : (filter + ' progid:DXImageTransform.Microsoft.'+gradientText+')');
				} else {
					if (value[0]==='center') {
						gradientText = 'radial-gradient(circle,'+value[1]+','+value[2]+')';
					} else {
						gradientText = 'linear-gradient('+value[0]+','+value[1]+','+value[2]+')';
					}
					style.backgroundImage = '-webkit-' + gradientText;
					style.backgroundImage = '-ms-' + gradientText;
					style.backgroundImage = '-moz-' + gradientText;
				}
			}
		}, 
		step: function(target, key, fx) {
			var start = fx.start,
				end = fx.end,
				end = typeof(end) === 'string'? StyleSheet.toGradient(end) : end,
				pos = fx.pos,
				result = [end[0]];

			var getColor = function(pos, start, end) {
				start = StyleSheet.toRGBA(start);
				end = StyleSheet.toRGBA(end);
				var color = {};
				for (var i in end) {
					color[i] = Math.floor((end[i] - start[i]) * pos + start[i]);
				}
				return StyleSheet.toColor(color);
			}
			result.push(getColor(pos, start[1], end[1]));
			result.push(getColor(pos, start[2], end[2]));
			target.style(key, result);
		}
	},
	
	fillImage: {
		get: StyleSheet.commonGetStyle,
		set: function(target, key, value) {
			target.fillColor = target.fillGradient = null;
			if (target.renderMode === 0) {
				target.elemStyle.backgroundImage = 'url(' + value + ')';
			} else {
				var image = new Image();
				image.src = value;
				value = image;
			}
			StyleSheet.commonSetStyle(target, key, value);
		}
	},
	
	stroke: {
		get: function(target, key) {
			return target.strokeColor;
		},
		set: function(target, key, value) {
			target.style('strokeColor', value);
		},
		step: function(target, key, fx) {
			target._stepStyle('strokeColor', fx);
		}
	},
	
	strokeColor: {
		get: StyleSheet.commonGetStyle,
		set: function(target, key, value) {
			StyleSheet.commonSetStyle(target, key, value);
			if (target.renderMode === 0) {
				target.elemStyle.border = '1px solid ' + value;
			}
		},
		step: function(target, key, fx) {
			var start = StyleSheet.toRGBA(fx.start),
				end = StyleSheet.toRGBA(fx.end),
				pos = fx.pos,
				result = {};
			for (var i in end) {
				result[i] = Math.floor((end[i] - start[i]) * pos + start[i]);
			}
			target.style(key, StyleSheet.toColor(result));
		}
	},
	
	lineWidth: {
		get: StyleSheet.commonGetStyle,
		set: function(target, key, value) {
			StyleSheet.commonSetStyle(target, key, value);
			if (target.renderMode === 0) {
				target.elemStyle.borderWidth = value + 'px';
			}
		},
		step: StyleSheet.commonStepStyle
	},
	
	radius: {
		get: StyleSheet.commonGetStyle,
		set: function(target, key, value) {
			StyleSheet.commonSetStyle(target, key, value);
			target.width = target.height = value * 2;
			if (target.renderMode === 0) {
				var style = target.elemStyle;
				style.borderRadius = '50%';
				style.width = style.height = target.width + 'px';
			}
		},
		step: StyleSheet.commonStepStyle
	},
	
	radiusXY: {
		get: function(target, key) {
			return {
				radiusX: target.radiusX,
				radiusY: target.radiusY
			}
		},
		set: function(target, key, value) {
			target.radiusX = value.radiusX;
			target.radiusY = value.radiusY;
			target.width = target.radiusX * 2;
			target.height = target.radiusY * 2;
			if (target.renderMode === 0) {
				var style = target.elemStyle;
				style.borderRadius = '50%';
				style.width = target.width + 'px';
				style.height = target.height + 'px';
			}
		}
	},
	
	angle: {
		get: StyleSheet.commonGetStyle,
		set: StyleSheet.commonSetStyle,
		step: StyleSheet.commonStepStyle
	}
}

StyleSheet.toRGBA = function(color){
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

StyleSheet.toColor = function(rgba) {
	var r = rgba.r.toString(16),
		g = rgba.g.toString(16),
		b = rgba.b.toString(16);
	if (r.length===1) r = '0'+r;
	if (g.length===1) g = '0'+g;
	if (b.length===1) b = '0'+b;
	return '#'+r+g+b;
};

StyleSheet.toGradient = function(gradient) {
	gradient = gradient.split(/\,#|\,rgb/);
	
	for (var i=1,l=gradient.length; i<l; i++) {
		gradient[i] = (gradient[i].indexOf('(')>-1?'rgb':'#') + gradient[i];
	}
	return gradient;
};

if (jQuery) {
	jQuery.extend( jQuery.fx.step, {
		backgroundColor: function( fx ) {
			var elem = fx.elem,
				start = StyleSheet.toRGBA(fx.start),
				end = StyleSheet.toRGBA(fx.end),
				pos = fx.pos;
			var result = {},
				style = elem.style;	
			for (var i in end) {
				result[i] = Math.floor((end[i] - start[i])*pos + start[i]);
			}
			style.backgroundColor = StyleSheet.toColor(result);
		}
	});
};

return StyleSheet;
});