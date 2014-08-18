var gameViews, gameStage,
	scaleToFit = true;

cc.game.onStart = function(){
	if (scaleToFit) {
		// scale canvas to fit screen
		cc.view.setDesignResolutionSize(g_views.width, g_views.height, cc.ResolutionPolicy.SHOW_ALL);
		cc.view.resizeWithBrowserSize(true);
	} else {
		// use window size
		if (ccp._root.document) {
			cc.view.setDesignResolutionSize(window.innerWidth, window.innerHeight, cc.ResolutionPolicy.SHOW_ALL);
		}
	}
    
    //load resources
    cc.LoaderScene.preload(g_resources, function () {
    	gameViews = new	ccp.Views(g_views);
		gameStage = new ccp.Stage(g_views.startScene);
        cc.director.runScene(gameStage);
    }, this);
};

cc.game.run();