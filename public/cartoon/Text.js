
define(function (require, exports, module) {
   
var DisplayObject = require('DisplayObject');
	
var Text = DisplayObject.extend({
	
	color: '#fff',
	text: null,
	
	init: function($elem, props) {
		this.Super_init($elem, props);
		
		this._setText(props.text);
	},
	
	draw: function(ctx) {
		ctx.font = '20px 微软雅黑';
		ctx.textBaseline = 'top';
		ctx.fillStyle = this.color;
		ctx.fillText(this.text, 0, 0);
	},
	
	_setText: function(text) {
		this.text = text;
		
		if (this.renderInCanvas) return;
		
		this.elem.innerHTML = text;
	}
});

return Text;
});