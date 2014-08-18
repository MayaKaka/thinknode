(function(){
	"use strict";
	
var Bitmap1 = Class.extend.call(cy.Bitmap, {
	init: function(width, height) {
		var cache = document.createElement('canvas');

		if (width > 2047) width = 2047;
		if (height > 2047) height = 2047;	
		cache.width = width;
		cache.height = height;
		
		this.initialize(cache);
	},
	drawTexture: function(image) {
		var ctx = this.image.getContext('2d'),
			width = this.image.width,
			height = this.image.height;
		
		ctx.rect(0, 0, width, height);
		ctx.fillStyle = ctx.createPattern(image, 'repeat');
		ctx.fill();
	}
});

var Bitmap3 = Class.extend.call(cy.Bitmap, {
	init: function(width, height) {
		var cache = document.createElement('canvas');

		if (width > 2047) width = 2047;
		if (height > 2047) height = 2047;	
		cache.width = width;
		cache.height = height;
		
		this.initialize(cache);
	},
	drawTexture: function(top, middle, bottom) {
		var ctx = this.image.getContext('2d'),
			width = this.image.width,
			height = this.image.height;
		ctx.drawImage(top, 0, 0);
		ctx.drawImage(middle, 0, top.height, middle.width, height - top.height - bottom.height);
		ctx.drawImage(bottom, 0, height - bottom.height);
	}
});

var Bitmap9 = Class.extend.call(cy.Bitmap, {
	init: function(width, height) {
		var cache = document.createElement('canvas');

		if (width > 2047) width = 2047;
		if (height > 2047) height = 2047;	
		cache.width = width;
		cache.height = height;
		
		this.initialize(cache);
	},
	drawTexture: function(leftTop, centerTop, rightTop, leftMiddle, centerMiddle, rightMiddle, leftBottom, centerBottom, rightBottom) {
		var ctx = this.image.getContext('2d'),
			width = this.image.width,
			height = this.image.height;
		ctx.drawImage(leftTop, 0, 0);
		ctx.drawImage(centerTop, leftTop.width, 0, width - leftTop.width - rightTop.width, centerTop.height);
		ctx.drawImage(rightTop, width - rightTop.height, 0);
		
		ctx.drawImage(leftMiddle, 0, leftTop.height, leftMiddle.width, height - leftTop.height - leftBottom.height);
		ctx.drawImage(centerMiddle, leftMiddle.width, centerTop.height, width - leftMiddle.width - rightMiddle.width, height - centerTop.height - centerBottom.height);
		ctx.drawImage(rightMiddle, width - rightMiddle.width, rightTop.height, rightMiddle.width, height - rightTop.height - rightBottom.height);
		
		ctx.drawImage(leftBottom, 0, height - leftBottom.height);
		ctx.drawImage(centerBottom, leftBottom.width, height - centerBottom.height, width - leftBottom.width - rightBottom.width, centerBottom.height);
		ctx.drawImage(rightBottom, width - rightBottom.width, height - rightBottom.height);
	}
});	

cy.Bitmap1 = Bitmap1;
cy.Bitmap3 = Bitmap3;
cy.Bitmap9 = Bitmap9;

})();
