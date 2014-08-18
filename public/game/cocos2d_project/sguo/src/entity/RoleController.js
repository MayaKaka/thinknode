var createEntityRole = function(data){

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
		
		var controller = new RoleController("main");
		controller.onData(data);
		owner.addComp(controller);
	
		return owner;
};


var RoleController = ccp.BaseComponent.extend({	
	
	onEnter: function() {
		var owner = this.getOwner();
		this.animation = owner.query("sprite");
		this.namelabel = owner.query("namelabel");
		this.hitbody = owner.query("hitbody");
		
		this.namelabel.setText(this.roleName);
	},

	onData: function(data) {
		this.roleId = data.id;
		this.roleName = data.name;
	},
	
	bindTouchEvent: function(handler, target){
		var hitbody = this.getOwner().query("hitbody");
		hitbody.setTouchEnabled(true);
		hitbody.addTouchEventListener(handler, target);
	},	
	
	onUpdate: function(delta, owner) {
		var path = this.path;
		if (path) {
			var owner = this.getOwner();
			
			var p1 = path[0],
				p0 = owner.getPosition(),
				dx = p1.x - p0.x,
				dy = p1.y - p0.y,
				dis = Math.sqrt(dx*dx+dy*dy),
				speed = this.speed*delta/0.0167;
			// cc.log(delta/0.0167); 
			if (dis < speed) {
				owner.setPosition(p1);
				path.shift();
				if (path.length===0) {
					this.path = null;
					this.animation.playAnimation('stand'+this.direction);
				}
			} else {
				var ex = p0.x + dx*speed/dis,
					ey = p0.y + dy*speed/dis;
				owner.setPosition(cc.p(ex, ey));
				var dir = 0, mirror = false , k = Math.abs(dx)/Math.abs(dy);
				if (k<1/Math.sqrt(3)) {
					if (dy>0) {
						dir = 0;
					} else {
						dir = 2;
					}
				} else if(dy>=0) {
					dir = 3;
					if (dx<0) mirror = true;
				} else {
					dir = 1;
					if (dx<0) mirror = true;
				}
				if (this.animation.getCurrentAnimationName() !== ('run'+dir)) {
					this.animation.playAnimation('run'+dir);
					this.direction =  dir;
				}
				this.animation.setScaleX(mirror?-1:1);
			}
			if (this.isLeadingRole) {
				gameStage.currentScene.getComp("main").focus(owner);
			}
		}
	}
});
