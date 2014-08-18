
var MovieTicker = ccp.BaseComponent.extend({

	mc: null,
	
	onEnter: function() {
		var owner = this.getOwner(),
		    mc0 = owner.query("mc0"),
		    mc1 = owner.query("mc1");
		this.mc = new ccp.MovieClip("hehe");
		this.mc.loop = true;
		this.mc.timeline.addTween(ccp.Tween.get(mc0).to({ y: 150, rotation:360 }, 50).to({ y: 0, rotation:0 }, 50));
		this.mc.timeline.addTween(ccp.Tween.get(mc1).to({ x: 150, rotation:360 }, 50).to({ x: 0, rotation:0 }, 50).wait(50));
		owner.addComp(this.mc);
	},


	// onExit: function() {}

});