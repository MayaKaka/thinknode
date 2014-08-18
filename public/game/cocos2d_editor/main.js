var gameViews, gameStage;

cc.game.onStart = function(){
    cc.view.setDesignResolutionSize(g_views.width, g_views.height, cc.ResolutionPolicy.SHOW_ALL);
	cc.view.resizeWithBrowserSize(true);
    //load resources
    cc.LoaderScene.preload(g_resources, function () {
    	gameViews = new	ccp.Views(g_views);
		gameStage = new ccp.Stage(MainScene);
		
		gameViews.setUrlHead("../"+g_views.name+"/res/");
		
        renderCtrl = new RenderCtrl();
        
        nodesTree = new NodesTree();
        nodesTree.createTree(g_views);
        
        assetsTree = new AssetsTree();
        assetsTree.createTree(g_views);
        assetsTree.getAssets();
        
        attrsCtrl = new AttrsCtrl();
        attrsCtrl.update(cc.Node.create());
        
        toolsCtrl = new ToolsCtrl();
        toolsCtrl.updateScenes();
        
        timeline = new Timeline();
        
        keyboardCtrl = new KeyboardCtrl();
        imagePreview = new ImagePreview();

        cc.director.runScene(gameStage);
    }, this);
};

var g_resources = [
		"res/bear.json",
		"res/bear0.plist",
		"res/logo.png"
	], 
	g_views;

var nodesTree = null,
	assetsTree = null,
	renderCtrl = null,
	attrsCtrl = null,
	toolsCtrl = null,
	timeline = null,
	keyboardCtrl = null,
	imagePreview = null,
	viewRoot = null,
	viewMap = {};

$.ajax({
	url: '/import-data-cc',
	type: 'GET',
	dataType: 'json',
	data: {
            name: $.query.get("name")
	}
}).done(function(data){
	var canvas = document.getElementById('gameCanvas');
	canvas.width = data.width;
	canvas.height = data.height;
	$("title").html(data.title);
	
	g_views = data;
	cc.game.run();
});
