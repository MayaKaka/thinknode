var BattleSceneController = ccp.BaseComponent.extend({
	
	onEnter: function(){
		var v = this.getOwner(),
			map = v.query('map');
			o = this;
		audioEngine.stopMusic();
		audioEngine.playMusic(MUSIC_FIGHT, true);

		map.setPosition(cc.p(
			(gameStage.getSize().width-map.getSize().width)/2,
			(gameStage.getSize().height-map.getSize().height)/2));
		var hasParticle = false;
		map.onClick = function(){
			if (hasParticle) return;
			hasParticle = true;
			var p0 = this.getPosition(),
				p1 = this.getTouchEndPos();
			o.addParticleByType('Flower', cc.p(Math.random()*960, Math.random()*540));
			o.addParticleByType('Fire', cc.p(Math.random()*960, Math.random()*540));
			o.addParticleByType('Sun', cc.p(Math.random()*960, Math.random()*540));
			o.addParticleByType('Galaxy', cc.p(Math.random()*960, Math.random()*540));
			
			o.addParticleByType('Fireworks', cc.p(Math.random()*960, Math.random()*540));
			o.addParticleByType('Meteor', cc.p(Math.random()*960, Math.random()*540));
			o.addParticleByType('Spiral', cc.p(Math.random()*960, Math.random()*540));
			o.addParticleByType('Smoke', cc.p(Math.random()*960, Math.random()*540));
			
			o.addParticleByType('Snow', cc.p(Math.random()*960, Math.random()*540));
			o.addParticleByType('Rain', cc.p(Math.random()*960, Math.random()*540));
		};	
		v.query('skipBtn').onClick = function(){
			ccp.Notification.notify("getMapInfoEcho");
		};
		v.query('sk0').onClick = function(){
			o.attack();
		};
		v.query('sk1').onClick = function(){
			o.attack2();
		};
		v.query('sk2').onClick = function(){
			o.attack3();
		};
		v.query('sk3').onClick = function(){
			o.shake();
		};
		this.addRole();
		this.addBoss();
	},
	
	addParticle: function(pos){
		
		var particle = ccui.Widget.create(),
			node = cc.ParticleSystem.create("res/particle/SmallSun.plist");
		node.setPosition(cc.p(0, 0));
        node.setTotalParticles(30);
        particle.addView(node);
        particle.setPosition(pos);
        					  
        this.getOwner().query('entities').addView(particle);						  
	},
	
	addParticleByType: function(type, pos){
		var particle = cc['Particle'+type].create();
		particle.setTexture(cc.textureCache.addImage('res/particle/fire.png'));
		particle.setPosition(pos);
		this.getOwner().query('entities').addView(particle);
	},
	
	addRole: function() {
		var role = ccui.Widget.create(),
			sprite = gameViews.create('Zhaoyun'),
			label = ccui.Text.create(),
			pos = this.getOwner().query('p0').getPosition();
		label.setText('赵子龙');
		label.setFontName('微软雅黑');
		label.setPositionY(120);
		sprite.setPosition(cc.p(0, 0));
		sprite.playAnimation('stand1');

		role.addView(sprite);
		role.addView(label);
		role.sprite = sprite;
		role.setPosition(cc.p(pos.x+50, pos.y+50));
		
		this.getOwner().query('entities').addView(role);		
		this.role = role;
	},
	
	addBoss: function() {
		var role = ccui.Widget.create(),
			sprite = gameViews.create('Boss'),
			pos = this.getOwner().query('p1').getPosition();
		sprite.setPosition(cc.p(0, 0));
		sprite.playAnimation('stand');
		
		role.addView(sprite);
		role.sprite = sprite;
		role.setPosition(cc.p(pos.x+50, pos.y+50));
		role.setScaleX(-1);
		this.getOwner().query('entities').addView(role);
		this.boss = role;	
	},
	
	attack: function() {
		if (this.role.tweenjs_count) return;
		var s = this.role.sprite,
			p0 = this.role.getPosition(),
			p1 = this.boss.getPosition();
		var delay = s.getAnimationDelay('atk2');
		s.playAnimation('run1');
		ccp.Tween.get(this.role).to({x:p1.x-160},500).call(function(){
			s.playAnimation('atk2', false);
		}).wait(delay).call(function(){
			s.playAnimation('run1');
			s.setScaleX(-1);
		}).to({x:p0.x},500).call(function(){
			s.setScaleX(1);
			s.playAnimation('stand1');
		});
	},
	
	attack2: function() {
		if (this.role.tweenjs_count) return;
		var o = this,
			s = this.role.sprite,
			p0 = this.role.getPosition(),
			p1 = this.boss.getPosition();
		s.playAnimation('atk', false);
		var delay = s.getAnimationDelay('atk'),
			skill;
		ccp.Tween.get(this.role).wait(delay).call(function(){
			s.playAnimation('stand1');
			skill = gameViews.create('Fire');
			skill.playAnimation('all');
			var pp0 = cc.p(p0.x+100, p1.y+50),
				pp1 = cc.p(p1.x-100, p1.y+150),
				dis = Math.sqrt((pp1.x-pp0.x)*(pp1.x-pp0.x) + (pp1.y-pp0.y)*(pp1.y-pp0.y)),
				ro = Math.asin((pp1.y-pp0.y)/dis)/Math.PI*180;
			skill.setPosition(pp0);
			o.getOwner().query('entities').addView(skill);
			ccp.Tween.get(skill).wait(800).to({x: pp1.x, y: pp1.y, rotation: -ro},400).call(function(){
				o.getOwner().query('entities').removeView(skill);
				skill = gameViews.create('Cursor');
				skill.playAnimation('all');
				skill.setPosition(pp1);
				o.getOwner().query('entities').addView(skill);
				skill.onAnimationEnd = function() {
					o.getOwner().query('entities').removeView(skill);
				};
				//o.hurt(o.boss, 1000);
			});
		});
	},
	
	attack3: function(){
		if (this.boss.tweenjs_count) return;
		var o = this,
			s = this.boss.sprite,
			p0 = this.boss.getPosition(),
			p1 = this.role.getPosition();
		s.playAnimation('atk', false);
		var delay = s.getAnimationDelay('atk'),
			skill = gameViews.create('Cursor'),
			delay2 = skill.getAnimationDelay('all');
		ccp.Tween.get(this.boss).wait(delay).call(function(){
			s.playAnimation('stand');
			skill = gameViews.create('Cursor');
			skill.playAnimation('all');
			skill.setPosition(cc.p(p1.x, p1.y+100));
			o.getOwner().query('entities').addView(skill);
		}).wait(delay2).call(function(){
			o.getOwner().query('entities').removeView(skill);
			o.hurt(o.role, 1000);
		});
	},
	
	shake: function(){
		if (this.boss.tweenjs_count) return;
		var o = this,
			s = this.boss.sprite,
			p0 = this.boss.getPosition(),
			p1 = this.role.getPosition(),
			map = this.getOwner().query('map'),
			pos = cc.p(map.getPosition().x, map.getPosition().y);
		s.playAnimation('shake', false);
		
		var delay = s.getAnimationDelay('shake'),
			dy = 5;
		var shake = function(){
				dy *= -1;
				map.setPosition(cc.p(pos.x, pos.y+dy));
			};
		ccp.Tween.get(this.boss).wait(delay).call(function(){
			s.playAnimation('stand');
			ccp.Tween.get(map).wait(30).call(shake)
					.wait(30).call(shake).wait(30).call(shake).wait(30).call(shake).wait(30).call(shake)
					.wait(30).call(shake).wait(30).call(shake).wait(30).call(shake).wait(30).call(shake)
					.wait(30).call(shake).wait(30).call(shake).wait(30).call(shake).wait(30).call(shake)
					.wait(30).call(function(){
						map.setPosition(pos);
					});
		});
	},
	
	hurt: function(target, dmg) {
		var s = target.sprite,
			p = target.getPosition();
		var delay = s.getAnimationDelay('hurt');
		s.playAnimation('hurt');
		ccp.Tween.get(target).wait(delay).call(function(){
			s.playAnimation('stand1');
		});
	}
	
});