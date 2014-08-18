
//通用函数
//从URL里面取出参数
function request (paras) {
    var url = location.href; 
    var paraString = url.substring(url.indexOf("?")+1,url.length).split("&"); 
    var paraObj = {};
    for (i=0; j=paraString[i]; i++) { 
   		paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length); 
    } 
    var returnValue = paraObj[paras.toLowerCase()]; 
    if (typeof(returnValue)=="undefined") { 
    	return ""; 
    } else { 
    	return returnValue; 
    } 
}
//移除 URL头，保存相对路径
function removeUrlHead(str){
	var reg = 'res/',
		idx = str.indexOf(reg);
	return str.substring(idx, str.length);
}

//修正 相对路径				
function addUrlHead(str){
	if (Views.isEditor) {
		return '../createjs_project/'+Views.name+'/'+str;
	} else {
		return str;
	}
}
//允许Drag事件 
function dragstart(ev){
	ev.dataTransfer.setData("Text",ev.target.name);
}
//允许Drop事件 
function allowDrop(ev) {
	ev.preventDefault();
}

//视图管理工具
var Views = Views || {};
Views.get = function(name){
	return Views.parseData(Views.views[name]);
};
Views.parseData = function(data, root, map){
	var obj;
	switch(data.n){
		case 'Scene':
			obj = new cy.Scene(data.w, data.h);
			if (!root) root = obj;
			data.cr.forEach(function(a,i){
				obj.addChild(Views.parseData(a, root, map));
			});
			break;
		case 'Panel':
			obj = new cy.Panel(data.w, data.h);
			if (!root) root = obj;
			data.cr.forEach(function(a,i){
				obj.addChild(Views.parseData(a, root, map));
			});
			if('o' in data) obj.overflow = data.o;
			if('ap' in data) {
				obj.applyType = data.ap;
				if (!Views.render) { cy[obj.applyType].apply(obj); }
			}
			break;
		case 'Label':
			obj = new cy.Label(data.t);
			obj.color = data.c;
			if('fs' in data) obj.fontSize = data.fs;
			if('ff' in data) obj.fontFamily = data.ff;
			if('lw' in data) obj.lineWidth = data.lw;
			if('ta' in data) obj.textAlign = data.ta;
			if('s' in data) obj.border = new createjs.Shadow("#000000", 1, 1, 1);
			break;
		case 'Bitmap':
			obj = new cy.Bitmap(App.getRes(addUrlHead(data.i)));
			if(data.re) obj.sourceRect = {x:data.re[0],y:data.re[1],width:data.re[2],height:data.re[3]};
			if(data.rw) {
				obj.repeatW = data.rw;
				obj.repeatH = data.rh;
				obj.repeatFill(data.rw, data.rh);
			}
			break;
		case 'Button':
			obj = new cy.Button(App.getRes(addUrlHead(data.u)), App.getRes(addUrlHead(data.d)), App.getRes(addUrlHead(data.di)));
			if(data.ure) obj._bmpNormal.sourceRect = {x:data.ure[0],y:data.ure[1],width:data.ure[2],height:data.ure[3]};
			if(data.dre) obj._bmpSelected.sourceRect = {x:data.dre[0],y:data.dre[1],width:data.dre[2],height:data.dre[3]};
			if(data.die) obj._bmpDisabled.sourceRect = {x:data.die[0],y:data.die[1],width:data.die[2],height:data.die[3]};
			if(data.t) obj.setText(data.t);
			if(data.tc) obj.contentLbl.color = data.tc;
			if(data.e) obj.effect = data.e;
			break;
		case 'CheckBox':
			obj = new cy.CheckBox(addUrlHead('res/selected02.png'),addUrlHead('res/selected03.png'));
			break;
		case 'TextField':
			obj = new cy.TextField();
			obj.htmlElement.className = data.c;
			break;
		case 'TextArea':
			obj = new cy.TextArea();
			obj.htmlElement.className = data.c;
			break;
		case 'ColorRect':
			obj = new cy.ColorRect(data.w, data.h, data.c);
			break;
		case 'ColorCircle':
			obj = new cy.ColorCircle(data.r, data.c);
			break;
		case 'Sprite':
			data.images.forEach(function(a, b){
				//取已加载资源，避免重复加载
				if(typeof(data.images[b]) === 'string') {
					data.images[b] = App.getRes(addUrlHead(a));
				}
			});
			obj = new cy.Sprite(new cy.SpriteSheet(data));
			obj.gotoAndStop(0);
			break;
		case 'MovieClip':
			obj = new cy.MovieClip();
			if (!root) root = obj;
			data.cr.forEach(function(a,i){
				obj.addChild(Views.parseData(a, root, map));
			});
			if (data.da) {
				obj.data = {};
				var arr;
				for(var name in data.da) {
					arr = [];
					for(var i in data.da[name]) {
						arr[i] = { params: Views.parseMovieClipParams(data.da[name][i].p),
								   haveTween: data.da[name][i].h };
					}
					obj.data[name] = arr;	
				}
			}		
			break;
	}

	if('x' in data) obj.x = data.x;
	if('y' in data) obj.y = data.y;
	if('rx' in data) obj.regX = data.rx;
	if('ry' in data) obj.regY = data.ry;
	if('sx' in data) obj.scaleX = data.sx;
	if('sy' in data) obj.scaleY = data.sy;
	if('ro' in data) obj.rotation = data.ro;
	if('al' in data) obj.alpha = data.a;
	if('vn' in data) {
		obj.viewName = data.vn;
		if (root && root!==obj) {
			root[obj.viewName] = obj;
		}
	}
	if('vi' in data) obj.visible = data.vi;
	// if('mo' in data) obj.mouseEnabled = data.mo;
	if (map) map[obj.id] = obj;
	return obj;
};
Views.exportData = function(obj){
	var result = {
		n: obj.type
	};
	if(obj.x!==0) result.x = obj.x;
	if(obj.y!==0) result.y = obj.y;
	if(obj.regX!==0) result.rx = obj.regX;
	if(obj.regY!==0) result.ry = obj.regY;
	if(obj.scaleX!==1) result.sx = obj.scaleX;
	if(obj.scaleY!==1) result.sy = obj.scaleY;
	if(obj.rotation!==0) result.ro = obj.rotation;
	if(obj.alpha!==1) result.al = obj.alpha;
	if(obj.viewName)  result.vn = obj.viewName;
	if(!obj.visible)  result.vi = obj.visible;
	// if(obj.mouseEnabled)  result.mo = obj.mouseEnabled;
	
	switch(obj.type){
		case 'Scene':
			result.w = obj.width;
			result.h = obj.height;
			result.cr = [];
			obj.children.forEach(function(a,b){
				result.cr.push(Views.exportData(a));
			});
			break;
		case 'Panel':
			result.w = obj.width;
			result.h = obj.height;
			result.cr = [];
			if(obj.overflow===false) result.o = obj.overflow;
			if(obj.applyType && obj.applyType!=='none') result.ap = obj.applyType;
			obj.children.forEach(function(a,b){
				result.cr.push(Views.exportData(a));
			});
			break;
		case 'Label':
			result.t = obj.text;
			result.c = obj.color;
			if(obj.fontSize!==20) result.fs = obj.fontSize;
			if(obj.fontFamily!=='微软雅黑') result.ff = obj.fontFamily;
			if(obj.lineWidth) result.lw = obj.lineWidth;
			if(obj.textAlign!=='left') result.ta = obj.textAlign;
			if(obj.border) result.s = 1;
			break;
		case 'Bitmap':
			result.i = removeUrlHead(obj.image.src);
			if(obj.sourceRect){
				result.re = [obj.sourceRect.x,obj.sourceRect.y,obj.sourceRect.width,obj.sourceRect.height];
			}
			if(obj.repeatW){
				result.rw = obj.repeatW;
				result.rh = obj.repeatH;
			}
			break;
		case 'Button':
			result.u = removeUrlHead(obj._bmpNormal.image.src);
			if(obj.contentLbl){
				result.t = obj.contentLbl.text;
				if(obj.contentLbl.color!='#FFFFFF') result.tc = obj.contentLbl.color;
			}
			if(obj._bmpNormal.sourceRect){
				result.ure = [obj._bmpNormal.sourceRect.x,obj._bmpNormal.sourceRect.y,obj._bmpNormal.sourceRect.width,obj._bmpNormal.sourceRect.height];
			}
			result.d = removeUrlHead(obj._bmpSelected.image.src);
			if(obj._bmpSelected.sourceRect){
				result.dre = [obj._bmpSelected.sourceRect.x,obj._bmpSelected.sourceRect.y,obj._bmpSelected.sourceRect.width,obj._bmpSelected.sourceRect.height];
			}
			result.di = removeUrlHead(obj._bmpDisabled.image.src);
			if(obj._bmpDisabled.sourceRect){
				result.die = [obj._bmpDisabled.sourceRect.x,obj._bmpDisabled.sourceRect.y,obj._bmpDisabled.sourceRect.width,obj._bmpDisabled.sourceRect.height];
			}
			if(obj.effect) result.e = true;
			break;
		case 'CheckBox':
			break;
		case 'ColorRect':
			result.w = obj.width;
			result.h = obj.height;
			result.c = obj.color;			
			break;
		case 'ColorCircle':
			result.r = obj.radius;
			result.c = obj.color;
			break;
		case 'TextField':
		case 'TextArea':
			result.c = obj.htmlElement.className;
			break;
		case 'Sprite':
			var ss = obj.spriteSheet,
				fs = ss._frames,
				d = ss._data;
			result.images = [];
			result.frames = [];
			result.animations = {};
			var url, idx;
			for(var i=0,l=fs.length;i<l;i++){
				url = removeUrlHead(fs[i].image.src);
				idx = result.images.indexOf(url);
				if (idx===-1){
					idx = result.images.length;
					result.images.push(url);
				}
				result.frames.push([fs[i].rect.x, fs[i].rect.y, fs[i].rect.width, fs[i].rect.height, idx, fs[i].regX, fs[i].regY]);	
			}
			for(var i in d){
				result.animations[i] = [d[i].frames[0], d[i].frames[d[i].frames.length-1], d[i].next, d[i].speed];
			}
			break;
		case 'MovieClip':
			result.cr = [];
			result.da = {};
			obj.children.forEach(function(a,b){
				result.cr.push(Views.exportData(a));
			});
			var data, da, last, lastParams;
			if (obj.data) {
				for (var name in obj.data) {
					data = obj.data[name];
					da = {};
					for (var i=0,l=data.length;i<l;i++) {
						if (data[i]) {
							lastParams = data[last]?data[last].params:null;
							da[i] = { p: Views.exportMovieClipParams(data[i].params, lastParams),
									  h: data[i].haveTween };
							last = i;
						}
					}
					last = null;
					result.da[name] = da;
				}
			}
			break;
	}
	return result;
};
Views.clone = function(obj) {
	return Views.parseData(Views.exportData(obj));
};
Views.parseMovieClipParams = function(result){
	var params = {};
	if('x' in result) params.x = result.x;
	if('y' in result) params.y = result.y;
	if('rx' in result) params.regX = result.rx;
	if('ry' in result) params.regY = result.ry;
	if('sx' in result) params.scaleX = result.sx;
	if('sy' in result) params.scaleY = result.sy;
	if('ro' in result) params.rotation = result.ro;
	if('al' in result) params.alpha = result.al;
	if('vi' in result) params.visible = result.vi;
	
	if('w' in result) params.width = result.w;
	if('h' in result) params.height = result.h;
	if('hi' in result) params.highlight = result.hi;
	return params;
};
Views.exportMovieClipParams = function(params, lastParams){
	var result = {};
	lastParams = lastParams || {};
	// 当状态发生改变时 标记 状态
	if(this.testMovieClipParam(params,lastParams,'x')) result.x = params.x;
	if(this.testMovieClipParam(params,lastParams,'y')) result.y = params.y;
	if(this.testMovieClipParam(params,lastParams,'regX')) result.rx = params.regX;
	if(this.testMovieClipParam(params,lastParams,'regY')) result.ry = params.regY;
	if(this.testMovieClipParam(params,lastParams,'scaleX')) result.sx = params.scaleX;
	if(this.testMovieClipParam(params,lastParams,'scaleY')) result.sy = params.scaleY;
	if(this.testMovieClipParam(params,lastParams,'rotation')) result.ro = params.rotation;
	if(this.testMovieClipParam(params,lastParams,'alpha')) result.al = params.alpha;
	if(this.testMovieClipParam(params,lastParams,'visible')) result.vi = params.visible;
	
	if(this.testMovieClipParam(params,lastParams,'width')) result.w = params.width;
	if(this.testMovieClipParam(params,lastParams,'height')) result.h = params.height;
	if(this.testMovieClipParam(params,lastParams,'highlight')) result.hi = params.highlight;
	return result;
};
Views.testMovieClipParam = function(params, lastParams, name){
	if (name in params) {
		if (params[name] === lastParams[name]) {
			return false;
		}
		return true;
	} else {
		return false;
	}
};
Views.importData = function(data){
	Views.roots = {};
	Views.map = {};
	var a;
	for(var name in data){
		a = Views.parseData(data[name], null, Views.map);
		a.root = true;
		a.viewName = name;
		Views.roots[name] = a;
	}
};
Views.createEmpty = function(name, map){
	var obj;
	switch(name){
		case 'Scene':
			obj = new cy.Scene(Views.width, Views.height);
			break;
		case 'Panel':
			obj = new cy.Panel(300, 300);
			break;
		case 'Label':
			obj = new cy.Label('Hello World');
			break;
		case 'Bitmap':
			obj = new cy.Bitmap('res/unknown.png');
			break;
		case 'Button':
			obj = new cy.Button('res/button01.png','res/button02.png','res/button03.png');
			break;
		case 'CheckBox':
			obj = new cy.CheckBox('res/selected02.png','res/selected03.png');
			break;
		case 'TextField':
			obj = new cy.TextField();
			break;
		case 'TextArea':
			obj = new cy.TextArea();
			break;
		case 'Scroller':
			obj = new cy.Scroller(300,300);
			break;	
		case 'ColorRect':
			obj = new cy.ColorRect(100,100);
			break;				
		case 'ColorCircle':
			obj = new cy.ColorCircle();
			break;	
		case 'Sprite':
			var ss = new cy.SpriteSheet({
			    "frames": [[0, 0, 128, 128, 0, 64, 64]],
			    "images": ["res/unknown.png"],
			    "animations": {
			    	"all": [0, 0, false, 1]
			    }
			});
			obj = new cy.Sprite(ss);
			obj.gotoAndStop('all');
			break;
		case 'MovieClip':
			obj = new cy.MovieClip();
			break;				
	}
	if (map) map[obj.id] = obj;
	return obj;
};
/*
Views.parseDataToDOM = function(data, root, map){
	var obj;
	switch(data.n){
		case 'Scene':
			obj = new cy.Scene(data.w, data.h);
			if (!root) root = obj;
			data.cr.forEach(function(a,i){
				obj.addChild(Views.parseDataToDOM(a, root, map));
			});
			break;
		case 'Panel':
			obj = new cy.DOMObject('<div style="width:'+data.w+'px;height:'+data.h+'px;"></div>');
			if (!root) root = obj;
			data.cr.forEach(function(a,i){
				obj.addChild(Views.parseDataToDOM(a, root, map));
			});
			if('o' in data) obj.css('overflow', 'hidden');
			break;
		case 'Label':
			obj = new cy.DOMObject('<label>'+data.t+'<label>');
			obj.css('color', data.c);
			if('fs' in data) obj.css('fontSize', data.fs);
			if('ff' in data) obj.css('fontFamily', data.ff);
			if('lw' in data) obj.css('width', data.lw); 
			if('ta' in data) obj.css('textAlign', data.ta);
			if('b' in data) obj.css('textShadow', '0px 1px 1px #000,0px -1px 1px #000,1px 0px 1px #000,-1px 0px 1px #000');
			if('s' in data) obj.css('textShadow', '1px 1px 1px #000');
			break;
		case 'Bitmap':
			if (data.re) {
				obj = new cy.DOMObject('<div style="background-image:url('+data.i+');"></div>');
				obj.css('backgroundPosition', (-data.re[0])+'px '+(-data.re[1])+'px');
				obj.css('width', data.re[2]);
				obj.css('height', data.re[3]);
				if(data.rw) {
					// obj.css('width', data.rw);
					// obj.css('height', data.rh);
				}
			} else {
				obj = new cy.DOMObject('<img src="'+data.i+'">');
			}
			break;
		case 'Button':
			data.ure = data.ure || [0,0,100, 100];
			obj = new cy.DOMObject('<div style="background-image:url('+data.u+');background-position:-'+data.ure[0]+'px -'+data.ure[1]+'px;width:'+data.ure[2]+'px;height:'+data.ure[3]+'px;text-align:center;line-height:'+data.ure[3]+'px;">'+(data.t||'')+'</div>');
			// obj = new cy.Button(App.getRes(data.u), App.getRes(data.d));
			// if(data.ure) obj._bmpNormal.sourceRect = {x:data.ure[0],y:data.ure[1],width:data.ure[2],height:data.ure[3]};
			// if(data.dre) obj._bmpSelected.sourceRect = {x:data.dre[0],y:data.dre[1],width:data.dre[2],height:data.dre[3]};
			// if(data.t) obj.setText(data.t);
			// if(data.tc) obj.contentLbl.color = data.tc;
			// if(data.e) obj.effect = data.e;
			obj.bind('mousedown',function(){
				obj.css('backgroundPosition', '-'+data.dre[0]+'px -'+data.dre[1]+'px');
			});
			obj.bind('mouseup',function(){
				obj.css('backgroundPosition', '-'+data.ure[0]+'px -'+data.ure[1]+'px');
			});
			obj.bind('mouseout',function(){
				obj.css('backgroundPosition', '-'+data.ure[0]+'px -'+data.ure[1]+'px');
			});
			break;
		case 'CheckBox':
			break;
		case 'Sprite':
			var ss = new cy.SpriteSheet({});
			obj = new cy.Sprite(ss);
			obj.gotoAndPlay('all');
			break;
		case 'TextField':
			obj = new cy.DOMObject('<input type="text">');
			obj.htmlElement.className = data.c;
			break;
		case 'TextArea':
			obj = new cy.DOMObject('<textarea>');
			obj.htmlElement.className = data.c;
			break;
		case 'ColorRect':
			obj = new cy.DOMObject('<div style="width:'+data.w+'px;height:'+data.h+'px;background:'+data.c+';"></div>');
			break;
		case 'ColorCircle':
			obj = new cy.DOMObject('<div style="width:'+2*data.r+'px;height:'+2*data.r+'px;background:'+data.c+';boder-radius:50em;"></div>');
			break;
			
	}
	if(obj.css) {
		obj.css('position', 'absolute');
		obj.css('left', (data.x||0)-(data.rx||0));
		obj.css('top', (data.y||0)-(data.ry||0));
		// if('sx' in data) obj.css('left', data.x);.scaleX = data.sx;
		// if('sy' in data) obj.css('left', data.x);.scaleY = data.sy;
		// if('ro' in data) obj.css('left', data.x);.rotation = data.ro;
		if('a' in data) obj.css('opacity', data.a);
	} else {
		if('x' in data) obj.x = data.x;
		if('y' in data) obj.y = data.y;
		if('rx' in data) obj.regX = data.rx;
		if('ry' in data) obj.regY = data.ry;
		if('sx' in data) obj.scaleX = data.sx;
		if('sy' in data) obj.scaleY = data.sy;
		if('ro' in data) obj.rotation = data.ro;
		if('a' in data) obj.alpha = data.a;
	}
	
	if('vn' in data) {
		obj.viewName = data.vn;
		if (root && root!==obj) {
			root[obj.viewName] = obj;
		}
	}
	if('vi' in data) obj.visible = data.vi;
	// if('mo' in data) obj.mouseEnabled = data.mo;
	if (map) map[obj.id] = obj;
	return obj;
};
*/
