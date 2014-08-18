
ccp.Notification.register("exportRoleEcho", function(data){
	if (data[0]) {
		wsClient.send({ type: 'getUserInfo', data: [] });	
	}
});

var SelectRoleSceneController = ccp.BaseComponent.extend({
	
	onEnter: function(){
		var o = this,
			v = this.getOwner(),
			selectLbl = v.query('selectLbl'),
			startBtn = v.query('startBtn');
			
		v.setPosition(cc.p(
			(gameStage.getSize().width-960)/2,0));
		startBtn.onClick = function(){
			var name = v.query("nameInput").getStringValue(),
				info = v.query("roleInfo");
		    if (wsClient && wsClient.connected) {
		        wsClient.send({ type: 'exportRole', data: [ name, info[0], info[1] ] });
		    }
		};
		v.query('role0').onClick = function() {
			selectLbl.setPosition(this.getPosition());
			o.roleInfo = [1,1];
		};
		v.query('role1').onClick = function() {
			selectLbl.setPosition(this.getPosition());
			o.roleInfo = [1,2];
		};
		v.query('role2').onClick = function() {
			selectLbl.setPosition(this.getPosition());
			o.roleInfo = [2,1];
		};
		v.query('role3').onClick = function() {
			selectLbl.setPosition(this.getPosition());
			o.roleInfo = [2,2];
		};
		
		audioEngine = cc.audioEngine;
        audioEngine.setEffectsVolume(0.5);
        audioEngine.setMusicVolume(0.5);
        audioEngine.playMusic(MUSIC_HOME, true);
        cc.log("play background music");
        
        this.roleInfo = [1,1];
        
        ccs.armatureDataManager.addArmatureFileInfo('res/SelectRole.ExportJson');
		var anim = ccs.Armature.create('SelectRole');
		anim.getAnimation("Stand").playWithIndex(0);
		anim.setPosition(cc.p(548, 370));
		window.a = anim;
		v.addViewAt(anim, 3);
	},
	
	onData: function(data) {
		var name = data[0];
		var input = this.getOwner().query("nameInput");
		input.setText(name);
	}
		
});