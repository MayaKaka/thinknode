var apitest = {
	transform2d: {
		init: function(div, cvs, ct, $panel, $fps) {
			var ticker = this.ticker = new ct.Ticker(),
				divRect = new ct.Shape({
					x: 230, y: 150, graphics: { type: 'rect', fill: 'top,#FF8822,#88DD22', width: 100, height: 100 } 
				}),
				cvsRect = new ct.Shape({
					renderInCanvas: true,
					x: 230, y: 150, graphics: { type: 'rect', fill: 'top,#FF8822,#88DD22', width: 100, height: 100 } 
				})		
			div.addChild(divRect);
			cvs.addChild(cvsRect);
			ticker.add(cvs);
			ticker.start();
			
			var $control = $([
				'<div class="op-test-transform2d">',
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
			var ticker = this.ticker = new ct.Ticker(),
				divRect = new ct.Shape({
					x: 230, y: 150, graphics: { type: 'rect', fill: 'top,#FF8822,#88DD22', width: 100, height: 100 } 
				}),
				cvsRect = new ct.Shape({
					renderInCanvas: true,
					x: 230, y: 150, graphics: { type: 'rect', fill: 'top,#FF8822,#88DD22', width: 100, height: 100 } 
				})		
			div.addChild(divRect);
			cvs.addChild(cvsRect);
			ticker.add(cvs);
			ticker.start();
			
			var $control = $([
				'<div class="op-test-transform2d">',
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
	}	
	
	
	
}
