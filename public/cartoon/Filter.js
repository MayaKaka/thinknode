
define(function (require, exports, module) {
	"use strict";
	
var Filter = function() {};

Filter.get = function(type, image) {
	var filter = Filter.filters[type];
	
	if (filter) {
		return filter(image);
	}
};

Filter.filters = {
	grayscale: function(image) {
		var canvas = document.createElement('canvas');
		canvas.width = image.width;
		canvas.height = image.height;
		
		var ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0);
		
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
			data = imageData.data,
			pixelData;
			
		for (var i=0, l=data.length; i<l; i+=4) {
			pixelData = (data[i]+data[i+1]+data[i+2])/3;
			data[i] = data[i+1] = data[i+2] = pixelData;
			data[i+3] = data[i+3];
		}
	
		ctx.putImageData(imageData, 0, 0);
	
		return canvas;
	},
	
	brightness: function(image) {
		var canvas = document.createElement('canvas');
		canvas.width = image.width;
		canvas.height = image.height;
		
		var ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0);
		
		ctx.globalCompositeOperation = 'lighter';
		ctx.drawImage(image, 0, 0);
		
		return canvas;	
	}
}
	
return Filter;
});
