
var audioEngine = cc.audioEngine;

var msgHandler;

var wsClient = null;

var MUSIC_HOME = "res/home_background.mp3",
	MUSIC_FIGHT = "res/fight_background.mp3";

var soundId = -1;

var DEBUG = false;

var RoleInfo = cc.Class.extend({
	ctor: function () {
		this.id = 999;
	},
	update: function(data){
		this.id = data[0];
	}
});

var roleInfo = new RoleInfo();

var currentCtrl = null;

var MainController = ccp.BaseComponent.extend({
	onEnter: function(){
		msgHandler = new MsgHandler(g_protocols);
		cc.log("Enter Main Scene~~~~~~~~~~~~~~~");
		
		var v = this.getOwner(),
			ads = v.query('address'),
			btn = v.query('loginBtn'),
			lbl = v.query('nameLbl');
			
		var url = "ws://10.6.192.218:8080/websocket";
		
		ads.setText(url);
		ads.setMaxLength(100);
		wsClient = new ccp.WSClient(url, msgHandler);
		// wsClient = {
			// connected: false,
			// send: function(){}
		// };
		btn.onClick = function(){
		    // gameStage.replaceScene("SelectRoleScene");
		    // return;
			if (wsClient.connected) {
				var name = lbl.getStringValue();
				if (name) {
					Alert("确认以此账号名登陆？", function(){
						ccp.Notification.notify("userLogin", { name: name });
					});
				} else {
					Alert("账号名不能为空！");
				}
			} else {
				// wsClient._address = v.query('address').getStringValue();
				// wsClient.connect();
				ccp.Notification.notify("getMapInfoEcho", { name: name });
			}
		};
	}
});

ccp.Notification.register("userLogin", function(data){
	wsClient.send({
		type: 'userLogin', data: [ data.name, data.name ] });
});

ccp.Notification.register("userLoginEcho", function(data){
	var sucess = data[0];
	if (sucess === 1) {
		wsClient.send({ type: 'getUserInfo', data: [] });
	} else if(sucess === 2) {
		wsClient.send({ type: 'createRole', data: [ 2 ] });
	}
});

ccp.Notification.register("createRoleEcho", function(data){
	currentCtrl = new SelectRoleSceneCtrl();
	currentCtrl.update(data);
	gameStage.replaceScene(currentCtrl.getView());
});

ccp.Notification.register("getUserInfoEcho", function(data){
	roleInfo.update(data);
	wsClient.send({ type: 'resetScene', data: [ 1,0,0 ] });
});

ccp.Notification.register("resetSceneEcho", function(data){
	wsClient.send({ type: 'getMapInfo', data: [ 1,0 ] });
});


