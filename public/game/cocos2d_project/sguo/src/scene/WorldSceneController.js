var WorldSceneController = ccp.BaseComponent.extend({
	
	onEnter: function(){
		var v = this.getOwner();
		v.query('bgContainer').setSize(cc.size(gameStage.getSize().width,gameStage.getSize().height));
		v.query('a0').onClick = 
		v.query('a1').onClick = 
		v.query('a2').onClick = 
		v.query('a3').onClick = function(){
			ccp.Notification.notify("getMapInfoEcho");
		};
	}
	
});