
define(function (require, exports, module) {
	"use strict";
	   
var DisplayObject = require('DisplayObject'),
	Preload = require('Preload'),
	Filter = require('Filter');

var supportCanvas = !!document.createElement('canvas').getContext,
	divStyle = document.createElement('div').style,
	prefix = divStyle.webkitTransform === ''? 'webkit' :
    		 divStyle.WebkitTransform === ''? 'Webkit' :
    		 divStyle.msTransform === ''? 'ms' :
    		 divStyle.MozTransform === ''? 'Moz' : 'ct';

var Bitmap = DisplayObject.extend({
	
	_image: null,
	_sourceRect: null,
	_sourceCanvas: null,
	_scaleToFit: false,
	
	init: function(props) {
		this._super(props);
		this._initImage(props); // 初始化图像资源
	},
	
	_initImage: function(props) {
		var image = props.image;
		
		if (props.sourceRect) { // 剪裁
			this._sourceRect = props.sourceRect;
			this.style('size', { width: this._sourceRect[2], height: this._sourceRect[3] });
		}
		else if (props.scaleToFit)  { // 平铺 
			this._scaleToFit = props.scaleToFit;
		}
		
		if (this.renderMode === 0) { // dom方式渲染
			this.elemStyle.backgroundImage = 'url('+image+')';	
			this.elemStyle.backgroundRepeat = 'no-repeat';
			if (this._sourceRect) { // 处理剪裁
				this.elemStyle.backgroundPosition = '-' + this._sourceRect[0] + 'px -' + this._sourceRect[1] + 'px';
			} 
			else if (this._scaleToFit) { // 处理平铺
				this.elemStyle.backgroundSize = '100% 100%';
			}
		} 
		else if (this.renderMode === 1) { // canvas方式渲染
			if (typeof(image) === 'string') { // 初始化image
				this._image = new Image();
				this._image.src = image;
			} else {
				this._image = image;
			}
		}
	},
		
	draw: function(ctx) {
		if (this._image.complete) {
			var image = this._sourceCanvas || this._image;

			if (this._sourceRect) { // 处理剪裁
				ctx.drawImage(image, this._sourceRect[0], this._sourceRect[1], this.width, this.height, 0, 0, this.width, this.height);
			} 
			else if (this._scaleToFit) { // 处理平铺
				ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, this.width, this.height);
			} 
			else { // 绘制image
				ctx.drawImage(image, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
			}
		}
	},
	
	applyFilter: function(type, value) {
		if (this.renderMode === 0) { // dom方式添加滤镜
			this.elemStyle[prefix + 'Filter'] = type ? (type + '(' + value + ')') : '';
		} 
		else if (this.renderMode === 1) { // canvas方式添加滤镜
			var image = this._image;
			
			if (image.complete) {
				this._sourceCanvas = (type && supportCanvas) ? Filter.get(image, type, value) : null;
			} 
			else {
				var self = this;
				// 兼容低版本ie		
				if (!image.addEventListener) {
					image.addEventListener = image.attachEvent;
				}
				// 加载完成后执行
				image.addEventListener('load', function() {
					self.applyFilter(type, value);
				});
			}
		}	
	}
	
});
	
return Bitmap;
});