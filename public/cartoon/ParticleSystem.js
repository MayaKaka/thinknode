
define(function (require, exports, module) {
   
var DisplayObject = require('DisplayObject'),
	ParticleEmitter = require('ParticleEmitter');

var ParticleSystem = DisplayObject.extend({
	
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
			emitter = ParticleEmitter[type];
			
		if (emitter && emitter.init && emitter.update) {
			this.emitter = emitter;
			this.screenWidth = particle.screenWidth || particle.width;
			this.screenHeight = particle.screenHeight || particle.height;
			emitter.init.call(this, particle);
		}
	}
});

return ParticleSystem;
});