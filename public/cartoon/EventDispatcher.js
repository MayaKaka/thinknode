define(function (require, exports, module) {
   
var Class = require('Class');

var EventDispatcher = Class.extend({
	
	_listeners: null,
	
	bind: function(type, handler) {
		this._addEventListener(type, handler);
	},
	
	unbind: function(type, handler) {
		this._removeEventListener(type, handler);
	},
	
	trigger: function(evt) {
		this._dispatchEvent(evt);
	},
	
	_addEventListener: function(type, handler) {
		var arr = this._getEventListener(type);
		for (var i=arr.length-1; i>=0; i--) {
			if (arr[i] === handler) {
				arr.splice(i, 1);
				break;
			}
		}
		arr.push(handler);
	},

	_removeEventListener: function(type, handler) {
		var arr = this._getEventListener(type);
		for (var i=arr.length-1; i>=0; i--) {
			if (arr[i] === handler) {
				arr.splice(i, 1);
				break;
			}
		}
	},
	
	_dispatchEvent: function(evt) {
		var arr = this._getEventListener(evt.type);
		for (var i=0,l=arr.length; i<l; i++) {
			arr[i].call(this, evt);
		}
	},
	
	_getEventListener: function(type) {
		if (!this._listeners) {
			this._listeners = {};
		}
		
		if (!this._listeners[type]) {
			this._listeners[type] = [];
		}
		
		return this._listeners[type];
	}
});

return EventDispatcher;
});