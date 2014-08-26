
define(function (require, exports, module) {
	
var divStyle = document.createElement('div').style,
	supportTransform = divStyle.transform === '' || divStyle.webkitTransform === '' || divStyle.msTransform === '' || divStyle.MozTransform === '',
	supportIE6Filter = supportTransform? false : divStyle.filter === '',
	isWebkitCore = divStyle.webkitTransform === '',
    isIE9 = navigator.userAgent.indexOf("MSIE 9.0")>0;
    
var StyleSheet = function() {};

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

var commonGetStyle = function(target, key) {
	return target[key];
};

var commonSetStyle = function(target, key, value) {
	target[key] = value;
};

var commonStepStyle = function(target, key, fx) {
	var start = fx.start,
		end = fx.end,
		pos = fx.pos;	
	var result = (end - start) * pos + start;
	target.style(key, result);
};

var commonStepStyles = function(target, key, fx) {
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
		get: commonGetStyle,
		set: function(target, key, value) {
			commonSetStyle(target, key, value);
			if (!target.renderInCanvas) {
				target.elemStyle.position = 'absolute';
				target.elemStyle.left = value+'px';
			}
		},
		step: commonStepStyle
	},
	
	y: {
		get: commonGetStyle,
		set: function(target, key, value) {
			commonSetStyle(target, key, value);
			if (!target.renderInCanvas) {
				target.elemStyle.position = 'absolute';
				target.elemStyle.top = value+'px';
			}
		},
		step: commonStepStyle
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
			if (!target.renderInCanvas) {
				target.elemStyle.position = 'absolute';
				target.elemStyle.left = target.x+'px';
				target.elemStyle.top = target.y+'px';
			}		
		},
		step: commonStepStyles
	},
	
	width: {
		get: commonGetStyle,
		set: function(target, key, value) {
			commonSetStyle(target, key, value);
			if (!target.renderInCanvas) {
				if (target._useElemSize) {
					target.elem.width = value;
				} else {
					target.elemStyle.width = value+'px';
				}
			}
		},
		step: commonStepStyle
	},
	
	height: {
		get: commonGetStyle,
		set: function(target, key, value) {
			commonSetStyle(target, key, value);
			if (!target.renderInCanvas) {
				if (target._useElemSize) {
					target.elem.height = value;
				} else {
					target.elemStyle.height = value+'px';
				}
			}		
		},
		step: commonStepStyle
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
			if (!target.renderInCanvas) {
				if (target._useElemSize) {
					target.elem.width = target.width;
					target.elem.height = target.height;
				} else {
					target.elemStyle.width = target.width+'px';
					target.elemStyle.height = target.height+'px';
				}
			}		
		},
		step: commonStepStyles
	},
	
	transform: {
		get: function(target, key) {
			var transform = {};
			transform.rotate = target.rotation;
			transform.scale = 
			transform.scaleX = target.scaleX;
			transform.scaleY = target.scaleY;
			transform.origin = 
			transform.originX = target.originX;
			transform.originY = target.originY;
			return transform;
		},
		set: function(target, key, value) {
			for (var i in value) {
				target._updateTransform(i, value[i]);
			}
			if (target.renderInCanvas) return;
			
			var style = target.elemStyle;
			// handle ie6-ie8 matrix filter
			if (supportIE6Filter) {
				var	elem = target.elem,
					filter = style.filter,
					matrix = target._updateMatrix2D(true),
					regMatrix = /Matrix([^)]*)/,
					matrixText = [
						'Matrix('+
							'M11='+matrix.a,
							'M12='+matrix.b,
							'M21='+matrix.c,
							'M22='+matrix.d,
							'SizingMethod=\'auto expand\''
					].join(',');
						
				style.filter = filter.match(regMatrix) ? filter.replace(regMatrix, matrixText) : ('progid:DXImageTransform.Microsoft.' + matrixText + ') ' + filter);		
				style.marginLeft = (elem.clientWidth - elem.offsetWidth) * target.originX + 'px';
				style.marginTop = (elem.clientHeight - elem.offsetHeight) * target.originY + 'px';
			} else {
				style.transform = style.webkitTransform = style.msTransform = style.MozTransform = target._mergeTransformText();	
				if ('origin' in value || 'originX' in value || 'originY' in value) {
					style.transformOrigin = style.webkitTransformOrigin = style.msTransformOrigin = style.MozTransformOrigin = target.originX * 100 + '% ' + target.originY * 100 + '%';
				}
			}
		},
		step: commonStepStyles
	},
	
	visible: {
		get: commonGetStyle,
		set: function(target, key, value) {
			commonSetStyle(target, key, value);		
			if (!target.renderInCanvas) {
				target.elemStyle.display = value? 'block': 'none';
			}
		}
	},
	
	alpha: {
		get: commonGetStyle,
		set: function(target, key, value) {
			commonSetStyle(target, key, value);
			if (!target.renderInCanvas) {
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
		step: commonStepStyle
	},
	
	overflow: {
		get: commonGetStyle,
		set: function(target, key, value) {
			commonSetStyle(target, key, value);
			if (!target.renderInCanvas) {
				target.elemStyle.overflow = value;
			}
		}
	},
	
	bgColor: {
		get: commonGetStyle,
		set: function(target, key, value) {
			commonSetStyle(target, key, value);
			if (!target.renderInCanvas) {
				target.elemStyle.backgroundColor = value;
			}
		}
	},	
	
	bgGradient: {
		get: commonGetStyle,
		set: function(target, key, value) {
			commonSetStyle(target, key, value);
			if (target.renderInCanvas) return;
			var style = target.elemStyle;
			// handle ie6-ie9 gradient filter
			if (supportIE6Filter || isIE9) {
				var filter = style.filter,
					regGradient = /gradient([^)]*)/,
					gradientText = 'gradient(GradientType=0,startColorstr=\''+value[1]+'\', endColorstr=\''+value[2]+'\'';
					
				style.filter = filter.match(regGradient) ? filter.replace(regGradient, gradientText) : (filter + ' progid:DXImageTransform.Microsoft.'+gradientText+')');	
				
			} else {
				var gradientText = '-linear-gradient('+value[0]+', '+value[1]+', '+value[2]+')';
				
				style.backgroundImage = gradientText;
				style.backgroundImage = '-webkit'+gradientText;
				style.backgroundImage = '-ms'+gradientText;
				style.backgroundImage = '-moz'+gradientText;
			}	
		}
	},	
	
	bgImage: {
		get: commonGetStyle,
		set: function(target, key, value) {
			if (target.renderInCanvas) {
				var img = new Image();
				img.src = value;
				value = img;
			}
			commonSetStyle(target, key, value);
			if (!target.renderInCanvas) {
				target.elemStyle.backgroundImage = 'url('+value+')';
			}
		}
	},
	
	radius: {
		get: commonGetStyle,
		set: function(target, key, value) {
			commonSetStyle(target, key, value);
			target.width = target.height = 2*value;
			if (!target.renderInCanvas) {
				var style = target.elemStyle;
				style.borderRadius = '50%';
				style.width = style.height = value*2+'px';
			}
		}
	},
	
	angle: {
		get: commonGetStyle,
		set: commonSetStyle
	}
}

return StyleSheet;
});