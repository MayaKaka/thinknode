(function() {
	"use strict";

var Stage = cc.Scene.extend({
	
	innerStage: null,
	startScene: null,
	currentScene: null,
	
    ctor:function(startScene) {
        this._super();
        this.startScene = startScene;
        
        this.innerStage = ccui.Widget.create();
        
        // this.innerStage.setTouchEnabled(true);
        // this.innerStage.addTouchEventListener(this.handleStageEvent, this);
        
        this.addChild(this.innerStage);
    },

    onEnter: function () {
        this._super();
        
        var component = new UpdateStageComponent();
        component.setName("ticker");
        this.addComp(component);
        
        this.currentScene = this._createScene(this.startScene);
        this.innerStage.addView(this.currentScene);
    },
    
    replaceScene: function(newScene) {
    	ccp.Tween.removeAllTweens();
    	if (this.currentScene) {
    		this.innerStage.removeView(this.currentScene);
    	}
        this.currentScene = this._createScene(newScene);
        this.innerStage.addView(this.currentScene);
    },
    
    handleTouchEvent: function(sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BAGAN:
                cc.log("Touch start :" + sender.getTouchStartPos().toString());
                break;
            case ccui.Widget.TOUCH_MOVED:
            	 cc.log("Touch move :" + sender.getTouchMovePos().toString());
                break;
            case ccui.Widget.TOUCH_ENDED:
                 cc.log("Touch end :" + sender.getTouchEndPos().toString());
                break;
            case ccui.Widget.TOUCH_CANCELED:
            	 cc.log("Touch cancel :");
                break;
            default:
                break;
        }
   	},

    getSize: function(){
    	return cc.director.getWinSize();
    },  
    
    _createScene: function(scene) {
        var newScene;
        if (typeof(scene) === 'string') {
            newScene = gameViews.create(scene);
        } else if (scene instanceof cc.Node) {
            newScene = scene;
        } else if (scene.prototype instanceof cc.Node){
            newScene = new scene();
        }
        return newScene;
    }
});

var UpdateStageComponent = cc.Component.extend({
	
	update: function(delta){
		if (ccp.Tween._inited) {
            // JSB bug: delta === 1
            if (delta >= 1) {
                delta = 0.0167;
            }
			ccp.Tween.tick(delta);
		}
	}
	
});

ccp.Stage = Stage;
}());