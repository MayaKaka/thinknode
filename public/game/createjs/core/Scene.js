
(function() {
    "use strict";
    
var Scene = Class.extend.call(cy.Container, {
	type: 'Scene',
	width: 0, 
	height: 0,
	onEnter: null,
	onExit: null,
	
	init: function(width, height){
		this.initialize();
		this.width = width || App.viewport.width;
		this.height = height || App.viewport.height;
	},
	
	enter: function (parent, index){
		if (typeof(index) === 'number') {
			parent.addChildAt(this, 0);
		} else {
			parent.addChild(this);
		}
		this.onEnter && this.onEnter();
	},
	
	exit: function(){
		var parent = this.parent;
		parent && parent.removeChild(this);
		this.onExit && this.onExit();
	},
	
	resize: function(width, height){
		this.width = width;
		this.height = height;
	},
	
	getMeasuredRect: function(){
		return this._rectangle.initialize(0, 0, this.width, this.height);
	}
});

var TransitionScene = function() {};

TransitionScene.fadeIn = function(lastScene, scene, app){
	scene.alpha = 0;
	scene.enter(app.stage);
	scene.mouseEnabled = false;
	if (lastScene) {
		lastScene.mouseEnabled = false;
	}
	cy.Tween.get(scene).to({
		alpha: 1
	}, 300).call(function(){
		if (lastScene) {
			lastScene.exit();
			lastScene.mouseEnabled = true;
		}
		scene.mouseEnabled = true;
		app.camera.reset();
	});
};

TransitionScene.fadeOut = function(lastScene, scene, app){
	scene.enter(app.stage, 0);
	if (lastScene) {
		scene.mouseEnabled = false;
		lastScene.mouseEnabled = false;
		cy.Tween.get(lastScene).to({
			alpha: 0
		}, 300).call(function(){
			lastScene.exit();
			lastScene.alpha = 1;
			lastScene.mouseEnabled = true;
			scene.mouseEnabled = true;
			app.camera.reset();
		});
	}
};

TransitionScene.popOut = function(lastScene, scene, app){
	scene.x = scene.regX = app.viewport.width / 2;
	scene.y = scene.regY = app.viewport.height / 2;
	scene.scaleX = scene.scaleY = 0.5;
	scene.enter(app.stage);
	scene.mouseEnabled = false;
	if (lastScene) {
		lastScene.mouseEnabled = false;
	}
	cy.Tween.get(scene).to({
		scaleX: 1,
		scaleY: 1,
	}, 300).call(function(){
		if (lastScene) {
			lastScene.exit();
			lastScene.mouseEnabled = true;
		}
		scene.x = scene.y = scene.regX = scene.regY = 0;
		scene.mouseEnabled = true;
		app.camera.reset();
	});
};

TransitionScene.fallDown = function(lastScene, scene, app){
	scene.y = -app.viewport.height;
	scene.enter(app.stage);
	scene.mouseEnabled = false;
	if (lastScene) {
		lastScene.mouseEnabled = false;
	}
	cy.Tween.get(scene).to({
		y: 0
	}, 300).call(function(){
		if (lastScene) {
			lastScene.exit();
			lastScene.mouseEnabled = true;
		}
		scene.mouseEnabled = true;
		app.camera.reset();
	});
};

TransitionScene.none = function(lastScene, scene, app){
	scene.enter(app.stage);
	lastScene && lastScene.exit();
	app.camera.reset();
};

cy.Scene = Scene;
cy.TransitionScene = TransitionScene;

})();