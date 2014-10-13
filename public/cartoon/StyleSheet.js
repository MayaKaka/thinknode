
define(function (require, exports, module) {

var divStyle = document.createElement('div').style,
	prefix = divStyle.webkitTransform === ''? 'webkit' :
    		 divStyle.WebkitTransform === ''? 'Webkit' :
    		 divStyle.msTransform === ''? 'ms' :
    		 divStyle.MozTransform === ''? 'Moz' : 'ct',
    isIE9 = navigator.userAgent.indexOf("MSIE 9.0") > 0,
    supportIE6Filter = prefix === 'ct' && divStyle.filter === '';
    
var StyleSheet = function() {};

StyleSheet.has = function(key) {
	// 判断是否存在样式
	return !!StyleSheet.styles[key];
}

StyleSheet.init = function(target, key) {
	var style = StyleSheet.styles[key];
	// 初始化样式		
	if (style && style.init) {
		return style.init(target, key);
	}
}

StyleSheet.get = function(target, key) {
	var style = StyleSheet.styles[key];
	// 获取样式
	if (style) {
		return style.get(target, key);
	}
}

StyleSheet.set = function(target, key, value) {
	var style = StyleSheet.styles[key];
	// 设置样式
	if (style) {
		style.set(target, key, value);
	}
}

StyleSheet.step = function(target, key, value) {
	var style = StyleSheet.styles[key];
	// 补间动画逐帧更新样式		
	if (style && style.step) {
		style.step(target, key, value);
	}
}

StyleSheet.commonGet = function(target, key) {
	// 通用获取样式
	return target[key];
};

StyleSheet.commonSet = function(target, key, value) {
	// 通用设置样式
	target[key] = value;
};

StyleSheet.commonCss = function(style, key, value) {
	// 通用设置css3样式
	var suffix = key.charAt(0).toUpperCase() + key.substring(1, key.length);
	style[prefix+suffix] = value;
};

StyleSheet.commonStep = function(target, key, fx) {
	// 通用设置过渡样式
	var start = fx.start,
		end = fx.end,
		pos = fx.pos;	
	var result = (end - start) * pos + start;
	target.style(key, result);
};

StyleSheet.commonSteps = function(target, key, fx) {
	// 通用设置过渡样式
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
	x: { // x轴坐标
		get: StyleSheet.commonGet,
		set: function(target, key, value) {
			StyleSheet.commonSet(target, key, value);
			if (target.renderMode === 0) {
				var style = target.elemStyle;
				style.position = 'absolute';
				style.left = value + 'px';
			}
		},
		step: StyleSheet.commonStep
	},
	
	y: { // y轴坐标
		get: StyleSheet.commonGet,
		set: function(target, key, value) {
			StyleSheet.commonSet(target, key, value);
			if (target.renderMode === 0) {
				var style = target.elemStyle;
				style.position = 'absolute';
				style.top = value + 'px';
			}
		},
		step: StyleSheet.commonStep
	},
	
	z: { // 3d远视坐标
		get: StyleSheet.commonGet,
		set: function(target, key, value) {
			StyleSheet.commonSet(target, key, value);
			target.style('transform3d', { perspective: value });
		},
		step: StyleSheet.commonStep
	},
	
	pos: { // xy坐标
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
		step: StyleSheet.commonSteps
	},
	
	width: { // 宽度
		get: StyleSheet.commonGet,
		set: function(target, key, value) {
			StyleSheet.commonSet(target, key, value);
			if (target.renderMode === 0) {
				if (target._useElemSize) {
					target.elem.width = value;
				} else {
					target.elemStyle.width = value + 'px';
				}
			}
		},
		step: StyleSheet.commonStep
	},
	
	height: { // 高度
		get: StyleSheet.commonGet,
		set: function(target, key, value) {
			StyleSheet.commonSet(target, key, value);
			if (target.renderMode === 0) {
				if (target._useElemSize) {
					target.elem.height = value;
				} else {
					target.elemStyle.height = value + 'px';
				}
			}
		},
		step: StyleSheet.commonStep
	},
	
	size: { // 尺寸
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
		step: StyleSheet.commonSteps
	},
	
	transform: { // 2d变换
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
				if (supportIE6Filter) {
					// ie6-8下使用matrix filter
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
					// 设置css3样式
					StyleSheet.commonCss(style, 'transform', target._mergeTransformText());
					if ('originX' in value || 'originY' in value) {
						StyleSheet.commonCss(style, 'transformOrigin', t2d.originX*100+'% ' + t2d.originY*100+'%');
					}
				}
			}
		},
		step: StyleSheet.commonSteps
	},
	
	transform3d: { // 3d变换
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
				// 设置css3样式
				var style = target.elemStyle;
				StyleSheet.commonCss(style, 'transformStyle', 'preserve-3d');
				StyleSheet.commonCss(style, 'backfaceVisibility', 'visible');
				StyleSheet.commonCss(style, 'transform', target._mergeTransform3DText());
				if ('originX' in value || 'originY' in value || 'originZ' in value) {
					StyleSheet.commonCss(style, 'transformOrigin', t3d.originX*100+'% ' + t3d.originY*100+'%');
				}
			};
		},
		step: StyleSheet.commonSteps
	},
	
	visible: { // 是否可见
		get: StyleSheet.commonGet,
		set: function(target, key, value) {
			StyleSheet.commonSet(target, key, value);		
			if (target.renderMode === 0) {
				target.elemStyle.display = value ? 'block' : 'none';
			}
		}
	},
		
	overflow: { // 溢出效果
		get: StyleSheet.commonGet,
		set: function(target, key, value) {
			StyleSheet.commonSet(target, key, value);
			if (target.renderMode === 0) {
				target.elemStyle.overflow = value;
			}
		}
	},
	
	alpha: { // 透明度
		get: StyleSheet.commonGet,
		set: function(target, key, value) {
			StyleSheet.commonSet(target, key, value);
			if (target.renderMode === 0) {
				var style = target.elemStyle;
				if (supportIE6Filter) {
					// ie6-8下使用alpha filter
					var filter = style.filter,
						regAlpha = /alpha\(opacity=([^)]*)/,
						alphaText = 'alpha(opacity=' + value*100;
					style.filter = filter.match(regAlpha) ? filter.replace(regAlpha, alphaText) : (filter + ' '+alphaText+')');	
				} else {
					// 设置css3样式
					style.opacity = value;
				}
			}
		},
		step: StyleSheet.commonStep
	},
	
	shadow: { // 阴影
		get: StyleSheet.commonGet,
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
			StyleSheet.commonSet(target, key, value);
			if (target.renderMode === 0) {
				target.elemStyle.boxShadow = value.offsetX+'px ' + value.offsetY+'px ' + value.blur+'px ' + value.color;
			}
		},
		step: StyleSheet.commonSteps
	},
	
	fill: { // 填充样式
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
	
	fillColor: { // 填充色
		get: StyleSheet.commonGet,
		set: function(target, key, value) {
			StyleSheet.commonSet(target, key, value);
			target.fillGradient = target.fillImage = null;
			
			if (target.renderMode === 0) {
				target.elemStyle.backgroundColor = value;
				target.elemStyle.backgroundImage = '';
			}
		},
		step: function(target, key, fx) {
			target.style(key, StyleSheet.stepColor(fx.pos, fx.start, fx.end));
		}
	},	
	
	fillGradient: { // 填充渐变
		get: StyleSheet.commonGet,
		set: function(target, key, value) {
			target.fillColor = target.fillImage = null;
			value = StyleSheet.toGradient(value);
			StyleSheet.commonSet(target, key, value);
			if (target.renderMode === 0) {
				var style = target.elemStyle, gradientText;
				if (supportIE6Filter || isIE9) {
					// ie6-8下使用gradient filter
					var filter = style.filter,
						regGradient = /gradient([^)]*)/;
					gradientText = 'gradient(GradientType=0,startColorstr=\''+value[1]+'\', endColorstr=\''+value[2]+'\'';
					style.filter = filter.match(regGradient) ? filter.replace(regGradient, gradientText) : (filter + ' progid:DXImageTransform.Microsoft.'+gradientText+')');
				} else {
					// 设置css3样式
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
				end = StyleSheet.toGradient(end),
				pos = fx.pos,
				result = [end[0]];

			result.push(StyleSheet.stepColor(pos, start[1], end[1]));
			result.push(StyleSheet.stepColor(pos, start[2], end[2]));
			target.style(key, result);
		}
	},
	
	fillImage: { // 填充位图
		get: StyleSheet.commonGet,
		set: function(target, key, value) {
			target.fillColor = target.fillGradient = null;
			if (target.renderMode === 0) {
				target.elemStyle.backgroundImage = 'url(' + value + ')';
			} else {
				var image = new Image();
				image.src = value;
				value = image;
			}
			StyleSheet.commonSet(target, key, value);
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
		get: StyleSheet.commonGet,
		set: function(target, key, value) {
			StyleSheet.commonSet(target, key, value);
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
		get: StyleSheet.commonGet,
		set: function(target, key, value) {
			StyleSheet.commonSet(target, key, value);
			if (target.renderMode === 0) {
				target.elemStyle.borderWidth = value + 'px';
			}
		},
		step: StyleSheet.commonStep
	},
	
	radius: {
		get: StyleSheet.commonGet,
		set: function(target, key, value) {
			StyleSheet.commonSet(target, key, value);
			target.width = target.height = value * 2;
			if (target.renderMode === 0) {
				var style = target.elemStyle;
				style.borderRadius = '50%';
				style.width = style.height = target.width + 'px';
			}
		},
		step: StyleSheet.commonStep
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
		get: StyleSheet.commonGet,
		set: StyleSheet.commonSet,
		step: StyleSheet.commonStep
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

StyleSheet.stepColor = function(pos, start, end) {
	start = StyleSheet.toRGBA(start);
	end = StyleSheet.toRGBA(end);
	
	var color = {};
	for (var i in end) {
		color[i] = Math.floor((end[i] - start[i]) * pos + start[i]);
	}
	return StyleSheet.toColor(color);
}

StyleSheet.toGradient = function(gradient) {
	if (typeof(gradient) === 'string') {
		gradient = gradient.split(/\,#|\,rgb/);
	
		for (var i=1,l=gradient.length; i<l; i++) {
			gradient[i] = (gradient[i].indexOf('(')>-1?'rgb':'#') + gradient[i];
		}
	}
	return gradient;
};

return StyleSheet;
});