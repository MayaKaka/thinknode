


(function(){
	"use strict";
	
var Label = Class.extend.call(cy.Text, {
	type: 'Label',
	fontSize: 20,
	fontFamily: '微软雅黑',
	color: '#FFFFFF',
	useTextCache:  true,
	
	border: null,
	
	_realRect: null,
	_stateChanged: false,
	_textCache: null,
	_colorCache: null,
	_fontSizeCache: null,
	_fontFamilyCache: null,
	
	init: function(text, params) {
		if (params) {
			if (params.fontSize) this.fontSize = params.fontSize;
			if (params.fontFamily) this.fontFamily = params.fontFamily;
			if (params.color) this.color = params.color;
		}
		// this.shadow = new createjs.Shadow("#000000", 1, 1, 1);
		this._realRect = new cy.Rectangle();
		this.initialize(text, this.font, this.color);
	},
	
	reset: function(){
		if (this._stateChanged) this._stateChanged = false;
		if (this._fontSizeCache !== this.fontSize || this._fontFamilyCache !== this.fontFamily) {
			this.font = 'normal normal '+this.fontSize+'px '+this.fontFamily;
			this._fontSizeCache = this.fontSize;
			this._fontFamilyCache = this.fontFamily;
			this._stateChanged = true;
		}
		if (!this.useTextCache) return;
		if (this._colorCache !== this.color) {
			this._colorCache = this.color;
			this._stateChanged = true;
		}
		if (this._textCache === null) {
			// 当文本缓存为空时，初始化文本缓存
			this._drawTextCache();
		} else if (this._textCache !== this.text || this._stateChanged) {
			// 当文本改变时，清除文本缓存，当前帧直接绘制文本，并更新文本的矩形区域，下一帧重新初始化缓存
			this._clearTextCache();
		}
	},
	
	draw: function(ctx, ignoreCache) {
		App.drawCount++;
		if (!ignoreCache) this.reset();
		if (!ignoreCache && this.cacheCanvas) {
			//当绘制 cacheCanvas时，清除上下文的阴影状态，因为 IOS 会预处理阴影而影响性能
			ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
		}
		
		if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }

		// if(typeof(this.color)==='string') this.useGradient(ctx);
		var col = this.color || "#000";
		if (this.outline) { ctx.strokeStyle = col; ctx.lineWidth = this.outline*1; }
		else { ctx.fillStyle = col; }
		
		this._drawText(this._prepContext(ctx), this._realRect);
		return true;
	},
	
	useGradient: function(ctx) {
		var gradient = ctx.createLinearGradient(0,0,0,this.fontSize);
		gradient.addColorStop(0, "rgb(247,235,112)");
		gradient.addColorStop(1, "rgb(239,162,9)");
		this.color = gradient;
		this.borderColor = 'rgb(65,19,0)';
	},
	
	getMeasuredLineHeight: function() {
		if (this.fontFamily === '微软雅黑') {
			return this.Super_getMeasuredLineHeight();
		} else {
			return this._prepContext(cy.Text._workingContext).measureText("中").width;
		}
	},
	
	getMeasuredRect: function() {
		if (this._realRect) {
			var w = this._realRect.width,
				x = w * cy.Text.H_OFFSETS[this.textAlign||"left"],
				lineHeight = this.lineHeight||this.getMeasuredLineHeight(),
				y = lineHeight * cy.Text.V_OFFSETS[this.textBaseline||"top"],
				h = this._realRect.height;
			return this._rectangle.initialize(x, y, w, h);
		}
		return this.getBounds();
	},
	
	_drawText: function(ctx, o) {
		var paint = !!ctx;
		if (!paint) { ctx = this._prepContext(Text._workingContext); }
		var lineHeight = this.lineHeight||this.getMeasuredLineHeight();
		
		var maxW = 0, count = 0;
		var lines = String(this.text).split(/(?:\r\n|\r|\n)/);
		for (var i=0, l=lines.length; i<l; i++) {
			var str = lines[i];
			var w = null;
			
			if (this.lineWidth != null && (w = ctx.measureText(str).width) > this.lineWidth) {
				var words = [],
					k = w/this.lineWidth,
					sl = Math.floor(str.length/k),
					substr = null;
				for(var j=0; j<=k; j++) {
					substr = str.substring(j*sl, (j+1)*sl);
					if (paint) { this._drawTextLine(ctx, substr, count*lineHeight); }
					if (o) { w = ctx.measureText(substr).width; }
					if (w > maxW) { maxW = w; }
					count++;
				}
			} else {
				if (paint) { this._drawTextLine(ctx, str, count*lineHeight); }
				if (o && w == null) { w = ctx.measureText(str).width; }
				if (w > maxW) { maxW = w; }
				count++;
			}
		}
		
		if (o) {
			o.count = count;
			o.width = maxW;
			o.height = count*lineHeight;
		}
		return o;
	},

	_drawTextLine: function(ctx, text, y) {	
		if (this.border) {
			var offsetX = [1,1,-1,-1],
				offsetY = [1,-1,1,-1];
			ctx.shadowColor = this.border.color;
			ctx.shadowBlur = this.border.blur;
			for (var i=0;i<4;i++) {
				ctx.shadowOffsetX = offsetX[i];
				ctx.shadowOffsetY = offsetY[i];
				this.Super__drawTextLine(ctx, text, y);
			}
		} else {
			this.Super__drawTextLine(ctx, text, y);
		}
	},
	
	_drawTextCache: function(){
		if (this._realRect.width<=0) return false;
		var rect = this.getMeasuredRect();
		this.cache(rect.x-2, rect.y-2, rect.width+4, rect.height+4);
		// this.cacheCanvas.getContext('2d').strokeStyle = 'rgb(0,255,0)';
		// this.cacheCanvas.getContext('2d').strokeRect(0,0,rect.width+4, rect.height+4);
		this._textCache = this.text;
		return true;
	},
	
	_clearTextCache: function(){
		this._textCache = this.cacheCanvas = null;
	}
});

cy.Label = Label;

})();