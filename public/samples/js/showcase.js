var showcase = {
	clock: {
		renderMode: 1,
		
		init: function(div, cvs, ct, $panel, $fps) {

		}
	},
	
	board: {
		renderMode: 1,
		
		init: function(div, cvs, ct, $panel, $fps) {
			
	},
	
	filter: {
		renderMode: 1,
		
		init: function(div, cvs, ct, $panel, $fps) {
			var ticker = new ct.Ticker(),
				bmp = new ct.Bitmap({ renderMode: 1, width: 800, height: 480, image: 'images/flower.jpg' }),
				bmp1 = new ct.Bitmap({ renderMode: 1, width: 800, height: 480, image: 'images/flower.jpg' }),
				bmp2 = new ct.Bitmap({ renderMode: 1, width: 800, height: 480, image: 'images/flower.jpg' }),
				bmp3 = new ct.Bitmap({ renderMode: 1, width: 800, height: 480, image: 'images/flower.jpg' }),
				bmp4 = new ct.Bitmap({ renderMode: 1, width: 800, height: 480, image: 'images/flower.jpg' });
				
			bmp1.applyFilter('brightness');
			bmp2.applyFilter('impression');
			bmp3.applyFilter('grayscale');
			bmp4.applyFilter('rilievo');
			
			cvs.addChild(bmp);
			cvs.addChild(bmp1);
			cvs.addChild(bmp2);
			cvs.addChild(bmp3);
			cvs.addChild(bmp4);
			
			var delay = 0;
			bmp4.to(delay+=3000).to({ alpha: 0},300);
			bmp3.to(delay+=3000).to({ alpha: 0},300);
			bmp2.to(delay+=3000).to({ alpha: 0},300);
			bmp1.to(delay+=3000).to({ alpha: 0},300);
			
			ticker.add(ct.Tween);
			ticker.add(cvs);
			ticker.add(function(){
				$fps.html(ticker.fps);
			});
			ticker.start();
			
			this.dispose = function() {
				ticker.stop();
				cvs.removeAllChildren();
			}
		}	
	},
	
	light: {
		renderMode: 1,
		
		init: function(div, cvs, ct, $panel, $fps) {
			var ticker = new ct.Ticker(),
				random = function(min, scope){
					return min+Math.floor(Math.random()*scope);
				},
				bg = new ct.Shape({
					renderMode: 1,
					graphics: { type: 'rect', fill: '#000000', width: 800, height: 480 }
				}),
				sysm = new ct.ParticleSystem({
					renderMode: 1,
					particle: {
						init: function() {
							this.particles = [];
							var particle, path, timeline = new ct.Timeline();
							for (var i=0;i<60;i++) {
								path = i%2 ? [[random(0,cvs.width), 0], [random(0,cvs.width), cvs.height]]:[[0, random(0,cvs.height)], [cvs.width, random(0,cvs.height)]];
								particle = new ct.Shape({
									renderMode: 1, alpha: 0,	
									graphics: { type: 'line', stroke: 'rgb('+random(0,256)+','+random(0,256)+','+random(0,256)+')', lineWidth: 20, path: path }
								})
								particle.blendMode = 'lighter';
								timeline.get(particle).addKeyframe
								this.particles.push(particle);
								this.addChild(particle);
							}
							
						},
						update: function(delta) {
							var particles = this.particles;
							for (var i=0;i<60;i++) {
								
							}
						}
					}
				});
			cvs.addChild(bg);
			cvs.addChild(sysm);
			
			ticker.add(sysm);
			ticker.add(cvs);
			ticker.start();
			this.dispose = function() {
				ticker.stop();
				cvs.removeAllChildren();
			}
		}
	},
	
	weather: {
		renderMode: 1,
		
		init: function(parent, ct) {
			this.parent = parent;
			this.ticker = new ct.Ticker();
			
			var $fps = $('.op-show-fps'), 
				ticker = this.ticker;
				bg = new ct.Bitmap({
					renderMode: 1, image: 'images/snow.jpg', sourceRect:[0, 80, 800, 480]
				}),
				light = new ct.Shape({
					renderMode: 1, x: 32, y: -58,
					graphics: { type: 'rect', fill: 'center,rgba(225,225,105,0.3),rgba(225,225,105,0)', width: 200, height: 200 }
				}),
				fire = new ct.Shape({
					renderMode: 1, x: 624, y: 315, alpha: 0,
					graphics: { type: 'rect', fill: 'center,rgba(255,85,0,0.6),rgba(255,85,0,0)', width: 100, height: 100 }
				}),

				snow = new ct.ParticleSystem({
					renderMode: 1,
					particle: { type: 'snow', num: 50, width: 800, height: 480, image: 'images/particle.png' }
				}),
				timeline = new ct.Timeline();
				
			light.blendMode = 'lighter';
			fire.blendMode = 'lighter';
			timeline.get(light).addKeyframe({ alpha: 0 }, 2400).addKeyframe({ alpha: 1 }, 4800);
			timeline.get(fire).addKeyframe({ alpha: 1 }, 1200).addKeyframe({ alpha: 0 }, 2400)
					          .addKeyframe({ alpha: 1 }, 3600).addKeyframe({ alpha: 0 }, 4800);
			parent.addChild(bg);
			parent.addChild(light);
			parent.addChild(fire);
			parent.addChild(snow);
			
			ticker.add(snow);
			ticker.add(timeline);
			ticker.add(parent);
			ticker.add(function(){
				$fps.html(ticker.fps);
			});
			ticker.start();
		},
		
		dispose: function() {
			this.ticker.stop();
			this.parent.removeAllChildren();
		}	
	},
	
	xique: {
		renderMode: false,
		
		init: function(parent, ct) {
			this.parent = parent;
			this.ticker = new ct.Ticker();
			var $fps = $('.op-show-fps'),
				ticker = this.ticker,
				board = new ct.DisplayObject({
					width: 800, height: 480
				}),
				bird = new ct.DisplayObject({
					x: 0, y: 0, width: 100, height: 100, transform: { translateX: -50, translateY: -50 },
					elem: $('<img src="http://www.baidu.com/aladdin/img/right_qixi_cursor/bird.gif">')[0]
				});
			var path = [], endPos = { x: 0, y: 0 };
			board.$.on('mousemove', function(e) {
				if (path.length > 5) {
					var x = path[0][0],
						y = path[0][1],
						dx = Math.abs(x-endPos.x),
						dy = Math.abs(y-endPos.y);
					if (dx>10 || dy>10) {
						endPos.x = x;
						endPos.y = y;
					}
					path = [];
				} else {
					path.push([e.offsetX, e.offsetY]);
				}
			});
			bird.data('flySpeed', 5);
			board.addChild(bird);
			parent.addChild(board);
			ticker.add(function(){
				var spd = bird.data('flySpeed');
					x0 = bird.x,
					y0 = bird.y,
					x1 = endPos.x,
					y1 = endPos.y;
				var dx = x1 - x0,
					dy = y1 - y0,
					dis = Math.sqrt(dx*dx+dy*dy),
					rx, ry;
				if (dis < spd) {
					rx = x1,
					ry = y1;
				} else {
					rx = x0 + spd/dis*dx,
					ry = y0 + spd/dis*dy;
					if (dx >= 0 && bird.transform.scaleX === 1) {
						bird.style('transform', { scaleX: -1 });
					} else if (dx < 0 && bird.transform.scaleX === -1) {
						bird.style('transform', { scaleX: 1 });
					}
				}
				bird.style('pos', { x: rx, y: ry });
				$fps.html(ticker.fps);
			});
			ticker.start();
		},
		
		dispose: function() {
			this.ticker.stop();
			this.parent.removeAllChildren();
		}		
	},
	
	runner: {
		renderMode: 1,
		
		init: function(parent, ct) {
			this.parent = parent;
			this.ticker = new ct.Ticker();
			
			var $fps = $('.op-show-fps'),
				ticker = this.ticker;
			
			var bg = new ct.Bitmap({
					renderMode: 1, x: 0, y: 0,
					image: 'images/sky.png', width: 800, height: 480
				}),
				ground = new ct.Shape({
					renderMode: 1, x: 0, y: 396,
					graphics:{ type: 'rect', fill: '#111', width: 800, height: 480 }
				}),
				sun = new ct.Bitmap({
					renderMode: 1, x: 500, y: 100,
					image: 'images/sun.png', width: 371, height: 355
				}),
				tree = new ct.Bitmap({
					renderMode: 1, x: 500, y: 400, transform: { translateY: -307 },
					image: 'images/tree_big.png', width: 404, height: 307
				}),
				tree2 = new ct.Bitmap({
					renderMode: 1, x: 100, y: 400, transform: { translateY: -150 },
					image: 'images/tree_small.png', width: 173, height: 150
				}),
				grass = new ct.Bitmap({
					renderMode: 1, x: 0, y: 400, transform: { translateY: -33 },
					image: 'images/grass.png', width: 1185, height: 33
				}),
				bear = new ct.Sprite({
					renderMode: 1, x: 400, y: 400, transform: { translateY: -119 },
					spriteSheet: {
						images: [ 'images/bear_big.png' ],
						frames: { width: 220, height: 119, num: 32, cols: 32, rows: 1 },
						animations: { walk:[0, 31, 'walk', 2200] }
					}
				}),
				bear2 = new ct.Sprite({
					renderMode: 1, x: 190, y: 400, transform: { translateY: -82 },
					spriteSheet: {
						images: [ 'images/bear_small.png' ],
						frames: { width: 147, height: 82, num: 20, cols: 20, rows: 1 },
						animations: { walk:[0, 19, 'walk', 1400] }
					}
				}),
				timeline = new ct.Timeline(),
				timeline2 = new ct.Timeline(),
				timeline3 = new ct.Timeline(),
				timeline4 = new ct.Timeline();
			bear._frames.reverse();
			bear2._frames.reverse();
			bear.play('walk');
			bear2.play('walk');
			parent.addChild(bg);
			parent.addChild(sun);
			parent.addChild(ground);
			parent.addChild(tree2);
			parent.addChild(tree);
			parent.addChild(grass);
			parent.addChild(bear);
			parent.addChild(bear2);
			timeline.get(sun).addKeyframe({ x: 800 }, 0).addKeyframe({ x: -600 }, 600000);
			timeline2.get(tree).addKeyframe({ x: 800 }, 0).addKeyframe({ x: -600 }, 60000);
			timeline3.get(tree2).addKeyframe({ x: 800 }, 0).addKeyframe({ x: -600 }, 200000);
			timeline4.get(grass).addKeyframe({ x: 800 }, 0).addKeyframe({ x: -1185 }, 50000);
			timeline.setNowTime(100000);
			timeline2.setNowTime(10000);
			timeline4.setNowTime(10000);
			ticker.add(function(){
				$fps.html(ticker.fps);
			});
			ticker.add(timeline);
			ticker.add(timeline2);
			ticker.add(timeline3);
			ticker.add(timeline4);
			ticker.add(bear);
			ticker.add(bear2);
			ticker.add(parent);
			ticker.start();
		},
		
		dispose: function() {
			this.ticker.stop();
			this.parent.removeAllChildren();
		}
	},
	
	box3d: {
		renderMode: 0,
		
		init: function(parent, ct) {
			this.parent = parent;
			this.ticker = new ct.Ticker();
			
			var $fps = $('.op-show-fps'),
				ticker = this.ticker;
				world = new ct.DisplayObject({
					x: 200, y: 40, width: 600, height: 600
				}),
				plane = new ct.Shape({
					x: 300, y: 300, transform3d: { tranlateX: -300, translateY: -300 },
					graphics: { type: 'rect', fill: '#666', width: 600, height: 600 }
				}),
				cube = new ct.DisplayObject({
					x: 300, y: 300, width: 200, height: 200, transform3d: { tranlateX: -100, translateY: -100 }
				});
			cube.addChild(new ct.Shape({
				x: 0, y: 0, z: -100,
			    graphics: { type: 'rect', fill: '#FF0', width: 200, height: 200 }
			}));
			cube.addChild(new ct.Shape({
				x: 0, y: 100, z: 0, transform3d: { rotateX: 90 },
			    graphics: { type: 'rect', fill: '#0FF', width: 200, height: 200 }
			}));
			cube.addChild(new ct.Shape({
				x: 0, y: -100, z: 0, transform3d: { rotateX: -90 },
			    graphics: { type: 'rect', fill: '#F0F', width: 200, height: 200 }
			}));
			cube.addChild(new ct.Shape({
				x: 100, y: 0, z: 0, transform3d: { rotateY: -90 },
			    graphics: { type: 'rect', fill: '#00F', width: 200, height: 200 }
			}));
			cube.addChild(new ct.Shape({
				x: -100, y: 0, z: 0, transform3d: { rotateY: 90 },
			    graphics: { type: 'rect', fill: '#F00', width: 200, height: 200 }
			}));
			cube.addChild(new ct.Shape({
				x: 0, y: 0, z: 100,
			    graphics: { type: 'rect', fill: '#0F0', width: 200, height: 200 }
			}));
			world.style('transform3d',{ rotateX: 60, rotateY: 0, rotateZ: 30 });
			world.addChild(plane);
			world.addChild(cube);
			parent.addChild(world);
			
			ticker.add(function(){
				// world.style('transform3d', { rotateZ: world.transform3d.rotateZ+1 });
				$fps.html(ticker.fps);
			});
			ticker.start();
		},
		
		dispose: function() {
			this.ticker.stop();
			this.parent.removeAllChildren();
		}		
	},

	
	eggs: {
		renderMode: 0,
		
		init: function(parent, ct) {
			
		},
		
		dispose: function() {
			
		}	
		
	}
	
}
