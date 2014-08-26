
define(function (require, exports, module) {
   
var DisplayObject = require('DisplayObject'),
	ParticleEmitter = require('ParticleEmitter');

var ParticleSystem = DisplayObject.extend({
	
	emitter: null,
	
	init: function(elem, props) {
		this._super(elem, props);
		this._initParticle(props.particle);
	},
	
	update: function(delta) {
		if (this.emitter) {
			this.emitter.update.call(this, delta);
		}
	},
	
	_initParticle: function(particle) {
		var type = particle.type,
			emitter = ParticleEmitter[type];
		if (emitter.init && emitter.update) {
			this.emitter = emitter;
			emitter.init.call(this, particle);
		}
	}
});

return ParticleSystem;
});