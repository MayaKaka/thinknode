define(function (require, exports, module) {
	"use strict";
	
var	Shape = require('Shape');
	   
var ParticleEmitter = function() {};

ParticleEmitter.get = function(type) {

	return ParticleEmitter.particles[type];
}

ParticleEmitter.particles = {	
	rain: {
		type: 'rain',
		init: function(particle) {
			this.particles = [];
			var screenWidth = this.screenWidth,
				screenHeight = this.screenHeight,
				particle;
			for(var i=0,l=particle.num||60; i<l; i++) {
				particle = new Shape({
					renderInCanvas: this.renderInCanvas,
					pos: { x: Math.floor(Math.random()*screenWidth), y: -Math.floor(Math.random()*screenHeight) },
					graphics: {
						type: 'rect', width: i%6===0?2:1, height: i%5===0?20:15, fill: '#FFF'
					},
					alpha: Math.floor(Math.random()*3)/10+0.3
				});
				particle.data('fall_speed', Math.floor(Math.random()*25)/100+0.25);
				this.particles.push(particle);
				this.addChild(particle);
			}
		},
		update: function(delta) {
			var particles = this.particles,
				screenWidth = this.screenWidth,
				screenHeight = this.screenHeight,
				particle, dis, y;
			for (var i=0,l=particles.length; i<l; i++) {
				particle = particles[i];
				dis = particle.data('fall_speed')*delta;
				y = particle.y;
				
				if (y > screenHeight) {
					y = -Math.floor(Math.random()*screenHeight);
				}
				particle.style('y', y+dis);
			}
		}
	},
	
	snow: {
		type: 'snow',
		init: function(particle) {
			this.particles = [];
			var screenWidth = this.screenWidth,
				screenHeight = this.screenHeight,
				particle;
			for (var i=0,l=particle.num||60; i<l; i++) {
				particle = new Shape({
					renderInCanvas: this.renderInCanvas,
					pos: { x: Math.floor(Math.random()*screenWidth), y: -Math.floor(Math.random()*screenHeight) },
					graphics: {
						type: 'circle', radius: Math.floor(Math.random()*4)+2, fill: '#FFF', angle: 360
					},
					alpha: Math.floor(Math.random()*5)/10+0.3
				});
				particle.data('fall_x', particle.x);
				particle.data('fall_width', Math.floor(Math.random()*10 + 10));
				particle.data('fall_speed', Math.floor(Math.random()*15 + 15)/1000);
				this.particles.push(particle);
				this.addChild(particle);
			}
		},
		update: function(delta) {
			var particles = this.particles,
				screenWidth = this.screenWidth,
				screenHeight = this.screenHeight,
				particle, dis, x, y;
			for (var i=0,l=particles.length; i<l; i++) {
				particle = particles[i];
				dis = particle.data('fall_speed')*delta;
				x = particle.data('fall_x');
				y = particle.y;
				if (y > screenHeight) {
					particle.fallTime = 0;
					y = -Math.floor(Math.random()*screenHeight);
				}
				particle.style('pos', { x: x + Math.sin(y/50)*particle.data('fall_width'), y: y+dis });
			}
		}
	}
}

return ParticleEmitter;
});