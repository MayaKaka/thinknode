var MainController = ccp.BaseComponent.extend({
	
	mainScene: null,
	
	onEnter: function() {
		this.mainScene = this.getOwner();
	},
	
	onExit: function(){

	}
});
