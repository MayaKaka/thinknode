


(function(){
	"use strict";
	
var ColorRect = Class.extend.call(cy.Shape, {
	type: 'ColorRect',
	width: 0,
	height: 0,
	color: '#FFFFFF',
	borderRadius: 0,
	
	_widthCache: null,
	_heightCache: null,
	_colorCache: null,
	
	init: function(width, height, color) {
		this.initialize();
		
		if (width) this.width = width;
    	if (height) this.height = height;
		if (color) this.color = color;
		this.reset();
	},
	
	reset: function() {
		if (this._widthCache!==this.width || this._heightCache!==this.height || this._colorCache!==this.color) {
			this.graphics.clear().beginFill(this.color);
			if (this.borderRadius>0) {
				this.graphics.drawRoundRect(0, 0, this.width, this.height, this.borderRadius);
			} else {
				this.graphics.drawRect(0, 0, this.width, this.height);
			}
			
			this._colorCache = this.color;
			this._widthCache = this.width;
			this._heightCache = this.height;	
		}
	},
	
	draw: function(ctx, ignoreCache) {
		App.drawCount++;
		if (!ignoreCache) this.reset();
		// this.useGradient(ctx);
		return this.Super_draw(ctx, ignoreCache);
	},
	
	useGradient: function(ctx) {
		var gradient = ctx.createLinearGradient(0,0,0,this.height);
		gradient.addColorStop(0,"rgb(247,235,112)");
		gradient.addColorStop(1,"rgb(239,162,9)");
		this.color = gradient;
	},
	
	getMeasuredRect: function(){
		return this._rectangle.initialize(0, 0, this.width, this.height);
	}
	
});

cy.ColorRect = ColorRect;

})();