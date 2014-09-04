
define(function (require, exports, module) {
	"use strict";
	 
var Class = require('Class');

var EventDispatcher = Class.extend({
	
	_listeners: null,
	
	on: function(type, handler) {
		this.addEventListener(type, handler);
	},
	
	off: function(type, handler) {
		this.removeEventListener(type, handler);
	},
	
	trigger: function(evt) {
		this.dispatchEvent(evt);
	},
	
	addEventListener: function(type, handler) {
		var arr = this.getEventListener(type);
		
		for (var i=arr.length-1; i>=0; i--) {
			if (arr[i] === handler) {
				arr.splice(i, 1);
				break;
			}
		}
		arr.push(handler);
	},

	removeEventListener: function(type, handler) {
		var arr = this.getEventListener(type);
		
		for (var i=arr.length-1; i>=0; i--) {
			if (arr[i] === handler) {
				arr.splice(i, 1);
				break;
			}
		}
	},
	
	dispatchEvent: function(evt) {
		var arr = this.getEventListener(evt.type);
		
		for (var i=0,l=arr.length; i<l; i++) {
			arr[i].call(this, evt);
		}
	},
	
	getEventListener: function(type) {
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