
define('Class',[],function(){

// 类式继承基类，参见 http://ejohn.org/blog/simple-javascript-inheritance/
var Class = function() {}, initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

Class.extend = function(props) {
	var superClass = this,
		superProto = this.prototype,
		subClass = function() { // 初始化子类
			 if (!initializing && this.init) {
			  	 this.init.apply(this, arguments);
			}
		};
	// 原型链继承	
	if (superClass !== Class) {
		initializing = true;
		subClass.prototype = new superClass();
	}
	initializing = false;
	            
	var subProto = subClass.prototype;
	// 函数重写
	for (var name in props) {
		subProto[name] = (typeof(superProto[name]) === 'function' && 
			typeof(props[name]) === 'function' && fnTest.test(props[name])) ?
			(function(name, fn){
	        	return function() {
	        		var temp = this._super;
	            	this._super = superProto[name];
	           		
	           		var result = fn.apply(this, arguments);  
	           		this._super = temp;
	           		
	           		return result;
	        	};
	        })(name, props[name]) : props[name];
	}
	
	subClass.extend = arguments.callee;
	
	return subClass;
};

return Class;
});

define('Ticker',['require','exports','module','Class'],function (require, exports, module) {
	
	   
var Class = require('Class');

var requestAnimationFrame = 
		window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame || 
		window.oRequestAnimationFrame || 
		window.msRequestAnimationFrame || window.setTimeout;
					
var cancelAnimationFrame = 
		window.cancelAnimationFrame || 
		window.webkitCancelAnimationFrame || 
		window.mozCancelAnimationFrame || 
		window.oCancelAnimationFrame || 
		window.msCancelAnimationFrame || window.clearTimeout;						   
						   				   					
var Ticker = Class.extend({
	
	fps: -1,
	
	_paused: true,
	_timer: null,
	
	_interval: -1,
	_targets: null,
	_useAnimationFrame: false,
	
	init: function(interval, useAnimationFrame) {
		this.fps = 0;
		
		this._interval = interval || (1000/60).toFixed(2);
	    this._targets = [];
	    
	    if (useAnimationFrame === undefined || useAnimationFrame === 'auto' || useAnimationFrame === true) {
	    	this._useAnimationFrame = requestAnimationFrame !== window.setTimeout;
	    }
	},
	
	isActive: function() {
		return !this._paused;
	},
	
	start: function() {
	 	this._clearTimer();
	    this._paused = false;
	    this._setTimer();
	},
	 	
	stop: function() {
		this._paused = true;
	},

	has: function(target) {
		var t = this._targets, l = t.length;
        for (var i=l-1;i>=0;i--) {
        	if(t[i] === target) {
            	return true;
            }
        }
        return false;
   	},
	
	add: function(target) {
		if (!this.has(target)) {
			if (target._ticker) {
				target._ticker.remove(target);
			}
			if (target.update instanceof Function) {
				target._ticker = this;
			}
        	this._targets.push(target);
 		}
	},
    
    remove: function(target) {
    	var t = this._targets, l = t.length;
        for (var i=l-1;i>=0;i--) {
        	if(t[i] === target) {
        		if (target._ticker) {
            		target._ticker = null;
            	}
            	t.splice(i, 1);
            	break;
        	}
        }
    },
    
    removeAll: function() {
    	this._targets = [];
    },

	_clearTimer: function() {
		if (this._timer) {
			var cancelFrame = this._useAnimationFrame? cancelAnimationFrame: window.clearTimeout;
			cancelFrame(this._timer);
	    	this._timer = null;
	    }
	},
	
	_setTimer: function() {
		var self = this;
		
		var nowTime = 0, lastTime = 0, deltaTime = 0,
		 	afTime = 0, lastAfTime = 0, deltaAfTime = 0,
	        timePoints = [], timeTemp = 0;
	       
	    var delay = self._interval,
	    	afDelay = (delay-1)*0.97,
	        useAnimationFrame = self._useAnimationFrame,
	        nextFrame = useAnimationFrame? requestAnimationFrame: window.setTimeout;
	        	
	    var hasTick = function(){
	        if (!useAnimationFrame) {
	        	return true;
	        }
	
	        if (lastAfTime === 0) {
	        	lastAfTime = new Date().getTime();
	        	return true;
	        } else {
	        	afTime = new Date().getTime();
	        	deltaAfTime = afTime - lastAfTime;
	        	if (deltaAfTime > afDelay) {
	        		lastAfTime = afTime;
	        		return true;
	        	}
	        }
	        return false;
		};
	        
	    var tick = function(){
			if (lastTime === 0) {
		    	lastTime = new Date().getTime();
		    } else {
				nowTime = new Date().getTime();
		        deltaTime = nowTime - lastTime;
		        lastTime = nowTime;
		        timePoints.push(deltaTime);
		        // 计算执行 fps
		        if (timePoints.length === 5) {
					for (var i=0,l=timePoints.length; i<l; i++) {
		            	timeTemp += timePoints[i];
		            }
		            self.fps = Math.floor(5000/timeTemp);
		            timePoints = [];
		            timeTemp = 0;
		        }
			}
			
		    // 执行当前帧
		    self._exec(deltaTime);		
		};
	              
		var nextTick = function(){
			if (hasTick()) {
				tick();
	        }
	            
	        self._clearTimer();
	            
	        if (!self._paused && !Ticker._destroyed) {
	        	self._timer = nextFrame(nextTick, delay); 
	        }
		};
	        
	    nextTick();
    },
     
   	_exec: function(delta) {
    	var targets = this._targets, 
    		target;
    	
        for(var i=0,l=targets.length;i<l;i++){
        	if (this._paused || Ticker._destroyed) break;
            target = targets[i];
        	if (target.update instanceof Function) {
        		target.update(delta);
            } else if (target instanceof Function) {
            	 target(delta);
            }
        }
	}
});
	
Ticker._destroyed = false;

Ticker.destroy = function() {
	this._destroyed = true;
}

return Ticker;
});

define('EventDispatcher',['require','exports','module','Class'],function (require, exports, module) {
	
	 
var Class = require('Class');

// 事件派发器，参见 https://github.com/mrdoob/eventdispatcher.js
var EventDispatcher = Class.extend({
	
	_listeners: null,
	
	on: function(type, listener) {
		// 绑定事件
		this.addEventListener(type, listener);
	},
	
	off: function(type, listener) {
		// 解绑事件
		this.removeEventListener(type, listener);
	},
	
	trigger: function(evt) {
		// 触发事件
		this.dispatchEvent(evt);
	},
	
	addEventListener: function(type, listener) {
		if (!this._listeners) this._listeners = {};

		var listeners = this._listeners,
			listenerArray = listeners[type];
			
		if (!listenerArray) {
			listenerArray = listeners[type] = [];
			// 兼容低版本ie
			if (!listenerArray.indexOf) {
				listenerArray.indexOf = function(target) {
					for (var i=0, l=this.length; i<l; i++) {
						if (this[i] === target) {
							return i;
						}
					}
					return -1;
				}
			}
		}
		// 添加事件函数
		if (listenerArray.indexOf(listener) === - 1) {
			listenerArray.push(listener);
		}
	},

	hasEventListener: function(type, listener) {
		if (!this._listeners) return false;

		var listeners = this._listeners,
			listenerArray = listeners[type];
		// 检测事件函数
		if (listenerArray && listenerArray.indexOf(listener) !== - 1) {
			return true;
		}

		return false;
	},

	removeEventListener: function(type, listener) {
		if (!this._listeners) return;

		var listeners = this._listeners,
			listenerArray = listeners[type];

		if (listenerArray) {
			var index = listenerArray.indexOf(listener);
			// 移除事件函数
			if (index !== - 1) {
				listenerArray.splice(index, 1);
			}
		}
	},

	dispatchEvent: function(evt) {
		if (!this._listeners) return;

		var listeners = this._listeners,
			listenerArray = listeners[evt.type];

		if (listenerArray) {
			evt.target = this;
			// 遍历执行事件函数
			for (var i=0, l=listenerArray.length; i<l; i++) {
				listenerArray[i].call(this, evt);
			}
		}
	}
	
});

return EventDispatcher;
});

define('PrivateData',['require','exports','module','Class'],function (require, exports, module) {
	
	  
var Class = require('Class');

var PrivateData = Class.extend({
	
	_data: null,
	
	init: function() {
		this._data = {};
	},
	
	get: function(key) {
		return this._data[key];
	},
	
	set: function(key, value) {
		this._data[key] = value;
		return value;
	}
});

return PrivateData;
});

define('StyleSheet',['require','exports','module'],function (require, exports, module) {
	
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

StyleSheet.commonGet = function(target, key) {
	return target[key];
};

StyleSheet.commonSet = function(target, key, value) {
	target[key] = value;
};

StyleSheet.commonCss = function(style, key, value) {
	var suffix = key.charAt(0).toUpperCase() + key.substring(1, key.length);
	style[prefix+suffix] = value;
};

StyleSheet.commonStep = function(target, key, fx) {
	var start = fx.start,
		end = fx.end,
		pos = fx.pos;	
	var result = (end - start) * pos + start;
	target.style(key, result);
};

StyleSheet.commonSteps = function(target, key, fx) {
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
	
	y: {
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
	
	z: {
		get: StyleSheet.commonGet,
		set: function(target, key, value) {
			StyleSheet.commonSet(target, key, value);
			target.style('transform3d', { perspective: value });
		},
		step: StyleSheet.commonStep
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
		step: StyleSheet.commonSteps
	},
	
	width: {
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
	
	height: {
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
		step: StyleSheet.commonSteps
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
					StyleSheet.commonCss(style, 'transform', target._mergeTransformText(t2d));
					if ('origin' in value || 'originX' in value || 'originY' in value) {
						StyleSheet.commonCss(style, 'transformOrigin', t2d.originX*100+'% ' + t2d.originY*100+'%');
					}
				}
			}
		},
		step: StyleSheet.commonSteps
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
				StyleSheet.commonCss(style, 'transformStyle', 'preserve-3d');
				StyleSheet.commonCss(style, 'backfaceVisibility', 'visible');
				StyleSheet.commonCss(style, 'transform', target._mergeTransform3DText(t3d));
				if ('originX' in value || 'originY' in value || 'originZ' in value) {
					StyleSheet.commonCss(style, 'transformOrigin', t3d.originX*100+'% ' + t3d.originY*100+'%');
				}
			};
		},
		step: StyleSheet.commonSteps
	},
	
	visible: {
		get: StyleSheet.commonGet,
		set: function(target, key, value) {
			StyleSheet.commonSet(target, key, value);		
			if (target.renderMode === 0) {
				target.elemStyle.display = value? 'block': 'none';
			}
		}
	},
		
	overflow: {
		get: StyleSheet.commonGet,
		set: function(target, key, value) {
			StyleSheet.commonSet(target, key, value);
			if (!target.renderMode) {
				target.elemStyle.overflow = value;
			}
		}
	},
	
	alpha: {
		get: StyleSheet.commonGet,
		set: function(target, key, value) {
			StyleSheet.commonSet(target, key, value);
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
		step: StyleSheet.commonStep
	},
	
	shadow: {
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
				target.elemStyle.boxShadow = value.offsetX+'px '+value.offsetY+'px '+value.blur+'px '+value.color;
			}
		},
		step: StyleSheet.commonSteps
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
		get: StyleSheet.commonGet,
		set: function(target, key, value) {
			target.fillColor = target.fillImage = null;
			if (typeof(value) === 'string') {
				value = StyleSheet.toGradient(value);
			}
			StyleSheet.commonSet(target, key, value);
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

define('Matrix2D',['require','exports','module','Class'],function (require, exports, module) {
	
	
var Class = require('Class');

var DEG_TO_RAD = Math.PI/180;

var Matrix2D = Class.extend({
	
	a: 1,
	b: 0,
	c: 0,
	d: 1,
	tx: 0,
	ty: 0,
	
	init: function(a, b, c, d, tx, ty) {
		this.a = (a == null) ? 1 : a;
		this.b = b || 0;
		this.c = c || 0;
		this.d = (d == null) ? 1 : d;
		this.tx = tx || 0;
		this.ty = ty || 0;
		return this;
	},
	
	prepend: function(a, b, c, d, tx, ty) {
		var tx1 = this.tx;
		if (a != 1 || b != 0 || c != 0 || d != 1) {
			var a1 = this.a;
			var c1 = this.c;
			this.a  = a1*a+this.b*c;
			this.b  = a1*b+this.b*d;
			this.c  = c1*a+this.d*c;
			this.d  = c1*b+this.d*d;
		}
		this.tx = tx1*a+this.ty*c+tx;
		this.ty = tx1*b+this.ty*d+ty;
		return this;
	},
	
	append: function(a, b, c, d, tx, ty) {
		var a1 = this.a;
		var b1 = this.b;
		var c1 = this.c;
		var d1 = this.d;

		this.a  = a*a1+b*c1;
		this.b  = a*b1+b*d1;
		this.c  = c*a1+d*c1;
		this.d  = c*b1+d*d1;
		this.tx = tx*a1+ty*c1+this.tx;
		this.ty = tx*b1+ty*d1+this.ty;
		return this;
	},
	
	prependMatrix: function(matrix) {
		this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
		return this;
	},
	
	appendMatrix: function(matrix) {
		this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
		return this;
	},
	
	prependTransform: function(x, y, scaleX, scaleY, rotation, skewX, skewY) {
		if (rotation%360) {
			var r = rotation*DEG_TO_RAD;
			var cos = Math.cos(r);
			var sin = Math.sin(r);
		} else {
			cos = 1;
			sin = 0;
		}

		if (skewX || skewY) {
			// TODO: can this be combined into a single prepend operation?
			skewX *= DEG_TO_RAD;
			skewY *= DEG_TO_RAD;
			this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
			this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
		} else {
			this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
		}
		return this;
	},
	
	appendTransform: function(x, y, scaleX, scaleY, rotation, skewX, skewY) {
		if (rotation%360) {
			var r = rotation*DEG_TO_RAD;
			var cos = Math.cos(r);
			var sin = Math.sin(r);
		} else {
			cos = 1;
			sin = 0;
		}

		if (skewX || skewY) {
			// TODO: can this be combined into a single append?
			skewX *= DEG_TO_RAD;
			skewY *= DEG_TO_RAD;
			this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
			this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
		} else {
			this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
		}
		return this;
	},
	
	rotate: function(angle) {
		var cos = Math.cos(angle);
		var sin = Math.sin(angle);

		var a1 = this.a;
		var c1 = this.c;
		var tx1 = this.tx;

		this.a = a1*cos-this.b*sin;
		this.b = a1*sin+this.b*cos;
		this.c = c1*cos-this.d*sin;
		this.d = c1*sin+this.d*cos;
		this.tx = tx1*cos-this.ty*sin;
		this.ty = tx1*sin+this.ty*cos;
		return this;
	},
	
	skew: function(skewX, skewY) {
		skewX = skewX*DEG_TO_RAD;
		skewY = skewY*DEG_TO_RAD;
		this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
		return this;
	},
	
	scale: function(x, y) {
		this.a *= x;
		this.d *= y;
		this.c *= x;
		this.b *= y;
		this.tx *= x;
		this.ty *= y;
		return this;
	},
	
	translate: function(x, y) {
		this.tx += x;
		this.ty += y;
		return this;
	},
	
	identity: function() {
		this.a = this.d = 1;
		this.b = this.c = this.tx = this.ty = 0;
		return this;
	},
	
	invert: function() {
		var a1 = this.a;
		var b1 = this.b;
		var c1 = this.c;
		var d1 = this.d;
		var tx1 = this.tx;
		var n = a1*d1-b1*c1;

		this.a = d1/n;
		this.b = -b1/n;
		this.c = -c1/n;
		this.d = a1/n;
		this.tx = (c1*this.ty-d1*tx1)/n;
		this.ty = -(a1*this.ty-b1*tx1)/n;
		return this;
	},
	
	isIdentity: function() {
		return this.tx == 0 && this.ty == 0 && this.a == 1 && this.b == 0 && this.c == 0 && this.d == 1;
	},
	
	transformPoint: function(x, y, pt) {
		pt = pt||{};
		pt.x = x*this.a+y*this.c+this.tx;
		pt.y = x*this.b+y*this.d+this.ty;
		return pt;
	}
});

return Matrix2D;
});

define('Ease',['require','exports','module'],function (require, exports, module) {
	
	
var Ease = function() {};

Ease.get = function(type) {
	// 获取过渡函数
	return easing[type] || easing.linear;
};

// 过渡函数，参见 https://github.com/gdsmith/jquery.easing
// t: current time, b: begInnIng value, c: change In value, d: duration
var easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	},
	
	easeIn: function (x, t, b, c, d) {
		return easing.easeInQuad(x, t, b, c, d);
	},
	easeOut: function (x, t, b, c, d) {
		return easing.easeOutQuad(x, t, b, c, d);
	},
	easeInOut: function (x, t, b, c, d) {
		return easing.easeInOutQuad(x, t, b, c, d);
	},
	expoIn: function(x, t, b, c, d) {
		return easing.easeInExpo(x, t, b, c, d);
	},
	expoOut: function(x, t, b, c, d) {
		return easing.easeOutExpo(x, t, b, c, d);
	},
	expoInOut: function(x, t, b, c, d) {
		return easing.easeInOutExpo(x, t, b, c, d);
	},
	bounceIn: function(x, t, b, c, d) {
		return easing.easeInBounce(x, t, b, c, d);
	},
	bounceOut: function(x, t, b, c, d) {
		return easing.easeOutBounce(x, t, b, c, d);
	},
	bounceInOut: function(x, t, b, c, d) {
		return easing.easeInOutBounce(x, t, b, c, d);
	},
	elasIn: function(x, t, b, c, d) {
		return easing.easeInElastic(x, t, b, c, d);
	},
	elasOut: function(x, t, b, c, d) {
		return easing.easeOutElastic(x, t, b, c, d);
	},
	elasInOut: function(x, t, b, c, d) {
		return easing.easeInOutElastic(x, t, b, c, d);
	},
	backIn: function(x, t, b, c, d) {
		return easing.easeInBack(x, t, b, c, d);
	},
	backOut: function(x, t, b, c, d) {
		return easing.easeOutBack(x, t, b, c, d);
	},
	backInOut: function(x, t, b, c, d) {
		return easing.easeInOutBack(x, t, b, c, d);
	}
};

Ease.easing = easing;
// 绑定jQuery
if (jQuery) {
	jQuery.extend(jQuery.easing, easing);
}

return Ease;
});

define('Tween',['require','exports','module','Class','Ticker','Ease'],function (require, exports, module) {
	
	
var Class = require('Class'),
	Ticker = require('Ticker'),
	Ease = require('Ease');
	
var Tween = Class.extend({
	
	pos: -1,
	start: null,
	end: null,

	_target: null,
	_options: null,
	_easing: null,
	_detlaTime: -1,
	_finish: false,
	
	init: function(target, props, options) {
		this.pos = 0;
		this.start = {};
		for (var i in props) {
			this.start[i] = this._clone(target.style(i));
		}
		this.end = props;
		
		this._target = target;
		this._options = options;
		this._easing = Ease.get(options.easing);
		this._detlaTime = 0;
		
		Tween._tweens.push(this);
	},
	
	remove: function() {
		var target = this._target;
		target.data('fx_queue', null);
		target.data('fx_cur_tween', null);
	},
	
	update: function(delta) {
		var target = this._target,
			options = this._options,
			easing = this._easing,
			duration = options.duration,
			percent = this._detlaTime/duration;
			
		if (percent >= 1) {
			this.pos = 1;
			this._finish = true;
		} else if (easing) {
			this.pos = easing(percent, duration*percent, 0, 1, duration);
		} else {
			this._detlaTime += delta;
			return;
		}
		
		for (var i in this.end) {
			target._stepStyle(i,  { 
				pos: this.pos, start: this.start[i], end: this.end[i]
			});
		}
		
		options.step && options.step();
		
		if (this._finish) {
			options.callback && options.callback();
			var queue = target.data('fx_queue');
			if (queue.length === 0) {
				target.data('fx_queue', null);
				target.data('fx_cur_tween', null);
			} else {
				var doAnimation = queue.shift();
				doAnimation();
			}
		} else {
			this._detlaTime += delta;
		}
	},
	
	_clone: function(origin) {
		var temp;
		if (typeof(origin) === 'object') {
			temp = {};
			for (var i in origin) {
				temp[i] = this._clone(origin[i]);
			}
 		} else {
			temp = origin;
		}		
		return temp;
	}
});

Tween._tweens = [];

Tween.update = function(delta) {
	var tweens = Tween._tweens;
	for (var i=tweens.length-1; i>=0; i--) {
		if (tweens[i]._finish) {
			tweens.splice(i, 1);
		}
	}
	for (var i=0,l=tweens.length; i<l; i++) {
		tweens[i].update(delta);
	}
}

Tween.option = function(speed, easing, callback) {
	if (speed && speed.duration) {
		return speed;
	} else {
		return {
			duration: speed || 300,
			easing: easing || 'linear',
			callback: callback
		}
	}
};

Tween.queue = function(target, props, speed, easing, callback) {
	var queue = target.data('fx_queue'),
		options = Tween.option(speed, easing, callback);
	
	if (typeof(props) === 'number') {
		options.duration = props;
		options.easing = 'none';
		props = {};
	}

	var doAnimation = function() {
		target.data('fx_cur_tween', new Tween(target, props, options));
	};
	
	if (queue) {
		queue.push(doAnimation);
	} else {
		doAnimation();
		target.data('fx_queue', []);
	}
}

return Tween;
});

define('DisplayObject',['require','exports','module','EventDispatcher','PrivateData','StyleSheet','Matrix2D','Tween'],function (require, exports, module) {
	
   	
var EventDispatcher = require('EventDispatcher'),
	PrivateData = require('PrivateData'),
	StyleSheet = require('StyleSheet'),
	Matrix2D = require('Matrix2D'),
	Tween = require('Tween');
   
var supportCanvas = !!document.createElement('canvas').getContext;
   	
var DisplayObject = EventDispatcher.extend({

	x: 0, // 坐标
	y: 0,
	
	width: 0, // 尺寸
	height: 0,
	
	visible: true, // 基础样式
	overflow: 'visible',
	alpha: 1,
	shadow: null,
	
	transform: null, // 2d&3d变换
	transform3d: null,
	
	parent: null, // 关联节点&元素
	elem: null,
	elemStyle: null,

	renderMode: 0, // 渲染模式,  0: dom,  1: canvas,  2: webgl
	blendMode: 'source-over',
	mouseEnabled: true,
	
	_tagName: 'div', // 私有属性
	_children: null,
	_matrix2d: null,
	_privateData: null,

	init: function(props) {
		// 设置渲染模式
		if (props.renderMode) {
			this.renderMode = props.renderMode;
		}
		if (this.renderMode === 0) {
			// 初始化dom节点
			var elem = props.elem;
			if (elem && typeof(elem) === 'string') {
				if (elem.match(/^\#[A-Za-z0-9]+$/)) {
					elem = document.getElementById(elem);
				} else if (elem.match(/^\.[A-Za-z0-9]+$/)) {
					elem = document.getElementsByClassName(elem)[0];
				} else {
					elem = document.querySelector(elem);
				}
			}
			this.elem = elem || document.createElement(this._tagName);
			this.elem.displayObj = this;
			this.elemStyle = this.elem.style;
			// 绑定jQuery
			if (jQuery) {
				this.$ = jQuery(this.elem);
			}
		} else {
			// 设置混色模式
			if (props.blendMode) {
				this.blendMode = props.blendMode;
			}
		}
		// 初始化私有属性
		this._children = [];
	    this._matrix2d = new Matrix2D();
		this._privateData = new PrivateData();
		// 初始化样式
		for (var i in props) {
			if (StyleSheet.has(i)) {
				this.style(i, props[i]);
			}
		}
		// 初始化2d变换
		if (!this.transform) {
			StyleSheet.init(this, 'transform');
		}
	},
	
	addChild: function(displayObj) {
		if (displayObj.parent) {
			displayObj.parent.removeChild(displayObj);
		}
		displayObj.parent = this;
		// 添加子节点
		if (displayObj.renderMode === 0) {
			if (this.elem) {
				this.elem.appendChild(displayObj.elem);
			}
		} else {
			this._children.push(displayObj);
		}
	},
	
	removeChild: function(displayObj) {
		if (displayObj.parent === this) {
			displayObj.parent = null;
			// 移除子节点
			if (displayObj.renderMode === 0) {
				if (this.elem) {
					this.elem.removeChild(displayObj.elem);
				}
			} else {
				var children = this._children;
				for (var i=children.length-1; i>=0; i--) {
					if (children[i] === displayObj) {
						children.splice(i, 1);
						break;
					}
				}
			}
		}
	},
	
	removeAllChildren: function() {
		var children, child;
		// 遍历移除子节点
		if (this.renderMode === 0) {
			var elem = this.elem;
			children = elem.children;
			while (children.length) {
				child = children[children.length - 1];
				if (child.displayObj) {
					child.displayObj.parent = null;
				}
				elem.removeChild(child);
			}
		} else {
			var index = -1;
			children = this._children;
			while (children.length) {
				index = children.length - 1;
				child = children[index];
				child.parent = null;
				children.splice(index, 1);
			}
		}
	},
	
	eachChildren: function(fn) {
		var children = this.renderMode === 0 ? 
					   this.elem.children : this._children,
			child;
		// 遍历执行函数	
		for (var i=0,l=children.length; i<l; i++) {
			child = this.renderMode === 0 ? 
					children[i].displayObj : children[i];
			if (child) {
				fn(child, i);
			}
		}
	},

	style: function(key, value) {
		// 设置样式，参见 jQuery.css()
		if (value === undefined) {
			return StyleSheet.get(this, key);
		} else {
			StyleSheet.set(this, key, value);
		}
	},
	
	data: function(key, value) {
		// 设置私有数据，参见 jQuery.data()
		if (value === undefined) {
			return this._privateData.get(key);
		} else {
			this._privateData.set(key, value);
		}
	},

	to: function(props, speed, easing, callback) {
		// 创建补间动画，参见 jQuery.animate()
		Tween.queue(this, props, speed, easing, callback);
		return this;
	},

	draw: function(ctx) {
		// canvas模式下绘制自己
		if (!this._children.length) return;
		
		if (this.overflow === 'hidden') {
			// 剪切溢出部分
		}
		
		var children = this._children, 
			child;
		// 遍历绘制子节点
		for (var i=0,l=children.length; i<l; i++) {
			child = children[i];
			// 判断是否可见
			if (child.visible) {
				ctx.save();
				child._drawCanvas(ctx);
				ctx.restore();
			}
		}
	},

	cache: function() {
		// 开启缓存，后期加入多缓存模式
		if (supportCanvas) {
			var canvas = document.createElement('canvas');
			canvas.width = this.width;
			canvas.height = this.height;
			
			this.draw(canvas.getContext('2d'));
			this._cacheCanvas = canvas;
		}
	},
	
	uncache: function() {
		// 关闭缓存
		this._cacheCanvas = null;
	},

	_stepStyle: function(key, fx) {
		// 补间动画逐帧更新样式
		StyleSheet.step(this, key, fx);
	},

	_updateTransform: function(key, value) {
		// 更新2d变换
		if (key === 'scale') {
			this.transform.scale = this.transform.scaleX = this.transform.scaleY = value;
		} else if (key in this.transform) {
			this.transform[key] = value;
		}
	},
	
	_updateTransform3D: function(key, value) {
		// 更新3d变换	
		if (key in this.transform3d) {
			this.transform3d[key] = value;
		}
	},
	
	_mergeTransformText: function(t2d) {
		// 合成2d变换的css样式
		var value = '';
		if (t2d.translateX !== 0 || t2d.translateY !== 0) {
			value += 'translate('+t2d.translateX+'px,'+t2d.translateY+'px'+')';
		}
		if (t2d.rotate !== 0) {
		    value += ' rotate('+t2d.rotate+'deg)';
		}
		if (t2d.scaleX !== 1 || t2d.scaleY !== 1) {
			value += ' scale('+t2d.scaleX+','+t2d.scaleY+')';	
		}
		if (t2d.skewX !== 0 || t2d.skewY !== 0) {
			value += ' skew('+t2d.skewX+'deg,'+t2d.skewY+'deg)';
		}
		return value;
	},
	
	_mergeTransform3DText: function(t3d) {
		// 合成3d变换的css样式
		var value = '';
		if (t3d.perspective !== 0) {
			value += 'perspective('+t3d.perspective+'px)';
		}
		if (t3d.translateX !== 0 || t3d.translateY !== 0 || t3d.translateZ !== 0) {
		    value += ' translate3d('+t3d.translateX+'px,'+t3d.translateY+'px,'+t3d.translateZ+'px)';
		}
		if (t3d.rotateX !== 0) {
		    value += ' rotateX('+t3d.rotateX+'deg)';
		}
		if (t3d.rotateY !== 0) {
		    value += ' rotateY('+t3d.rotateY+'deg)';
		}
		if (t3d.rotateZ !== 0) {
		    value += ' rotateZ('+t3d.rotateZ+'deg)';
		}
		if (t3d.scaleX !== 1 || t3d.scaleY !== 1 || t3d.scaleZ !== 1) {
			value += ' scale3d('+t3d.scaleX+','+t3d.scaleY+','+t3d.scaleZ+')';	
		}
		return value;
	},
	
	_drawCanvas: function(ctx) {
		// 更新上下文
		this._updateCanvasContext(ctx);
		// 绘制canvas
		if (this._cacheCanvas) {
			ctx.drawImage(this._cacheCanvas, 0, 0);
		} else {
			this.draw(ctx);
		}
	},
	
	_updateCanvasContext: function(ctx) {
		// 更新2d上下文
		var mtx = this._updateMatrix2D(),
			dx = this._getAnchorX(),
			dy = this._getAnchorY(),
			shadow = this.shadow;
		// 设置2d变换	
		if (dx === 0 && dy === 0) {
			ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
		} else {
			ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx+dx, mtx.ty+dy);
			ctx.transform(1, 0, 0, 1, -dx, -dy);
		}
		// 设置透明度&混色模式
		ctx.globalAlpha *= this.alpha;
		ctx.globalCompositeOperation = this.blendMode;
		// 设置阴影
		if (shadow) {
			ctx.shadowOffsetX = shadow.offsetX;
			ctx.shadowOffsetY = shadow.offsetY;
			ctx.shadowBlur = shadow.blur;
			ctx.shadowColor = shadow.color;	
		}
	},

	_getAnchorX: function() {
		// 获取x轴锚点
		return this.width * this.transform.originX;
	},

	_getAnchorY: function() {
		// 获取y轴锚点
		return this.height * this.transform.originY;
	},

	_updateMatrix2D: function(ieMatrix) {
		// 计算2d矩阵
		var mtx = this._matrix2d.identity(),
			t2d = this.transform;
		if (ieMatrix) {
			return mtx.rotate(-t2d.rotate%360*Matrix2D.DEG_TO_RAD).scale(t2d.scaleX, t2d.scaleY);
		} else {
			return mtx.appendTransform(this.x+t2d.translateX, this.y+t2d.translateY, t2d.scaleX, t2d.scaleY, t2d.rotate, t2d.skewX, t2d.skewY, 0, 0);
		}
	}
	
});

return DisplayObject;
});

define('Container',['require','exports','module','DisplayObject'],function (require, exports, module) {
	
	   
var DisplayObject = require('DisplayObject');
	
var Container = DisplayObject.extend({
	
	init: function(props) {
		this._super(props);
		this._initEvents(); // 初始化鼠标及触摸事件
	},
		
	_initEvents: function() {
		var self = this,
			elem = this.elem,
			target, moved,
			startX, startY;
		// 事件处理函数
		var handleDown = function(e) {
				e.preventDefault();
				// 检测点击对象
				target = self._hitTest(e.target);
				// 触发down事件
				self._triggerEvent('mousedown', target, e.clientX, e.clientY);
				// 标记起始状态
				moved = false;
				startX = e.clientX;
				startY = e.clientY;
			},
			handleUp = function(e) {
				e.preventDefault();
				// 触发up事件
				self._triggerEvent('mouseup', target, e.clientX, e.clientY);
				// 触发click事件
				if (!moved) {
					self._triggerEvent('click', target, e.clientX, e.clientY);
				}
				// 清除对象
				target = null;
			},
			handleMove = function(e) {
				e.preventDefault();
				// 触发move事件
				self._triggerEvent('mousemove', target, e.clientX, e.clientY);
				// 检测移动状态
				if (!moved && (Math.abs(e.clientX-startX) > 3 || Math.abs(e.clientY-startY) > 3)) {
					moved = true;
				}
			};
		// 兼容低版本ie
		if (!elem.addEventListener) {
			elem.addEventListener = elem.attachEvent;
		}
		// 绑定事件
		elem.addEventListener('mousedown', handleDown);
		elem.addEventListener('mouseup', handleUp);
		elem.addEventListener('mousemove', handleMove);
	},
	
	_triggerEvent: function(eventName, target, mouseX, mouseY) {
		if (target) {
			// 创建事件
			var evt = { 
				type: eventName, target: target,
				clientX: mouseX, clientY: mouseY
			};
			// 事件冒泡执行
			while (target) {	
				target.trigger(evt);
				target = target.parent;
			}
		}
	},
	
	_hitTest: function(elem) {
		var target;
		// 依次检测displayObj对象
		while (!target && elem && elem !== this.elem) {
			target = elem.displayObj;
			elem = elem.parentNode;
		}
		
		return target;
	}
	
});
	
return Container;
});

define('Canvas',['require','exports','module','DisplayObject','Matrix2D'],function (require, exports, module) {
	
	   
var DisplayObject = require('DisplayObject'),
	Matrix2D = require('Matrix2D');
	
var Canvas = DisplayObject.extend({
	
	_tagName: 'canvas',
	_ctx: null,
	_useElemSize: true,
		
	init: function(props) {
		this._super(props);
		this._initEvents(); // 初始化鼠标及触摸事件
		this._ctx = this.elem.getContext('2d'); // 获取2d上下文
	},
	
	removeAllChildren: function() {
		var children = this._children,
			index, child;
		// 遍历移除子节点
		while (children.length) {
			index = children.length - 1;
			child = children[index];
			child.parent = null;
			children.splice(index, 1);
		}
	},
	
	eachChildren: function(fn) {
		var children = this._children;
		// 遍历执行函数	
		for (var i=0,l=children.length; i<l; i++) {
			fn(children[i], i);
		}
	},
		
	update: function() {
		var ctx = this._ctx;
		// 重绘画布
		ctx.clearRect(0, 0, this.width, this.height);
		this.draw(ctx);
	},
		
	_initEvents: function() {
		var self = this,
			elem = this.elem,
			target, moved,
			startX, startY;
		// 事件处理函数
		var handleDown = function(e) {
				e.preventDefault();
				// 检测点击对象
				target = self._hitTest(self._children, e.offsetX, e.offsetY);
				// 触发down事件
				self._triggerEvent('mousedown', target, e.offsetX, e.offsetY);
				// 标记起始状态
				moved = false;
				startX = e.offsetX;
				startY = e.offsetY;
			},
			handleUp = function(e) {
				e.preventDefault();
				// 触发up事件
				self._triggerEvent('mouseup', target, e.offsetX, e.offsetY);
				// 触发click事件
				if (!moved) {
					self._triggerEvent('click', target, e.offsetX, e.offsetY);
				}
				// 清除对象
				target = null;
			},
			handleMove = function(e) {
				e.preventDefault();
				// 触发move事件
				self._triggerEvent('mousemove', target, e.offsetX, e.offsetY);
				// 检测移动状态
				if (!moved && (Math.abs(e.offsetX-startX) > 3 || Math.abs(e.offsetY-startY) > 3)) {
					moved = true;
				}
			};
		// 兼容低版本ie
		if (!elem.addEventListener) {
			elem.addEventListener = elem.attachEvent;
		}
		// 绑定事件
		elem.addEventListener('mousedown', handleDown);
		elem.addEventListener('mouseup', handleUp);
		elem.addEventListener('mouseout', handleUp);
		elem.addEventListener('mousemove', handleMove);
	},
	
	_triggerEvent: function(eventName, target, mouseX, mouseY) {
		if (target) {
			// 创建事件
			var evt = { 
				type: eventName, target: target,
				clientX: mouseX, clientY: mouseY
			};
			// 事件冒泡执行
			while (target) {	
				target.trigger(evt);
				target = target.parent;
			}
		}
	},
	
	_hitTest: function(children, mouseX, mouseY) {
		var child;
		// 遍历检测点击对象
		for (var i=children.length-1; i>=0; i--) {
			child = children[i];
			// 容器节点，递归检测
			if (child._children.length) {
				child = this._hitTest(child._children, mouseX, mouseY);
				if (child) {
					return child;	
				}
			}
			// 普通节点，检测矩阵
			else if (this._hitTestMatrix(child, mouseX, mouseY)) {	
				return child;
			}
		}
		
		return null;
	},
	
	_hitTestMatrix: function(child, mouseX, mouseY) {
		var matrix = new Matrix2D(),
			objs = [],
			dx, dy, mtx;
		// 依次加入层节点
		while (child && child !== this) {
			objs.unshift(child);
			child = child.parent;
		}
		// 运算鼠标偏移量
		matrix.append(1, 0, 0, 1, -mouseX, -mouseY);
		// 矩阵运算
		for (var i=0, l=objs.length; i<l; i++) {
			child = objs[i];
			mtx = child._matrix2d;
			dx = child._getAnchorX();
			dy = child._getAnchorY();
			// 添加节点矩阵
			if (dx === 0 && dy === 0) {
				matrix.append(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
			} else {
				matrix.append(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx+dx, mtx.ty+dy);
				matrix.append(1, 0, 0, 1, -dx, -dy);
			}
		}
		// 反转矩阵，计算相对位置
		matrix.invert();
		// 判断鼠标位置
		var x = matrix.tx, 
			y = matrix.ty,
			r = child.radius,
			w = child.width,
			h = child.height;
		if (r) {
			return r*r >= (x-r)*(x-r) + (y-r)*(y-r);
		}
		else if (w && h) {
			return x >= 0 && x <= w && y >= 0 && y <= h;
		}
		
		return false;
	}
	
});
	
return Canvas;
});

define('Graphics2D',['require','exports','module'],function (require, exports, module) {
	
	   
var Graphics2D = function() {};

Graphics2D.get = function(type) {
	// 获取2d图形
	return Graphics2D.shapes[type];
}

Graphics2D.commonStyle = function(target, graphics) {
	// 设置绘图样式
	target.style('fill', graphics.fill);
	target.style('stroke', graphics.stroke);
	target.style('lineWidth', graphics.lineWidth);
}

Graphics2D.commonDraw = function(ctx, isFill, isStroke) {
	// 绘制图形
	if (isFill) ctx.fill();
	if (isStroke) ctx.stroke();
}

Graphics2D.shapes = {
	rect: {
		type: 'rect',
		init: function(graphics) {
			this.style('size', graphics);
			// 设置通用样式
			Graphics2D.commonStyle(this, graphics);
		},
		draw: function(ctx) {
			// 绘制矩形
			if (this.fillStyle(ctx)) {
				ctx.fillRect(0, 0, this.width, this.height);
			}
			if (this.strokeStyle(ctx)) {
				ctx.strokeRect(0, 0, this.width, this.height);
			}
		}
	},
	
	circle: {
		type: 'circle',
		init: function(graphics) {
			if (graphics.angle === undefined) {
				graphics.angle = 360;
			}
			this.style('radius', graphics.radius);
			this.style('angle', graphics.angle);
			// 设置通用样式
			Graphics2D.commonStyle(this, graphics);
		},
		draw: function(ctx) {
			var radius = this.radius,
				isFill = this.fillStyle(ctx),
				isStroke = this.strokeStyle(ctx);
			// 绘制圆
			ctx.beginPath();
			ctx.arc(radius, radius, radius, 0, this.angle/360 * Math.PI*2, 0);
			if (this.angle < 360) {
				ctx.lineTo(radius, radius);
			}
			ctx.closePath();
			Graphics2D.commonDraw(ctx, isFill, isStroke);
		}
	},
	
	ellipse: {
		type: 'ellipse',
		init: function(graphics) {
			this.style('radiusXY', graphics);
			// 设置通用样式
			Graphics2D.commonStyle(this, graphics);
		},
		draw: function(ctx) {
			var k = 0.5522848,
				rx = this.radiusX,
				ry = this.radiusY,
				kx = rx * k,
				ky = ry * k,
				w = rx * 2,
				h = ry * 2,
				isFill = this.fillStyle(ctx),
				isStroke = this.strokeStyle(ctx);
			// 绘制椭圆
			ctx.beginPath();
			ctx.moveTo(0, ry);
			ctx.bezierCurveTo(0, ry-ky, rx-kx, 0, rx, 0);
			ctx.bezierCurveTo(rx+kx, 0, w, ry-ky, w, ry);
			ctx.bezierCurveTo(w, ry+ky, rx+kx, h, rx, h);
			ctx.bezierCurveTo(rx-kx, h, 0, ry+ky, 0, ry);
			ctx.closePath();
			Graphics2D.commonDraw(ctx, isFill, isStroke);
		}
	},
	
	line: {
		type: 'line',
		init: function(graphics) {
			this.path = graphics.path;
			this.style('stroke', graphics.stroke);
			this.style('lineWidth', graphics.lineWidth);
		},
		draw: function(ctx) {
			var path = this.path, line, 
				isStroke = this.strokeStyle(ctx);
			// 绘制线段
			if (isStroke && path.length > 1) {
				ctx.beginPath();
				for (var i=0, l=path.length; i<l; i++) {
					line = path[i];
					if (i === 0) {
						ctx.moveTo(line[0], line[1]);
					} else {
						if (line.length === 2) {
							ctx.lineTo(line[0], line[1]);	
						} else if (line.length === 4) {
							ctx.quadraticCurveTo(line[0], line[1], line[2], line[3]);		
						} else if (line.length === 6) {
							ctx.bezierCurveTo(line[0], line[1], line[2], line[3], line[4], line[5]);		
						}
					}
				}
				ctx.stroke();
			}
		}
	},
	
	ploygon: {
		type: 'ploygon',
		init: function(graphics) {
			this.path = graphics.path;
			// 设置通用样式
			Graphics2D.commonStyle(this, graphics);
		},
		draw: function(ctx) {
			var path = this.path, line,
				isFill = this.fillStyle(ctx),
				isStroke = this.strokeStyle(ctx);
			// 绘制多边形
			if (path.length > 2) {
				ctx.beginPath();
				for (var i=0, l=path.length; i<l; i++) {
					line = path[i];
					if (i === 0) {
						ctx.moveTo(line[0], line[1]);
					} else {
						if (line.length === 2) {
							ctx.lineTo(line[0], line[1]);	
						} else if (line.length === 4) {
							ctx.quadraticCurveTo(line[0], line[1], line[2], line[3]);		
						} else if (line.length === 6) {
							ctx.bezierCurveTo(line[0], line[1], line[2], line[3], line[4], line[5]);		
						}
					}
				}
				ctx.closePath();
				Graphics2D.commonDraw(ctx, isFill, isStroke);
			}
		}
	},
	
	polyStar: {
		type: 'polyStar',
		init: function(graphics) {
			this.sides = graphics.sides;
			this.cohesion = graphics.cohesion;
			this.style('radius', graphics.radius);
			// 设置通用样式
			Graphics2D.commonStyle(this, graphics);
		},
		draw: function(ctx) {
			var radius = this.radius,
				sides = this.sides,
				cohesion = this.cohesion,
				angle, x, y, 
				isFill = this.fillStyle(ctx),
				isStroke = this.strokeStyle(ctx);
			// 绘制等多边形
			ctx.beginPath();
			for (var i=0; i<sides; i++) {
				angle = i/sides * Math.PI*2;
				x = (1 - Math.sin(angle)) * radius;
				y = (1 - Math.cos(angle)) * radius;
				if (i === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
				if (cohesion) {
					angle += Math.PI/sides;
					x = (1 - Math.sin(angle) * cohesion) * radius;
					y = (1 - Math.cos(angle) * cohesion) * radius;
					ctx.lineTo(x, y);
				}
			}
			ctx.closePath();
			Graphics2D.commonDraw(ctx, isFill, isStroke);
		}
	},
	
	roundRect: {
		type: 'roundRect',
		init: function() {
			
		},
		draw: function() {
			
		}
	},
	
	lines: {
		type: 'lines',
		init: function(graphics) {
			this.paths = graphics.paths;
			this.style('stroke', graphics.stroke);
			this.style('lineWidth', graphics.lineWidth);
		},
		draw: function(ctx) {
			var paths = this.paths,
				path, line, 
				isStroke = this.strokeStyle(ctx);
			// 绘制多重线段
			if (isStroke && paths.length) {
				ctx.beginPath();
				for (var j=0, jl=paths.length; j<jl; j++) {
					path = paths[j];
					if (path.length > 1) {
						for (var i=0, l=path.length; i<l; i++) {
							line = path[i];
							if (i === 0) {
								ctx.moveTo(line[0], line[1]);
							} else {
								if (line.length === 2) {
									ctx.lineTo(line[0], line[1]);	
								} else if (line.length === 4) {
									ctx.quadraticCurveTo(line[0], line[1], line[2], line[3]);		
								} else if (line.length === 6) {
									ctx.bezierCurveTo(line[0], line[1], line[2], line[3], line[4], line[5]);		
								}
							}
						}
					}
				}
				ctx.stroke();
			}
		}
	}
}

return Graphics2D;
});

define('Shape',['require','exports','module','DisplayObject','Graphics2D'],function (require, exports, module) {
	
	   
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
			ctx.lineJoin = this.lineJoin || 'round';
			if (this.snapToPixel && ctx.lineWidth === 1) {
				var mtx = this._matrix2d;
				ctx.translate(mtx.tx>=0?0.5:-0.5, mtx.ty>=0?0.5:-0.5);
			}
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

define('Filter',['require','exports','module'],function (require, exports, module) {
	
	
var Filter = function() {};

Filter.get = function(image, type, value) {
	var filter = Filter.filters[type];
	// 获取滤镜处理后的图像
	if (filter) {
		return filter(image, value);
	}
};

Filter.filters = {
	grayscale: function(image, value) {
		// 处理灰阶效果
		var canvas = document.createElement('canvas');
		canvas.width = image.width;
		canvas.height = image.height;
		
		var ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0);
		
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
			data = imageData.data,
			pixel;
			
		for (var i=0, l=data.length; i<l; i+=4) {
			pixel = (data[i] + data[i+1] + data[i+2]) / 3;
			data[i] = data[i+1] = data[i+2] = pixel;
		}
	
		ctx.putImageData(imageData, 0, 0);
	
		return canvas;
	},
	
	brightness: function(image, value) {
		// 处理高亮效果
		var canvas = document.createElement('canvas');
		canvas.width = image.width;
		canvas.height = image.height;
		
		var ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0);
		
		ctx.globalCompositeOperation = 'lighter';
		ctx.drawImage(image, 0, 0);
		
		return canvas;	
	},
	
	impression: function(image, value) {
		// 处理印象派效果
		var canvas = document.createElement('canvas');
		canvas.width = image.width;
		canvas.height = image.height;
		
		var ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0);
		
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
			data = imageData.data,
			text = ['1', '0'],
			pixels = [];
			
		for (var i=0, l=data.length; i<l; i+=16) {
			if (Math.floor(i / 4 / canvas.width) % 4) {
				continue;
			}
			pixels.push([
				'rgba('+ data[i] +','+ data[i+1] +','+ data[i+2] +','+ data[i+3] +')', // color
				text[ Math.floor( Math.random() * text.length ) ], // text
				i / 4 % canvas.width, // x
				Math.floor(i / 4 / canvas.width) // y
			]);
		}

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font = '40px Microsoft Yahei';
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		ctx.globalAlpha = 0.25;

		var idx, pixel;
		while (pixels.length) {
			idx = Math.floor(Math.random() * pixels.length);
			pixel = pixels[idx];
			ctx.fillStyle = pixel[0];
			ctx.fillText(pixel[1], pixel[2], pixel[3]);
			pixels.splice(idx, 1);
		}
		
		return canvas;
	},
	
	rilievo: function(image, value) {
		// 处理浮雕效果
		var canvas = document.createElement('canvas');
		canvas.width = image.width;
		canvas.height = image.height;
		
		var ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0);
		
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
			data = imageData.data,
			next, diff, pixel,
			test = function(val) {
				// 判断是否超出范围
				if (val < 0) {
					val = 0;
				} else if (val > 255) {
					val = 255;
				}
				return val;
			};
			
		for (var i=0, l=data.length; i<l; i+=4) {
			next = i+4;
			if (data[next] === undefined) {
				next = i;
			}
			diff = Math.floor((data[next] + data[next+1] + data[next+2]) - (data[i] + data[i+1] + data[i+2]));
			pixel = test(diff + 128);
			data[i] = data[i+1] = data[i+2] = pixel;
		}
	
		ctx.putImageData(imageData, 0, 0);
	
		return canvas;
	}
}
	
return Filter;
});

define('Bitmap',['require','exports','module','DisplayObject','Filter'],function (require, exports, module) {
	
	   
var DisplayObject = require('DisplayObject'),
	Filter = require('Filter');

var supportCanvas = !!document.createElement('canvas').getContext,
	divStyle = document.createElement('div').style,
	prefix = divStyle.webkitTransform === ''? 'webkit' :
    		 divStyle.WebkitTransform === ''? 'Webkit' :
    		 divStyle.msTransform === ''? 'ms' :
    		 divStyle.MozTransform === ''? 'Moz' : 'ct';

var Bitmap = DisplayObject.extend({
	
	_image: null,
	_sourceRect: null,
	_sourceCanvas: null,
	_scaleToFit: false,
	
	init: function(props) {
		this._super(props);
		this._initImage(props); // 初始化图像资源
	},
	
	_initImage: function(props) {
		var image = props.image;
		
		if (props.sourceRect) { // 剪裁
			this._sourceRect = props.sourceRect;
			this.style('size', { width: this._sourceRect[2], height: this._sourceRect[3] });
		}
		else if (props.scaleToFit)  { // 平铺 
			this._scaleToFit = props.scaleToFit;
		}
		
		if (this.renderMode === 0) { // dom方式渲染
			this.elemStyle.backgroundImage = 'url('+image+')';	
			this.elemStyle.backgroundRepeat = 'no-repeat';
			if (this._sourceRect) { // 处理剪裁
				this.elemStyle.backgroundPosition = '-' + this._sourceRect[0] + 'px -' + this._sourceRect[1] + 'px';
			} 
			else if (this._scaleToFit) { // 处理平铺
				this.elemStyle.backgroundSize = '100% 100%';
			}
		} 
		else if (this.renderMode === 1) { // canvas方式渲染
			if (typeof(image) === 'string') { // 初始化image
				this._image = new Image();
				this._image.src = image;
			} else {
				this._image = image;
			}
		}
	},
		
	draw: function(ctx) {
		if (this._image.complete) {
			var image = this._sourceCanvas || this._image;

			if (this._sourceRect) { // 处理剪裁
				ctx.drawImage(image, this._sourceRect[0], this._sourceRect[1], this.width, this.height, 0, 0, this.width, this.height);
			} 
			else if (this._scaleToFit) { // 处理平铺
				ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, this.width, this.height);
			} 
			else { // 绘制image
				ctx.drawImage(image, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
			}
		}
	},
	
	applyFilter: function(type, value) {
		if (this.renderMode === 0) { // dom方式添加滤镜
			this.elemStyle[prefix + 'Filter'] = type ? (type + '(' + value + ')') : '';
		} 
		else if (this.renderMode === 1) { // canvas方式添加滤镜
			var image = this._image;
			
			if (image.complete) {
				this._sourceCanvas = (type && supportCanvas) ? Filter.get(image, type, value) : null;
			} 
			else {
				var self = this;
				// 兼容低版本ie		
				if (!image.addEventListener) {
					image.addEventListener = image.attachEvent;
				}
				// 加载完成后执行
				image.addEventListener('load', function() {
					self.applyFilter(type, value);
				});
			}
		}	
	}
	
});
	
return Bitmap;
});

define('Text',['require','exports','module','DisplayObject'],function (require, exports, module) {
	
	   
var DisplayObject = require('DisplayObject');
	
var Text = DisplayObject.extend({
	
	text: null,
	
	init: function(props) {
		this._super(props);
		this._setText(props);
	},
	
	draw: function(ctx) {
		ctx.font = this.font;
		ctx.textAlign = this.textAlign;
		ctx.textBaseline = this.textBaseline;
		ctx.fillStyle = this.fillColor;
		ctx.fillText(this.text, 0, 0);
	},
	
	_setText: function(props) {
		this.text = props.text || '';
		this.font = props.font || '20px Microsoft Yahei';
		this.textAlign = props.textAlign || 'left';
		this.textBaseline = props.textBaseline || 'top';
		this.fillColor = props.fill || 'black';
		
		if (!this.renderMode) {
			this.elem.innerHTML = this.text;
		}
	}
});

return Text;
});

define('Timeline',['require','exports','module','Class','Ease'],function (require, exports, module) {
	
	   
var Class = require('Class'),
	Ease = require('Ease');

var Timeline = Class.extend({
	
	_paused: false,
	_finish: false,
	_target: null,
	_targets: null,
	_deltaTime: -1,
	
	init: function() {
		this._targets = [];
		this._deltaTime = 0;
	},
	
	setNowTime: function(timepoint) {
		this._deltaTime = timepoint;
	},
	
	has: function(target) {
		var t = this._targets, l = t.length;
        for (var i=l-1;i>=0;i--) {
        	if(t[i] === target) {
            	return true;
            }
        }
        return false;
	},
	
	get: function(target) {
		if (!this.has(target)) {
			this.removeKeyframes(target);
			this._targets.push(target);
		}
		this._target = target;
		
		return this;
	},
		
	addKeyframe: function(props, timepoint, easing, callback) {
		var target = this._target,
			queue = target.data('tl_queue'),
			start = target.data('tl_start');
			
		if (!queue) {
			queue = [];
			start = {};
			target.data('tl_queue', queue);
			target.data('tl_start', start);			
		}
		for (var i in props) {
			start[i] = this._clone(target.style(i));
		}
		
		queue.push([props, timepoint, easing || 'linear', callback]);
		queue.sort(function(a, b) {
			return a[1]-b[1];
		})
		
		var steps = [], 
			step,
			from = 0,
			max = 0;
		for (var i=0,l=queue.length; i<l; i++) {
			step = queue[i];
			if (i === 0) {
				steps.push({
					from: step[1]===0?-1:0, to: step[1],
					start: start, end: step[0],
					ease: step[2], cb: step[3]
				})
			} else {
				steps.push({
					from: from, to: step[1],
					start: start, end: step[0],
					ease: step[2], cb: step[3]
				})
			}
			from = step[1];
			start = this._merge(start, step[0]);
		}
		target.data('tl_steps', steps);

		return this;
	},
	
	removeKeyframes: function(target) {
		target.data('tl_queue', null);
		target.data('tl_start', null);
		target.data('tl_steps', null);
		target.data('tl_cur_step', null);
	},
	
	update: function(delta) {
		if (this._paused) return;
		
		var deltaTime = this._deltaTime,
			targets = this._targets,
			target,
			steps,
			step,
			cur,
			duration,
			percent,
			easing,
			pos,
			end,
			max = 0;
		
		for (var j=0,jl=targets.length; j<jl; j++) {
			target = targets[j];
			steps = target.data('tl_steps');
			cur = target.data('tl_cur_step');
			end = steps[steps.length-1].to;
			
			if (cur) {
				if (deltaTime >= cur.from && deltaTime <= cur.end) {
					step = cur;
				} else {
					cur.cb && cur.cb();
				}
			}
			
			if (!step) {
				for (var i=0,l=steps.length; i<l; i++) {
					if (deltaTime >= steps[i].from && deltaTime <= steps[i].to) {
						step = steps[i];
						target.data('tl_cur_step', step);
						target.style(step.start);
						break;
					}
				}
			}
			
			if (step) {
				duration = step.to-step.from;
				percent = (deltaTime-step.from)/duration;
				easing = Ease.get(step.ease);
				
				if (easing) {
					pos = easing(percent, duration*percent, 0, 1, duration);
					for (var key in step.end) {
						target._stepStyle(key, {
							pos: pos, start: step.start[key], end: step.end[key]
						});
					}
				}
				
				step = null;
			}
			
			if (max < end) {
				max = end;
			}
		}
		
		if (deltaTime >= max) {
			this._deltaTime = 0;
		} else {
			this._deltaTime += delta;
		}
	},
	
	_clone: function(origin) {
		var temp;
		if (typeof(origin) === 'object') {
			temp = {};
			for (var i in origin) {
				temp[i] = this._clone(origin[i]);
			}
 		} else {
			temp = origin;
		}		
		return temp;
	},
	
	_merge: function(origin, extension) {
		var temp = this._clone(origin);
		
		if (typeof(extension) === 'object') {
			for (var i in extension) {
				if (typeof(temp[i]) === 'object' && typeof(extension[i]) === 'object') {
					for (var j in extension[i]) {
						temp[i][j] = extension[i][j];
					}
				} else {
					temp[i] = extension[i];
				}
			}
 		} else {
			temp = extension;
		}
		return temp;
	}
});

return Timeline;
});

define('Sprite',['require','exports','module','DisplayObject'],function (require, exports, module) {
	
	   
var DisplayObject = require('DisplayObject');

var Sprite = DisplayObject.extend({
	
	animationName: '',
	
	_paused: true,
		
    _images: null,
    _imageIndex: -1,
    
    _animations: null,
    _currentAnimation: null,
    
    _frames: null,
    _currentFrame: null,
    
    _deltaTime: -1,
   	_frameIndex: -1,
    
    init: function(props) {
		this._super(props);		
		this._initSpriteSheet(props.spriteSheet);
	},
	
    play: function(name){
    	var animation = this._animations[name];
    	
        if (animation) {
        	this.animationName = name;        	
            this._currentAnimation  = animation;
 
            this._deltaTime = 0;
            this._frameIndex = 0;
            this._paused = false;
  		}
    },
    
    gotoAndStop: function(index) {
    	var frame = this._frames[index];
    	
    	this._playFrame(frame);
    	this._paused = true;
    },
    
    update: function(delta){
     	if (this._paused || !this._currentAnimation) return;
     	
     	var anim = this._currentAnimation,
     		start = anim[0],
     		end = anim[1],
     		next = anim[2],
     		delay = anim[3];
     	
     	var pos, index;
     	
     	if (delay > 0) {
     		pos = this._deltaTime/delay,
     		index = Math.floor((end-start+1)*pos+start);
     		this._deltaTime += delta;
     	} else {
     		index = this._frameIndex+start;
     		this._frameIndex += 1;
     	}

     	var frame = this._frames[ index>end? end: index ];
        this._playFrame(frame);
		
        if (delay > 0 ? (this._deltaTime > delay) : (this._frameIndex > end-start)) {
        	next = (this.animationEnd && this.animationEnd()) || next;
            if (next) {
                this.play(next);	
            } else {
            	this._deltaTime = 0;
            	this._frameIndex = 0;
            }
        }
	},
       
    draw: function(ctx){
     	var frame = this._currentFrame;
     	 
     	if (frame) {
	     	var	image = this._images[frame[4]];
	     	if (image && image.complete) {
	     		ctx.drawImage(image, frame[0], frame[1], frame[2], frame[3], frame[5], frame[6], frame[2], frame[3]);
	     	}
     	}
     },

	_initSpriteSheet: function(spriteSheet) {
		this._initImages(spriteSheet.images);
        this._initFrames(spriteSheet.frames);
        this._animations = spriteSheet.animations;
     },
	
	_initImages: function(images) {
		this._images = [];
		
		var image;
		
		for(var i=0,l=images.length; i<l; i++) {
			if (this.renderMode) {
				image = new Image();
				image.src = images[i];
			} else {
				image = images[i];
			}
			this._images.push(image);
		}
	},
	
	_initFrames: function(frames, append) {
		if (!append) {
			this._frames = [];
		}
		
		if (frames instanceof Array) {
			for (var i=0,l=frames.length; i<l; i++) {
				if (frames[i] instanceof Array) {
					this._frames.push(frames[i]);
				} else {
					this._initFrames(frames[i], true);
				}
			}
		} else {
			for (var j=0, jl=frames.rows; j<jl; j++) {
				for (var i=0, il=frames.cols; i<il; i++) {
					if ((j*frames.cols+i) === frames.num) {
						break;
					} else {
						this._frames.push([
							i*frames.width, j*frames.height,
							frames.width, frames.height,
							frames.img||0, 0, 0
						]);	
					}
				}
			}	
		}
	},
	
	_playFrame: function(frame) {
		if (this.renderMode) {
        	this._currentFrame = frame;
        } else {
        	if (this.width !== frame[2] || this.height !== frame[3]) {
        		this.style('size', { width: frame[2], height: frame[3] })
        	}
        	if (this._imageIndex !== frame[4]) {
        		this.elemStyle.backgroundImage = 'url('+this._images[frame[4]]+')';
        		this.elemStyle.backgroundRepeat = 'no-repeat';
        		this._imageIndex = frame[4];
        	}
        	this.elemStyle.backgroundPosition = '-'+frame[0]+'px -'+frame[1]+'px';
        }
	}
});

return Sprite;
});
define('ParticleEmitter',['require','exports','module','Shape','Bitmap'],function (require, exports, module) {
	
	
var	Shape = require('Shape'),
	Bitmap = require('Bitmap');
	   
var ParticleEmitter = function() {};

ParticleEmitter.get = function(type) {

	return ParticleEmitter.particles[type];
}

ParticleEmitter.particles = {	
	rain: {
		type: 'rain',
		init: function(particle) {
			var width = particle.width,
				height = particle.height,
				particle;
				
			this.particles = [];
			this.data('fall_width', width);
			this.data('fall_height', height);
			
			for(var i=0,l=particle.num||60; i<l; i++) {
				particle = new Shape({
					renderMode: this.renderMode,
					pos: { x: Math.floor(Math.random()*width), y: -Math.floor(Math.random()*height) },
					graphics: {
						type: 'rect', width: i%6===0?3:2, height: i%3===0?24:16, fill: '#FFF'
					},
					alpha: Math.floor(Math.random()*3)/10+0.2
				});
				
				particle.data('fall_speed', Math.floor(Math.random()*25)/100+0.25);
				this.particles.push(particle);
				this.addChild(particle);
			}
		},
		update: function(delta) {
			var particles = this.particles,
				width = this.data('fall_width'),
				height = this.data('fall_height'),
				particle, dis, y;
				
			for (var i=0,l=particles.length; i<l; i++) {
				particle = particles[i];
				dis = particle.data('fall_speed')*delta;
				y = particle.y;
				if (y > height) {
					y = -Math.floor(Math.random()*height);
				}
				particle.style('y', y+dis);
			}
		}
	},
	
	snow: {
		type: 'snow',
		init: function(particle) {
			var width = particle.width,
				height = particle.height,
				image, radius, pos, alpha,
				particle;
			
			if (particle.image) {
				image = new Image();
				image.src = particle.image;
			}
			this.particles = [];
			this.data('fall_width', width);
			this.data('fall_height', height);
			
			for (var i=0,l=particle.num||60; i<l; i++) {
				pos = { x: Math.floor(Math.random()*width), y: -Math.floor(Math.random()*height) };
				radius = Math.floor(Math.random()*8)+12;
				alpha = Math.floor(Math.random()*4)/10+0.6;
				
				particle = image ? new Bitmap({
					renderMode: this.renderMode,
					pos: pos, width: radius, height: radius, scaleToFit: true,
					image: image, alpha: alpha
				}) : new Shape({
					renderMode: this.renderMode,
					pos: pos, alpha: Math.floor(Math.random()*5)/10+0.3,
					graphics: {
						type: 'circle', radius: Math.floor(Math.random()*3)+4, fill: '#FFF', angle: 360
					}
				});
				
				particle.data('fall_x', particle.x);
				particle.data('fall_width', Math.floor(Math.random()*10 + 10));
				particle.data('fall_speed', Math.floor(Math.random()*15 + 15)/1000);
				this.particles.push(particle);
				this.addChild(particle);
			}
		},
		update: function(delta) {
			var particles = this.particles,
				width = this.data('fall_width'),
				height = this.data('fall_height'),
				particle, dis, x, y;
				
			for (var i=0,l=particles.length; i<l; i++) {
				particle = particles[i];
				dis = particle.data('fall_speed')*delta;
				x = particle.data('fall_x');
				y = particle.y;
				if (y > height) {
					particle.fallTime = 0;
					y = -Math.floor(Math.random()*height);
				}
				particle.style('pos', { x: x + Math.sin(y/50)*particle.data('fall_width'), y: y+dis });
			}
		}
	}
}

return ParticleEmitter;
});

define('ParticleSystem',['require','exports','module','DisplayObject','ParticleEmitter'],function (require, exports, module) {
	
	   
var DisplayObject = require('DisplayObject'),
	ParticleEmitter = require('ParticleEmitter');

var ParticleSystem = DisplayObject.extend({
	
	emitter: null,
	particles: null,
	
	init: function(props) {
		this._super(props);
		this._initParticle(props.particle);
	},
	
	update: function(delta) {
		if (this.emitter) {
			this.emitter.update.call(this, delta);
		}
	},
	
	_initParticle: function(particle) {
		var type = particle.type,
			emitter = type? ParticleEmitter.get(type): particle;
			
		if (emitter && emitter.init && emitter.update) {
			this.emitter = emitter;
			emitter.init.call(this, particle);
		}
	}
});

return ParticleSystem;
});

define('BoneAnimation',['require','exports','module','DisplayObject','Timeline','Bitmap'],function (require, exports, module) {
	
	   
var DisplayObject = require('DisplayObject'),
	Timeline = require('Timeline'),
	Bitmap = require('Bitmap');

var BoneAnimation = DisplayObject.extend({
	
	animationName: '',
	
	_paused: true,
	_bones: null,
	_animations: null,
	_currentAnimation: null,
	_timeline: null,
	
	init: function(props) {
		this._super(props);
		this._initBones(props); // 初始化骨骼节点
	},

	play: function(name) {
		var animation = this._animations[name];

        if (animation) {
        	this.animationName = name;
            
            this._currentAnimation = animation;
            this._timeline = this._initTimeline(animation); // 创建动画时间轴
            this._paused = false;
  		}
	},
	
	update: function(delta) {
		if (this._paused || !this._currentAnimation) return;
		// 播放时间轴动画
		this._timeline.update(delta);
	},
	
	_initBones: function(props) {
		this._bones = {};
		this._animations = {};
		
		var bones = props.bones,
			animations = props.animations,
			bone, displayObj;
		// 创建骨骼节点
		for (var i=0, l=bones.length; i<l; i++) {
			bone = bones[i];

			if (bone.image) { // 图像节点
				displayObj = new Bitmap({
					renderMode: this.renderMode,
					x: 0, y: 0, width: bone.width, height: bone.height,
					image: bone.image
				});
			} else { // 容器节点
				displayObj = new DisplayObject({
					renderMode: this.renderMode,
					x: 0, y: 0, width: bone.width, height: bone.height
				});
			}
			
			if (!bone.parent) { // 添加根节点
				this.addChild(displayObj);
			}
			
			this._bones[bone.tag] = displayObj;
		}
		// 添加全部子节点
		for (var i=0, l=bones.length; i<l; i++) {
			bone = bones[i];

			if (bone.parent) { // 添加子节点
				this._bones[bone.parent].addChild(this._bones[bone.tag]);	
			}		
		}
		// 初始化动画
		for (var i in animations) {
			this._animations[i] = animations[i];
		}
	},
	
	_initTimeline: function(animation) {
		var timeline = new Timeline(),
			data, bone, frames, frame;
		// 初始化时间轴	
		for (var j=0, jl=animation.length; j<jl; j++) {
			data = animation[j];
			bone = this._bones[data.tag];
			frames = data.frames;
			timeline.get(bone);
			// 添加关键帧
			for (var i=0, l=frames.length; i<l; i++) {
				frame = frames[i];
				timeline.addKeyframe(frame, frame.time);
			}
		}

		return timeline;
	}
	
});

return BoneAnimation;
});

define('cartoon',['require','exports','module','Class','Ticker','DisplayObject','Container','Canvas','Shape','Bitmap','Text','Tween','Timeline','Sprite','ParticleSystem','BoneAnimation'],function (require, exports, module) {
	
	   
var cartoon = {
	
	// 基础组件
	Class: require('Class'),
	Ticker: require('Ticker'),
	// 渲染组件
	DisplayObject: require('DisplayObject'),
	Container: require('Container'),
	Canvas: require('Canvas'),
	Shape: require('Shape'),
	Bitmap: require('Bitmap'),
	Text: require('Text'),
	// 动画组件
	Tween: require('Tween'),
	Timeline:  require('Timeline'),
	Sprite: require('Sprite'),
	ParticleSystem: require('ParticleSystem'),
	BoneAnimation: require('BoneAnimation')
	
};

return cartoon;
});
