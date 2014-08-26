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
		this.detlaTime += 16.7;
		
		var percent = this.detlaTime/this.options.duration;
		
		this.pos = this.easing(percent, this.options.duration * percent, 0, 1, this.options.duration);
		
		if (percent>1) {
			this.pos = 1;
			this.finish = true;
		}
		
		for (var i in this.end) {
			this.target.step(i, this.getFx(i));
		}
		
		this.options.step && this.options.step();
		
		if (this.finish) {
			this.options.callback && this.options.callback();
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

Tween.queue = function(target, func) {
	var queue = target.dataset.get('fx_queue');
	
	if (!queue) {
		queue = target.dataset.set('fx_queue', []);
	}
	
	queue.push(func);
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
	var queue = target.dataset.get('fx_queue'),
		options = Tween.option(speed, easing, callback);
		
	var doAnimation = function() {
		target._tween = new Tween(target, jQuery.extend({}, props), options);
	};
	
	if (queue) {
		Tween.queue(target, doAnimation);
	} else {
		doAnimation();
	}
	
	if (!Tween.ticker.isActive()) {
		Tween.ticker.start();
	}
}

Tween.ticker = new Ticker(60, false, false);
Tween.ticker.add(Tween.step);

return Tween;
});