
define(function (require, exports, module) {
   
var DisplayObject = require('DisplayObject'),
	Shape = require('Shape');

var ParticleSystem = DisplayObject.extend({
	
	_particles: null,
	
	init: function($elem, props) {
		this.Super_init($elem, props);
		
		this._initParticle(props.particle);
	},
	
	_initParticle: function(particle) {
		this._particles = [];
		
		switch (particle.type) {
			case 'Snow':
				this._initSnow();
				this.update = this._updateSnow;
				break;
			case 'Rain':
				this._initRain();
				this.update = this._updateRain;
				break;
			case 'Fire':
				break;
			case 'Fly':
				break;
		}
	},
	
	_initSnow: function() {
		var particle;
		for(var i=0; i<60; i++) {
			particle = new Shape(null, {
				renderInCanvas: this.renderInCanvas,
				pos: { x: Math.floor(Math.random()*600), y: -Math.floor(Math.random()*300) },
				graphics: {
					type: 'Circle', radius: Math.floor(Math.random()*4)+2, color: '#FFF', angle: 360
				},
				style: { alpha: Math.floor(Math.random()*5)/10+0.2 }
			});
			particle.fallX = particle.x;
			particle.fallWidth = Math.floor(Math.random()*10)+10;
			particle.fallSpeed =  Math.floor(Math.random()*3)/10+0.3;
			this._particles.push(particle);
			this.addChild(particle);
		}		
	},
	
	_initRain: function() {
		var particle;
		for(var i=0; i<60; i++) {
			particle = new Shape(null, {
				renderInCanvas: this.renderInCanvas,
				pos: { x: Math.floor(Math.random()*600), y: -Math.floor(Math.random()*300) },
				graphics: {
					type: 'Rect', width: i%6===0?2:1, height: i%5===0?20:15, color: '#FFF'
				},
				style: { alpha: Math.floor(Math.random()*3)/10+0.2 }
			});
			particle.fallSpeed =  Math.floor(Math.random()*5)+5;
			this._particles.push(particle);
			this.addChild(particle);
		}
	},
	
	_updateSnow: function(){
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
			
			particle.pos(x+Math.sin(y/particle.fallSpeed/360*Math.PI)*particle.fallWidth, y+particle.fallSpeed);
		}
	},
	
	_updateRain: function() {
		var particles = this._particles,
			particle, y;
			
		for (var i=0,l=particles.length; i<l; i++) {
			particle = particles[i];
			y = particle.y;
			
			if (y>300) {
				y = -Math.floor(Math.random()*300);
			}
			
			particle.posY(y+particle.fallSpeed);
		}
	}
});

return ParticleSystem;
});