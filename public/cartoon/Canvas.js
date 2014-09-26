
define(function (require, exports, module) {
	"use strict";
	   
var DisplayObject = require('DisplayObject'),
	Matrix2D = require('Matrix2D');
	
var Canvas = DisplayObject.extend({
	
	_tagName: 'canvas',
	_ctx: null,
	_useElemSize: true,
		
	init: function(props) {
		this._super(props);
		this._initEvents(); // 初始化鼠标及触摸事件
		this._ctx = this.elem.getContext('2d'); // 获取 2d上下文
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
				// 触发 down事件
				self._triggerEvent('mousedown', target, e.offsetX, e.offsetY);
				// 标记起始状态
				moved = false;
				startX = e.offsetX;
				startY = e.offsetY;
			},
			handleUp = function(e) {
				e.preventDefault();
				// 触发 up事件
				self._triggerEvent('mouseup', target, e.offsetX, e.offsetY);
				// 触发 click事件
				if (!moved) {
					self._triggerEvent('click', target, e.offsetX, e.offsetY);
				}
				// 清除对象
				target = null;
			},
			handleMove = function(e) {
				e.preventDefault();
				// 触发 move事件
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
			var e = new Event(eventName);
			e.target = target;
			e.clientX = mouseX;
			e.clientY = mouseY;
			// 事件冒泡执行
			while (target) {	
				target.trigger(e);
				target = target.parent;
			}
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
