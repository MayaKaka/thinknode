
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
	// 设置过渡样式		
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
	var pos = fx.pos,
		start = fx.start,
		end = fx.end;
	var result = {};
	for (var i in end) {
		result[i] = (end[i] - start[i]) * pos + start[i];
	}
	target.style(key, result);
};

StyleSheet.toRGBA = function(color){
	var rgba = {
		r: 0, g: 0, b: 0, a: 1
	};
	// 将色值转换成rgba格式	
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
	// 将色值转换成16进制格式
	if (r.length===1) r = '0'+r;
	if (g.length===1) g = '0'+g;
	if (b.length===1) b = '0'+b;
	return '#'+r+g+b;
};

StyleSheet.toGradient = function(gradient) {
	if (typeof(gradient) === 'string') {
		gradient = gradient.split(/\,#|\,rgb/);
		// 将渐变样式转换成数组格式
		for (var i=1,l=gradient.length; i<l; i++) {
			gradient[i] = (gradient[i].indexOf('(')>-1?'rgb':'#') + gradient[i];
		}
	}
	return gradient;
};

StyleSheet.stepColor = function(pos, start, end) {
	start = StyleSheet.toRGBA(start);
	end = StyleSheet.toRGBA(end);
	// 处理颜色过渡
	var color = {};
	for (var i in end) {
		color[i] = Math.floor((end[i] - start[i]) * pos + start[i]);
	}
	return StyleSheet.toColor(color);
}

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
				if (target.useElemSize) {
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
				if (target.useElemSize) {
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
				if (target.useElemSize) {
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
			return target.transform || this.init(target, key);
		},
		set: function(target, key, value) {
			var t2d = this.get(target, key);
			for (var i in value) {
				target._updateTransform(i, value[i]);
			}
			if (target.renderMode === 0) {
				var style = target.elemStyle;
				if (supportIE6Filter) {
					// ie6-8下使用matrix filter
					var	elem = target.elem,
						filter = style.filter,
						regexp = /Matrix([^)]*)/,
						mtx = target._updateMatrix2D(true),
						text = [
							'Matrix('+'M11='+mtx.a,
							'M12='+mtx.b, 'M21='+mtx.c, 'M22='+mtx.d,
							'SizingMethod=\'auto expand\''
						].join(',');
					style.filter = regexp.test(filter) ? filter.replace(regexp, text) : ('progid:DXImageTransform.Microsoft.' + text + ') ' + filter);		
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
			if (target.renderMode === 0) {
				var style = target.elemStyle;
				StyleSheet.commonCss(style, 'transformStyle', 'preserve-3d');
				StyleSheet.commonCss(style, 'backfaceVisibility', 'visible');
			}
			return target.transform3d;
		},
		get: function(target, key){
			return target.transform3d || this.init(target, key);
		},
		set: function(target, key, value) {
			var t3d = this.get(target, key);
			for (var i in value) {
				target._updateTransform3D(i, value[i]);
			}
			if (target.renderMode === 0) {
				// 设置css3样式
				var style = target.elemStyle;
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
			value = value >= 0 ? value : 0;
			StyleSheet.commonSet(target, key, value);
			if (target.renderMode === 0) {
				var style = target.elemStyle;
				if (supportIE6Filter) {
					// ie6-8下使用alpha filter
					var filter = style.filter,
						regexp = /alpha\(opacity=([^)]*)/,
						text = 'alpha(opacity=' + value*100;
					style.filter = regexp.test(filter) ? filter.replace(regexp, text) : (filter + ' '+ text + ')');	
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
		regexpColor: /^\#|^rgb|^rgba|black|red|green|blue|yellow|orange|pink|purple|gray/,
		regexpGradient: /^top|^right|^bottom|^left|^center/,
		regexpImage: /\.jpg$|\.png$|\.gif$/,
		get: function(target, key) {
			return target.fillColor || target.fillGradient || target.fillImage;
		},
		set: function(target, key, value) {
			if (this.regexpColor.test(value)) {		
				target.style('fillColor', value);
			} else if (this.regexpGradient.test(value)) {
				target.style('fillGradient', value);
			} else if (this.regexpImage.test(value)) { 
				target.style('fillImage', value);
			}
		},
		step: function(target, key, fx) {
			var value = fx.end;
			if (this.regexpColor.test(value)) {		
				target._stepStyle('fillColor', fx);
			} else if (this.regexpGradient.test(value)) {
				target._stepStyle('fillGradient', fx);
			}
		}
	},
	
	fillColor: { // 填充色
		get: StyleSheet.commonGet,
		set: function(target, key, value) {
			target.fillGradient = target.fillImage = null;
			StyleSheet.commonSet(target, key, value);
			
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
				var style = target.elemStyle, text;
				if (supportIE6Filter || isIE9) {
					// ie6-8下使用gradient filter
					var filter = style.filter,
						regexp = /gradient([^)]*)/;
					text = 'gradient(GradientType=0,startColorstr=\''+value[1]+'\', endColorstr=\''+value[2]+'\'';
					style.filter = regexp.test(filter) ? filter.replace(regexp, text) : (filter + ' progid:DXImageTransform.Microsoft.'+text+')');
				} else {
					// 设置css3样式
					if (value[0]==='center') {
						text = 'radial-gradient(circle,'+value[1]+','+value[2]+')';
					} else {
						text = 'linear-gradient('+value[0]+','+value[1]+','+value[2]+')';
					}
					style.backgroundImage = '-webkit-' + text;
					style.backgroundImage = '-ms-' + text;
					style.backgroundImage = '-moz-' + text;
				}
			}
		}, 
		step: function(target, key, fx) {
			var start = fx.start,
				end = fx.end,
				end = StyleSheet.toGradient(end),
				pos = fx.pos,
				result = [end[0]];
			// 设置渐变颜色过渡
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
	
	stroke: { // 画笔样式
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
	
	strokeColor: { // 画笔颜色
		get: StyleSheet.commonGet,
		set: function(target, key, value) {
			StyleSheet.commonSet(target, key, value);
			if (target.renderMode === 0) {
				var style = target.elemStyle;	
				style.borderColor = value;
				style.borderStyle = 'solid';
			}
		},
		step: function(target, key, fx) {
			target.style(key, StyleSheet.stepColor(fx.pos, fx.start, fx.end));
		}
	},
	
	lineWidth: { // 画笔宽度
		get: StyleSheet.commonGet,
		set: function(target, key, value) {
			StyleSheet.commonSet(target, key, value);
			if (target.renderMode === 0) {
				target.elemStyle.borderWidth = value + 'px';
			}
		},
		step: StyleSheet.commonStep
	},
	
	radius: { // 圆半径
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
	
	angle: { // 圆角度
		get: StyleSheet.commonGet,
		set: StyleSheet.commonSet,
		step: StyleSheet.commonStep
	},
	
	radiusXY: { // 椭圆半径
		get: function(target, key) {
			return {
				radiusX: target.radiusX,
				radiusY: target.radiusY
			}
		},
		set: function(target, key, value) {
			if (value.radiusX !== undefined) {
				target.radiusX = value.radiusX;
				target.width = target.radiusX * 2;
			}
			if (value.radiusY !== undefined) {
				target.radiusY = value.radiusY;
				target.height = target.radiusY * 2;
			}
			if (target.renderMode === 0) {
				var style = target.elemStyle;
				style.borderRadius = '50%';
				style.width = target.width + 'px';
				style.height = target.height + 'px';
			}
		},
		step: StyleSheet.commonSteps
	},
	
	font: { // 字体
		get: StyleSheet.commonGet,
		set: StyleSheet.commonSet,
		step: StyleSheet.commonStep
	},

	textColor: { // 文字颜色
		get: StyleSheet.commonGet,
		set: StyleSheet.commonSet,
		step: StyleSheet.commonStep
	}
	
}

return StyleSheet;
});