define(function (require, exports, module) {

var	Shape = require('Shape');
	   
var ParticleEmitter = function() {};

ParticleEmitter.Snow = {
	type: 'Snow',
	init: function() {
		this._particles = [];
		var particle;
		for(var i=0; i<60; i++) {
			particle = new Shape({
				renderInCanvas: this.renderInCanvas,
				pos: { x: Math.floor(Math.random()*600), y: -Math.floor(Math.random()*300) },
				graphics: {
					type: 'Circle', radius: Math.floor(Math.random()*4)+2, fill: '#FFF', angle: 360
				},
				alpha: Math.floor(Math.random()*5)/10+0.3
			});
			particle.fallX = particle.x;
			particle.fallWidth = Math.floor(Math.random()*10)+10;
			particle.fallSpeed =  Math.floor(Math.random()*3)/10+0.3;
			this._particles.push(particle);
			this.addChild(particle);
		}
	},
	
	update: function() {
		var particles = this._particles,
			particle, x, y;
		for (var i=0,l=particles.length; i<l; i++) {
			particle = particles[i];
			x = particle.fallX;
			y = particle.y;
			
			if (y>300) {
				particle.fallTime = 0;
				y = -Math.floor(Math.random()*300);
			}
			particle.style('pos', { x: x+Math.sin(y/particle.fallSpeed/360*Math.PI)*particle.fallWidth, y: y+particle.fallSpeed });
		}
	}
};

ParticleEmitter.Rain = {
	type: 'Rain',
	init: function() {
		this._particles = [];
		var particle;
		for(var i=0; i<60; i++) {
			particle = new Shape({
				renderInCanvas: this.renderInCanvas,
				pos: { x: Math.floor(Math.random()*600), y: -Math.floor(Math.random()*300) },
				graphics: {
					type: 'Rect', width: i%6===0?2:1, height: i%5===0?20:15, fill: '#FFF'
				},
				alpha: Math.floor(Math.random()*3)/10+0.3
			});
			particle.fallSpeed =  Math.floor(Math.random()*5)+5;
			this._particles.push(particle);
			this.addChild(particle);
		}
	},
	
	update: function() {
		var particles = this._particles,
			particle, y;
		for (var i=0,l=particles.length; i<l; i++) {
			particle = particles[i];
			y = particle.y;
			
			if (y>300) {
				y = -Math.floor(Math.random()*300);
			}
			particle.style('y', y+particle.fallSpeed);
		}
	}
};

return ParticleEmitter;
});