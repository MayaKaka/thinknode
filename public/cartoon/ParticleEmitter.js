define(function (require, exports, module) {
	"use strict";
	
var	Shape = require('Shape'),
	Bitmap = require('Bitmap');
	   
var ParticleEmitter = function() {};

ParticleEmitter.get = function(type) {
	// 获取粒子效果		
	return ParticleEmitter.particles[type];
}

ParticleEmitter.particles = {	
	rain: {
		type: 'rain',
		init: function(data) {
			var width = data.width,
				height = data.height,
				particle;
			this.particles = [];
			this.data('fall_width', width);
			this.data('fall_height', height);
			// 初始化雨滴粒子
			for(var i=0, l=data.num||60; i<l; i++) {
				particle = new Shape({
					renderMode: this.renderMode,
					pos: { x: Math.floor(Math.random()*width), y: -Math.floor(Math.random()*height) },
					graphics: {
						type: 'rect', width: i%6===0?3:2, height: i%3===0?28:20, fill: '#FFF'
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
			// 雨滴下落效果
			for (var i=0, l=particles.length; i<l; i++) {
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
		init: function(data) {
			var width = data.width,
				height = data.height,
				particle, image,
				radius, pos, alpha;
			if (data.image) {
				image = new Image();
				image.src = data.image;
			}
			this.particles = [];
			this.data('fall_width', width);
			this.data('fall_height', height);
			// 初始化雪花粒子
			for (var i=0, l=data.num||60; i<l; i++) {
				pos = { x: Math.floor(Math.random()*width), y: -Math.floor(Math.random()*height) };
				radius = Math.floor(Math.random()*8)+12;
				alpha = Math.floor(Math.random()*4)/10+0.6;
				
				particle = image ? new Bitmap({
					renderMode: this.renderMode,
					pos: pos, width: radius, height: radius, scaleToFit: true,
					image: image, alpha: alpha
				}) : new Shape({
					renderMode: this.renderMode,
					pos: pos, alpha: Math.floor(Math.random()*5)/10 + 0.3,
					graphics: {
						type: 'circle', radius: Math.floor(Math.random()*3) + 4, fill: '#FFF', angle: 360
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
				particle, spd, dis, x, y;
			// 雪花飘落效果
			for (var i=0, l=particles.length; i<l; i++) {
				particle = particles[i];
				spd = particle.data('fall_speed');
				dis = spd * delta;
				x = particle.data('fall_x');
				y = particle.y;
				if (y > height) {
					particle.fallTime = 0;
					y = -Math.floor(Math.random()*height);
				}
				particle.style('pos', { x: x + Math.sin(y / (spd*2000)) * particle.data('fall_width'), y: y + dis });
			}
		}
	}
	
}

return ParticleEmitter;
});