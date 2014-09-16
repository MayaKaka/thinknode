
define(function (require, exports, module) {
	"use strict";
   	
var EventDispatcher = require('EventDispatcher'),
	PrivateData = require('PrivateData'),
	StyleSheet = require('StyleSheet'),
	Matrix2D = require('Matrix2D'),
	Tween = require('Tween');
   	
var DisplayObject = EventDispatcher.extend({

// Public Properties	
// Position and Size
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	
// Transform Style
	transform: null,
	transform3d: null,
	
// Display Style
	visible: true,
	overflow: 'visible',
	alpha: 1,
	shadow: null,
	
// Relative Nodes 
	parent: null,
	elem: null,
	elemStyle: null,
	
// Render Mode
	renderInCanvas: false,
	snapToPixel: false,
	mouseEnabled: true,
	blendMode: 'source-over',
	
// Private Properties
	_tagName: 'div',
	_children: null,
	_matrix2d: null,
	_privateData: null,
	
// Public Methods
// Constructor
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
		this._privateData = new PrivateData();
		
		for (var i in props) {
			if (StyleSheet.has(i)) {
				this.style(i, props[i]);
			}
		}
	},
	
// Handle Nodes		
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
	
	removeAllChildren: function() {
		var children = this.renderInCanvas? this._children: this.elem.children,
			child;
		
		while (children.length) {
			child = children[children.length-1];
			this.removeChild(this.renderInCanvas? child: child.displayObj);
		}
	},
	
	eachChildren: function(func) {
		var children = this.renderInCanvas? this._children: this.elem.children,
			child;
		for (var i=0,l=children.length; i<l; i++) {
			child = this.renderInCanvas? children[i]: children[i].displayObj;
			func(child, i);
		}
	},

// JQuery Similar Methods
// jQuery.css(), include x, y, width, height, transform, alpha...
	style: function(key, value) {
		if (value === undefined) {
			return StyleSheet.get(this, key);
		} else {
			StyleSheet.set(this, key, value);
		}
	},
	
// jQuery.data()	
	data: function(key, value) {
		if (value === undefined) {
			return this._privateData.get(key);
		} else {
			this._privateData.set(key, value);
		}
	},
	
// jQuery.animate()
	to: function(props, speed, easing, callback) {
		Tween.queue(this, props, speed, easing, callback);
		return this;
	},

// Draw Self In Canvas
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

// Draw Self By WebGL	
	draw3D: function(gl) {
		
	},

// Cache Self Into A CacheCanvas	
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
	
// Private Methods
// Animation Step Each Frame
	_stepStyle: function(key, fx) {
		StyleSheet.step(this, key, fx);
	},

// Transform Calculation
	_updateTransform: function(key, value) {
		if (key === 'scale') {
			this.transform.scale = this.transform.scaleX = this.transform.scaleY = value;
		} else if (key in this.transform) {
			this.transform[key] = value;
		}
	},
	
	_updateTransform3D: function(key, value) {		
		if (key in this.transform3d) {
			this.transform3d[key] = value;
		}
	},
	
	_mergeTransformText: function(t2d) {
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
			value += ' skew('+t2d.skewX+','+t2d.skewY+')';
		}
		return value;
	},
	
	_mergeTransform3DText: function(t3d) {
		var value = '';
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
	
// Draw Self In Canvas	
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
			dy = this._getAnchorY(),
			shadow = this.shadow;
			
		if (dx === 0 && dy === 0) {
			ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
		} else {
			ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx+dx, mtx.ty+dy);
			ctx.transform(1, 0, 0, 1, -dx, -dy);
		}
		if (this.snapToPixel) {
			ctx.translate(mtx.tx>=0?0.5:-0.5, mtx.ty>=0?0.5:-0.5);
		}
		ctx.globalAlpha *= this.alpha;
		ctx.globalCompositeOperation = this.blendMode;
		
		if (shadow) {
			ctx.shadowOffsetX = shadow.offsetX;
			ctx.shadowOffsetY = shadow.offsetY;
			ctx.shadowBlur = shadow.blur;
			ctx.shadowColor = shadow.color;	
		}
	},

// Anchor Points
	_getAnchorX: function() {
		return (this.renderInCanvas? this.width: (this.elem.clientWidth || parseFloat(this.elemStyle.width))) * this.transform.originX;
	},

	_getAnchorY: function() {
		return (this.renderInCanvas? this.height: (this.elem.clientHeight || parseFloat(this.elemStyle.height))) * this.transform.originY;
	},

// Update Matrix2D
	_updateMatrix2D: function(ieMatrix) {
		var t2d = StyleSheet.test(this, 'transform');
		if (ieMatrix) {
			return this._matrix2d.identity().rotate(-t2d.rotate%360*Matrix2D.DEG_TO_RAD).scale(t2d.scaleX, t2d.scaleY);
		} else {
			return this._matrix2d.identity().appendTransform(this.x+t2d.translateX, this.y+t2d.translateY, t2d.scaleX, t2d.scaleY, t2d.rotate, t2d.skewX, t2d.skewY, 0, 0);
		}
	},
	
// Draw Self By WebGL	
	_drawWebGL: function(gl) {
		this._updateWebGLContext(gl);
	},
	
	_updateWebGLContext: function() {
		
	}
});

return DisplayObject;
});