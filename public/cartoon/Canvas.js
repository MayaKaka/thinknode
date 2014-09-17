
define(function (require, exports, module) {
	"use strict";
	   
var DisplayObject = require('DisplayObject'),
	Matrix2D = require('Matrix2D');
	
var Canvas = DisplayObject.extend({
	
	_tagName: 'canvas',
	_context2d: null,
	_eventTarget: null,
	_useElemSize: true,
		
	init: function(props) {
		this._super(props);
		this._context2d = this.elem.getContext('2d');
		this._initEvents();
	},
	
	removeAllChildren: function() {
		var children = this._children,
			child;
			
		while (children.length) {
			child = children[children.length-1];
			this.removeChild(child);
		}
	},
	
	eachChildren: function(func) {
		var children = this._children,
			child;
			
		for (var i=0,l=children.length; i<l; i++) {
			child = children[i];
			func(child, i);
		}
	},
		
	update: function() {
		var ctx = this._context2d;		
		ctx.clearRect(0, 0, this.width, this.height);
		this.draw(ctx);
	},
		
	_initEvents: function() {
		var self = this,
			moved = false,
			startX, startY;
		
		this.$.bind({
			mousedown: function(e) {
				e.preventDefault();
				self._eventTarget = self._hitTest(self._children, e.offsetX, e.offsetY);
				self._triggerEvent(e);
				startX = e.offsetX;
				startY = e.offsetY;
				moved = false;
			},
			mouseup: function(e) {
				e.preventDefault();
				self._triggerEvent(e);
			},
			mousemove: function(e) {
				e.preventDefault();
				self._triggerEvent(e);
				if (!moved && (Math.abs(e.offsetX-startX)>3 || Math.abs(e.offsetY-startY)>3)) {
					moved = true;
				}
			},
			click: function(e) {
				e.preventDefault();
				if (!moved) {
					self._triggerEvent(e);
				}
				self._eventTarget = null;
			}
		});
	},
	
	_triggerEvent: function(e) {
		var target = this._eventTarget;
				
		if (target) {
			target.trigger(e);
		}
	},
	
	_hitTest: function(children, mouseX, mouseY) {
		var child;

		for (var i=children.length-1; i>=0; i--) {
			child = children[i];
			
			if (child._children.length) {
				child = this._hitTest(child._children, mouseX, mouseY);
				
				if (child) {
					return child;	
				}
			} else if (this._hitTestMatrix(child, mouseX, mouseY)) {
				
				return child;
			}
		}
		
		return null;
	},
	
	_hitTestMatrix: function(child, mouseX, mouseY) {
		var parent = child.parent,
			list = [ child ],
			matrix = new Matrix2D(),
			dx, dy, mtx;
		
		while (parent && parent !== this) {
			list.unshift(parent);
			parent = parent.parent;	
		}
		
		matrix.append(1, 0, 0, 1, -mouseX, -mouseY);
		
		for (var i=0, l=list.length; i<l; i++) {
			child = list[i];
			mtx = child._matrix2d;
			dx = child._getAnchorX();
			dy = child._getAnchorY();

			if (dx === 0 && dy === 0) {
				matrix.append(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
			} else {
				matrix.append(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx+dx, mtx.ty+dy);
				matrix.append(1, 0, 0, 1, -dx, -dy);
			}
		}
		
		matrix.invert();
		
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
