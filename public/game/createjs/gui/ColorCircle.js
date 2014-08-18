


(function(){
	"use strict";
	
var ColorCircle = Class.extend.call(cy.Shape, {
	type: 'ColorCircle',
	radius: 64,
	color: '#FFFFFF',
	gradient: null,
	outline: false,
	
	_radiusCache: null,
	_colorCache: null,
	
	init: function(radius, color) {
		this.initialize();
		
		if (radius) this.radius = radius;
		if (color) this.color = color;
		this.reset();
	},
	
	reset: function(){
		if (this._radiusCache!==this.radius || this._colorCache!==this.color) {
			this.graphics.clear().beginFill(this.color);
			this.graphics.drawCircle(0, 0, this.radius);
			this._radiusCache = this.radius;
			this._colorCache = this.color;
		}
	},
	
	draw: function(ctx, ignoreCache) {
		App.drawCount++;
		if (!ignoreCache) this.reset();
		// this.useGradient(ctx);
		return this.Super_draw(ctx, ignoreCache);
	},
	
	useGradient: function(ctx) {
		var gradient = ctx.createRadialGradient(0,0,0,0,0,this.radius);
		gradient.addColorStop(0,"rgb(247,235,112)");
		gradient.addColorStop(1,"rgb(239,162,9)");
		this.color = gradient;
	},
	
	getMeasuredRadius: function() {
		return this.radius;
	},
	
	getMeasuredRect: function() {
		return this._rectangle.initialize(-this.radius, -this.radius, 2*this.radius, 2*this.radius);
	}
});

cy.ColorCircle = ColorCircle;

})();