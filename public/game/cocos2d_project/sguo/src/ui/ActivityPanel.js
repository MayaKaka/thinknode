var ActivityListCtrl = ccp.BaseComponent.extend({
	onEnter: function(){
		var view = this.getOwner(),
			uiPanel = view.query('uiPanel');
		uiPanel.setPosition(cc.p(
			(gameStage.getSize().width-uiPanel.getSize().width)/2,
			(gameStage.getSize().height-uiPanel.getSize().height)/2));
        
        view.query('closeBtn').onClick = function(){
        	view.removeFromParent();
        };
	}
});