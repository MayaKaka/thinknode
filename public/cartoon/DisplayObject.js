
define(function (require, exports, module) {
   
var EventDispatcher = require('EventDispatcher'),
	PrivateData = require('PrivateData'),
	StyleSheet = require('StyleSheet'),
	Matrix2D = require('Matrix2D'),
	Tween = require('Tween');
   	
var DisplayObject = EventDispatcher.extend({
	x: 0,
	y: 0,
	width: 0,
	height: 0,	
	
	translateX: 0,
	translateY: 0,
	scaleX: 1,
	scaleY: 1,
	skewX: 0,
	skewY: 0,
	rotation: 0,
	originX: 0.5,
	originY: 0.5,
		
	alpha: 1,
	visible: true,
	overflow: 'visible',
	
	parent: null,
	
	elem: null,
	elemStyle: null,
	
	renderInCanvas: false,
	blendMode: 'source-over',
	
	privateData: null,
	
	_tagName: 'div',
	_children: null,
	_matrix2d: null,
	_tween: null,
	
//  Public Methods
	init: function(props) {
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
		
		if (props.renderInCanvas) {
			this.renderInCanvas = true;
		} else {
			this.elem = elem || document.createElement(this._tagName);
			this.elem.displayObj = this;
			this.elemStyle = this.elem.style;
			if (jQuery) {
				this.$ = jQuery(this.elem);
			}
		}
	
		this._children = [];
	    this._matrix2d = new Matrix2D();
		this.dataset = new PrivateData();
		
		for (var i in props) {
			this.style(i, props[i]);
		}
	},
		
	addChild: function(displayObj) {
		if (displayObj.renderInCanvas) {
			this._children.push(displayObj);
		} else if (this.elem) {
			this.elem.appendChild(displayObj.elem);
		}
		displayObj.parent = this;
	},
	
	removeChild: function(displayObj) {
		if (displayObj.renderInCanvas) {
			for (var i=this._children.length-1; i>=0; i++) {
				if (this._children[i] === displayObj) {
					this._children.splice(i, 1);
					break;
				}
			}
		} else if (this.elem) {
			this.elem.removeChild(displayObj.elem);
		}
		displayObj.parent = null;
	},
	
	eachChildren: function(func) {
		var children = this.renderInCanvas? this._children: this.elem.children;
		
		for (var i=0,l=children.length; i<l; i++) {
			func(this.renderInCanvas? children[i]: children[i].displayObj, i);
		}
	},
	
	style: function(key, value) {
		if (arguments.length === 2) {
			StyleSheet.set(this, key, value);
		} else {
			return StyleSheet.get(this, key);
		}
	},
	
	to: function(props, speed, easing, callback) {
		Tween.animate(this, props, speed, easing, callback);
	},
	
	on: function(event, handler){
		this.bind(event, handler);
	},
		
	un: function(event, handler){
		this.unbind(event, handler);
	},
	
	draw: function(ctx) {
		if (!this._children.length) return;
		
		if (this.overflow === 'hidden') {
			// todo clip
		}
		
		var children = this._children,
			displayObj;
		
		for (var i=0,l=children.length; i<l; i++) {
			displayObj = children[i];
			
			if (displayObj.visible) {
				ctx.save();
				displayObj._drawCanvas(ctx);
				ctx.restore();
			}
		}
	},
	
	cache: function() {
		var canvas = document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;
		
		this.draw(canvas.getContext('2d'));
		this._cacheCanvas = canvas;
	},
	
	uncache: function() {
		this._cacheCanvas = null;
	},
	
//  Private Methods
	_stepStyle: function(key, fx) {
		StyleSheet.step(this, key, fx);
	},
	
	_updateTransform: function(type, value) {
		switch(type) {
			case 'translateX': this.translateX = value;
	    		break;
	    	case 'translateY': this.translateY = value;
	    		break;
	    	case 'rotate': this.rotation = value;
	    		break;
	    	case 'scaleX': this.scaleX = value;
	    		break;
	    	case 'scaleY': this.scaleY = value;
	    		break;
	    	case 'scale':  this.scaleX = this.scaleY = value;
	    		break;
	    	case 'skew':   this.skewX = this.skewY = value;
	    		break;
	    	case 'originX': this.originX = value;
	    		break;
	    	case 'originY': this.originY = value;
	    		break;
	    	case 'origin':  this.originX = this.originY = value;
	    		break;
	    }
	},

	_mergeTransformText: function() {
		var value = '';			
		if (this.translateX!==0 || this.translateY!==0) {
			value += 'translate('+this.translateX+'px,'+this.translateY+'px'+')';
		}
		if (this.rotation!==0) {
		    value += ' rotate('+this.rotation+'deg)';
		}
		if (this.scaleX!==1 || this.scaleY!==1) {
			value += ' scale('+this.scaleX+','+this.scaleY+')';	
		}
		if (this.skewX!==0 || this.skewY!==0) {
			value += ' skew('+this.skewX+','+this.skewY+')';
		}
		return value;
	},
	
	_drawCanvas: function(ctx) {
		this._updateCanvasContext(ctx);	
		if (this._cacheCanvas) {
			ctx.drawImage(this._cacheCanvas, 0, 0);
		} else {
			this.draw(ctx);
		}		
	},
	
	_updateCanvasContext: function(ctx, dx, dy) {
		var mtx = this._updateMatrix2D(),
			dx = this._getAnchorX(),
			dy = this._getAnchorY();
		if (dx === 0 && dy === 0) {
			ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
		} else {
			ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx+dx, mtx.ty+dy);
			ctx.transform(1, 0, 0, 1, -dx, -dy);
		}
		ctx.globalAlpha *= this.alpha;
		ctx.globalCompositeOperation = this.blendMode;
	},

	_getAnchorX: function() {
		return (this.renderInCanvas? this.width: (this.elem.clientWidth || parseFloat(this.elemStyle.width))) * this.originX;
	},

	_getAnchorY: function() {
		return (this.renderInCanvas? this.height: (this.elem.clientHeight || parseFloat(this.elemStyle.height))) * this.originY;
	},
	
	_updateMatrix2D: function(ieMatrix) {
		if (ieMatrix) {
			return this._matrix2d.identity().rotate(-this.rotation%360*Matrix2D.DEG_TO_RAD).scale(this.scaleX, this.scaleY);
		} else {
			return this._matrix2d.identity().appendTransform(this.x+this.translateX, this.y+this.translateY, this.scaleX, this.scaleY, this.rotation, 0, 0, 0, 0);
		}
	}
	
});

return DisplayObject;
});