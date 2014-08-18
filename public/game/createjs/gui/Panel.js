
(function() {
    "use strict";
    
var Panel = Class.extend.call(cy.Container, {
	type: 'Panel',
	width: 0, 
	height: 0, 
	border: null,
	borderWidth: 1,
	borderColor: '#FFFFFF',
	backgroundBmp: null,
	overflow: true,
	
	init: function(width, height) {
		this.initialize();
    	if (width) this.width = width;
    	if (height) this.height = height;
	},
	
	isVisible: function() {
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
	},
	
	draw: function(ctx, ignoreCache) {
		if (this.DisplayObject_draw(ctx, ignoreCache)) { 
			App.drawCount++;
			return true; 
		}
		//不是绘制 cacheCanvas时, 剪切掉 溢出的部分
		if (this.width > 0 && this.height > 0) {
			if (this.border) {
				ctx.lineWidth = this.borderWidth;
		        ctx.strokeStyle = this.borderColor;
		        ctx.strokeRect(0, 0, this.width, this.height);
			}
			if (!this.overflow) {
				ctx.beginPath();
        		ctx.rect(0, 0, this.width, this.height);      	
        		ctx.clip();
        		ctx.closePath();
			}
		}
		return this.Super_draw(ctx, ignoreCache);
	},
	
	getMeasuredRect: function(){
		return this._rectangle.initialize(0, 0, this.width, this.height);
	},

	add1BackgroundBmp: function(image) {
		if (this.backgroundBmp) {
			this.removeChild(this.backgroundBmp);
		}
		this.backgroundBmp = new cy.Bitmap1(this.width, this.height);
		this.backgroundBmp.drawTexture(image);
		this.addChildAt(this.backgroundBmp, 0);
	},
	
	add3BackgroundBmp: function(top, middle, bottom) {
		if (this.backgroundBmp) {
			this.removeChild(this.backgroundBmp);
		}
		this.backgroundBmp = new cy.Bitmap3(this.width, this.height);
		this.backgroundBmp.drawTexture(top, middle, bottom);
		this.addChildAt(this.backgroundBmp, 0);
	},

	add9BackgroundBmp: function(leftTop, centerTop, rightTop, leftMiddle, centerMiddle, rightMiddle, leftBottom, centerBottom, rightBottom) {
		if (this.backgroundBmp) {
			this.removeChild(this.backgroundBmp);
		}
		this.backgroundBmp = new cy.Bitmap9(this.width, this.height);
		this.backgroundBmp.drawTexture(leftTop, centerTop, rightTop, leftMiddle, centerMiddle, rightMiddle, leftBottom, centerBottom, rightBottom);
		this.addChildAt(this.backgroundBmp, 0);
	}
});

cy.Panel = Panel;

})();
