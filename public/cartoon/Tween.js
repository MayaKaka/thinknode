define(function (require, exports, module) {

var Class = require('Class'),
	Ticker = require('Ticker'),
	Ease = require('Ease');
	
var Tween = Class.extend({
	target: null,
	
	init: function(target, props, options) {
		this.target = target;
		this.start = {};
		for (var i in props) {
			this.start[i] = target.style(i);
		}
		this.end = props;
		this.pos = 0;
		this.options = options;
		this.easing = Ease[options.easing];
		this.detlaTime = 0;
		this.fisish = false;
		
		Tween._tweens.push(this);
	},
	
	update: function(delta) {
		this.detlaTime += delta;
		
		var percent = this.detlaTime/this.options.duration;
		this.pos = this.easing(percent, this.options.duration * percent, 0, 1, this.options.duration);
		
		if (percent>1) {
			this.pos = 1;
			this.finish = true;
		}
		for (var i in this.end) {
			this.target._stepStyle(i, this.getFx(i));
		}
		
		this.options.step && this.options.step();
		if (this.finish) {
			this.options.callback && this.options.callback();
			var queue = this.target.data('fx_queue');
			if (queue.length === 0) {
				this.target.data('fx_tween', null);
				this.target.data('fx_queue', null);
			} else {
				var doAnimation = queue.shift();
				doAnimation();
			}
		}
	},
	
	getFx: function(type) {
		var fx = { pos: this.pos };
		fx.start = this.start[type];
		fx.end = this.end[type];
		return fx;
	}
});

Tween._tweens = [];

Tween.step = function(delta) {
	var tweens = Tween._tweens;
	for (var i=tweens.length-1; i>=0; i--) {
		if (tweens[i].finish) {
			tweens.splice(i, 1);
		}
	}
	if (!tweens.length) {
		Tween.ticker.stop();
	}
	for (var i=0,l=tweens.length; i<l; i++) {
		tweens[i].update(delta);
	}
}

Tween.option = function(speed, easing, callback) {
	if (speed.duration) {
		return speed;
	} else {
		return {
			duration: speed || 300,
			easing: easing || 'linear',
			callback: callback
		}
	}
};

Tween.animate = function(target, props, speed, easing, callback) {
	var queue = target.data('fx_queue'),
		options = Tween.option(speed, easing, callback);
		
	var doAnimation = function() {
		target.data('fx_tween', new Tween(target, props, options));
	};
	
	if (queue) {
		queue.push(doAnimation);
	} else {
		doAnimation();
		target.data('fx_queue', []);
	}
	
	if (!Tween.ticker.isActive()) {
		Tween.ticker.start();
	}
}

Tween.ticker = new Ticker(60, 'auto', false);
Tween.ticker.add(Tween.step);

return Tween;
});