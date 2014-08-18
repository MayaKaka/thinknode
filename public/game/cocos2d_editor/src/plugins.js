
require([
	"ccBoot",
	"jquery.query",
	"jquery.position",
	"jquery.contextMenu",
	"jquery.ztree",
], function(cc){
	
	cc.game.onStart = function(){
	    cc.view.setDesignResolutionSize(g_views.width, g_views.height, cc.ResolutionPolicy.SHOW_ALL);
		cc.view.resizeWithBrowserSize(true);
	    //load resources
	    cc.LoaderScene.preload(g_resources, function () {
	    	gameViews = new	ccp.Views(g_views);
			gameStage = new ccp.Stage(MainScene);
			
			gameViews.setUrlHead("../cocos2d_project/"+g_views.name+"/res/");
			
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
	
	$.ajax({
		url: '/home/editor/import_data_cc',
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
	
});