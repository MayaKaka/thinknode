// transform lib
require.config({
	paths: {
		transform2d: 'http://localhost/public/jquery/jquery.transform2d'
	}
});
	
define(['transform2d'], function(transform2d){
// 类式继承函数
var Class = function() {}, _ready_ = false, _empty_ = {};

	Class.extend = function(props) {
		var Cls = function() {
			if (_ready_) {
		   		this.init && this.init.apply(this, arguments);
			}
		};
		
		if (this !== Class) {
	        _ready_ = false;
			Cls.prototype = new this();
			// Cls.prototype.constructor = Cls;
		}
		_ready_ = true;
	            
	    var p = Cls.prototype;
	    for (var name in props) {
	    	if (typeof(p[name]) === 'function' && !_empty_[name]) {
	        	p['Super_'+name] = p[name];
	        }
			p[name] = props[name];
		
		}
		
	    Cls.extend = arguments.callee;
	    return Cls;
	};


var supportCss3	= $.support['transform'];
// DOM 类                          
var DOM = Class.extend({
		x: 0, y: 0,
		scaleX: 1, scaleY: 1, scaleZ: 1,
		skewX : 0, skewY : 0,
		originX: 0.5, originY: 0.5,
		rotation: 0, rotationX: 0, rotationY: 0, rotationZ: 0,
		alpha: 1,
		
		_hasTween: false,
		_tweenList: null,
		init: function(width, height, tagName){
	    	if (typeof(width) === 'string' && (width.charAt(0)==='<'||width.charAt(0)==='#'||width.charAt(0)==='.')) {
	    		this.$ = $(width);
	        	this.element = this.$[0];
	        } else if(typeof(width) === 'object' && width.nodeType) {
	        	this.element = width;
	        } else {
	            this.element = document.createElement(tagName||'div');
	            this.element.style.position = 'absolute';
	            this.element.style.left = this.element.style.top = '0';
	            if (width) this.element.style.width = typeof(width)==='string'?width:(width+'px');
	            if (height) this.element.style.height = typeof(height)==='string'?height:(height+'px');
	        }
	        if (!this.$) {
	        	this.$ = $(this.element);
	        }
	        this._tweenList = [];
	        this._tempTransformProps = {};
		},
	    addChild: function(dom) {
	    	this.element.appendChild(dom.element);
	    },
	    removeChild: function(dom) {
	    	this.element.removeChild(dom.element);
	    },
	    pos: function(x, y, leftAndBottom) {
	        this.x = x;
	        this.y = y;
	        
	        var style = this.element.style;
	        style.left = x + 'px';
	        if (leftAndBottom) {
	        	style.bottom = y + 'px';
	        } else {
	        	style.top = y + 'px';
	        }
	        this._apadtIeTransform();
		},
	    posX: function(x){
	    	this.x = x;
	        this.element.style.left = x + 'px';
	        this._apadtIeTransform();
	    },
	    posY: function(y, leftAndBottom){
	    	this.y = y;
	        if (leftAndBottom) {
	        	this.element.style.bottom = y + 'px';
	        } else {
	        	this.element.style.top = y + 'px';
	        }
	        this._apadtIeTransform();
	    },
	    transform: function(values) {
	    	for (var i in values) {
	    		switch(i) {
	    			case 'rotate':
	    				this.rotation = values[i];
	    				break;
	    			case 'scale':
	    				this.scaleX = this.scaleY = values[i];
	    				break;
	    			case 'skew':
	    				this.skewX = this.skewY = values[i];
	    				break;
	    			case 'origin':
	    				this.originX = this.originY = values[i];
	    				break;
	    		}
	    	}
			
	    	this.$.css({ 'transform': 
	    		this._mergeTransformText(this) });
	    	// value = this.originX*100+'% '+(1-this.originY)*100+'%';
	    	// this.$.css({ 'transform-origin': value });
	    },
	    _tempTransformProps: null,
	    _apadtIeTransform: function() {
			if (!supportCss3 && this.$.css('transition')) {
				// 当使用 filter martix 时，ie8 left 和  top 会失效
				this.transform({});
			}
		},
		_mergeTransformProps: function(transform){	
			var tempTransformProps = this._tempTransformProps;
			tempTransformProps.x = this.x;
			tempTransformProps.y = this.y;
			tempTransformProps.rotation = transform.rotate || tempTransformProps.rotation || this.rotation;
			tempTransformProps.scaleX = transform.scale || tempTransformProps.scaleX || this.scaleX;
			tempTransformProps.scaleY = transform.scale || tempTransformProps.scaleY || this.scaleY;
			tempTransformProps.skewX = transform.skew || tempTransformProps.skewX || this.skewX;
			tempTransformProps.skewY = transform.skew || tempTransformProps.skewY || this.skewY;
		},
		_mergeTransformText: function(target){
			var value = '',
				x = target.x,
				y = target.y,
				rotation = target.rotation,
				scaleX = target.scaleX,
				scaleY = target.scaleY,
				skewX = target.skewX,
				skewY = target.skewY;
				
			if (!supportCss3) value += 'translate('+x+'px,'+y+'px'+')';
	    	if(rotation!==0) value += ' rotate('+rotation+'deg)';
			if(scaleX!==1) value += ' scale('+scaleX+','+scaleY+')';
			if(skewX!==0) value += ' skew('+skewX+','+skewY+')';
			
			return value;
		},
	    scale: function(value) {
	    	this.transform({
	    		scale: value
	    	});
	    },
	    rotate: function(value) {
	    	this.transform({
	    		rotate: value
	    		
	    	});
	    },
	    opacity: function(value){
	    	this.alpha = value;
	    	if (supportCss3) {
	    		this.$.css('opacity', value);
	    	} else {
	    		var filter = this.$.css('filter'),
	    			rFilter = /alpha\(opacity=.*?\)/;
	    		if (filter.match(rFilter)) {
	    			filter = filter.replace(rFilter, 'alpha(opacity='+value*100+')');
	    		} else {
	    			filter += ' alpha(opacity='+value*100+')';
	    		}
	    		this.$.css('filter', filter);
	    	}
	    },
		gradient: function(value){
			this.gradient = value;
			this.$.css('background-image', '-ms-linear-gradient('+value+')');
			this.$.css('background-image', '-moz-linear-gradient('+value+')');
			this.$.css('background-image', '-webkit-linear-gradient('+value+')');
			//this.$.css('background-image', '-webkit-gradient(linear,left top,left bottom,from(#00abeb),to(#fff))');
		},
		to: function(values, options, callback){
			if (values.transform) {
				this._mergeTransformProps(values.transform);
				values.transform = this._mergeTransformText(this._tempTransformProps);
				
			}
			if (supportCss3&&false) {
				this._animateCss3(values, options, callback);
			} else {
				this.$.animate(values, options, callback);
			}
			
			return this;	
		},
	    _animateCss3: function(values, options, callback, immediate){
	    	if (this._hasTween && !immediate) {
	    		this._tweenList.push([ values, options, callback ]);
	    		return this;
	    	};

	    	var $ = this.$, self = this;
	    	this._hasTween = true;
	    	
	    	requestAnimationFrame(function() {
	    		$.css('transition', 'all '+options/1000+'s linear 0s');
		    	$.one('transitionend', function(){
		    		$.css('transition', '');
		    		if (self._tweenList.length>0) {
		    			var tween = self._tweenList.shift();
		    			requestAnimationFrame(function(){
		    				self._animateCss3(tween[0], tween[1], tween[2], true);
		    			});
		    		} else {
		    			this._tempTransformProps = {};
			    		self._hasTween = false;
		    		}
		    		if (callback) {
			    		callback();
			    		callback = null;
			    	}
		    	});
	    		$.css(values);
	    	});

	    	return this;
	    },
	});
	
return {
		
		Class: Class,
		Ticker: Ticker,
		DOM: DOM
		
	};
});

/*
        // Bitmap 类 
        var Bitmap = DOM.extend({
            init: function(width, height){
                this.Super_init(width, height, 'img');
                if(width>0) this.element.width = width;
                if(height>0) this.element.height = height;
            },
            load: function(url){
                this.element.src = url;
            }
        });
        // Sound 类
        var Sound = DOM.extend({
            init: function(){
                this.Super_init(0, 0, 'audio');
                this.element.autoplay = 'autoplay';
            },
            load: function(url){
                try {
                	this.element.src = url;
                } catch(e) {
                    // console.log(e);
                }
            },
            play: function(){
                this.element.play && this.element.play();
            },
            stop: function(){
            	this.element.pause && this.element.pause();
            }
        });
    	// Sprite 类
        var Sprite = DOM.extend({

        }); 
        
*/