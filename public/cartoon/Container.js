
define(function (require, exports, module) {
	"use strict";
	   
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
		elem.addEventListener('mousemove', handleMove);
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