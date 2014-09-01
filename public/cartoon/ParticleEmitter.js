define(function (require, exports, module) {

var	Shape = require('Shape');
	   
var ParticleEmitter = function() {};

ParticleEmitter.get = function(type) {

	return ParticleEmitter.particles[type];
}

ParticleEmitter.particles = {	
	rain: {
		type: 'rain',
		init: function() {
			this.particles = [];
			var screenWidth = this.screenWidth,
				screenHeight = this.screenHeight,
				particle;
			for(var i=0; i<60; i++) {
				particle = new Shape({
					renderInCanvas: this.renderInCanvas,
					pos: { x: Math.floor(Math.random()*screenWidth), y: -Math.floor(Math.random()*screenHeight) },
					graphics: {
						type: 'rect', width: i%6===0?2:1, height: i%5===0?20:15, fill: '#FFF'
					},
					alpha: Math.floor(Math.random()*3)/10+0.3
				});
				particle.fallSpeed =  Math.floor(Math.random()*5)+5;
				this.particles.push(particle);
				this.addChild(particle);
			}
		},
		update: function() {
			var particles = this.particles,
				screenWidth = this.screenWidth,
				screenHeight = this.screenHeight,
				particle, y;
			for (var i=0,l=particles.length; i<l; i++) {
				particle = particles[i];
				y = particle.y;
				
				if (y > screenHeight) {
					y = -Math.floor(Math.random()*screenHeight);
				}
				particle.style('y', y+particle.fallSpeed);
			}
		}
	},
	
	snow: {
		type: 'snow',
		init: function() {
			this.particles = [];
			var screenWidth = this.screenWidth,
				screenHeight = this.screenHeight,
				particle;
			for(var i=0; i<60; i++) {
				particle = new Shape({
					renderInCanvas: this.renderInCanvas,
					pos: { x: Math.floor(Math.random()*screenWidth), y: -Math.floor(Math.random()*screenHeight) },
					graphics: {
						type: 'circle', radius: Math.floor(Math.random()*4)+2, fill: '#FFF', angle: 360
					},
					alpha: Math.floor(Math.random()*5)/10+0.3
				});
				particle.fallX = particle.x;
				particle.fallWidth = Math.floor(Math.random()*10)+10;
				particle.fallSpeed =  Math.floor(Math.random()*3)/10+0.3;
				this.particles.push(particle);
				this.addChild(particle);
			}
		},
		update: function() {
			var particles = this.particles,
				screenWidth = this.screenWidth,
				screenHeight = this.screenHeight,
				particle, x, y;
			for (var i=0,l=particles.length; i<l; i++) {
				particle = particles[i];
				x = particle.fallX;
				y = particle.y;
				
				if (y > screenHeight) {
					particle.fallTime = 0;
					y = -Math.floor(Math.random()*screenHeight);
				}
				particle.style('pos', { x: x+Math.sin(y/particle.fallSpeed/360*Math.PI)*particle.fallWidth, y: y+particle.fallSpeed });
			}
		}
	}
}

return ParticleEmitter;
});