(function() {
	"use strict";

var Views = cc.Class.extend({
	
	_data: null,
	_urlHead: 'res/',
	
	ctor: function(data) {
		this._data = data;	
	},
	
	setUrlHead: function(urlHead) {
		this._urlHead = urlHead;
	},
	
	getUrl: function(url, clearUrlHead){
		if (clearUrlHead) {
			var urlHead = this._data.name+"/res/",
				idx = url.indexOf(urlHead);
			if (idx>-1) {
				return url.substring(idx+urlHead.length, url.length);
			}
			return url;
		}
		return this._urlHead+url;
	},
	
	parseColor: function (color){
		var r = parseInt(color.substring(1,3), 16),
			g = parseInt(color.substring(3,5), 16),
			b = parseInt(color.substring(5,7), 16);
		return cc.color(r, g, b);
	},
	
	exportColor: function(color){
		var r = color.r.toString(16),
			g = color.g.toString(16),
			b = color.b.toString(16);
		if (r.length<2) r = '0' + r;
		if (g.length<2) g = '0' + g;
		if (b.length<2) b = '0' + b;
		return '#'+r+g+b;
	},
		
	parseRect: function(render, rect){
		if (!render) {
			cc.log('No Render');
			return;
		}
		render.setTextureRect(cc.rect(
			rect[0], rect[1], rect[2], rect[3]
		));
	},
	
	exportRect: function (render) {
		var rect = render.getTextureRect(),
			img = render.getTexture();
		if (rect.width !== img.getContentSize().width || rect.height !== img.getContentSize().height) {
			return [rect.x, rect.y, rect.width, rect.height];
		} 
		return null;
	},
	
	exportTween: function (tweens) {
		return tweens;
		var tween, result = {};
		// animations { run: {}, jump: {} }
		for (var i in tweens) {
			result[i] = {};
			tween = tweens[i];
			// targets { head: {}, body: {}, leg: {} }
			for (var j in tween) {
				result[i][j] = {};
				// frames { 0: { st:{} }}
				for (k in tween[j]) {
					
				}
			}
		}
	},
	
	create: function(viewName) {
		var data = this._data.scenes[viewName] || this._data.prefabs[viewName] || this._data.animations[viewName];
		return this.parseData(data);
	},
	
	createDefault: function(type, root, map) {
		var obj, o = this;
		switch(type){
			case 'Widget':
				obj = ccui.Widget.create();
				break;
			case 'Layout':
				obj = ccui.Layout.create();
				obj.setSize(cc.size(100, 100));
				break;
			case 'Text':
				obj = ccui.Text.create();
				obj.setText('hello world');
				obj.setFontName('微软雅黑');
				obj.setFontSize(20);
				break;
			case 'ImageView':
				obj = ccui.ImageView.create();
				obj.loadTexture(o.getUrl('res/image.png', true));
				break;
			case 'Button':
				obj = ccui.Button.create();
            	obj.setTouchEnabled(true);
           	 	obj.loadTextures(o.getUrl('res/button01.png', true), o.getUrl('res/button02.png', true), o.getUrl('res/button03.png', true));
            	break;
			case 'CheckBox':
				obj = ccui.CheckBox.create();
            	obj.setTouchEnabled(true);
            	obj.loadTextures(o.getUrl('res/selected01.png', true), o.getUrl('res/selected01.png', true), o.getUrl('res/selected03.png', true),'','');
				break;
			case 'ScrollView':
				obj = ccui.ScrollView.create();
				obj.setTouchEnabled(true);
            	obj.setDirection(3);
            	obj.setBounceEnabled(false);
           	 	obj.setSize(cc.size(200, 200));
           	 	obj.setInnerContainerSize(cc.size(300, 300));
				break;
			case 'ListView':
				obj = ccui.ListView.create();
				obj.setTouchEnabled(true);
				obj.setDirection(1);
				obj.setBounceEnabled(false);
	           	obj.setSize(cc.size(200, 200));
				break;
			case 'Slider':
				break;
			case 'TextField':
				obj = ccui.TextField.create();
            	obj.setTouchEnabled(true);
           	 	obj.setFontSize(30);
           	 	obj.setMaxLength(14);
           	 	obj.setFontName('微软雅黑');
            	obj.setPlaceHolder("请输入内容");
				break;
			case 'Armature':
				obj = new ccs.Armature();
				ccs.armatureDataManager.addArmatureFileInfoAsync(o.getUrl('res/bear.json', true), function(){
					obj._jsonFileName = 'bear.json';
					obj.init('bear');
					obj.getAnimation().playWithIndex(0);
				},  this);
				break;
			case 'Animation':
				obj = ccp.Animation.create();
				obj.loadData({
					images: [],
					frames: [],
					animations: {}
				});
				obj.setPosition(cc.p(gameStage.getSize().width/2, gameStage.getSize().height/2));
				break;
			case 'Particle':
				obj = ccp.Particle.create();
				obj.createParticle("fire", o.getUrl('res/fire.png', true));
				break;
		}
		
		obj.setTag("");
		obj.type = type;
		obj.setAnchorPoint(cc.p(0, 0));
		if (map) {
			map[obj.__instanceId] = obj;
			obj.treeNodeTitle = (root||obj).__instanceId+'_'+obj.__instanceId;
		}
	
		return obj;
	},
	
	parseData: function(data, root, map){
		var obj, o = this;
		switch(data.n){
			case 'Widget':
				obj = ccui.Widget.create();
				break;
			case 'Layout':
				obj = ccui.Layout.create();
				obj.setTouchEnabled(true);
				if (data.u) {
					obj.setBackGroundImageScale9Enabled(true);
					obj.setBackGroundImage(o.getUrl(data.u));
				} else if (data.c) {
		    		obj.setBackGroundColor(o.parseColor(data.c||'#ffffff'));
		    		obj.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
				}
				obj.addTouchEventListener(o.handleButtonEvent, obj);
				break;
			case 'Text':
				obj = ccui.Text.create();
				obj.setText(data.t);
				obj.setFontName(data.fn||'微软雅黑');
				obj.setFontSize(data.fs||20);
				obj.setColor(o.parseColor(data.c||'#ffffff'));
				// obj.enableShadow(cc.size(1,1),1,1,true);
				// obj.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
				break;
			case 'ImageView':
				obj = ccui.ImageView.create();
				obj.loadTexture(o.getUrl(data.u));
				if (data.re) { 
					o.parseRect(obj.getVirtualRenderer(), data.re);
				}
				break;
			case 'Button':
				obj = ccui.Button.create();
            	obj.setTouchEnabled(true);
            	if (data.t) {
            		obj.setTitleText(data.t);
					obj.setTitleFontName(data.fn||'微软雅黑');
					obj.setTitleFontSize(data.fs||20);
					obj.setTitleColor(o.parseColor(data.c||'#ffffff'));
            	}
           	 	obj.loadTextures(o.getUrl(data.u), o.getUrl(data.u2), '');
           	 	if (data.re2) {
           	 		obj.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
           	 		o.parseRect(obj.getVirtualRenderer(), data.re2);	
           	 	}
           	 	if (data.re) {
           	 		obj.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
           	 		o.parseRect(obj.getVirtualRenderer(), data.re);	
           	 	}
           	 	obj.addTouchEventListener(o.handleButtonEvent, obj);
            	break;
			case 'CheckBox':
				obj = ccui.CheckBox.create();
            	obj.setTouchEnabled(true);
            	obj.loadTextures(o.getUrl(data.u),o.getUrl(data.u),o.getUrl(data.u2),'','');
				obj.addEventListenerCheckBox(o.handleCheckEvent, obj);
				break;
			case 'ScrollView':
				obj = ccui.ScrollView.create();
				obj.setTouchEnabled(true);
				obj.setDirection(data.di||3);
           	 	obj.setInnerContainerSize(cc.size(data.iw, data.ih));
				break;
			case 'ListView':
				obj = ccui.ListView.create();
				obj.setTouchEnabled(true);
				obj.setDirection(data.di||1);
				break;
			case 'Slider':
				break;
			case 'TextField':
				obj = ccui.TextField.create();
            	obj.setTouchEnabled(true);
           	 	obj.setFontSize(30);
           	 	obj.setMaxLength(14);
           	 	obj.setFontName('微软雅黑');
            	obj.setPlaceHolder("请输入内容");
            	obj.setMaxLengthEnabled(true);
            	// obj.addEventListenerTextField(o.handleInputEvent, obj);
				break;
			case 'Armature':
				obj = new ccs.Armature();
				ccs.armatureDataManager.addArmatureFileInfoAsync(o.getUrl('res/bear.json', true), function(){
					obj._jsonFileName = 'bear.json';
					obj.init('bear');
					obj.getAnimation().playWithIndex(0);
				},  this);
				break;
			case 'Animation':
				obj = ccp.Animation.create();
				obj.loadData(data, o._urlHead);
				break;
			case 'Particle':
				obj = ccp.Particle.create();
				obj.createParticle(data.tp, o.getUrl(data.u));
				break;
		}
		// Set The Transform && Properties
		obj.type = data.n;
		obj.setPosition(cc.p(data.x||0, data.y||0));
		obj.setRotation(data.ro||0);
		obj.setScaleX(data.sx||1);
		obj.setScaleY(data.sy||1);
		obj.setAnchorPoint(cc.p(data.ax||0, data.ay||0));
		if ("op" in data) obj.setOpacity(data.op);
		if ("vi" in data) obj.setVisible(data.vi);
		
		// Set The Size && Bounce 
		if (data.w && data.h) obj.setSize(cc.size(data.w, data.h));
		if (data.bo) obj.setBounceEnabled(data.bo);
		// Define The Root View
		if (!root) root = obj;
		// Set The Tag Of View
		if ('tag' in data) {
			obj.setViewTag(data.tag);
		} else {
			// Deafault Tag ""
			obj.setViewTag("");
		}
		// Add Children
		if ('cr' in data) {
			var child;
			data.cr.forEach(function(a,i){
				child = o.parseData(a, root, map);
				obj.addView(child);
			});
		}
		// Add Components
		if ('comps' in data) {
			var comp, compData;
			for (var i in data.comps) {
				compData = data.comps[i];
				comp = ccp._root[compData[0]];
				if (comp && comp instanceof Function) {
					comp = new comp(i, compData[0], compData[1]);
					obj.addComp(comp);
					cc.log("Add Component: " +compData[0]);
				} else {
					cc.log("Not Found Component: " + compData[0]);
				}
			}
			obj._comps = data.comps;
		}
		if ('tweens' in data) {
			var mc = new ccp.MovieClip("mc");
			mc.loadData(data.tweens, data.defaultTween);
			obj.addComp(mc);
			obj._tweens = data.tweens;
		}
		// Sign In The View To Map
		if (map) {
			map[obj.__instanceId] = obj;
			obj.treeNodeTitle = root.__instanceId+'_'+obj.__instanceId;
		}
		return obj;
	},
	
	exportData: function(obj){
		var result = { n: obj.type }, o = this;
		
		var pos = obj.getPosition(),
			ro = obj.getRotation(),
			sx = obj.getScaleX(),
			sy = obj.getScaleY(),
			anc = obj.getAnchorPoint(),
			op = obj.getOpacity?obj.getOpacity():255,
			vi = obj.isVisible(),
			tag = obj.getViewTag();
		
		if (pos.x!==0) result.x = pos.x;
		if (pos.y!==0) result.y = pos.y;
		if (ro!==0) result.ro = ro;
		if (sx!==1) result.sx = sx;
		if (sy!==1) result.sy = sy;
		if (anc.x!==0) result.ax = anc.x;
		if (anc.y!==0) result.ay = anc.y;
		if (op!==255) result.op = op;
		if (!vi) result.vi = vi;
		if (tag) result.tag = tag;
		
		var cr, c, fn, fs, re, re2, di, bo, size, isize;
		
		var frame, img, idx;
		switch(obj.type){
			case 'Widget':
				cr = [];
				break;
			case 'Layout':
				cr = [];
				size = obj.getSize();
				if (obj._backGroundImageFileName) {
					result.u = o.getUrl(obj._backGroundImageFileName, true);
				}
				break;
			case 'Text':
				result.t = obj.getStringValue();
				c = o.exportColor(obj.getColor());
				fn = obj.getVirtualRenderer().getFontName();
				fs = obj.getVirtualRenderer().getFontSize();
				if (c!=='#ffffff') result.c = c;
				if (fn!=='微软雅黑') result.fn = fn;
				if (fs!==20) result.fs = fs;
				break;
			case 'ImageView':
				result.u = o.getUrl(obj._textureFile, true);
				re = o.exportRect(obj.getVirtualRenderer());
				break;
			case 'Button':
				if (obj.getTitleText()) {
					result.t = obj.getTitleText();
					c = o.exportColor(obj.getTitleColor());
					fn = obj.getTitleFontName();
					fs = obj.getTitleFontSize();
					if (c!=='#ffffff') result.c = c;
					if (fn!=='微软雅黑') result.fn = fn;
					if (fs!==20) result.fs = fs;
				}
				result.u = o.getUrl(obj._normalFileName, true);
				result.u2 = o.getUrl(obj._clickedFileName, true);
           	 	obj.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
           	 	re2 = o.exportRect(obj.getVirtualRenderer());	
           	 	obj.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
           	 	re = o.exportRect(obj.getVirtualRenderer());
            	break;
			case 'CheckBox':
				result.u = o.getUrl(obj._backGroundFileName, true);
				result.u2 = o.getUrl(obj._frontCrossFileName, true);
				break;
			case 'ScrollView':
				cr = [];
				size = obj.getSize();
				di = obj.getDirection();
				bo = obj.isBounceEnabled();
				isize = obj.getInnerContainerSize();
				result.iw = isize.width;
				result.ih = isize.height;
				break;
			case 'ListView':
				cr = [];
				size = obj.getSize();
				di = obj.getDirection();
				bo = obj.isBounceEnabled();
				break;
			case 'Slider':
				break;
			case 'TextField':
				break;	
			case 'Armature':
				result.na = obj.getName();
				result.u = obj._jsonFileName;
				break;
			case 'Animation':
				result.images = [];
				result.frames = [];
				result.animations = {};
				for (var i=0,l=obj._frames.length; i<l; i++) {
					frame = obj._frames[i];
					img = gameViews.getUrl(frame.getTexture().getHtmlElementObj().src, true);
					idx = result.images.indexOf(img);
					if (idx===-1) {
						idx = result.images.length;
						result.images.push(img);
					}
					result.frames.push([
						frame.getTextureRect().x, frame.getTextureRect().y, 
						frame.getTextureRect().width, frame.getTextureRect().height,
						idx, frame.getPosition().x, frame.getPosition().y
					]);
				}
				for (var i in obj._animations) {
					result.animations[i] = 
						[obj._animations[i].start, obj._animations[i].end,
						 false, obj._animations[i].speed];
				}
				if (obj._defaultAnimationName) result.defaultAnimation = obj._defaultAnimationName;
				break;
			case 'Particle':
				result.tp = obj._particleType;
				result.u = gameViews.getUrl(obj._particleFileName, true);
				break;
		}
		
		if (size) {
			if (size.width && size.height) {
				result.w = size.width;	
				result.h = size.height;
			}
		}
		if (di) result.di = di;
		if (bo) result.bo = bo;
		if (re) result.re = re;
		if (re2) result.re2 = re2;
		
		if (obj._comps) result.comps = obj._comps;
		if (obj._tweens) {
			result.tweens = this.exportTween(obj._tweens);
			var anim = obj.getComp("mc")._defaultAnimationName;
			if (anim) {
				result.defaultTween = anim;
			}
		}
		if (cr) {
			var children = obj.getChildrenView();
			children.forEach(function(a, i){
				cr.push(o.exportData(a));
			});
			children = obj.getNodes?obj.getNodes():[];
			children.forEach(function(a, i){
				cr.push(o.exportData(a));
			});
			result.cr = cr;
		}
		
		return result;
	},
	
	handleButtonEvent: function(sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BAGAN:
                this.onTouchStart && this.onTouchStart(sender);
                break;
            case ccui.Widget.TOUCH_MOVED:
            	 this.onTouchMove && this.onTouchMove(sender);
                break;
            case ccui.Widget.TOUCH_ENDED:
                this.onTouchEnd && this.onTouchEnd(sender);
                this.onClick && this.onClick(sender);
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
   },
   
   handleCheckEvent: function(sender, type) {
        switch (type) {
            case ccui.CheckBox.EVENT_UNSELECTED:
                this.onChange && this.onChange(false, sender);
                break;
            case ccui.CheckBox.EVENT_SELECTED:
                this.onChange && this.onChange(true, sender);
                break;
            default:
                break;
        }
   },
   
   handleInputEvent: function (sender, type) {
        switch (type) {
            case ccui.TextField.EVENT_ATTACH_WITH_ME:
                break;
            case ccui.TextField.EVENT_DETACH_WITH_ME:
                break;
            case ccui.TextField.EVENT_INSERT_TEXT:
                break;
            case ccui.TextField.EVENT_DELETE_BACKWARD:
                break;
            default:
                break;
        }
    }
});

ccp.Views = Views;
}());