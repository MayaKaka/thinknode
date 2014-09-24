
define(function (require, exports, module) {
	"use strict";
	
var Filter = function() {};

Filter.get = function(image, type, value) {
	var filter = Filter.filters[type];
	
	if (filter) {
		return filter(image, value);
	}
};

Filter.filters = {
	grayscale: function(image, value) {
		var canvas = document.createElement('canvas');
		canvas.width = image.width;
		canvas.height = image.height;
		
		var ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0);
		
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
			data = imageData.data,
			pixel;
			
		for (var i=0, l=data.length; i<l; i+=4) {
			pixel = (data[i]+data[i+1]+data[i+2])/3;
			data[i] = data[i+1] = data[i+2] = pixel;
		}
	
		ctx.putImageData(imageData, 0, 0);
	
		return canvas;
	},
	
	brightness: function(image, value) {
		var canvas = document.createElement('canvas');
		canvas.width = image.width;
		canvas.height = image.height;
		
		var ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0);
		
		ctx.globalCompositeOperation = 'lighter';
		ctx.drawImage(image, 0, 0);
		
		return canvas;	
	},
	
	abstract: function(image, value) {
		var canvas = document.createElement('canvas');
		canvas.width = image.width;
		canvas.height = image.height;
		
		var ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0);
		
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
			data = imageData.data,
			text = ['1', '0'],
			pixels = [];
			
		for (var i=0, l=data.length; i<l; i+=16) {
			if (Math.floor(i/4/canvas.width)%4) {
				continue;
			}
			pixels.push(['rgba('+data[i]+','+data[i+1]+','+data[i+2]+','+data[i+3]+')',
						text[Math.floor(Math.random()*2)],
						i/4%canvas.width, Math.floor(i/4/canvas.width)]);
		}

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font = '40px Microsoft Yahei';
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		ctx.globalAlpha = 0.25;
				
		var i, pixel;
		while (pixels.length) {
			i = Math.floor(Math.random()*pixels.length);
			pixel = pixels[i];
			ctx.fillStyle = pixel[0];
			ctx.fillText(pixel[1], pixel[2], pixel[3]);
			pixels.splice(i, 1);
		}
		
		return canvas;
	},
	
	rilievo: function(image, value) {
		var canvas = document.createElement('canvas');
		canvas.width = image.width;
		canvas.height = image.height;
		
		var ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0);
		
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
			data = imageData.data,
			next, diff, pixel,
			test = function(val) {
				if (val < 0) {
					val = 0;
				} else if(val > 255) {
					val = 255;
				}
				return val;
			};
			
		for (var i=0, l=data.length; i<l; i+=4) {
			next = i+4;
			if (data[next] === undefined) {
				next = i;
			}
			diff = Math.floor((data[next]+data[next+1]+data[next+2]) - (data[i]+data[i+1]+data[i+2]));
			pixel = test(diff + 128);
			data[i] = data[i+1] = data[i+2] = pixel;
		}
	
		ctx.putImageData(imageData, 0, 0);
	
		return canvas;
	}
}
	
return Filter;
});
