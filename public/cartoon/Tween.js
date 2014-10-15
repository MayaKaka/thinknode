
define(function (require, exports, module) {
	"use strict";
	
var Class = require('Class'),
	Ticker = require('Ticker'),
	Ease = require('Ease');
	
var Tween = Class.extend({
	
	pos: -1,
	start: null,
	end: null,

	_target: null,
	_options: null,
	_easing: null,
	_detlaTime: -1,
	_finish: false,
	
	init: function(target, props, options) {
		this.pos = 0;
		this.start = {};
		for (var i in props) {
			this.start[i] = this._clone(target.style(i));
		}
		this.end = props;
		
		this._target = target;
		this._options = options;
		this._easing = Ease.get(options.easing);
		this._detlaTime = 0;
		
		Tween._tweens.push(this);
	},
	
	remove: function() {
		var target = this._target;
		target.data('fx_queue', null);
		target.data('fx_cur_tween', null);
	},
	
	update: function(delta) {
		var target = this._target,
			options = this._options,
			easing = this._easing,
			duration = options.duration,
			percent = this._detlaTime/duration;
			
		if (percent >= 1) {
			this.pos = 1;
			this._finish = true;
		} else if (easing) {
			this.pos = easing(percent, duration*percent, 0, 1, duration);
		} else {
			this._detlaTime += delta;
			return;
		}
		
		for (var i in this.end) {
			target._stepStyle(i,  { 
				pos: this.pos, start: this.start[i], end: this.end[i]
			});
		}
		
		options.step && options.step(percent, this.pos);
		
		if (this._finish) {
			options.callback && options.callback();
			var queue = target.data('fx_queue');
			if (queue.length === 0) {
				target.data('fx_queue', null);
				target.data('fx_cur_tween', null);
			} else {
				var doAnimation = queue.shift();
				doAnimation();
			}
		} else {
			this._detlaTime += delta;
		}
	},
	
	_clone: function(origin) {
		var temp;
		if (typeof(origin) === 'object') {
			temp = {};
			for (var i in origin) {
				temp[i] = this._clone(origin[i]);
			}
 		} else {
			temp = origin;
		}		
		return temp;
	}
});

Tween._tweens = [];

Tween.update = function(delta) {
	var tweens = Tween._tweens;
	for (var i=tweens.length-1; i>=0; i--) {
		if (tweens[i]._finish) {
			tweens.splice(i, 1);
		}
	}
	for (var i=0,l=tweens.length; i<l; i++) {
		tweens[i].update(delta);
	}
}

Tween.option = function(speed, easing, callback) {
	if (speed && speed.duration) {
		return speed;
	} else {
		return {
			duration: speed || 300,
			easing: easing || 'linear',
			callback: callback
		}
	}
};

Tween.queue = function(target, props, speed, easing, callback) {
	var queue = target.data('fx_queue'),
		options = Tween.option(speed, easing, callback);
	
	if (typeof(props) === 'number') {
		options.duration = props;
		options.easing = 'none';
		options.callback = speed;
		props = {};
	}

	var doAnimation = function() {
		target.data('fx_cur_tween', new Tween(target, props, options));
	};
	
	if (queue) {
		queue.push(doAnimation);
	} else {
		doAnimation();
		target.data('fx_queue', []);
	}
}

return Tween;
});