define(function (require, exports, module) {

var Class = require('Class'),
	Ticker = require('Ticker');

var Tween = Class.extend({
	_queue: null,
	_target: null,
	_startTime: -1,
	_nowTime: -1,
	
	init: function(target) {
		this._target = target;
		this._queue = [];
	},
	add: function(count) {
		this._queue.push(count);
		if (this._queue.length && !Tween._ticker.has(this)) {
			this._startTime = this._deltaTime = 0;
			this._lastTime = new Date().getTime();
			Tween._ticker.add(this);
		}
	},
	update: function() {
		if(!this._queue.length) {
			Tween._ticker.remove(this);
			return;
		}
		var now = new Date().getTime();
		this._deltaTime += now - this._lastTime;
		this._lastTime = now;
		if (this._deltaTime > this._queue[0]) {
			this._queue.shift();
		}
	}
});

Tween._ticker = new Ticker(20, false, false);
Tween._ticker.start();

return Tween;
});