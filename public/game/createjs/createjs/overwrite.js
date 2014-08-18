(function(){
var display_p = createjs.DisplayObject.prototype,
	stage_p = createjs.Stage.prototype,
	container_p = createjs.Container.prototype,
	bitmap_p = createjs.Bitmap.prototype,
	sprite_p = createjs.Sprite.prototype,
	dom_p = createjs.DOMElement.prototype,
	movie_p = createjs.MovieClip? createjs.MovieClip.prototype: {};
	
	
if (!window.cy) {
	window.cy = {
		Panel: function(){}
	};
	display_p.pixelHitTest = true;
} else {
	display_p.pixelHitTest = false;
}

display_p.snapToPixel = true;
bitmap_p.pixelHitTest = false;

//用矩阵运算取代 getImageData方式	
var hitPoint = function(o, x, y){
		// 使用像素检测
		if (o.pixelHitTest) {
			var ctx = createjs.DisplayObject._hitTestContext,
				mtx = o.getConcatenatedMatrix();
			ctx.setTransform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx-x, mtx.ty-y);
			o.draw(ctx);
			if (!o._testHit(ctx)) { return false; }
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, 2, 2);
			return true;
		} 
		// 使用矩阵检测
		else if (o.getMeasuredRadius || o.getMeasuredRect) {
			var mtx1 = o.getConcatenatedMatrix(),
				mtx2 = new createjs.Matrix2D();
			mtx2.append(mtx1.a, mtx1.b, mtx1.c, mtx1.d, x, y);
			mtx1.invert();
			mtx2.invert();
			var dx = mtx1.tx-mtx2.tx,
				dy = mtx1.ty-mtx2.ty,
				r = o.getMeasuredRadius? o.getMeasuredRadius(): 0;
			if (r>0) {
				return dx*dx+dy*dy<=r*r; 
			}
			var rect = o.getMeasuredRect? o.getMeasuredRect(): null,
				w = 0, h = 0;
			if (rect) {
				w = rect.width;
				h = rect.height;
				dx -= rect.x;
				dy -= rect.y;
				return dx>=0&&dx<=w&&dy>=0&&dy<=h;
			} 
			return false;
		}
		// 不检测
		return false; 
	};	
	

	stage_p._handlePointerUp = function(id, e, clear) {
		var o = this._getPointerData(id);

		this._dispatchMouseEvent(this, "stagemouseup", false, id, o, e);

		var oTarget = o.target;
		if (oTarget) {
			//调整了 pressup 和 click 事件的触发顺序
			this._dispatchMouseEvent(oTarget, "pressup", true, id, o, e);
			if (this._getObjectsUnderPoint(o.x, o.y, null, true) == oTarget) {
				this._dispatchMouseEvent(oTarget, "click", true, id, o, e);
			}
		}
		
		var oEvent = o.event;
		if (oEvent && oEvent.hasEventListener("mouseup")) {
			oEvent.dispatchEvent(new createjs.MouseEvent("mouseup", false, false, o.x, o.y, e, id, (id==this._primaryPointerID), o.rawX, o.rawY), oTarget);
		}
		if (clear) {
			if (id==this._primaryPointerID) { this._primaryPointerID = null; }
			delete(this._pointerData[id]);
		} else { o.event = o.target = null; }

		this.nextStage&&this.nextStage._handlePointerUp(id, e, clear);
	};	
	
	container_p._getObjectsUnderPoint = function(x, y, arr, mouse) {
		var mtx = this._matrix, child,
			l = this.children.length;
		for (var i=l-1; i>=0; i--) {
			child = this.children[i];
			if (!child.visible || !child.isVisible() || (mouse && !child.mouseEnabled)) { continue; }
			//用矩阵运算取代 getImageData方式
			if (child instanceof cy.Panel && child.width > 0 && child.height > 0) {
				var testHit = hitPoint(child,x,y);
				if (!child.overflow && !testHit) { continue; }
				var result = child._getObjectsUnderPoint(x, y, arr, mouse);
				if (!result && testHit) { result = child; }
				if (!arr && result) { return result; }
			}
			else if (child instanceof createjs.Container && !child.isnotContainer) {
				var result = child._getObjectsUnderPoint(x, y, arr, mouse);
				if (!arr && result) { return result; }
			} else {
				if (!hitPoint(child,x,y)) { continue; }
				if (arr) { arr.push(child); }
				else { return (mouse && !this.mouseChildren) ? this : child; }
			}
		}
		return null;
	};	
	container_p.draw = function(ctx, ignoreCache) {
		if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }
		var list = this.children.slice(0);
		for (var i=0,l=list.length; i<l; i++) {
			var child = list[i];
			if (!child.isVisible()) { continue; }
			ctx.save();
			child.updateContext(ctx);
			child.draw(ctx);
			//添加了drawDebug 绘制，用于编辑器
			child.drawDebug && child.drawDebug(ctx);
			ctx.restore();
		}
		return true;
	};
	container_p.removeAllChildren = function(){
		var children = this.children;
		while (children.length>0) {
			this.removeChildAt(0);
		}
	};
	container_p.removeChildAt = function(index) {
		var l = arguments.length;
		if (l > 1) {
			var a = [];
			for (var i=0; i<l; i++) { a[i] = arguments[i]; }
			a.sort(function(a, b) { return b-a; });
			var good = true;
			for (var i=0; i<l; i++) { good = good && this.removeChildAt(a[i]); }
			return good;
		}
		if (index < 0 || index > this.children.length-1) { return false; }
		var child = this.children[index];
		if (child) {
			//添加了 DOMElement 的移除处理
			this.removeDOMElement(child);
			child.parent = null; 
		}
		this.children.splice(index, 1);
		return true;
	};
	container_p.removeDOMElement = function(child) {
		//移除对象的缓动效果
		if (child.tweenjs_count > 0) {
			createjs.Tween.removeTweens(child);
		}
		if (child instanceof createjs.DOMElement) {
			//添加了 DOMElement 的销毁
			child.destroy();
		} 
		else if (child instanceof createjs.Container && !child.isnotContainer) {
			var children = child.children;
			children.forEach(function(a, b) {
				child.removeDOMElement(a);
			});
		}
	};
	
	bitmap_p.type = 'Bitmap';
	bitmap_p.highlight = 0;
	// Windows Phone 打包后 对 image 直接做矩阵变换会影响渲染性能，一般将需要 缩放的 image 元素绘制到 cacheCanvas 上
	bitmap_p.draw = function(ctx, ignoreCache) {
		window.App && App.drawCount++;
		if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }
		var rect = this.sourceRect;
		if (rect) {
			ctx.drawImage(this.image, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
		} else {
			ctx.drawImage(this.image, 0, 0);
		}
		// 添加了高亮效果
		if (this.highlight>0) {
			App.drawCount++;
			ctx.globalAlpha *= this.highlight;
			ctx.globalCompositeOperation = 'lighter';
			if (rect) {
				ctx.drawImage(this.image, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
			} else {
				ctx.drawImage(this.image, 0, 0);
			}
			ctx.globalCompositeOperation = this.compositeOperation;
		}
		return true;
	};
	bitmap_p.repeatFill = function(width, height){
		// 添加了重复填充效果
		var o = this,
			hasContent = (this.image && (this.image.complete || this.image.getContext || this.image.readyState >= 2)),
			beginFill = function() {
				var rect = o.sourceRect;
				if (rect) {
					o.cache(0, 0, rect.width, rect.height);
				} else {
					o.cacheCanvas = o.image;
				}
				var bmpMult = new cy.Bitmap1(width,  height);
				bmpMult.drawTexture(o.cacheCanvas);
				o.cacheCanvas = bmpMult.image;
			};
		
		if (hasContent) {
			beginFill();
		} else {
			this.image.onload = beginFill;
		}
	};	
	bitmap_p.getMeasuredRect =  function(){
		var content = this.cacheCanvas || this.sourceRect || this.image;
		return this._rectangle.initialize(0, 0, content.width, content.height);
	};

	dom_p.destroy = function(){
		var element = this.htmlElement,
			parentNode = element.parentNode;
		parentNode && parentNode.removeChild(element);
	};
	dom_p.initialize = function(htmlElement) {
		if( !htmlElement ) return;
		if (typeof(htmlElement)=="string") { htmlElement = document.getElementById(htmlElement); }
		this.DisplayObject_initialize();
		this.mouseEnabled = false;
		this.htmlElement = htmlElement;
	};
	dom_p.draw = function(ctx, ignoreCache) {
		if (this.visible) { this._visible = true; }
		this._addToScreen();
		return true;
	};
	dom_p._addToScreen = function(){
		var element = this.htmlElement;
		//添加了 DOMElement 的添加处理
		if (!element.parentNode) {
			var stage = this.getStage(),
				style = element.style;
			style.position = "absolute";
			style.transformOrigin = style.WebkitTransformOrigin = style.msTransformOrigin = style.MozTransformOrigin = style.OTransformOrigin = "0% 0%";
			stage.canvas.parentNode.appendChild(element);
		}
	};
	dom_p.getMeasuredRect =  function(){
		var content = this.htmlElement;
		return this._rectangle.initialize(0, 0, content.clientWidth, content.clientHeight);
	};
	dom_p.getConcatenatedMatrix = function(matrix) {
		if (matrix) { matrix.identity(); }
		else { matrix = new createjs.Matrix2D(); }
		var o = this;
		while (o != null) {
			matrix.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY).prependProperties(o.alpha, o.shadow, o.compositeOperation);
			o = o.parent;
		}
		//处理 canvas 标签的像素缩放，即 canvas 的 style 尺寸不同于 canvas 的像素尺寸时
		var zoomX = App.viewport.zoomX,
			zoomY = App.viewport.zoomY;
		if (zoomX !== 1 || zoomY !== 1) {
			matrix.prependTransform(0, 0, zoomX, zoomY, 0, 0, 0, 0, 0);		
		}
		return matrix;
	};
	
	sprite_p.type = 'Sprite';
	sprite_p.getMeasuredRect = function(){
		var o = this.spriteSheet.getFrame(this._currentFrame|0);
		return new createjs.Rectangle(-o.regX, -o.regY, o.rect.width, o.rect.height);
	};
	sprite_p.fitGlobalSpeed = true;
	sprite_p.advance = function(time) {
		//添加整体速率调整
		var speed = ((this._animation&&this._animation.speed)||1)*(this.fitGlobalSpeed? ((window.App&&App.globalSpeed)||1) : 1);
		var fps = this.framerate || this.spriteSheet.framerate;
		var t = (fps && time != null) ? time/(1000/fps) : 1;
		if (this._animation) { this.currentAnimationFrame+=t*speed; }
		else { this._currentFrame+=t*speed; }
		this._normalizeFrame();
	};
	sprite_p.Super_draw = sprite_p.draw;
	sprite_p.draw = function(ctx, ignoreCache) {
		window.App && App.drawCount++;
		return this.Super_draw(ctx, ignoreCache);
	};
	
	movie_p.type = 'MovieClip';
	movie_p.Container_draw = container_p.draw;
	movie_p._addManagedChild = function(child, offset) {
		if (child._off) { return; }
		// 这里不做修改节点操作，由于复杂动画中的层级比较复杂，这里 MC只对 对象进行 缓动处理，所有 动画对象需要预添加
		// if (!this.contains(child)) {
			// this.addChild(child);
		// }
		
		if (child instanceof createjs.MovieClip) {
			child._synchOffset = offset;
			if (child.mode == createjs.MovieClip.INDEPENDENT && child.autoReset && !this._managed[child.id]) { child._reset(); }
		}
		this._managed[child.id] = 2;
	};
	movie_p.fitGlobalSpeed = true;
	movie_p._tick = function(params) {
		if (!this.paused && this.mode == createjs.MovieClip.INDEPENDENT) {
			//添加整体速率调整
			this._prevPosition = (this._prevPos < 0) ? 0 : this._prevPosition + (this.fitGlobalSpeed? App.globalSpeed: 1);
			this._updateTimeline();
		}
		this.Container__tick(params);
	};
	movie_p.createTween = function(data) {
		var timeline = this.timeline, 
			item, tween, frames, 
			lastframe = 0;
		for(var name in data) {
			item = this[name];
			frames = data[name];
			if (item) {
				tween = createjs.Tween.get(item);
				for (var i=0,l=frames.length; i<l; i++) {
					if (frames[i]) {
						if (frames[i].haveTween) {
							tween.to(frames[i].params, i-lastframe);
						} else {
							tween.wait(i-lastframe).to(frames[i].params);
						}
						lastframe = i;
					}
				}
				timeline.addTween(tween);
				if (timeline.duration < lastframe+1) {
					timeline.duration = lastframe+1;
				}
			}
		}
	};
	
})();
