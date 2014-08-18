

(function() {
    "use strict";
    
var ScrollView = cy.Panel.extend({
	type: 'ScrollView',
	content: null,
	overflow : false,
	moved: false,
	
	_started: false,
	_startX: 0,
	_startY: 0,
	_contentX: 0,
	_contentY: 0,
	_scrollX: true,
	_scrollY: true,
	_startTime: 0,
	_dx: 0,
	_dy: 0,
	_contentW: 0,
	_contentH: 0,
	_contentTween: null,
	_scrollXTween: null,
	_scrollYTween: null,
	
	setContent: function(content){
		this.content = content;
		ScrollView.apply(this);
	}
});

ScrollView.apply = function(target){
	if (target.type!=='ScrollView') {
		target.type = 'ScrollView';
	}
	var o = target, mtx = null;
	if (!o.content) {
		o.content = o.children[0];
	} else {
		o.addChild(o.content);	
	}
	o.addEventListener('tick', function(e){
		ScrollView.reset(o);
	});
	o.addEventListener('mousedown', function(e){
		o._startX = e.stageX;
		o._startY = e.stageY;
		o._contentX = o.content.x;
		o._contentY = o.content.y;
		o._dx = 0;
		o._dy = 0;
		o._startTime = new Date().getTime();
		if (o._contentTween) {
			o._contentTween.setPaused(true);
			o._contentTween = null;
		}
		if (o._scrollYTween) {
			o._scrollYTween.setPaused(true);
			o._scrollYTween = null;
		}
		
		mtx = o.getConcatenatedMatrix();
		if (!e.target.preventMove) {
			o._started = true;
		} else {
			o._started = false;
		}
		o.moved = false;
	});
	o.addEventListener('pressmove', function(e){
		if (o._started) {
			var dx = (e.stageX - o._startX) / mtx.a,
				dy = (e.stageY - o._startY) / mtx.d,
				ex = o._contentX + dx,
				ey = o._contentY + dy;
			// 超出边界时 添加弹力效果
			if (ex<(o.width-o._contentW)) {
				ex = (ex - (o.width-o._contentW))*0.4 + (o.width-o._contentW);
			}else if (ex > 0) {
				ex = ex*0.4;
			}
			if (ey<(o.height-o._contentH)) {
				ey = (ey - (o.height-o._contentH))*0.4 +(o.height-o._contentH);
			}else if (ey > 0) {
				ey = ey*0.4;
			}
			if (o._scrollX) {
				o._dx = dx;
				o.content.x = ex;
				if (Math.abs(dx) > 3) o.moved = true;
			}
			if (o._scrollY) {
				o._dy = dy;
				o.content.y = ey;
				o.scrollBarY.y = -ScrollView.scopeValue(ey,o.height-o._contentH,0)*o.scrollBarY.k;
				if (Math.abs(dy) > 3) o.moved = true;
			}
		}
	});
	o.addEventListener('pressup', function(){
		if (o.moved) {
			var dTime = (new Date().getTime()) - o._startTime;
			// 超出边界时 返回边界位置
			var endX, endY, config = {};
			if (o.content.x < (o.width-o._contentW)) {
				endX = (o.width-o.content.width);
			} else if (o.content.x > 0) {
				endX = 0;
			}
			if (o.content.y < (o.height-o._contentH)) {
				endY = (o.height-o.content.height);
			} else if(o.content.y > 0) {
				endY = 0;
			}
			if ( endX !== undefined ) {
				config.x = endX;
			}
			if ( endY !== undefined ) {
				config.y = endY;
			}
			if (('x' in config) || ('y' in config)) {
				o._contentTween = cy.Tween.get(o.content).to(config, 200);
			} else {
				if (o.moved) {
					/*减速运动*/
					var v = o._dy/dTime,
						absV = Math.abs(v);
					if (absV > 1.2) {
						if (absV > 8) {
							v = v/absV*8;
							absV = 8;
						}
						var a = 0.002,
							t = absV/a,
							s = a*absV + a*t*t/2,
							endPos = ScrollView.scopeContentPosition(o,
											o.content.x + o._dx, o.content.y + (v<0?-1:1)*s),
							delay = t*(1-endPos.fixY/s);
						o._contentTween = cy.Tween.get(o.content)
											.to(endPos, delay, cy.Ease.circOut);
						if (o.scrollBarY) {
							o._scrollYTween = cy.Tween.get(o.scrollBarY)
											    .to({ y: -endPos.y * o.scrollBarY.k }, delay, cy.Ease.circOut);
						}
					}	
				}
			}
		}
		o._started = false;
	});
};

ScrollView.reset = function(target){
	var o = target,
		rect = o.content.getMeasuredRect(),
		contentW = rect.width, contentH = rect.height;
		
	if (o._contentW === contentW && o._contentH === contentH) {
		return;
	} else {
		o._contentW = contentW;
		o._contentH = contentH;
	}
	o._scrollX = contentW>o.width? true: false;
	o._scrollY = contentH>o.height? true: false;
	if (o.scrollBarY) {
		o.removeChild(o.scrollBarY);
	}
	if (o._scrollY) {
		o.scrollBarY = new cy.Shape();
		o.scrollBarY.width = 6;
		o.scrollBarY.height = o.height*o.height/contentH;
		o.scrollBarY.graphics.beginStroke('rgba(255,255,255,1)').beginFill('rgba(0,0,0,0.6)').drawRoundRect(0, 0, o.scrollBarY.width, o.scrollBarY.height, o.scrollBarY.width/2).endStroke();
		o.scrollBarY.x = o.width-o.scrollBarY.width;
		o.scrollBarY.k = (o.height-o.scrollBarY.height)/(contentH-o.height);
		o.scrollBarY.cache(0, 0, o.scrollBarY.width, o.scrollBarY.height);
		o.scrollBarY.mouseEnabled = false;
		o.addChild(o.scrollBarY);
	} else {
		o.content.y = 0;
	}
};

ScrollView.scopeContentPosition = function(target, x, y){
	var endX, endY,
		o = target,
		rect = o.content.getMeasuredRect(),
		contentW = rect.width, contentH = rect.height;
		
	if (x < (o.width-contentW)) {
		endX = (o.width-contentW);
	}else if (x > 0) {
		endX = 0;
	}else {
		endX = x;
	}
	if (y < (o.height-contentH)) {
		endY = (o.height-contentH);
	}else if (y > 0) {
		endY = 0;
	}else{
		endY = y;
	}
	
	return { x: endX, y: endY, fixX: Math.abs(endX-x), fixY: Math.abs(endY-y) };
};

ScrollView.scopeValue = function(val, min, max){
	if (val < min) {
		val = min;
	} else if (val > max) {
		val = max;
	}
	return val;
};

var SimpleScrollView = cy.Panel.extend({
	type: 'SimpleScrollView',
	content: null,
	overflow : false,
	moved: false,
	adjustPosition: false,
	
	_started: false,
	_startX: 0,
	_startY: 0,
	_contentX: 0,
	_contentY: 0,
	
	setContent: function(content){
		this.content = content;
		SimpleScrollView.apply(this);
	}
});

SimpleScrollView.apply = function(target){
	var o = target, mtx = null;
	if (!o.content) {
		o.content = o.children[0];
	} else {
		o.addChild(o.content);	
	}
	o.addEventListener('mousedown', function(e){
		o._startX = e.stageX;
		o._startY = e.stageY;
		o._contentX = o.content.x;
		o._contentY = o.content.y;
		mtx = o.getConcatenatedMatrix();
		if (!e.target.preventMove) {
			o._started = true;
		} else {
			o._started = false;
		}
		o.moved = false;
	});
	o.addEventListener('pressmove', function(e){
		if (o._started) {
			var dx = (e.stageX - o._startX) / mtx.a,
				dy = (e.stageY - o._startY) / mtx.d,
				ex = o._contentX + dx,
				ey = o._contentY + dy,
				rect = o.content.getMeasuredRect(),
				pos = ScrollView.scopeContentPosition(o, ex, ey);
			if (rect.width > o.width) {
				o.content.x = pos.x;
				if (Math.abs(dx) > 10) o.moved = true;
			}
			if (rect.height > o.height) {
				o.content.y = pos.y;
				if (Math.abs(dy) > 10) o.moved = true;
			}
		}
	});
	o.addEventListener('pressup', function(){
		o._started = false;
		if (o.adjustPosition) {
			var x = o.content.x,
				i = Math.round(Math.abs(x)/o.width),
				ex = o.content.children[i].x;
			cy.Tween.get(o.content).to({x: -ex},100);
		}
	});
};

cy.ScrollView = ScrollView;
cy.SimpleScrollView = SimpleScrollView;

})();