
define(function (require, exports, module) {
	"use strict";
	   
var DisplayObject = require('DisplayObject'),
	Filter = require('Filter');

var supportCanvas = !!document.createElement('Canvas').getContext;

var Bitmap = DisplayObject.extend({
	
	_image: null,
	_sourceRect: null,
	_sourceCanvas: null,
		
	init: function(props) {
		this._super(props);
		
		if (props.sourceRect) {
			this._sourceRect = props.sourceRect;
			this.style('size', { width: props.sourceRect[2], height:  props.sourceRect[3] });
		}
		
		this._initImage(props.image);
	},
	
	_initImage: function(image) {
		if (this.renderInCanvas) {
			this._image = new Image();
			this._image.src = image;
		} else {
			this.elemStyle.backgroundImage = 'url('+image+')';	
			this.elemStyle.backgroundRepeat = 'no-repeat';
			if (this._sourceRect) {
				this.elemStyle.backgroundPosition = '-' + this._sourceRect[0] + 'px -' + this._sourceRect[1] + 'px';
			}
		}
	},
		
	draw: function(ctx) {
		if (this._image.complete) {
			var image = this._sourceCanvas || this._image;
				
			if (this._sourceRect) {
				ctx.drawImage(image, this._sourceRect[0], this._sourceRect[1], this.width, this.height, 0, 0, this.width, this.height);
			} else {
				ctx.drawImage(image, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
			}
		}
	},
	
	applyFilter: function(type) {
		if (this.renderInCanvas) {
			switch (type) {
				case false:
					this._sourceCanvas = null;
					break;
				default:
					this._sourceCanvas = supportCanvas? Filter.get(type, this._image): null;
					break;
			}
		} else {
			var style = this.elemStyle;

			switch (type) {
				case false:
					style.WebkitFilter = style.msFilter = style.MozFilter = '';
					break;
				case 'grayscale':
					style.WebkitFilter = style.msFilter = style.MozFilter = 'grayscale(100%)';	
					break;
				case 'contrast': case 'saturate': case 'brightness':
				default:
					style.WebkitFilter = style.msFilter = style.MozFilter = type+'(2)';
					break;
			}
		}	
	}
});
	
return Bitmap;
});
