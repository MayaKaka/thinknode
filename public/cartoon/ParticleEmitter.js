define(function (require, exports, module) {
	"use strict";
	
var	Shape = require('Shape'),
	Bitmap = require('Bitmap');
	   
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
						type: 'rect', width: i%6===0?3:2, height: i%3===0?24:16, fill: '#FFF'
					},
					alpha: Math.floor(Math.random()*3)/10+0.2
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
				image, radius, pos, alpha,
				particle;
			
			if (particle.image) {
				image = new Image();
				image.src = particle.image;
			}
			this.particles = [];
			this.data('fall_width', width);
			this.data('fall_height', height);
			
			for (var i=0,l=particle.num||60; i<l; i++) {
				pos = { x: Math.floor(Math.random()*width), y: -Math.floor(Math.random()*height) };
				radius = Math.floor(Math.random()*8)+12;
				alpha = Math.floor(Math.random()*4)/10+0.6;
				
				particle = image ? new Bitmap({
					renderInCanvas: this.renderInCanvas,
					pos: pos, width: radius, height: radius, scaleToFit: true,
					image: image, alpha: alpha
				}) : new Shape({
					renderInCanvas: this.renderInCanvas,
					pos: pos, alpha: Math.floor(Math.random()*5)/10+0.3,
					graphics: {
						type: 'circle', radius: Math.floor(Math.random()*3)+4, fill: '#FFF', angle: 360
					}
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