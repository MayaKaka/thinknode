var showcase = {
	clock: {
		renderInCanvas: true,
		
		init: function(parent, ct) {
			this.parent = parent;
			this.ticker = new ct.Ticker();
			
			var ticker = this.ticker;
			var bg = new ct.Shape({
				renderInCanvas: true,
				graphics: { type: 'rect', fill: 'center,#888,#000', width: 800, height: 480 }
			});
			
			var clock = new ct.DisplayObject({
				renderInCanvas: true, x: 400-100, y: 240-100
			})
			clock.addChild(new ct.Shape({
				renderInCanvas: true,
				graphics: { type: 'circle', fill: '#DDD', radius: 100 }
			}));
			clock.addChild(new ct.Shape({
				renderInCanvas: true,
				graphics: { type: 'circle', stroke: '#444', radius: 100, lineWidth: 5 }
			}));
			clock.addChild(new ct.Shape({
				renderInCanvas: true, x: 6, y: 6,
				graphics: { type: 'circle', stroke: 'rgba(0,0,0,0.2)', radius: 94, lineWidth: 6 }
			}));
			
			parent.addChild(bg);
			parent.addChild(clock);
			ticker.add(parent);
			ticker.start();
		},
		
		dispose: function() {
			this.ticker.stop();
			this.parent.removeAllChildren();
		}
	},
	
	drawboard: {
		renderInCanvas: true,
		
		init: function(parent, ct) {
			this.parent = parent;
			this.ticker = new ct.Ticker();
			
			var ticker = this.ticker;
			var bg = new ct.Shape({
				renderInCanvas: true,
				graphics: { type: 'rect', fill: '#FFF', width: 800, height: 480 }
			});
			
			parent.addChild(bg);
			ticker.add(parent);
			ticker.start();
		},
		
		dispose: function() {
			this.ticker.stop();
			this.parent.removeAllChildren();
		}
	},
	
	weather: {
		renderInCanvas: true,
		
		init: function(parent, ct) {
			this.parent = parent;
			this.ticker = new ct.Ticker();
			
			var ticker = this.ticker;
			var bg = new ct.Shape({
				renderInCanvas: true,
				graphics: { type: 'rect', fill: 'top,#66D,#AAF', width: 800, height: 480 }
			});
			
			parent.addChild(bg);
			ticker.add(parent);
			ticker.start();
		},
		
		dispose: function() {
			this.ticker.stop();
			this.parent.removeAllChildren();
		}	
	},
	
	qixi: {
		renderInCanvas: false,
		
		init: function(parent, ct) {
			
		},
		
		dispose: function() {
			
		}		
	},
	
	runner: {
		renderInCanvas: false,
		
		init: function(parent, ct) {
			
		},
		
		dispose: function() {
			
		}
	},
	
	box3d: {
		renderInCanvas: false,
		
		init: function(parent, ct) {
			
		},
		
		dispose: function() {
			
		}		
	},
	
	filter: {
		renderInCanvas: true,
		
		init: function(parent, ct) {
			this.parent = parent;
			this.ticker = new ct.Ticker();
			
			var ticker = this.ticker;
			var bmp = new ct.Bitmap({
				renderInCanvas: true,
				width: 800, height: 480, image: 'images/flower.jpg'
			});
			
			parent.addChild(bmp);
			ticker.add(parent);
			ticker.start();
		},
		
		dispose: function() {
			this.ticker.stop();
			this.parent.removeAllChildren();
		}		
	},
	
	eggs: {
		renderInCanvas: false,
		
		init: function(parent, ct) {
			
		},
		
		dispose: function() {
			
		}	
		
	}
	
}
