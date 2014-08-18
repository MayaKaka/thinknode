
var App;

(function() {
    "use strict";

var Application = Class.extend({
	viewport: null,
	resource: null,
	
	stage: null,
	camera: null,
	currentScene: null,
	
	showFPS: false,
	drawCount: 0,
	globalSpeed: 1,
	
	init: function(config) {
        this.viewport = new cy.Viewport(config.width||800, config.height||480, !!config.scaleToFit, {
			maxWidth: config.maxWidth || false,
			maxHeight: config.maxHeight || false,
			minWidth: config.minWidth || false,
			minHeight: config.minHeight || false
		});
        this.resource = new cy.Resource(!!config.crossOriginAllow);
        if (config.manifest) {
        	this.resource.initLoad(config.manifest, config.loadComplete, config.fileLoaded);
        }
        this.camera = new cy.Camera();
		this.initStage(config.fps||60, !!config.showFPS, !!config.enableMouseOver);		
		this.run();
    },
	
	getRes: function(name) {
        return this.resource.getItem(name);
    },
	
    initStage: function (fps, showFPS, enableMouseOver) {
        var canvas = document.getElementById('gameCanvas'),
            stage = new cy.Stage(canvas);
		stage.autoClear = true;
		// 启用像素对齐后，动画不平滑
		// stage.snapToPixelEnabled = true;
		// 使用 requestAnimationFrame 还是 setTimeout ?
		cy.Ticker.useRAF = true;
        cy.Ticker.setFPS(fps);
		
		var isMobile = !!cy.UserAgent.mobile;
        if (isMobile) {
            cy.Touch.enable(stage, true);
            stage.enableDOMEvents(false);
        }
		if (enableMouseOver) {
            stage.enableMouseOver(10);
        }
        this.stage = stage;
        this.showFPS = showFPS;
    },
	
	run: function(){
		var o = this,
			stage = this.stage,
			viewport = this.viewport,
			ctx = stage.canvas.getContext('2d'),
			startTime = 0, endTime = 0, lastTime = 0,
			deltaTime = 0, mFPS = 0, dTime = 0;
			
		cy.Ticker.addEventListener('tick', function(e){
			o.drawCount = 0;
            startTime = new Date().getTime();
			if (window.innerWidth !== viewport.winWidth || window.innerHeight !== viewport.winHeight) {
				if((startTime - viewport.lastResetTime) > 500){
					//当有输入框获得焦点时，即键盘弹出时不作调整
					if (!viewport.testInputFocus()) {
						viewport.handleResize();
						viewport.lastResetTime = startTime;
						viewport.resetCount++;
					}
				}
			}
			
           	stage.update(e);
			
			endTime = new Date().getTime();
			deltaTime += o.updateGlobalSpeed(endTime, lastTime);
			if (deltaTime>300) {
				mFPS = Math.floor(cy.Ticker.getMeasuredFPS()*10)/10;
				dTime = endTime-startTime;
				deltaTime = 0;
			}
			lastTime = endTime;
			
			if (o.showFPS) {
				ctx.save();
				ctx.fillStyle = '#F00';
				ctx.font = '20px arial';
				ctx.fillText(mFPS+' / '+dTime, 5, 20);
				ctx.fillText(o.drawCount+' / '+o.globalSpeed, 5, 40);
				ctx.restore();
			}
        });
	},
	
	updateGlobalSpeed: function(endTime, lastTime){
		var interval = cy.Ticker._interval,
			delay = endTime - lastTime;
		this.globalSpeed = Math.floor(delay/interval);
		if (this.globalSpeed > 6) {
			this.globalSpeed = 6;
		} else if (this.globalSpeed < 1) {
			this.globalSpeed = 1;
		}
		return delay;
	},
	
	pause: function(){
		cy.Ticker.setPaused(true);
	},
	
	resetStage: function(){
		//stage 作为最顶层，应当避免其缩放，缩放操作放到其子对象中进行
		this.stage.x = this.stage.y = this.stage.regX = this.stage.regY = this.stage.rotation = 0;
		this.stage.scaleX = this.stage.scaleY = 1;
	},

	clearStage: function(){
		// this.stage.removeAllChildren();
		var stage = this.stage,
			children = stage.children;
		while(children.length>0) {
			stage.removeChildAt(0);
		}
	},
	
	runScene: function(scene, transition){
		var lastScene = this.currentScene;
		if (lastScene !== scene) {
			this.currentScene = scene;
			transition = transition || '';
			switch (transition) {
				case 'fadeIn':
					cy.TransitionScene.fadeIn(lastScene, scene, this);
					break;
				case 'fadeOut':
					cy.TransitionScene.fadeOut(lastScene, scene, this);
					break;
				case 'popOut':
					cy.TransitionScene.popOut(lastScene, scene, this);
					break;
				case 'fallDown':
					cy.TransitionScene.fallDown(lastScene, scene, this);
					break;
				default:
					cy.TransitionScene.none(lastScene, scene, this);
					break;
			}
		}
	},
	
	preventBrowserEvent: function(){
		//禁用浏览器的系统事件, 比如 img 的复制, 文本的复制
		cy.$( document ).bind('touchstart', function(e) {
			var target = e.target,
				tagName = target.tagName.toLowerCase();
			if (tagName === 'div' ||
			    tagName === 'img') {
				e.preventDefault();	
			}
		});
		//禁用浏览器的系统事件, 比如, DOM 的拖动
		cy.$( document ).bind('touchmove', function( e ) {
			var target = e.target,
				tagName = target.tagName.toLowerCase();
			if (tagName === 'input' ||
				tagName === 'textarea' ||
				tagName === 'select') {
				e.preventDefault();	
			}
		});
		//禁用鼠标右键
		cy.$( document ).bind('contextmenu', function(e){  
		   e.preventDefault();  
		});
	}
});

Application.create = function(config){
	if(!App){
		App = new Application(config);
	}
	return App;
};

cy.Application = Application;

})();