
var AlertCtrl = function(msg, callback) {
	var view = this.getOwner();
	view.query('message').setText(msg);
	view.query('sure').onClick = function() {
		callback && callback();
		gameStage.currentScene.removeView(view);
	};
	gameStage.currentScene.addView(view);
};

