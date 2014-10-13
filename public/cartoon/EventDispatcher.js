
define(function (require, exports, module) {
	"use strict";
	 
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