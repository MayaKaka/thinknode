function main() {
	var textSs = {
		"animations":{
			"0":{"frames":[0]},
			"1":{"frames":[1]},
			"2":{"frames":[2]},
			"3":{"frames":[3]},
			"4":{"frames":[4]},
			"5":{"frames":[5]},
			"6":{"frames":[6]},
			"7":{"frames":[7]},
			"8":{"frames":[8]},
			"9":{"frames":[9]},
			"-":{"frames":[10]}
		},
		"images":["res/battle/zhandoushuzi01.png"],
		"frames":[
			[0, 0, 28, 36, 0, 0, 0],
			[28, 0, 28, 36, 0, 0, 0],
			[56, 0, 28, 36, 0, 0, 0],
			[84, 0, 28, 36, 0, 0, 0],
			[112, 0, 28, 36, 0, 0, 0],
			[140, 0, 28, 36, 0, 0, 0],
			[168, 0, 28, 36, 0, 0, 0],
			[196, 0, 28, 36, 0, 0, 0],
			[224, 0, 28, 36, 0, 0, 0],
			[252, 0, 28, 36, 0, 0, 0],
			[280, 0, 28, 36, 0, 0, 0]
		]
	};
	Views.getBitmapText = function(text){
		return new cy.BitmapText(text, new cy.SpriteSheet(textSs));
	};
	App.runScene(new LoginSceneCtrl().getView());
	App.resource.initLoad([
		{ src: 'res/home_background.mp3'},
		{ src: 'res/fight_background.mp3'},
		
		{ src: 'res/background/background-029.jpg'},
		{ src: 'res/background/background-098.jpg'},
		{ src: 'res/background/background-112.jpg'},
		{ src: 'res/background/background-128.jpg'},
		{ src: 'res/background/battle_bg.jpg'},
		{ src: 'res/background/city_bg.jpg'},
		{ src: 'res/background/customs_pass-001.jpg'},
		{ src: 'res/background/login_bg.jpg'},
		{ src: 'res/background/map_background-001.jpg'},
		{ src: 'res/background/map_background-003.jpg'},
		{ src: 'res/background/map_background-004.jpg'},
		
		{ src: 'res/battle/background-005.png'},
		{ src: 'res/battle/fight_skill_4410.png'},
		{ src: 'res/battle/action_fight_attack_cavalry.png'},
		{ src: 'res/battle/Effects_Ranger_23.png'},
		{ src: 'res/battle/Effects_Ranger_26.png'},
		{ src: 'res/battle/Effects_UI_01.png'},
		{ src: 'res/battle/fight_skill_4825.png'},
		
		{ src: 'res/button/menu0.png'},
		{ src: 'res/button/menu1.png'},
		{ src: 'res/button/menu2.png'},
		{ src: 'res/button/menu3.png'},
		{ src: 'res/button/menu4.png'},
		{ src: 'res/button/menu5.png'},
		{ src: 'res/button/menu_select.png'},
		{ src: 'res/button/button-038.png'},
		{ src: 'res/button/button-039.png'},
		{ src: 'res/button/button-037.png'},
		{ src: 'res/button/button-070.png'},
		{ src: 'res/button/button-044.png'},
		{ src: 'res/button/button-045.png'},
		{ src: 'res/button/button-180.png'},
		{ src: 'res/button/button-181.png'},
		{ src: 'res/button/button-001.png'},
		{ src: 'res/button/button-009.png'},
		{ src: 'res/button/button-035.png'},
		{ src: 'res/button/button-036.png'},
		
		{ src: 'res/icon/hero_border_2.png'},
		{ src: 'res/icon/hero_border_3.png'},
		{ src: 'res/icon/hero_border_4.png'},
		{ src: 'res/icon/hero_border_5.png'},
		{ src: 'res/icon/icon_bg.png'},
		{ src: 'res/icon/fight_border_2.png'},
		{ src: 'res/icon/fight_border_3.png'},
		{ src: 'res/icon/fight_border_4.png'},
		{ src: 'res/icon/fight_border_5.png'},
		
		{ src: 'res/role/card_hero_81.png'},
		
		{ src: 'res/ui/background-022.png'},
		{ src: 'res/ui/background-031.png'},
		{ src: 'res/ui/background-039.png'},
		{ src: 'res/ui/background-068.png'},
		{ src: 'res/ui/background-082.png'},
		{ src: 'res/ui/background-099.png'},
		{ src: 'res/ui/background-108.png'},
		{ src: 'res/ui/background-109.png'},
		{ src: 'res/ui/background-111.png'},
		{ src: 'res/ui/background-114.png'},
		{ src: 'res/ui/background-131.png'},
		{ src: 'res/ui/background-132.png'},
		{ src: 'res/ui/background-143.png'},
		{ src: 'res/ui/background-177.jpg'},
		{ src: 'res/ui/background-200.png'},
		{ src: 'res/ui/background-201.png'},
		{ src: 'res/ui/background-202.png'},
		{ src: 'res/ui/background-208.png'},
		{ src: 'res/ui/button-267.png'},
		{ src: 'res/ui/head_bg00.png'},
		{ src: 'res/ui/head_bg01.png'},
		{ src: 'res/ui/menu_bg.png'},
		{ src: 'res/ui/progress-005.png'},
		{ src: 'res/ui/progress-018.png'},
		{ src: 'res/ui/shape-013.png'},
		{ src: 'res/ui/shape-026.png'},
		{ src: 'res/ui/shape-027.png'},
		{ src: 'res/ui/shape-028.png'},
		{ src: 'res/ui/shape-029.png'},
		{ src: 'res/ui/shape-036.png'},
		
		{ src: 'res/building/building00.png'},
		{ src: 'res/building/building01.png'},
		{ src: 'res/building/building10.png'},
		{ src: 'res/building/building11.png'},
		{ src: 'res/building/building20.png'},
		{ src: 'res/building/building21.png'},
		{ src: 'res/building/building30.png'},
		{ src: 'res/building/building31.png'},
		{ src: 'res/building/building40.png'},
		{ src: 'res/building/building41.png'},
		{ src: 'res/building/building50.png'},
		{ src: 'res/building/building51.png'},
		
		{ src: 'res/role/skin_hero_34.png'},
		{ src: 'res/role/skin_hero_81.png'},
		{ src: 'res/role/skin_hero_153.png'},
		{ src: 'res/role/skin_hero_220.png'}
	],
	//loadComplete 
	function(e){
		setTimeout(function(){
			App.currentScene.progressLbl.visible = false;
			App.currentScene.enterBtn.visible = true;
		},500);
	},
	//fileLoaded
	function(e){
		App.currentScene.progressLbl.text = '游戏载入中...'+Math.floor(e.progress*100)+'%';
	});
}


var BaseCtrl = Class.extend({
	createView: function(name) {
		var v = Views.get(name);
		this.v = v;
		return v;
	},
	getView: function(){
		return this.v;
	}
});

var MainSceneCtrl = BaseCtrl.extend({
	init: function(){
		var v = this.createView('MainScene');
		v.resize = function(w, h){ v.menuView.y = h - 91; };
		v.resize(v.width, App.viewport.height);
		this.initHead();
		this.initCity();
		this.initMenu();
		this.marquee();
	},
	marquee: function(){
		var v = this.v,
			l0 = v.msgLbl.getMeasuredWidth()+50,
			l1 = v.msgLbl.parent.width;
		cy.Tween.get(v.msgLbl, {loop:true}).to({x:l1}).to({x:150},800).wait(1500).to({x:-l0},5500).wait(1500);
	},
	initHead: function(){
		var v = this.v;
		v.teamBtn.onClick = function(){
			App.runScene(new TeamSceneCtrl().getView()); 
		};
		v.heroListPanel.on('click', function(){
			if(!v.heroListPanel.moved){
				App.runScene(new HeroSceneCtrl().getView()); 
			}
		});
	},
	initCity: function(){
		var v = this.v;
	},
	initMenu:function(){
		var v = this.v;
		v.homeBtn.onClick = function(){
			App.runScene(new MainSceneCtrl().getView()); 
		};
		v.expedBtn.onClick = function(){
			App.runScene(new ExpedSceneCtrl().getView()); 
		};
		v.fightBtn.onClick = function(){
			App.runScene(new BattleReadyCtrl().getView()); 
		};
		v.activityBtn.onClick = function(){
			App.runScene(new ActivitySceneCtrl().getView()); 
		};
		v.shopBtn.onClick = function(){
			App.runScene(new ShopSceneCtrl().getView()); 
		};
		v.otherBtn.onClick = function(){
			if (location.href.indexOf("http")>-1) {
				location.href = "/community/main";
			} else {
				location.href = "../../main.html";
			}
			return;
			App.runScene(new OtherSceneCtrl().getView()); 
		};
	}
});

var ExpedSceneCtrl = BaseCtrl.extend({
	init: function(){
		var v = this.createView('ExpedScene');
		v.resize = function(w, h){ v.menuView.y = h - 91; };
		v.resize(v.width, App.viewport.height);
		v.returnBtn.onClick = function(){
			App.runScene(new MainSceneCtrl().getView()); 
		};
		v.cityView.adjustPosition = true;
		v.cityViewContent.on('click', function(e){
			if (!v.cityView.moved && e.target.type==='Button') {
				App.runScene(new BattleReadyCtrl().getView()); 
			}
		});
		this.initMenu();
	},
	initMenu: MainSceneCtrl.prototype.initMenu
});

var BattleReadyCtrl = BaseCtrl.extend({
	init: function(){
		var v = this.createView('BattleReadyScene');
		v.resize = function(w, h){ 
			v.menuView.y = h - 91;
			v.listScroll.height = h - (850-445);
		};
		v.resize(v.width, App.viewport.height);
		v.expedBtn.onClick = function(){
			App.runScene(new ExpedCtrl().getView()); 
		};
		this.initCache();
		this.initMenu();
		this.marquee();
		this.update();
	},
	initMenu: MainSceneCtrl.prototype.initMenu,
	marquee: MainSceneCtrl.prototype.marquee,
	initCache: function(){
		var v = this.v;
		v.headBg.cache(0,0,480,163);
	},
	update: function(){
		var v = this.v,
			b = v.battleTargetPanel,
			p = v.battleTargetPanel.parent,
			c;
		p.children = [];
		for(var i=0;i<10;i++){
			c = Views.clone(b);
			p.addChild(c);
			c.children[1].onClick = function(){
				if(!p.parent.moved) {
					App.runScene(new BattleSceneCtrl().getView()); 
				}
			};
			c.children[0].cache(0,0,455,141);
		}
	}
});

var TeamSceneCtrl = BaseCtrl.extend({
	init: function(){
		var v = this.createView('TeamScene');
		v.resize = function(w, h){ v.menuView.y = h - 91; };
		v.resize(v.width, App.viewport.height);
		v.returnBtn.onClick = function(){
			App.runScene(new MainSceneCtrl().getView()); 
		};
		this.initMenu();
		this.marquee();
		this.initTeam();
	},
	initMenu: MainSceneCtrl.prototype.initMenu,
	marquee: MainSceneCtrl.prototype.marquee,
	initTeam: function(){
		var v = this.v,
			p = v.teamPanel,
			c = p.children;
		c.forEach(function(a, i){
			a.draggable = true;
			a.on('drop', function(e){
				var t = e.dragTarget;
				cy.Tween.get(t).to({x: a.x, y:a.y},150);
				cy.Tween.get(a).to({x: t.x, y:t.y},150);
			});
		});
		v.yesBtn.on('click', function(){
			App.runScene(new ExpedSceneCtrl().getView()); 
		});
	}
});

var ActivitySceneCtrl = BaseCtrl.extend({
	init: function(){
		var v = this.createView('ActivityScene');
		v.resize = function(w, h){ v.menuView.y = h - 91; };
		v.resize(v.width, App.viewport.height);
		v.lblPanel.mouseEnabled = false;
		this.initMenu();
		this.marquee();
	},
	initMenu: MainSceneCtrl.prototype.initMenu,
	marquee: MainSceneCtrl.prototype.marquee
});
var ShopSceneCtrl = BaseCtrl.extend({
	init: function(){
		var v = this.createView('ShopScene');
		v.resize = function(w, h){ v.menuView.y = h - 91; };
		v.resize(v.width, App.viewport.height);
		this.initMenu();
		this.marquee();
	},
	initMenu: MainSceneCtrl.prototype.initMenu,
	marquee: MainSceneCtrl.prototype.marquee
});
var OtherSceneCtrl = BaseCtrl.extend({
	init: function(){
		var v = this.createView('OtherScene');
		v.resize = function(w, h){ v.menuView.y = h - 91; };
		v.resize(v.width, App.viewport.height);
		this.initMenu();
		this.marquee();
	},
	initMenu: MainSceneCtrl.prototype.initMenu,
	marquee: MainSceneCtrl.prototype.marquee,

});
var HeroSceneCtrl = BaseCtrl.extend({
	init: function(){
		var v = this.createView('HeroScene');
		v.resize = function(w, h){ v.menuView.y = h - 91; };
		v.resize(v.width, App.viewport.height);
		this.initMenu();
		this.marquee();
		this.initEvent();
	},
	initMenu: MainSceneCtrl.prototype.initMenu,
	marquee: MainSceneCtrl.prototype.marquee,
	initEvent: function(){
		var v = this.v;
		v.updateBtn.onClick = function(){
			App.runScene(new HeroUpdateSceneCtrl().getView()); 
		};
	}
});
var HeroUpdateSceneCtrl = BaseCtrl.extend({
	init: function(){
		var v = this.createView('HeroUpdateScene');
		v.resize = function(w, h){ v.menuView.y = h - 91; };
		v.resize(v.width, App.viewport.height);
		this.initMenu();
		this.marquee();
		this.initEffect();
	},
	initMenu: MainSceneCtrl.prototype.initMenu,
	marquee: MainSceneCtrl.prototype.marquee,
	initEffect: function(){
		var v = this.v, p = v.eff00.parent, T = cy.Tween;
		v.eff00.compositeOperation =
		v.eff02.compositeOperation =
		v.eff04.compositeOperation = 'lighter';
		
		v.eff00.on('click', function(){
			App.runScene(new SelectEatSceneCtrl().getView()); 
		});
		v.eff02.on('click', function(){
			App.runScene(new SelectEatSceneCtrl().getView()); 
		});
		v.eff04.on('click', function(){
			App.runScene(new SelectEatSceneCtrl().getView()); 
		});
		
		T.get(v.eff00, {loop:true}).to({alpha:0},1200).to({alpha:1},1200);
		T.get(v.eff02, {loop:true}).to({alpha:0},1200).to({alpha:1},1200);
		T.get(v.eff04, {loop:true}).to({alpha:0},1200).to({alpha:1},1200);
		p.children.forEach(function(a, i){
			if (i<5) {
				T.get(a, {loop:true}).to({ scaleX:1.3, scaleY:1.3 },1600).to({ scaleX:1, scaleY:1 },1600);
			}
		});
	},
	animate: function(){
		var v = this.v, 
			p = v.eff00.parent, 
			pp = p.parent, 
			np = v.animatePanel, 
			T = cy.Tween;
		p.visible = false;
		np.visible = true;
		np.children.forEach(function(a, i){
			if(i<5){
				T.get(a).to({ scaleX:-0.8, scaleY:0.8, y:a.y-25},200).to({ scaleX:0.6, scaleY:0.6, y:a.y-50},200).to({y:a.y+50, alpha:0.5},300).to({alpha:0});
			} else {
				var s = Views.get('Update');
				s.x = a.x;
				s.y = a.y;
				T.get(a).wait(800).to({visible:true}).call(function(){
					s.gotoAndPlay('all');
					a.parent.addChildAt(s,i);
				}).to({y:a.y-30},800).call(function(){
					np.visible = false;
					p.visible = true;
				});
			}
		});
	}
});

var SelectEatSceneCtrl = BaseCtrl.extend({
	init: function(){
		var v = this.createView('SelectEatScene');
		v.resize = function(w, h){ 
			v.menuView.y = h - 91; 
			v.eatTargetPanel.parent.parent.height = h-(850-540);
			v.yesBtn.y = h-(850-570);
		};
		v.resize(v.width, App.viewport.height);
		this.initMenu();
		this.marquee();
		this.initList();
	},
	initMenu: MainSceneCtrl.prototype.initMenu,
	marquee: MainSceneCtrl.prototype.marquee,
	initList: function(){
		var v = this.v,
			t = v.eatTargetPanel,
			p = t.parent,
			c;
		p.children = [];
		for(var i=0;i<20;i++){
			c = Views.clone(t);
			p.addChild(c);
			c.children[0].cache(0,0,455,153);
		}
		v.returnBtn.onClick = function(){
			App.runScene(new HeroUpdateSceneCtrl().getView());
		};
		v.yesBtn.onClick = function(){
			var ctrl = new HeroUpdateSceneCtrl();
			App.runScene(ctrl.getView());
			ctrl.animate();
		};
	}
});
var HeroListSceneCtrl = BaseCtrl.extend({
	init: function(){
		var v = this.createView('HeroListScene');
	}
});
var DrinkSceneCtrl = BaseCtrl.extend({
	init: function(){
		var v = this.createView('DrinkScene');
	}
});
var SpellSceneCtrl = BaseCtrl.extend({
	init: function(){
		var v = this.createView('SpellScene');
	}
});
var CageSceneCtrl = BaseCtrl.extend({
	init: function(){
		var v = this.createView('CageScene');
	}
});
var EquipSceneCtrl = BaseCtrl.extend({
	init: function(){
		var v = this.createView('EquipScene');
	}
});

var BattleSceneCtrl = BaseCtrl.extend({
	speed:1.5,
	init: function(){
		var v = this.createView('BattleScene');
		v.onEnter = function(e){
			cy.Sound.stop('res/home_background.mp3');
			cy.Sound.play('res/fight_background.mp3', { loop:true });
		};
		v.onExit = function(e){
			cy.Sound.stop('res/fight_background.mp3');	
			cy.Sound.play('res/home_background.mp3', { loop:true });
		};
		this.initRoles();
	},
	action: function(){
		var v = this.v,
			d = this.data.shift();
		if (!d) {
			
			setTimeout(function(){
				var resultCtrl = new SuccessPanelCtrl();
				v.addChild(resultCtrl.getView());
			},500);
			
			return;
		}
		switch(d.type) {
			case 'attack':
				this.attack(d.role, d.target);
				break;
			case 'remoteAtk':
				this.remoteAtk(d.role, d.target);
				break;
			case 'spell':
				this.spell(d.role, d.target);
				break;
			case 'buff':
				this.buff(d.role, d.target);
				break;
			case 'movie':
				this.movie(d.role, d.target);
				break;
		}
	},
	initRoles: function(){
		var v = this.v,
			o = this,
			p = v.battleRolePanel,
			c = p.children;
		this.data = [
			{type:'movie', role:c[0], target:c[3] },
			{type:'attack', role:c[0], target:c[3] },
			{type:'attack', role:c[3], target:c[0] },
			{type:'remoteAtk', role:c[2], target:c[3] },
			{type:'attack', role:c[4], target:c[0] },
			{type:'remoteAtk', role:c[1], target:c[4] },
			{type:'attack', role:c[5], target:c[2] },
			{type:'buff', role:c[0], target:c[0]},
			{type:'attack', role:c[3], target:c[0] },
			{type:'remoteAtk', role:c[2], target:c[3] },
			{type:'attack', role:c[4], target:c[0] },
			{type:'spell', role:c[1], target:[c[3],c[4],c[5]]}
		];
		// v.speedLbl.useGradient(App.stage.canvas.getContext('2d'));
		// v.speedLbl.on('click', function(){
			// if(o.speed === 1.5){
				// o.speed = 2;	
			// } else if(o.speed === 2) {
				// o.speed = 1;
			// } else {
				// o.speed = 1.5;
			// }
			// v.speedLbl.text = 'x '+o.speed;
		// });
		this.action();
	},
	attack: function(role, target){
		var bmp = role.children[1],
			bmp1 = target.children[1],
			T = cy.Tween,
			o = this;
		var bmpX = bmp.x,
			bmpY = bmp.y;
		T.get(bmp).to({ x: bmpX-20, alpha:0}, 400/o.speed).call(function(){
			role.parent.addChild(bmp);
			bmp.x = target.x-60;
			bmp.y = target.y-50;
			T.get(bmp).to({x: target.x+20, alpha:1},200/o.speed).wait(150/o.speed).call(function(){
				T.get(bmp).to({ alpha:0},400/o.speed).to({ x:bmpX, y:bmpY });
				var s = Views.get('Attack');
				s.x = target.x;
				s.y = target.y;
				s.gotoAndPlay('all');
				target.parent.addChild(s);
				s.on('animationend', function(){
					s.parent.removeChild(s);
					T.get(target).to({x:target.x+10},60/o.speed).to({x:target.x},60/o.speed);
					T.get(bmp1).to({x:bmp1.x+6},60/o.speed).to({x:bmp1.x-6},60/o.speed).to({x:bmp1.x+4},60/o.speed).to({x:bmp1.x-4},60/o.speed).to({x:bmp1.x},60/o.speed).call(function(){
						var dmg = Views.getBitmapText(target.equip?'-5':'-300');
						dmg.x = target.x;
						dmg.regX = dmg.getBounds().width/2;
						dmg.y = target.y-70;
						target.parent.addChild(dmg);
						T.get(dmg).to({ scaleX:1.2, scaleY:1.2},20/o.speed).to({ scaleX:1.3, scaleY:1.3},20/o.speed).to({ scaleX:1.4, scaleY:1.4},10/o.speed).to({ scaleX:1, scaleY:1},40/o.speed).to({ y:dmg.y-40 },400/o.speed).call(function(){
							bmp.alpha = 1;
							role.addChildAt(bmp,1);
							dmg.parent.removeChild(dmg);
							o.action();
						});
					});
				});
			});
		});
	},
	remoteAtk: function(role, target){
		var bmp = role.children[1],
			bmp1 = target.children[1],
			T = cy.Tween,
			o = this,
			s;
		T.get(bmp).to({x:bmp.x-30,rotation:-15},200/o.speed).call(function(){
			s = Views.get('Fire');
			s.x = role.x;
			s.y = role.y-50;
			s.scaleX = s.scaleY = 0.5;
			s.compositeOperation = 'lighter';
			role.parent.addChild(s);
			s.gotoAndPlay('all');
			T.get(s).to({scaleX:1, scaleY:1},100/o.speed).call(function(){
				T.get(bmp).to({x:bmp.x+30,rotation:0},100/o.speed).call(function(){
					T.get(s).to({ x:target.x, y:target.y-50},400/o.speed,cy.Ease.quartIn)
					 .to({scaleX:1.5, scaleY:1.5},100/o.speed)
					 .to({scaleX:1, scaleY:1},100/o.speed).call(function(){
						s.parent.removeChild(s);
						T.get(target).to({x:target.x+10},60/o.speed).to({x:target.x},60/o.speed);
						T.get(bmp1).to({x:bmp1.x+20,rotation:20},100/o.speed).to({x:bmp1.x,rotation:0},100/o.speed).call(function(){
							var dmg = Views.getBitmapText('-300');
							dmg.x = target.x;
							dmg.regX = dmg.getBounds().width/2;
							dmg.y = target.y-70;
							target.parent.addChild(dmg);
							T.get(dmg).to({ scaleX:1.2, scaleY:1.2},20/o.speed).to({ scaleX:1.3, scaleY:1.3},20/o.speed).to({ scaleX:1.4, scaleY:1.4},10/o.speed).to({ scaleX:1, scaleY:1},40/o.speed).to({ y:dmg.y-40 },400/o.speed).call(function(){
								dmg.parent.removeChild(dmg);
								o.action();
							});
						});
					});
				});
			});
		});
	},
	spell: function(role, target){
		var bmp = role.children[1],
			T = cy.Tween,
			o = this,
			s;
		T.get(bmp).to({scaleX:bmp.scaleX*1.2, scaleY:bmp.scaleY*1.2},100/o.speed).wait(100/o.speed).to({scaleX:bmp.scaleX, scaleY:bmp.scaleY},100/o.speed).call(function(){
			s = Views.get('Cast');
			s.x = role.x;
			s.y = role.y-50;
			s.speed = o.speed;
			s.gotoAndPlay('all');
			s.compositeOperation = 'lighter';
			role.parent.addChild(s);
			T.get(s).wait(1000/o.speed).to({alpha:0},200/o.speed).call(function(){
				s.parent.removeChild(s);
				target.forEach(function(a, i){
					var ss = Views.get('Storm');
					ss.x = a.x;
					ss.y = a.y;
					ss.gotoAndPlay('all');
					a.parent.addChild(ss);
					ss.count = 0;
					ss.on('animationend', function(){
						ss.count++;
						if(ss.count===2){
							ss.parent.removeChild(ss);
							var bmp1 = a.children[1];
							T.get(a).to({x:a.x+10},60/o.speed).to({x:a.x},60/o.speed);
							T.get(bmp1).to({x:bmp1.x+20,rotation:20},100/o.speed).to({x:bmp1.x,rotation:0},100/o.speed).call(function(){
								var dmg = Views.getBitmapText('-980');
								dmg.x = a.x;
								dmg.regX = dmg.getBounds().width/2;
								dmg.y = a.y-70;
								a.parent.addChild(dmg);
								T.get(dmg).to({ scaleX:1.2, scaleY:1.2},20/o.speed).to({ scaleX:1.3, scaleY:1.3},20/o.speed).to({ scaleX:1.4, scaleY:1.4},10/o.speed).to({ scaleX:1, scaleY:1},40/o.speed).to({ y:dmg.y-40 },400/o.speed).call(function(){
									dmg.parent.removeChild(dmg);
									var f = new createjs.ColorMatrixFilter([
										0.33,0.33,0.33,0,0, // red
										0.33,0.33,0.33,0,0, // green
										0.33,0.33,0.33,0,0, // blue
										0,0,0,1,0  // alpha
									]);
									a.filters = [f];
									a.cache(-61,-81,61*4,81*4);
									a.alpha = 0.8;
									if(i===0){
										o.action();
									}
								});
							});
						}
					});
				});
			});
		});
	},
	buff: function(role, target){
		var bmp = role.children[1],
			T = cy.Tween,
			o = this,
			s;
		T.get(bmp).to({scaleX:bmp.scaleX*1.2, scaleY:bmp.scaleY*1.2},100/o.speed).wait(100/o.speed).to({scaleX:bmp.scaleX, scaleY:bmp.scaleY},100/o.speed).call(function(){
			s = Views.get('Wall');
			s.scaleX = s.scaleY = 1.2;
			s.x = role.x;
			s.y = role.y-50;
			s.gotoAndPlay('all');
			s.compositeOperation = 'lighter';
			role.parent.addChild(s);
			role.equip = true;
			setTimeout(function(){
				s.parent.removeChild(s);
			},10000);
			
		}).wait(400/o.speed).call(function(){
			o.action();
		});
	},
	movie: function(role, target){
		var v = this.v,
			o = this,
			T = cy.Tween;
		v.battleRolePanel.visible = false;
		v.battleMoviePanel.visible = true;
		if(!v.buffSs){
			v.buffSs = Views.get('Buff');
			v.buffSs.gotoAndPlay('all');
			v.buffSs.x = 200;
			v.buffSs.y = 412;
			v.buffSs.scaleX = v.buffSs.scaleY = 1.5;
			v.battleMoviePanel.addChild(v.buffSs);
			var swodSs = Views.get('Swod');
			swodSs.x = v.buffSs.x;
			swodSs.y = v.buffSs.y;
			swodSs.gotoAndPlay('all');
			swodSs.scaleX = swodSs.scaleY = 2;
			v.battleMoviePanel.addChild(swodSs);
		}
		
		T.get(v.role00).to({x:-200}).to({x:20},200).to({x:60},1600);
		T.get(v.roleLbl00).to({x:560}).to({x:360},200).to({x:320},1600);
		T.get(v.role01).to({x:680}).to({x:390},200).to({x:350},1600);
		T.get(v.roleLbl01).to({x:-140}).to({x:60},200).to({x:100},1600).wait(600).call(function(){
			v.battleRolePanel.visible = true;
			T.get(v.battleMoviePanel).to({alpha:0},400).call(function(){
				v.battleMoviePanel.visible = false;
				o.action();
			});
		});
	}
});

var SuccessPanelCtrl = BaseCtrl.extend({
	init: function(){
		var v = this.createView('SuccessPanel');
		v.resize = function(w, h){ 
			v.y = (h-556)/2; 
		};
		v.y = - 606;
		cy.Tween.get(v).to({y:(App.viewport.height-556)/2},300,cy.Ease.quartIn);
		cy.Tween.get(v.growLbl, {loop:true}).to({highlight:1, scaleX:1.2, scaleY:1.2},500).to({highlight:0, scaleX:1, scaleY:1},500);
		v.yesBtn.onClick = function(){
			App.runScene(new MainSceneCtrl().getView()); 
		};
	}
});

var LoginSceneCtrl = BaseCtrl.extend({
	init: function(){
		var v = this.createView('LoginScene');
		v.resize = function(w, h){ 
			v.enterBtn.y = h - 201; 
			v.tipLbl.y = h - 68;
			v.progressLbl.y = h - (850-663);
		};
		v.resize(v.width, App.viewport.height);
		v.enterBtn.onClick =  function(e) {
			App.runScene(new MainSceneCtrl().getView()); 
			cy.Sound.play('res/home_background.mp3', { loop:true });
		};
		v.tipLbl.border = new cy.Shadow('#FFF',0,0,0);
		this.animate();
	},
	animate: function(){
		var v = this.v,
			mc = new cy.MovieClip(null, 0, true, null);
		mc.addChild(v.lbl01,v.lbl02,v.lbl03,v.lbl04);
		v.logoBg.compositeOperation = 'lighter';
		v.lbl04.children[2].alpha = 0;
		v.lbl04.children[2].compositeOperation = 'lighter';
		mc.timeline.addTween(
			cy.Tween.get(v.lbl01).wait(10).to({scaleX:0.4,scaleY:0.4},6).to({scaleX:0.8,scaleY:0.8},6)
		);
		mc.timeline.addTween(
			cy.Tween.get(v.lbl01.children[1]).wait(22).to({highlight:1},12).to({highlight:0},12).to({highlight:1},12).to({highlight:0},12)
		);
		mc.timeline.addTween(
			cy.Tween.get(v.lbl02).wait(20).to({scaleX:0.4,scaleY:0.4},6).to({scaleX:0.8,scaleY:0.8},6)
		);
		mc.timeline.addTween(
			cy.Tween.get(v.lbl02.children[1]).wait(32).to({highlight:1},12).to({highlight:0},12).to({highlight:1},12).to({highlight:0},12)
		);
		mc.timeline.addTween(
			cy.Tween.get(v.lbl03).wait(30).to({scaleX:0.4,scaleY:0.4},6).to({scaleX:0.8,scaleY:0.8},6)
		);
		mc.timeline.addTween(
			cy.Tween.get(v.lbl03.children[1]).wait(42).to({highlight:1},12).to({highlight:0},12).to({highlight:1},12).to({highlight:0},12)
		);
		mc.timeline.addTween(
			cy.Tween.get(v.lbl04).wait(40).to({scaleX:0.4,scaleY:0.4},6).to({scaleX:0.8,scaleY:0.8},6).wait(150)
		);
		mc.timeline.addTween(
			cy.Tween.get(v.lbl04.children[1]).wait(52).to({highlight:1},12).to({highlight:0},12).to({highlight:1},12).to({highlight:0},12)
		);
		mc.timeline.addTween(
			cy.Tween.get(v.lbl04.children[2]).wait(52).to({alpha:1, rotation:90},12).to({alpha:1, rotation:180},12).to({alpha:0, rotation:270},12).to({rotation:0})
		);
		v.addChild(mc);
		
		var mc2 = Views.get('MC');
		mc2.createTween(mc2.data);
		mc2.gotoAndPlay(0);
		v.addChild(mc2);
		
		var mc3 = Views.get('Hunter');
		mc3.createTween(mc3.data);
		mc3.gotoAndPlay(0);
		mc3.scaleX = mc3.scaleY = 0.3;
		v.addChild(mc3);
		
		var s2 = Views.get('S2');
		s2.gotoAndPlay('atk');
		v.addChild(s2);
	}
});
