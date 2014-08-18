
define(function (require, exports, module) {
   
var Class = require('Class'),
	Matrix2D = require('Matrix2D'),
	Ease = require('Ease');
	
var divStyle = document.createElement('div').style;

var supportTransform = divStyle.transform === '' || divStyle.webkitTransform === '' || divStyle.msTransform === '' || divStyle.MozTransform === '',
	supportIE6Filter = supportTransform? false : divStyle.filter === '',
	isWebkitCore = divStyle.webkitTransform === '',
    isIE9 = navigator.userAgent.indexOf("MSIE 9.0")>0;
      
var DisplayObject = Class.extend({
	x: 0,
	y: 0,
	
	width: 0,
	height: 0,	
	
	translateX: 0,
	translateY: 0,
	 
	scaleX: 1,
	scaleY: 1,
	skewX: 0,
	skewY: 0,
	rotation: 0,
	originX: 0.5,
	originY: 0.5,
		
	alpha: 1,
	visible: true,
	
	parent: null,
	
	elem: null,
	elemStyle: null,
	
	renderInCanvas: false,
	blendMode: 'source-over',
	
	_tagName: 'div',
	_children: null,
	_matrix2d: null,

//  Public Methods
	
	init: function($elem, props) {
		
		this.$ = $elem ? $elem : jQuery(document.createElement(this._tagName));
		this.elem = this.$[0];
		this.elem.displayObj = this;
		this.elemStyle = this.elem.style;
				
		this._children = [];
	    this._matrix2d = new Matrix2D();
	   	
	   	if ('renderInCanvas' in props) this.renderInCanvas = !!props.renderInCanvas;
	   	if (props.pos) this._setPos(props.pos);
	   	if (props.size) this._setSize(props.size);
	   	if (props.transform) this._setTransform(props.transform);
	   	if (props.style) this._setStyle(props.style);
	},
		
	addChild: function(displayObj) {
		if (displayObj.renderInCanvas) {
			this._children.push(displayObj);
		} else {
			this.elem.appendChild(displayObj.elem);
		}
		displayObj.parent = this;
	},
	
	removeChild: function(displayObj) {
		if (displayObj.renderInCanvas) {
			for (var i=this._children.length-1; i>=0; i++) {
				if (this._children[i] === displayObj) {
					this._children.splice(i, 1);
					break;
				}
			}
		} else {
			this.elem.removeChild(displayObj.elem);
		}
		displayObj.parent = null;
	},
	
	forEachChildren: function(func) {
		
	},
		
	pos: function(x, y) {
		this._setPos({ x: x, y: y });
	},
	
	posX: function(x) {
		this._setPos({ x: x });
	},
	
	posY: function(y) {
		this._setPos({ y: y });
	},
	
	size: function(width, height) {
		this._setSize({ width: width, height: height });
	},
	
	transform: function(props) {
		this._setTransform(props);
	},
	
	style: function(props) {
		this._setStyle(props);
	},
	
	to: function() {
		this.$.animate.apply(this.$, arguments);
		
		return this;
	},
	
	on: function(event, handler){
		this.$.on(event, handler);
	},
	
	one: function(event, handler){
		this.$.one(event, handler);
	},
		
	un: function(event, handler){
		this.$.un(event, handler);
	},
	
	draw: function(ctx) {
		if (!this._children.length) return;
		
		var children = this._children,
			displayObj;

		for (var i=0,l=children.length; i<l; i++) {
			displayObj = children[i];
			
			if (displayObj.visible) {
				ctx.save();
				displayObj._drawCanvas(ctx);
				ctx.restore();
			}
		}
	},
	
//  Private Methods

	// pos style
	// { x: 0, x: 0 }
	_getPos: function(){
		if (!this._tempVarsPos) {
			this._tempVarsPos = {};
		}
		
		var pos = this._tempVarsPos;
		pos.x = this.x;
		pos.y = this.y;
		
		return pos;
	},
	
	_setPos: function(pos) {
		if ('x' in pos) this.x = pos.x;
		if ('y' in pos) this.y = pos.y;
		
		if (this.renderInCanvas) return;
		
		var style = this.elemStyle;
		if (style.position !== 'absolute') {
			style.position = 'absolute';
		}
		style.left = this.x + 'px';
		style.top = this.y + 'px';
	},
	
	_stepPos: function(fx) {
		var result = this._stepAnimation(fx);
		
		this._setPos(result);
	},	
	
	// size style
	// { width: 100, height: 100 }
	_getSize: function(){
		if (!this._tempVarsSize) {
			this._tempVarsSize = {};
		}
		
		var size = this._tempVarsSize;
		size.width = this.width;
		size.width = this.height;
		
		return size;
	},
	
	_setSize: function(size) {
		if ('width' in size) this.width = size.width;
		if ('height' in size) this.height = size.height;
		
		if (this.renderInCanvas) return;
		
		var style = this.elemStyle;
		style.width = this.width + 'px';
		style.height = this.height + 'px';
	},
	
	// transform get
	// { rotate: 0, scaleX: 1, scaleY: 1 }
	_getTransform: function() {
		if (!this._tempVarsTransform) {
			this._tempVarsTransform = {};
		}
		
		var transform = this._tempVarsTransform;
		transform.rotate = this.rotation;
		transform.scale = transform.scaleX = this.scaleX;
		transform.scaleY = this.scaleY;
		transform.origin = transform.originX = this.originX;
		transform.originY = this.originY;
		
		return transform;
	},
	// transform set
	_setTransform: function(transform) {		
		for (var i in transform) {
			this._updateTransform(i, transform[i]);
		}
		
		if (this.renderInCanvas) return;
		
		var style = this.elemStyle;
		// handle ie6-ie8 matrix filter
		if (supportIE6Filter) {
			var	elem = this.elem,
				filter = style.filter,
				matrix = this._updateMatrix2D(true),
				regMatrix = /Matrix([^)]*)/,
				matrixText = [
					'Matrix('+
						'M11='+matrix.a,
						'M12='+matrix.b,
						'M21='+matrix.c,
						'M22='+matrix.d,
						'SizingMethod=\'auto expand\''
				].join(',');
					
			style.filter = filter.match(regMatrix) ? filter.replace(regMatrix, matrixText) : ('progid:DXImageTransform.Microsoft.' + matrixText + ') ' + filter);		
			style.marginLeft = (elem.clientWidth - elem.offsetWidth) * this.originX + 'px';
			style.marginTop = (elem.clientHeight - elem.offsetHeight) * this.originY + 'px';
		} else {
			
			style.transform = style.webkitTransform = style.msTransform = style.MozTransform = this._mergeTransformText();	
			if ('origin' in transform || 'originX' in transform || 'originY' in transform) {
				style.transformOrigin = style.webkitTransformOrigin = style.msTransformOrigin = style.MozTransformOrigin = this.originX * 100 + '% ' + this.originY * 100 + '%';
			}
		}
	},
	// transform step
	_stepTransform: function(fx) {
		var result = this._stepAnimation(fx);
		
		this._setTransform(result);
	},
	// transform update
	_updateTransform: function(type, value) {
		switch(type) {
			case 'translateX': this.translateX = value;
	    		break;
	    	case 'translateY': this.translateY = value;
	    		break;
	    	case 'rotate': this.rotation = value;
	    		break;
	    	case 'scaleX': this.scaleX = value;
	    		break;
	    	case 'scaleY': this.scaleY = value;
	    		break;
	    	case 'scale':  this.scaleX = this.scaleY = value;
	    		break;
	    	case 'skew':   this.skewX = this.skewY = value;
	    		break;
	    	case 'originX': this.originX = value;
	    		break;
	    	case 'originY': this.originY = value;
	    		break;
	    	case 'origin':  this.originX = this.originY = value;
	    		break;
	    }
	},
	// transform text
	_mergeTransformText: function() {
		var value = '';
					
		if (this.translateX!==0 || this.translateY!==0) {
			value += 'translate('+this.translateX+'px,'+this.translateY+'px'+')';
		}
		if (this.rotation!==0) {
		    value += ' rotate('+this.rotation+'deg)';
		}
		if (this.scaleX!==1 || this.scaleY!==1) {
			value += ' scale('+this.scaleX+','+this.scaleY+')';	
		}
		if (this.skewX!==0 || this.skewY!==0) {
			value += ' skew('+this.skewX+','+this.skewY+')';
		}
			
		return value;
	},
	// style get
	_getStyle: function() {
		if (!this._tempVarsStyle) {
			this._tempVarsStyle = {};
		}
		
		var style = this._tempVarsStyle;
		style.visible = this.visible;
		style.alpha = this.alpha;
		
		return style;
	},
	// style set	
	_setStyle: function(style) {
		if ('visible' in style) this._setVisible(style.visible);
		if ('alpha' in style) this._setAlpha(style.alpha);
	},
	// style step
	_stepStyle: function(fx) {
		var result = this._stepAnimation(fx);
		
		this._setStyle(result);
	},
	// visible style set
	// true
	_setVisible: function(visible) {
		this.visible = visible;
		
		if (self.renderInCanvas) return;
		
		this.elemStyle.display = visible? 'block': 'none';
	},	
	
	// alpha style set
	// 0.8
	_setAlpha: function(alpha) {
		this.alpha = alpha;
		
		if (self.renderInCanvas) return;
		
		var style = this.elemStyle;
		// handle ie6-ie8 alpha filter
		if (supportIE6Filter) {
			var filter = style.filter,
				regAlpha = /alpha\(opacity=([^)]*)/,
				alphaText = 'alpha(opacity=' + alpha*100;
				
			style.filter = filter.match(regAlpha) ? filter.replace(regAlpha, alphaText) : (filter + ' '+alphaText+')');	
		} else {
			style.opacity = alpha;
		}
	},
	
	_stepAnimation: function(fx) {
		var start = fx.start,
			end = fx.end,
			pos = fx.pos;
		
		var result = {};	
		
		for (var i in end) {
			result[i] = (end[i] - start[i])*pos + start[i];
		}
		
		return result;
	},
	// render in canvas
	// 
	_drawCanvas: function(ctx) {
		this._updateCanvasContext(ctx);
		this.draw(ctx);
	},
	
	_updateCanvasContext: function(ctx, dx, dy) {
		var mtx = this._updateMatrix2D(),
			dx = this._getDx(),
			dy = this._getDy();
		
		if (dx === 0 && dy === 0) {
			ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
		} else {
			ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx+dx, mtx.ty+dy);
			ctx.transform(1, 0, 0, 1, -dx, -dy);
		}
		
		ctx.globalAlpha *= this.alpha;
		ctx.globalCompositeOperation = this.blendMode;
	},
	// get anchor dx	
	_getDx: function() {
		return (this.renderInCanvas? this.width: (this.elem.clientWidth || parseFloat(this.elemStyle.width))) * this.originX;
	},
	// get anchor dy
	_getDy: function() {
		return (this.renderInCanvas? this.height: (this.elem.clientHeight || parseFloat(this.elemStyle.height))) * this.originY;
	},
	
	_updateMatrix2D: function(ieMatrix) {
		if (ieMatrix) {
			return this._matrix2d.identity().rotate(-this.rotation%360*Matrix2D.DEG_TO_RAD).scale(this.scaleX, this.scaleY);
		} else {
			return this._matrix2d.identity().appendTransform(this.x+this.translateX, this.y+this.translateY, this.scaleX, this.scaleY, this.rotation, 0, 0, 0, 0);
		}
	}
	
});

DisplayObject.create = function(elem) {
	if (!elem.displayObj) {
		new DisplayObject(jQuery(elem), {});
	}
	
	return elem.displayObj;
};

DisplayObject.supportIE6Filter = supportIE6Filter;
DisplayObject.isIE9 = isIE9;

// jQuery plus
jQuery.extend( jQuery.cssHooks, {
	pos: {
		get: function(elem) {
			return DisplayObject.create(elem)._getPos();
		},
		set: function(elem, value) {
			DisplayObject.create(elem)._setPos(value);
		}
	},
	size: {
		get: function(elem) {
			return DisplayObject.create(elem)._getSize();
		},
		set: function(elem, value) {
			DisplayObject.create(elem)._setSize(value);
		}
	},
	transform: {
		get: function(elem) {
			return DisplayObject.create(elem)._getTransform();
		},
		set: function(elem, value) {
			if (typeof(value) === 'string') {
				elem.style.transform = value;
			} else {
				DisplayObject.create(elem)._setTransform(value);
			}
		}
	},
	style: {
		get: function(elem) {
			return DisplayObject.create(elem)._getStyle();
		},
		set: function(elem, value) {
			DisplayObject.create(elem)._setStyle(value);
		}
	}
});

jQuery.extend( jQuery.fx.step, {
	pos: function(fx) {
		DisplayObject.create(fx.elem)._stepPos(fx);
	},
	transform: function(fx) {
		DisplayObject.create(fx.elem)._stepTransform(fx);
	},
	style: function(fx) {
		DisplayObject.create(fx.elem)._stepStyle(fx);
	}
});

return DisplayObject;
});