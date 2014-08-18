
(function() {
    "use strict";
    
var Camera = Class.extend({
	originX: 0, 
	originY: 0,
	
	init: function(originX, originY){
		if (originX!==undefined) this.originX = originX;
		if (originY!==undefined) this.originY = originY;
	},
	
	moveTo: function(x, y, delay){
		var o = this;
		cy.Tween.get(App.currentScene)
				.to({x:-x, y:-y}, delay||0)
		        .call(function(){
		        	o.originX = x;
		        	o.originX = y;
		        });
	},
	
	reset: function(){
		if(this.originX !==0) this.originX = 0;
		if(this.originY !==0) this.originY = 0;
	},
	
	focus: function(target, parent){
		var mtx = target.getConcatenatedMatrix(),
			dx = mtx.tx - App.viewport.width/2,
			dy = mtx.ty - App.viewport.height/2;
		parent.width = 1200;
		parent.height = 1200;
		parent.x = this.scope(-dx, App.viewport.width-parent.width, 0);
		parent.y = this.scope(-dy, App.viewport.height-parent.height, 0);
		console.log(dx, dy, parent.x, parent.y);
		// App.camera.focus(App.currentScene.children[3],App.currentScene);
	},
	
	scope: function(p, p1, p2){
		if (p<p1) {
			p = p1;
		} else if (p>p2) {
			p = p2;
		}
		return p;
	}
});

cy.Camera = Camera;

})();