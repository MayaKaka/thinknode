
define(function (require, exports, module) {
	"use strict";
	   
var DisplayObject = require('DisplayObject');
	
var Container = DisplayObject.extend({
	
	_eventTarget: null,
		
	init: function(props) {
		this._super(props);
		this._initEvents();
	},
		
	_initEvents: function() {
		var self = this,
			moved = false,
			startX, startY;
		
		this.$.bind({
			mousedown: function(e) {
				e.preventDefault();
				self._eventTarget = e.target.displayObj;
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
	}
});
	
return Container;
});
