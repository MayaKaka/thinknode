(function() {
	"use strict";

var Particle = cc.Node.extend({
	
	_particles: null,
	_particleType: null,
	_particleFileName: null,
	
	ctor: function() {
		this._super();
		
	},
	
	createParticle: function(type, file){
		if (this._particles) {
			this.removeChild(this._particles);
		}
		
		this._particleType = type;
		this._particleFileName = file;
		this._particles = this._createParticles(type, file);
		this._particles.setPosition(cc.p(0, 0));
		this.addChild(this._particles);
	},
	
	getParticleType: function(){
		return this._particleType;
	},
	
	_createParticles: function(type, file) {
		var particle;
		switch (type) {
			case "flower":
				particle = cc.ParticleFlower.create();
				break;
			case "fire":
				particle = cc.ParticleFire.create();
				break;
			case "sun":
				particle = cc.ParticleSun.create();
				break;
			case "galaxy":
				particle = cc.ParticleGalaxy.create();
				break;
			case "fireworks":
				particle = cc.ParticleFireworks.create();
				break;
			case "meteor":
				particle = cc.ParticleMeteor.create();
				break;
			case "spiral":
				particle = cc.ParticleSpiral.create();
				break;
			case "smoke":
				particle = cc.ParticleSmoke.create();
				break;
			case "snow":
				particle = cc.ParticleSnow.create();
				break;
			case "rain":
				particle = cc.ParticleRain.create();
				break;
			case "system":
				particle = cc.ParticleSystem.create(file);
				break;
		}
		
		if (type!=="system") {
			particle.setTexture(cc.textureCache.addImage(file));
		}
		
		return particle;
	}

});

Particle.create = function(){
	return new Particle();
};

ccp.Particle = Particle;
}());