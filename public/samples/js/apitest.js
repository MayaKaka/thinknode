var apitest = {
	transform2d: {
		init: function(ct, dom, cvs, $fps) {
			var ticker = new ct.Ticker();

			var	rect = new ct.Shape({
				x: 10, y: 36, 
				graphics: { type: 'rect', fill: 'top,#0022FF,#00DDFF', width: 60, height: 60 } 
			});	
			rect.on('click', function(e){
				console.log(e);
			})
			dom.addChild(rect);
			
			var rect_cvs = new ct.Shape({
				renderMode: 1,
				x: 10, y: 36, 
				graphics: { type: 'rect', fill: 'top,#0022FF,#00DDFF', width: 60, height: 60 } 
			});
			rect_cvs.on('click', function(e){
				console.log(e);
			})
			cvs.addChild(rect_cvs);
			
			
			var animate = function() {
				rect.to(400).to({ x: 400 }, 400)
					.to(400).to({ y: 200 }, 400)
					.to(400).to({ x: 200 }, 400)
					.to(400).to({ transform: { scale: 3 } }, 400)
					.to(400).to({ transform: { rotate: 360 } }, 400)
					.to(400).to({ transform: { rotate: 0 } }, 400)
					.to(400).to({ transform: { scale: 1 } }, 400);
				
				rect_cvs.to(400).to({ x: 400 }, 400)
					.to(400).to({ y: 200 }, 400)
					.to(400).to({ x: 200 }, 400)
					.to(400).to({ transform: { scale: 3 } }, 400)
					.to(400).to({ transform: { rotate: 360 } }, 400)
					.to(400).to({ transform: { rotate: 0 } }, 400)
					.to(400).to({ transform: { scale: 1 } }, 400);
			}
			
			ticker.add(ct.Tween);
			ticker.add(cvs);
			ticker.start();
			
			animate();
			
			this.dispose = function() {
				ticker.stop();
				dom.removeAllChildren();
				cvs.removeAllChildren();
			}
		}
	},

	transform3d: {
		init: function(ct, dom, cvs, $fps) {
			var ticker = new ct.Ticker();

			var	rect = new ct.Shape({
				x: 10, y: 36, z: 500,
				graphics: { type: 'rect', fill: 'top,#0022FF,#00DDFF', width: 60, height: 60 } 
			});	
			dom.addChild(rect);
			
			var rect_cvs = new ct.Shape({
				renderMode: 1,
				x: 10, y: 36, z: 500,
				graphics: { type: 'rect', fill: 'top,#0022FF,#00DDFF', width: 60, height: 60 } 
			});
			cvs.addChild(rect_cvs);
			
			
			var animate = function() {
				rect.to(400).to({ pos: { x: 200, y: 200 } }, 400)
					.to(400).to({ transform3d: { scaleX: 3, scaleY: 3 } }, 400)
					.to(400).to({ transform3d: { rotateX: 360 } }, 400)
					.to(400).to({ transform3d: { rotateY: 360 } }, 400)
					.to(400).to({ transform3d: { rotateZ: 360 } }, 400)
					.to(400).to({ transform3d: { rotateX: 0, rotateY: 0, rotateZ: 0, scaleX: 1, scaleY: 1 } }, 800);
				
				rect_cvs.to(400).to({ pos: { x: 200, y: 200 } }, 400)
					.to(400).to({ transform3d: { scaleX: 3, scaleY: 3 } }, 400)
					.to(400).to({ transform3d: { rotateX: 360 } }, 400)
					.to(400).to({ transform3d: { rotateY: 360 } }, 400)
					.to(400).to({ transform3d: { rotateZ: 360 } }, 400)
					.to(400).to({ transform3d: { rotateX: 0, rotateY: 0, rotateZ: 0, scaleX: 1, scaleY: 1 } }, 800);
			}
			
			ticker.add(ct.Tween);
			ticker.add(cvs);
			ticker.start();
			
			animate();
			
			this.dispose = function() {
				ticker.stop();
				dom.removeAllChildren();
				cvs.removeAllChildren();
			}
		}
	},
	
	transition: {
		init: function(ct, dom, cvs, $fps) {
			var ticker = new ct.Ticker();

			var	rect = new ct.Shape({
				x: 10, y: 36,
				graphics: { type: 'rect', fill: 'top,#0022FF,#00DDFF', width: 60, height: 60 } 
			});	
			dom.addChild(rect);
			
			var rect_cvs = new ct.Shape({
				renderMode: 1,
				x: 10, y: 36,
				graphics: { type: 'rect', fill: 'top,#0022FF,#00DDFF', width: 60, height: 60 } 
			});
			cvs.addChild(rect_cvs);
			
			
			var animate = function() {
				rect.to(400).to({ pos: { x: 200, y: 200 } }, 400)
					.to(400).to({ width: 150, height: 150 }, 400)
					.to(400).to({ alpha: 0 }, 400)
					.to(400).to({ alpha: 1 }, 400)
					.to(400).to({ fill: 'top,#00DDFF,#0022FF' }, 400)
					.to(400).to({ fill: 'top,#0022FF,#00DDFF' }, 400);
				
				rect_cvs.to(400).to({ pos: { x: 200, y: 200 } }, 400)
					.to(400).to({ width: 150, height: 150 }, 400)
					.to(400).to({ alpha: 0 }, 400)
					.to(400).to({ alpha: 1 }, 400)
					.to(400).to({ fill: 'top,#00DDFF,#0022FF' }, 400)
					.to(400).to({ fill: 'top,#0022FF,#00DDFF' }, 400);
			}
			
			ticker.add(ct.Tween);
			ticker.add(cvs);
			ticker.start();
			
			animate();
			
			this.dispose = function() {
				ticker.stop();
				dom.removeAllChildren();
				cvs.removeAllChildren();
			}
		}
	},
	
	ease: {
		init: function(ct, dom, cvs, $fps) {
			var ticker = new ct.Ticker();
			
			var ease = [
				'linear', 'swing',
				'easeIn', 'easeOut', 'easeInOut',
				'expoIn', 'expoOut', 'expoInOut',
				'bounceIn', 'bounceOut', 'bounceInOut',
				'elasIn', 'elasOut', 'elasInOut',
				'backIn', 'backOut', 'backInOut'
			];
			var color = [
				'#000000', '#ABCDEF',
				'#FF00FF', '#FF00FF', '#00FFFF',
				'#FFFF00', '#00FFFF', '#FF00FF',
				'#FF0000', '#00FF00', '#0000FF',
				'#44BB00', '#00BB44', '#4400BB',
				'#888800', '#008888', '#880088'				
			];
					
			var objs = [], obj, 
				lines = [], line;
			
			for (var i=0, l=ease.length; i<l; i++) {
				obj = new ct.Shape({
					x: 30*i+15, y: 36,
					graphics: { type: 'rect', fill: color[i], width: 20, height: 20 } 
				})
				dom.addChild(obj);
				
				line = new ct.Shape({
					renderMode: 1,
					x: 10, y: 200,
					graphics: { type: 'line', stroke: color[i], lineWidth: 2, path: [] } 
				})
				cvs.addChild(line);
				
				objs.push(obj);
				lines.push(line);
				
				obj.animate = function(idx) {
					this.to(400).to({ y: 450 }, {
						duration: 800,
						easing: ease[idx],
						step: function(p, pos) {
							lines[idx].path.push([500*p, 200*pos]);
						},
						callback: function(){
							if (idx) lines[idx].to({ alpha: 0.2 }, 400);
							idx++;
							objs[idx] && objs[idx].animate(idx);
						}
					})
				}
			}		
			
			var animate = function() {
				objs[0].animate(0);
			}
			
			ticker.add(ct.Tween);
			ticker.add(cvs);
			ticker.start();
			
			animate();
			
			this.dispose = function() {
				ticker.stop();
				dom.removeAllChildren();
				cvs.removeAllChildren();
			}
		}
	},
	
}
