
define(function (require, exports, module) {
	"use strict";
	   
var DisplayObject = require('DisplayObject'),
	Matrix2D = require('Matrix2D');
	
var Canvas = DisplayObject.extend({
	
	_tagName: 'canvas',
	_context2d: null,
	_useElemSize: true,
		
	init: function(props) {
		this._super(props);
		this._initEvents(); // 初始化鼠标及触摸事件
		this._context2d = this.elem.getContext('2d'); // 获取2d上下文
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
		var ctx = this._context2d;
		// 重绘画布
		ctx.clearRect(0, 0, this.width, this.height);
		this.draw(ctx);
	},
		
	_initEvents: function() {
		var self = this,
			elem = this.elem,
			mouseX, mouseY,
			target, moved,
			startX, startY;
		// 事件处理函数
		var handleDown = function(evt) {
				evt.preventDefault();
				mouseX = self._getMouseX(evt);
				mouseY = self._getMouseY(evt);
				// 检测点击对象
				target = self._hitTest(self._children, mouseX, mouseY);
				// 触发down事件
				self._triggerEvent('mousedown', target, mouseX, mouseY);
				// 标记起始状态
				moved = false;
				startX = mouseX;
				startY = mouseY;
			},
			handleUp = function(evt) {
				evt.preventDefault();
				// 触发up事件
				self._triggerEvent('mouseup', target, mouseX, mouseY);
				// 触发click事件
				if (!moved) {
					self._triggerEvent('click', target, mouseX, mouseY);
				}
				// 清除对象
				target = null;
			},
			handleMove = function(evt) {
				evt.preventDefault();
				mouseX = self._getMouseX(evt);
				mouseY = self._getMouseY(evt);
				// 触发move事件
				self._triggerEvent('mousemove', target, mouseX, mouseY);
				// 检测移动状态
				if (!moved && (Math.abs(mouseX-startX) > 3 || Math.abs(mouseY-startY) > 3)) {
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
	
	_getMouseX: function(evt) {
		return evt.layerX;
	},
	
	_getMouseY: function(evt) {
		return evt.layerY;
	},
	
	_triggerEvent: function(eventName, target, mouseX, mouseY) {
		if (target) {
			// 创建事件
			var evt = { 
				type: eventName, target: target,
				mouseX: mouseX, mouseY: mouseY,
				offsetX: mouseX, offsetY: mouseY
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
		// 不可见或者不可点击时跳过检测
		if (!child.visible || !child.mouseEnabled) return false;
		// 执行检测
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