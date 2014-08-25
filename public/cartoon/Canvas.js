
define(function (require, exports, module) {
   
var DisplayObject = require('DisplayObject'),
	Matrix2D = require('Matrix2D');
	
var Canvas = DisplayObject.extend({
	
	_tagName: 'canvas',
	_context2d: null,
	_eventTarget: null,
		
	init: function($elem, props) {
		this._super($elem, props);
		
		this._context2d = this.elem.getContext('2d');

		this._initEvents();
	},
		
	update: function() {
		var ctx = this._context2d;
		
		ctx.clearRect(0, 0, this.width, this.height);
		this.draw(ctx);
	},
	
	_setSize: function(size) {
		if ('width' in size) this.width = size.width;
		if ('height' in size) this.height = size.height;
		
		var elem = this.elem;
		
		elem.width = this.width;
		elem.height = this.height;
	},
	
	_initEvents: function() {
		var self = this,
			moved = false;
		
		this.$.bind({
			mousedown: function(e) {
				e.preventDefault();
				
				self._eventTarget = self._hitTest(self._children, e.offsetX, e.offsetY);
				self._triggerEvent(e);
				moved = false;
			},
			mouseup: function(e) {
				e.preventDefault();
				
				self._triggerEvent(e);
			},
			mousemove: function(e) {
				e.preventDefault();
				
				self._triggerEvent(e);
				moved = true;
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
			dx = child._getDx();
			dy = child._getDy();
			mtx = child._matrix2d;
		
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
		
		if (r && (r*r >= (x*x + y*y))) {
			return true;
		}
		else if (x >= 0 && x <= w && y >= 0 && y <= h) {
			return true;
		}
		
		return false;
	}
});
	
return Canvas;
});
