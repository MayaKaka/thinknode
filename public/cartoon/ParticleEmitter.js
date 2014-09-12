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
			var width = particle.width,
				height = particle.height,
				particle;
			this.particles = [];
			this.data('fall_width', width);
			this.data('fall_height', height);
			for(var i=0,l=particle.num||60; i<l; i++) {
				particle = new Shape({
					renderInCanvas: this.renderInCanvas,
					pos: { x: Math.floor(Math.random()*width), y: -Math.floor(Math.random()*height) },
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
				width = this.data('fall_width'),
				height = this.data('fall_height'),
				particle, dis, y;
			for (var i=0,l=particles.length; i<l; i++) {
				particle = particles[i];
				dis = particle.data('fall_speed')*delta;
				y = particle.y;
				if (y > height) {
					y = -Math.floor(Math.random()*height);
				}
				particle.style('y', y+dis);
			}
		}
	},
	
	snow: {
		type: 'snow',
		init: function(particle) {
			var width = particle.width,
				height = particle.height,
				particle;
			this.particles = [];
			this.data('fall_width', width);
			this.data('fall_height', height);
			for (var i=0,l=particle.num||60; i<l; i++) {
				particle = new Shape({
					renderInCanvas: this.renderInCanvas,
					pos: { x: Math.floor(Math.random()*width), y: -Math.floor(Math.random()*height) },
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
				width = this.data('fall_width'),
				height = this.data('fall_height'),
				particle, dis, x, y;
			for (var i=0,l=particles.length; i<l; i++) {
				particle = particles[i];
				dis = particle.data('fall_speed')*delta;
				x = particle.data('fall_x');
				y = particle.y;
				if (y > height) {
					particle.fallTime = 0;
					y = -Math.floor(Math.random()*height);
				}
				particle.style('pos', { x: x + Math.sin(y/50)*particle.data('fall_width'), y: y+dis });
			}
		}
	}
}

return ParticleEmitter;
});