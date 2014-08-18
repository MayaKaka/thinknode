

(function() {
    "use strict";

var Viewport = Class.extend({
	scaleToFit: false,
	scope:null,
	winWidth: 0,
	winHeight: 0,
	width: 0,
	height: 0,
	zoomX: 1,
	zoomY: 1,
	resetCount: 0,
	lastResetTime: 0,
	isMobile: false,
	isPad: false,
	iPhone: false,
	landscape: false,
	
	_widthCache: 0,
	_heightCache: 0,
	init : function(width, height, scaleToFit, scope) {
		var system = cy.UserAgent.system;
					
		this.isMobile = cy.UserAgent.mobile;
		this.isPad =  system.ipad;
		this.iPhone = system.iphone || system.ipod;
       	this.scaleToFit = scaleToFit;
       	this.scope = scope;
       	
       	if (this.isMobile && !this.isPad) {
			document.getElementById('viewport').content = 'width=' + width + ',user-scalable=no,target-densitydpi=high-dpi';
		}
		this._widthCache = width;
		this._heightCache = height;
		if (width>height || width>=800) this.landscape = true;
		
		this.handleResize(width, height);
	},
	
	handleResize: function(width, height) {
		// iPhone和iPod下浏览器的隐藏地址栏策略
		// 导致IOS7 BUG
//		if( isMobile && iPhone ){
//			body.css( 'minHeight', (window.innerHeight+200) + 'px');
//			scr.css('top', '1px');
//			window.scrollTo(0, 1);
//		} else {
//			window.scrollTo(0, 0);
//		}
		var screen = document.getElementById('gameScreen'),
            canvas = document.getElementById('gameCanvas');
            
        width = width || this._widthCache;
        height = height || this._heightCache;
 		// 重新调整宽高
        this.winWidth = window.innerWidth;
		this.winHeight = window.innerHeight;	
		this.width = width==='device-width'?window.innerWidth:width;
		this.height = height==='device-height'?window.innerHeight:height;

		// 缩放以适应屏幕
		if (this.scaleToFit) {
			var scaleX = window.innerWidth / this.width,
                scaleY = window.innerHeight / this.height,
                scaleK = scaleY/scaleX,
                scaleM = scaleX > scaleY ? scaleY : scaleX;
            if (this.isMobile && !this.isPad) {
            	this.zoomX = scaleX;
            	this.zoomY = scaleY;
            	if (scaleK<0.5) {
                 	this.zoomX = this.zoomY;
                } else if(scaleK>1.5){
                 	this.zoomY = this.zoomX;
                }
            } else {
            	this.zoomX = this.zoomY = scaleM;
        	}
		} else {
			if ((this.landscape && this.height>this.width) || (!this.landscape && this.width>this.height)) {
				return;
			}
		}
		canvas.width = this.width;
		canvas.height = this.height;
		screen.style.width = Math.round(this.zoomX*this.width) + 'px';
		screen.style.height = Math.round(this.zoomY*this.height) + 'px';
		
		// 场景适应
		if (App && App.currentScene) {
			App.currentScene.resize(this.width, this.height);
		}
	},
	
	//检测是否有输入框获取焦点，在移动上表现为键盘弹出
	testInputFocus: function( ){
		var input = document.querySelectorAll('input'),
			area = document.querySelectorAll('textarea');
		for(var i=0,l=input.length; i<l; i++) {
			if (input[i].state==='focus') {
				return true;
			}
		}
		for(var i=0,l=area.length; i<l; i++) {
			if(area[i].state==='focus') {
				return true;
			}
		}	
		return false;
	}
});
	
cy.Viewport = Viewport;

})();