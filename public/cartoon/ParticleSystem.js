
define(function (require, exports, module) {
	"use strict";
	   
var DisplayObject = require('DisplayObject'),
	ParticleEmitter = require('ParticleEmitter');

var ParticleSystem = DisplayObject.extend({
	
	emitter: null,
	particles: null,
	
	init: function(props) {
		this._super(props);
		this._initParticle(props.particle); // 初始化粒子
	},
	
	update: function(delta) {
		// 播放粒子动画
		if (this.emitter) {
			this.emitter.update.call(this, delta);
		}
	},
	
	_initParticle: function(particle) {
		var type = particle.type,
			emitter = type ? ParticleEmitter.get(type) : particle;
		// 初始化粒子
		if (emitter && emitter.init && emitter.update) {
			this.emitter = emitter;
			emitter.init.call(this, particle);
		}
	}
	
});

return ParticleSystem;
});