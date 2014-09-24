
define(function (require, exports, module) {
	"use strict";
	   
var DisplayObject = require('DisplayObject');
	
var Text = DisplayObject.extend({
	
	text: null,
	
	init: function(props) {
		this._super(props);
		this._setText(props);
	},
	
	draw: function(ctx) {
		ctx.font = this.font;
		ctx.textAlign = this.textAlign;
		ctx.textBaseline = this.textBaseline;
		ctx.fillStyle = this.fillColor;
		ctx.fillText(this.text, 0, 0);
	},
	
	_setText: function(props) {
		this.text = props.text || '';
		this.font = props.font || '20px Microsoft Yahei';
		this.textAlign = props.textAlign || 'left';
		this.textBaseline = props.textBaseline || 'top';
		this.fillColor = props.fill || 'black';
		
		if (!this.renderMode) {
			this.elem.innerHTML = this.text;
		}
	}
});

return Text;
});