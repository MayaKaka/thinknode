var apitest = {
	transform2d: {
		init: function(div, cvs, ct, $panel, $fps) {
			var ticker = new ct.Ticker(),
				divRect = new ct.Shape({
					x: 230, y: 150, graphics: { type: 'rect', fill: 'top,#0022FF,#00DDFF', width: 100, height: 100 } 
				}),
				cvsRect = new ct.Shape({
					renderMode: 1,
					x: 230, y: 150, graphics: { type: 'rect', fill: 'top,#0022FF,#00DDFF', width: 100, height: 100 } 
				});
			div.addChild(divRect);
			cvs.addChild(cvsRect);
			
			ticker.add(cvs);
			ticker.start();
			
			var $control = $([
				'<div class="op-test-control-table">',
					'<table>',
						'<tr><td>x</td><td>230</td><td><input type="range" min="0" max="468"></td></tr>',
						'<tr><td>y</td><td>190</td><td><input type="range" min="0" max="380"></td></tr>',
						'<tr><td>width</td><td>100</td><td><input type="range" min="1" max="200"></td></tr>',
						'<tr><td>height</td><td>100</td><td><input type="range" min="1" max="200"></td></tr>',
						'<tr><td>translateX</td><td>0</td><td><input type="range" min="-100" max="100"></td></tr>',
						'<tr><td>translateY</td><td>0</td><td><input type="range" min="-100" max="100"></td></tr>',
						'<tr><td>rotate</td><td>0</td><td><input type="range" min="-360" max="360"></td></tr>',
						'<tr><td>scaleX</td><td>1</td><td><input type="range" min="-1" max="3"></td></tr>',
						'<tr><td>scaleY</td><td>1</td><td><input type="range" min="-1" max="3"></td></tr>',
						'<tr><td>skewX</td><td>0</td><td><input type="range" min="-100" max="100"></td></tr>',
						'<tr><td>skewY</td><td>0</td><td><input type="range" min="-100" max="100"></td></tr>',
						'<tr><td>originX</td><td>0.5</td><td><input type="range" min="0" max="2"></td></tr>',
						'<tr><td>originY</td><td>0.5</td><td><input type="range" min="0" max="2"></td></tr>',
					'</table>',		
				'</div>'].join(''));
			$control.appendTo($panel);
			$control.on('change', function(e){
				var input = e.target,
					tr = input.parentNode.parentNode,
					name = tr.children[0].innerHTML,
					td = tr.children[1],
					val = parseFloat(input.value);
				if (name === 'x' || name === 'y' || name === 'width' || name === 'height') {
					divRect.style(name, val);
					cvsRect.style(name, val);
				} else {
					var transform = {};
					if (name === 'originX' || name === 'originY') {
						val = val/2;
					}
					transform[name] = val;
					divRect.style('transform', transform);
					cvsRect.style('transform', transform);
				}
				td.innerHTML = val;
			});
			
			this.dispose = function() {
				$control.remove();
				ticker.stop();
				div.removeAllChildren();
				cvs.removeAllChildren();
			}
		}
	},

	transform3d: {
		init: function(div, cvs, ct, $panel, $fps) {
			var ticker = new ct.Ticker(),
				divRect = new ct.Shape({
					x: 230, y: 150, graphics: { type: 'rect', fill: 'top,#FF2200,#FFFF00', width: 100, height: 100 } 
				}),
				cvsRect = new ct.Shape({
					renderMode: 1,
					x: 230, y: 150, graphics: { type: 'rect', fill: 'top,#FF2200,#FFFF00', width: 100, height: 100 } 
				});
			div.addChild(divRect);
			cvs.addChild(cvsRect);
			
			ticker.add(cvs);
			ticker.start();
			
			var $control = $([
				'<div class="op-test-control-table">',
					'<table>',
						'<tr><td>x</td><td>230</td><td><input type="range" min="0" max="468"></td></tr>',
						'<tr><td>y</td><td>190</td><td><input type="range" min="0" max="380"></td></tr>',
						'<tr><td>z</td><td>0</td><td><input type="range" min="-300" max="300"></td></tr>',
						'<tr><td>translateX</td><td>0</td><td><input type="range" min="-100" max="100"></td></tr>',
						'<tr><td>translateY</td><td>0</td><td><input type="range" min="-100" max="100"></td></tr>',
						'<tr><td>translateZ</td><td>0</td><td><input type="range" min="-100" max="100"></td></tr>',
						'<tr><td>rotateX</td><td>0</td><td><input type="range" min="-360" max="360"></td></tr>',
						'<tr><td>rotateY</td><td>0</td><td><input type="range" min="-360" max="360"></td></tr>',
						'<tr><td>rotateZ</td><td>0</td><td><input type="range" min="-360" max="360"></td></tr>',
						'<tr><td>scaleX</td><td>1</td><td><input type="range" min="-1" max="3"></td></tr>',
						'<tr><td>scaleY</td><td>1</td><td><input type="range" min="-1" max="3"></td></tr>',
						'<tr><td>scaleZ</td><td>1</td><td><input type="range" min="-1" max="3"></td></tr>',
						'<tr><td>originX</td><td>0.5</td><td><input type="range" min="0" max="2"></td></tr>',
						'<tr><td>originY</td><td>0.5</td><td><input type="range" min="0" max="2"></td></tr>',
						'<tr><td>originZ</td><td>0.5</td><td><input type="range" min="0" max="2"></td></tr>',
					'</table>',		
				'</div>'].join(''));
			$control.appendTo($panel);
			$control.on('change', function(e){
				var input = e.target,
					tr = input.parentNode.parentNode,
					name = tr.children[0].innerHTML,
					td = tr.children[1],
					val = parseFloat(input.value);
				if (name === 'x' || name === 'y' || name === 'z') {
					divRect.style(name, val);
					cvsRect.style(name, val);
				} else {
					var transform = {};
					if (name === 'originX' || name === 'originY' || name === 'originZ') {
						val = val/2;
					}
					transform[name] = val;
					divRect.style('transform3d', transform);
					cvsRect.style('transform3d', transform);
				}
				td.innerHTML = val;
			});
			
			this.dispose = function() {
				$control.remove();
				ticker.stop();
				div.removeAllChildren();
				cvs.removeAllChildren();
			}
		}
	},
	
	transition: {
		init: function(div, cvs, ct, $panel, $fps) {
			var ticker = new ct.Ticker(),
				divRect = new ct.Shape({
					x: 100, y: 50, graphics: { type: 'rect', fill: 'top,#0022FF,#00DDFF', width: 100, height: 100 } 
				}),
				cvsRect = new ct.Shape({
					renderMode: 1,
					x: 100, y: 50, graphics: { type: 'rect', fill: 'top,#0022FF,#00DDFF', width: 100, height: 100 } 
				}),
				cvsCircle = new ct.Shape({
					renderMode: 1, visible: false,
					x: 100, y: 250, graphics: { type: 'circle', fill: 'top,#FFFF00,#FF0000', radius: 50 } 
				}),
				cvsLine = new ct.Shape({
					renderMode: 1, visible: false,
					x: 0, y: 0, graphics: { type: 'line', stroke: '#FFFF00', lineWidth: 10, 
					path: [[50, 300], [100, 150, 150, 300], [200, 150, 250, 300]] } 
				});
			div.addChild(divRect);
			cvs.addChild(cvsRect);
			cvs.addChild(cvsCircle);
			cvs.addChild(cvsLine);
			
			ticker.add(ct.Tween);
			ticker.add(cvs);
			ticker.start();
			
			var $control = $([
				'<div class="op-test-control-table">',
					'<table>',
						'<tr><td>过渡函数</td><td><input type="button" value="linear"></td><td><input type="button" value="swing"></td></tr>',
						'<tr><td><input type="button" value="easeIn"></td><td><input type="button" value="easeOut"></td><td><input type="button" value="easeInOut"></td></tr>',
						'<tr><td><input type="button" value="expoIn"></td><td><input type="button" value="expoOut"></td><td><input type="button" value="expoInOut"></td></tr>',
						'<tr><td><input type="button" value="bounceIn"></td><td><input type="button" value="bounceOut"></td><td><input type="button" value="bounceInOut"></td></tr>',
						'<tr><td><input type="button" value="elasIn"></td><td><input type="button" value="elasOut"></td><td><input type="button" value="elasInOut"></td></tr>',
						'<tr><td><input type="button" value="backIn"></td><td><input type="button" value="backOut"></td><td><input type="button" value="backInOut"></td></tr>',
						'<tr><td>过渡属性</td><td><input type="button" value="pos"></td><td><input type="button" value="size"></td></tr>',
						'<tr><td><input type="button" value="transform2d"></td><td><input type="button" value="transform3d"></td><td><input type="button" value="alpha"></td></tr>',
						'<tr><td><input type="button" value="fillColor"></td><td><input type="button" value="fillGradient"></td><td><input type="button" value="shadow"></td></tr>',
						'<tr><td><input type="button" value="strokeColor"></td><td><input type="button" value="lineWidth"></td><td></td></tr>',
						'<tr><td><input type="button" value="radius"></td><td><input type="button" value="angle"></td><td></td></tr>',
					'</table>',		
				'</div>'].join(''));
			$control.appendTo($panel);
			$control.on('click', function(e){
				var input = e.target,
					type = input.value;
				divRect.style('y', 50);
				cvsRect.style('y', 50);
				cvsCircle.style('visible', false);
				cvsLine.style('visible', false);
				switch(type) {
					case 'linear': case 'swing': 
					case 'easeIn': case 'easeOut': case 'easeInOut':
					case 'expoIn': case 'expoOut': case 'expoInOut':
					case 'bounceIn': case 'bounceOut': case 'bounceInOut':
					case 'elasIn': case 'elasOut': case 'elasInOut':
					case 'backIn': case 'backOut': case 'backInOut':
						divRect.to({ y: 350 }, 1000, type);
						cvsRect.to({ y: 350 }, 1000, type);
						break;
					case 'pos':
						divRect.to({ x: 0, y: 250 }, 500).to({ x: 240 }, 500).to({ x: 120, y: 50 }, 500);
						cvsRect.to({ x: 0, y: 250 }, 500).to({ x: 240 }, 500).to({ x: 120, y: 50 }, 500);
						break;
					case 'size':
						divRect.to({ width: 200 }, 500).to({ height: 200 }, 500).to({ width: 100, height: 100 }, 500);
						cvsRect.to({ width: 200 }, 500).to({ height: 200 }, 500).to({ width: 100, height: 100 }, 500);
						break;
					case 'transform2d':
						divRect.to({ transform: { scale: 2 }}, 500).to({ transform: { rotate: 360 }}, 500).to({ transform: { scale: 1 }}, 500).to({ transform: { rotate: 0 }}, 500);
						cvsRect.to({ transform: { scale: 2 }}, 500).to({ transform: { rotate: 360 }}, 500).to({ transform: { scale: 1 }}, 500).to({ transform: { rotate: 0 }}, 500);
						break;
					case 'transform3d':
						divRect.style('z', 300);
						divRect.to({ transform3d: { scaleX: 2, scaleY: 2 }}, 500).to({ transform3d: { rotateX: 360 }}, 500).to({ transform3d: { rotateY: 360 }}, 500).to({ transform3d: { rotateZ: 360 }}, 500)
							   .to({ transform3d: { scaleX: 1, scaleY: 1, rotateX: 0, rotateY: 0, rotateZ: 0 }}, 1000);
						break;
					case 'alpha':
						divRect.to({ alpha: 0 }, 500).to(500).to({ alpha: 1 }, 500);
						cvsRect.to({ alpha: 0 }, 500).to(500).to({ alpha: 1 }, 500);
						break;
					case 'fillColor':
						divRect.style('fill', '#FF0');
						cvsRect.style('fill', '#FF0');
						divRect.to({ fill: '#F00' }, 1000).to({ fill: '#0F0' }, 1000).to({ fill: '#00F' }, 1000);
						cvsRect.to({ fill: '#F00' }, 1000).to({ fill: '#0F0' }, 1000).to({ fill: '#00F' }, 1000);
						break;
					case 'fillGradient':
						divRect.style('fill', 'center,#FF0,#F00');
						cvsRect.style('fill', 'center,#FF0,#F00');
						divRect.to({ fill: 'center,#F00,#0F0' }, 1000).to({ fill: 'center,#0F0,#00F' }, 1000).to({ fill: 'center,#00F,#0DF' }, 1000);
						cvsRect.to({ fill: 'center,#F00,#0F0' }, 1000).to({ fill: 'center,#0F0,#00F' }, 1000).to({ fill: 'center,#00F,#0DF' }, 1000);
						break;
					case 'strokeColor':
						cvsLine.style('visible', true);
						cvsLine.to({ stroke: '#F00' }, 1000).to({ stroke: '#0F0' }, 1000).to({ stroke: '#00F' }, 1000);
						break;
					case 'lineWidth':
						cvsLine.style('visible', true);
						cvsLine.to({ lineWidth: 30 }, 1000).to({ lineWidth: 0 }, 1000).to({ lineWidth: 10 }, 1000);
						break;
					case 'radius':
						cvsCircle.style('visible', true);
						cvsCircle.to({ radius: 0 }, 1000).to({ radius: 50 }, 1000);
						break;
					case 'angle':
						cvsCircle.style('visible', true);
						cvsCircle.to({ angle: 0 }, 1000).to({ angle: 360 }, 1000);
						break;
				}
			});
			
			this.dispose = function() {
				$control.remove();
				ticker.stop();
				div.removeAllChildren();
				cvs.removeAllChildren();
			}
		}
	},
	
}
