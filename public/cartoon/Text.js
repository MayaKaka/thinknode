
define(function (require, exports, module) {
	"use strict";
	   
var DisplayObject = require('DisplayObject');
	
var Text = DisplayObject.extend({
	
	text: null,
	font: null,
	
	init: function(props) {
		this._super(props);
		this._setText(props.text, props.font, props.fill);
	},
	
	draw: function(ctx) {
		ctx.textBaseline = 'top';
		ctx.font = this.font;
		ctx.fillStyle = this.fillColor;
		ctx.fillText(this.text, 0, 0);
	},
	
	_setText: function(text, font, fill) {
		this.text = text || '';
		this.font = font || '20px Arail';
		this.style('fill', fill);
		
		if (!this.renderInCanvas) {
			this.elem.innerHTML = text;
		}
	}
});

return Text;
});