
define(function (require, exports, module) {
	"use strict";
	   
var DisplayObject = require('DisplayObject'),
	ParticleEmitter = require('ParticleEmitter');

var ParticleSystem = DisplayObject.extend({
	
	particles: null,
	emitter: null,
	screenWidth: 0,
	screenHeight: 0,
	
	init: function(props) {
		this._super(props);
		this._initParticle(props.particle);
	},
	
	update: function(delta) {
		if (this.emitter) {
			this.emitter.update.call(this, delta);
		}
	},
	
	_initParticle: function(particle) {
		var type = particle.type,
			emitter = ParticleEmitter.get(type);
			
		if (emitter && emitter.init && emitter.update) {
			this.emitter = emitter;
			emitter.init.call(this, particle);
		}
	}
});

return ParticleSystem;
});