var createEntityNpc = function (data) {
		var anim = data.anim,
			pos = data.pos,
			state = data.state;
		
		var owner = ccui.Widget.create();
		
		var sprite = gameViews.create(anim),
			namelabel = ccui.Text.create(),
			hitbody = ccui.Layout.create();
			
		namelabel.setFontName('微软雅黑');
		namelabel.setFontSize(24);
		namelabel.setPositionY(120);
			
		sprite.setPosition(cc.p(0, 0));
		sprite.playAnimation(state||'all');
		
		sprite.setViewTag('sprite');
		namelabel.setViewTag('namelabel');
		hitbody.setViewTag('hitbody');
		
		owner.addView(sprite);
		owner.addView(namelabel);
		owner.addView(hitbody);
		owner.setPosition(pos);
		
		var controller = new NpcController("main");
		controller.onData(data);
		owner.addComp(controller);
		
		return owner;
};


var NpcController = ccp.BaseComponent.extend({
	
	onEnter: function(){
		var owner = this.getOwner();
		this.animation = owner.query("sprite");
		this.namelabel = owner.query("namelabel");
		this.hitbody = owner.query("hitbody");

		this.namelabel.setText(this.roleName);
	},
	
	onData: function(data){
		this.roleId = data.id;
		this.roleName = data.name;
	},
		
	bindTouchEvent: function(handler, target){
		var hitbody = this.getOwner().query("hitbody");
		hitbody.setTouchEnabled(true);
		hitbody.addTouchEventListener(handler, target);
	},
		
	onUpdate: function (delta){
		if (!this.resizeHitBoby && this.animation) {
			var size = this.animation.getSize();
			if (size.width>0) {
				var frame = this.animation.getCurrentFrame();
				this.hitbody.setSize(cc.size(size.width, size.height));
				this.hitbody.setPosition(cc.p(frame.getPositionX(), frame.getPositionY()));
				this.resizeHitBoby = true;
			}
		}
	}
});
