
ccp.Notification.register("getMapInfoEcho", function(data){
	gameStage.replaceScene("AreaScene");
	
	gameStage.currentScene.getComp("main").onData(data);

	wsClient.send({ type: 'getRoles', data: [1, 0, 0] });
});

ccp.Notification.register("getRolesEcho", function(data){
	var list = data[0],
		ctrl = gameStage.currentScene.getComp("main");
	 
	list.forEach(function(a, i){
		ctrl.addRole({
			id: a[0],
			name: a[1],
			anim: "Zhaoyun",
			pos: (a[5]==10||a[5]==-1)?cc.p(450, 250):cc.p(a[5],a[6]),
			state: "stand2"
		});
	});
	
	ctrl.sort();
	ctrl.lock();
});

ccp.Notification.register("updatePositionEcho", function(data){
	gameStage.currentScene.getComp("main").updatePosition(data);
});

ccp.Notification.register("addRoleEcho", function(data){
	data = data[3];
	gameStage.currentScene.getComp("main").addRole({
		id: data[0],
		name: data[1],
		anim: "Zhaoyun",
		pos: cc.p(data[5], data[6]),
		state: "stand2"
	});
});

ccp.Notification.register("removeRoleEcho", function(data){
	gameStage.currentScene.getComp("main").removeRole(data[3]);
});

var AreaSceneController = ccp.BaseComponent.extend({
	
	onEnter: function(){
		cc.log("Enter Scene~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
		
		var owner = this.getOwner();
			o = this;
			
		audioEngine.stopMusic();
		audioEngine.playMusic(MUSIC_HOME, true);
		
		this.sceneUI = owner.query('sceneUI');
		this.sceneDialog = owner.query('sceneDialog');
		
		this.map = owner.query('map');
		this.tiles = owner.query('tiles');
		this.entities = owner.query('entities');

		this.map.onClick = function(){
			var pos = this.getPosition(),
				end = this.getTouchEndPos(),
				endPos = cc.p(Math.floor(end.x-pos.x), Math.floor(end.y-pos.y)),
				role = o.role;
				
			if (!role) {
				role = o.role = o.addRole({
					id: -1,
					name: "赵云",
					anim: "Zhaoyun",
					pos: cc.p(450, 300), //cc.p(a[5]*50,a[6]*50),
					state: "stand2"
				});
				role.getComp("main").isLeadingRole = true;
			}
			
			var startPos = role.getPosition();
			
			if (o.search(cc.p(Math.floor(startPos.x),Math.floor(startPos.y)), endPos)) {
				o.cursor(endPos);
			}

			o.toggleDialog(false);
		};
		
		this.sceneUI.query('chargeBtn').onClick = function(){
			cc.log(this.getSize().width);
			cc.log(this.getVirtualRenderer().getContentSize().width);
		};
		this.sceneUI.query('taskBtn').onClick = function(){
			cc.log(this.getSize().width);
			cc.log(this.getVirtualRenderer().getContentSize().width);
		};
		this.sceneUI.query('enterWorld').onClick = function(){
			gameStage.replaceScene("WorldScene");
		};
		this.sceneUI.query('otherBtn').onClick = function(){
			gameStage.replaceScene("BattleScene");
		};
		
		var ui = this.sceneUI.getChildren();
		ui[2].onClick = ui[3].onClick = ui[4].onClick = function(){
			o.getOwner().addView(gameViews.create("ActivityList"));
		};
		ui[5].onClick = function(){
			ccp.ajax({
				url: 'http://10.6.192.218:3000/ajax-test',
				type: 'post',
				data: {
					name: o.sceneUI.query('nameLbl').getStringValue()
				},
				dataType: 'json'
			}).call(function(data){
				cc.log(data);
			});
		};
		ui[6].onClick = function(){
			o.addRoles();
			cc.log(ui[6].getSize().width);
			cc.log(ui[6].getVirtualRenderer().getContentSize().width);
		};
		this.resize();
		this.initMap();
		// this.addRole({ id: roleInfo.id, name:"路人甲", anim: "Zhaoyun", pos: cc.p(450,350), state:"stand2" });
		this.addNpcs();
		
		this.toggleDialog(false);
	},
	
	onData: function(data) {
		
	},
	
	focus: function(role) {
		this.sort(role);
		this.lock(role);
	},
	
	updatePosition: function(data){
		var str = data[data.length-1],
			path = this.finder.pathToArray(str),
			role = this.roles[data[3]],
			rearch = data[8],
			posPath = [],
			tw = this.tw, 
			th = this.th,
			pos = null;

		if (!role) return;
		
		var p0 = role.getPosition(),
			p1 = cc.p(data[4], data[5]);
		
		if ((Math.abs(p1.x-p0.x) + Math.abs(p1.y-p0.y)) > 100) {
			role.setPosition(p1);
		}
		
		path.forEach(function(a, i){
			if (i===path.length-1) {
				if (rearch) {
					pos = cc.p(data[6], data[7]);
				} else {
					pos = cc.p([a.y+0.5]*tw, [a.x+0.5]*th);
				}
			} else {
				pos = cc.p([a.y+0.5]*tw, [a.x+0.5]*th);
			}
			posPath.push(pos);
		}); 
		role.getComp("main").path = posPath;
	},
	
	addRole: function(data){
		var role = createEntityRole(data),
			roleCtrl = role.getComp("main");

		roleCtrl.speed = 3;
		
		this.entities.addView(role);		
		
		this.roles = this.roles || {};
		this.roles[roleCtrl.roleId] = role;
		
		if (roleCtrl.roleId === roleInfo.id) {
			roleCtrl.isLeadingRole = true;
		}
		return role;
	},
	
	removeRole: function(id){
		var role = this.roles[id];
		if(!role) return;
		this.entities.removeView(role);
		this.roles[id] = null;
	},
	
	addNpcs: function(){
		this.addNpc({
			id:Math.random(), name:"路人甲", anim:'Nvyao', pos: cc.p(450, 299)
		});
		this.addNpc({
			id:Math.random(), name:"路人甲", anim:'Xiaoqiao', pos: cc.p(1150, 799)
		});
		this.addNpc({
			id:Math.random(), name:"路人甲", anim:'Sunce', pos: cc.p(1150, 299)
		});
		this.addNpc({
			id:Math.random(), name:"路人甲", anim:'Qianmian', pos: cc.p(450, 1099)
		});
	},
	
	addNpc: function(data) {
		var npc = createEntityNpc(data);
		npc.getComp("main").bindTouchEvent(this.handleNpcEvent, this); 
		this.entities.addView(npc);
	},
	
  	handleNpcEvent: function(sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            	this.toggleDialog(true);
                break;
            default:
                break;
        }
  	},
  		
	cursor: function(p) {
		var cursor = gameViews.create('Cursor'),
			tiles = this.tiles;
		cursor.setPosition(p);
		cursor.playAnimation('all');
		cursor.onAnimationEnd = this.cursorEnd;
		tiles.addView(cursor);
	},
	
	cursorEnd: function(){
		this.getParentView().removeView(this);
		return true;
	},
	
	search: function(p0, p1){
		var finder = this.finder,
			tw = this.tw,
			th = this.th,
			endX = Math.floor(p1.y/th),
			endY = Math.floor(p1.x/tw);
			
		finder.setStartNode(Math.floor(p0.y/th), Math.floor(p0.x/tw));
		finder.setEndNode(endX, endY);
		
		var path = finder.getPath();
		if (path.length > 0) {
			var rearch = (finder.graph.nodes[endX][endY]===path[path.length-1])?1:0;
			if (wsClient && wsClient.connected) {
				wsClient.send({ type: 'updatePosition', data: [ 1, 0, 0, roleInfo.id, p0.x, p0.y, p1.x, p1.y, rearch, 4.5, finder.pathToString(path) ]});
			} else {
				ccp.Notification.notify("updatePositionEcho",[ 1, 0, 0, -1, p0.x, p0.y, p1.x, p1.y, rearch, 4.5, finder.pathToString(path) ]);
			}
			return true;
		}
		return false;
	},
	
	initMap: function(){
		var tw = 50,
			th = 50;
		var data = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],[0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,1,1,0,0,1,1,1,1,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,1,1],[0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1],[0,0,1,1,1,1,1,1,1,0,1,0,1,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1],[0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0],[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
		
		// var data = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1],[0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1,1,1,1,1],[0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1,1],[0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,0,1,1,1,1,1,1,0,0,0,1,1],[0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1],[0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,0,1,1],[0,0,0,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],[0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1],[0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,0,1,1],[0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,1,1,1,1,0,1,1],[0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],[0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[0,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
		// for (var j=0;j<1512/th;j++) {
			// data[j] = [];
			// for (var i=0;i<1728/tw;i++) {
				// data[j][i] = 1;
			// }
		// }
		this.finder = new ccp.PathFinder(data);
		this.tw = tw;
		this.th = th;
		
		if (DEBUG) {
			window.data = data;
		}

		var tile, map = this.map, 
			size = map.getSize();
		
		if (DEBUG) 
		for(var j=0,jl=size.height/th;j<jl;j++) {
			for(var i=0,l=size.width/tw;i<l;i++) {
				tile = ccs.Layout.create();
					tile.setSize(cc.size(tw-10, th-10));
					tile.setPosition(cc.p(i*tw, j*th));
					tile.setBackGroundColorOpacity(50);
		    		tile.setBackGroundColorType(ccs.LayoutBackGroundColorType.solid);
		    		// tile.setTouchEnabled(true);
		    		tile.addTouchEventListener(this.handleTouchEvent, tile);
		    		tile.define('data', data);
		    		tile.define('i', i);
		    		tile.define('j', j);
		    		map.addView(tile);
				if (data[j][i] === 0) {
					tile.setBackGroundColor(cc.c3b(255,0,0));
				} else {
					tile.setBackGroundColor(cc.c3b(0,255,0));
				}
		 	}
		}
	},
	
	toggleDialog: function(able){
		if (able) {
			this.sceneDialog.setVisible(true);
			this.sceneDialog.setTouchEnabled(true);
		} else {
			this.sceneDialog.setVisible(false);
			this.sceneDialog.setTouchEnabled(false);
		}
	},
	
	handleTouchEvent: function(sender, type) {
        switch (type) {
            case ccs.TouchEventType.began:
                break;
            case ccs.TouchEventType.moved:
                break;
            case ccs.TouchEventType.ended:
            	var data = this.query('data'),
            		i = this.query('i'),
            		j= this.query('j');
            	if (data[j][i] === 1) {
            		data[j][i] = 0;
            		this.setBackGroundColor(cc.c3b(255,0,0));
            	} else {
            		data[j][i] = 1;
            		this.setBackGroundColor(cc.c3b(0,255,0));
            	}
                break;
            case ccs.TouchEventType.canceled:
                break;
            default:
                break;
        }
  	},
  	
	resize: function(){
		var v = this.getOwner(),
			ui = this.sceneUI.getChildrenView();
		this.sceneDialog.setSize(cc.size(gameStage.getSize().width, 180));
		
		ui[0].setPosition(cc.p(0, gameStage.getSize().height-83));
		ui[1].setPosition(cc.p(gameStage.getSize().width-358, gameStage.getSize().height-81));
		ui[2].setPosition(cc.p(0, gameStage.getSize().height-540+360));
		ui[3].setPosition(cc.p(0, gameStage.getSize().height-540+272));
		
		ui[4].setPosition(cc.p(gameStage.getSize().width-73, gameStage.getSize().height-540+360));
		ui[5].setPosition(cc.p(gameStage.getSize().width-73, gameStage.getSize().height-540+272));
		ui[6].setPosition(cc.p(gameStage.getSize().width-73, gameStage.getSize().height-540+189));
		ui[7].setPosition(cc.p(gameStage.getSize().width-73, gameStage.getSize().height-540+104));
	},
	
	lock: function(role){
		var map = this.map,
			p2 = map.getPosition(),
			size = map.getContentSize();			
		p0 = role.getPosition();
		var screenX = p0.x+p2.x,
			screenY = p0.y+p2.y;
		dx = gameStage.getSize().width/2 - screenX;
		dy = gameStage.getSize().height/2 - screenY;	
		var mapX = p2.x+dx,
			mapY = p2.y+dy;
		if (mapX>0) {
			mapX = 0;
		} else if(mapX<-(size.width-gameStage.getSize().width)) {
			mapX = -(size.width-gameStage.getSize().width);
		}
		if (mapY>0) {
			mapY = 0;
		} else if(mapY<-(size.height-gameStage.getSize().height)) {
			mapY = -(size.height-gameStage.getSize().height);
		}
		map.setPosition(cc.p(mapX, mapY));
	},
	
	sort: function(role){
		var entities = this.entities.getChildrenView();
		entities.sort(function(a, b){
			var dy = b.getPosition().y - a.getPosition().y;
			if (dy===0) return b.getPosition().x - a.getPosition().x;
			return dy;
		});
		entities.forEach(function(a, i){
			a.setLocalZOrder(i);
		});
	},
	
	addRoles: function(){
		var role, sprite, map = this.map,
			list = ['Nvyao', 'Xiaoqiao', 'Sunce', 'Qianmian'],
			w = map.getSize().width,
			h = map.getSize().height,
			pos;
		var n = 200; 
		for(var i=0;i<n;i++){
			pos = cc.p(Math.floor(Math.random()*w), Math.floor(Math.random()*h));
			this.addNpc({
				id: Math.random(), name:"路人甲", anim: list[i%4], pos: pos
			});
		}
	}
});