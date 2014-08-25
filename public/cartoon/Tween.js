define(function (require, exports, module) {

var Class = require('Class'),
	Ticker = require('Ticker');

var Tween = Class.extend({
	_queue: null,
	_target: null,
	
	init: function(target) {
		this._target = target;
		this._queue = [];
	},
	add: function() {
		if (this._queue.length && !Tween._ticker.has(this)) {
			Tween._ticker.add(this);
		}
	},
	update: function() {
		if(!this._queue.length) {
			Tween._ticker.remove(this);
		}
	}
});

Tween._ticker = new Ticker(20, false, false);
Tween._ticker.start();

return Tween;
});