var showcase = {
	clock: {
		renderInCanvas: true,
		
		init: function(parent, ct) {
			this.parent = parent;
			this.ticker = new ct.Ticker();
			
			var $fps = $('.op-show-fps'),
				ticker = this.ticker,
				bg = new ct.Shape({
					renderInCanvas: true,
					graphics: { type: 'rect', fill: 'center,#888,#000', width: 800, height: 480 }
				}),				
				clock = new ct.DisplayObject({
					renderInCanvas: true, x: 400-100, y: 240-100, width: 200, height: 200
				}),
				mark = new ct.DisplayObject({
					renderInCanvas: true, width: 200, height: 200
				}),
				hand = new ct.Shape({
					renderInCanvas: true,
					x: 100, y: 100, shadow: '1px 1px 2px #000',
					transform: { translateX: -3, translateY: -45, originY: 0.9, rotate: 108 },
					graphics: { type: 'rect', fill: '#222', width: 6, height: 50 }
				}),
				hand2 = new ct.Shape({
					renderInCanvas: true,
					x: 100, y: 100, shadow: '1px 1px 2px #000',
					transform: { translateX: -2, translateY: -72, originY: 0.9, rotate: 228 },
					graphics: { type: 'rect', fill: '#444', width: 4, height: 80 }
				}),
				hand3 = new ct.Shape({
					renderInCanvas: true,
					x: 100, y: 100, shadow: '2px 1px 2px #000',
					transform: { translateX: -1, translateY: -81, originY: 0.9, rotate: 0 },
					graphics: { type: 'rect', fill: '#F00', width: 2, height: 90 }
				});
			
			mark.addChild(new ct.Shape({
				renderInCanvas: true, x: 6, y: 6,
				graphics: { type: 'circle', stroke: 'rgba(0,0,0,0.2)', radius: 94, lineWidth: 6 }
			}));
			mark.addChild(new ct.Shape({
				renderInCanvas: true, x: 100, y: 100,
				graphics: { 
					init: function() {},
					draw: function(ctx) {
						var ag = 0, r0, r1;
						for (var i=0;i<60;i++) {
							ag = i*(Math.PI/30);
							r0 = i%5==0?88:92;
							r1 = 97;
							ctx.beginPath();
							ctx.moveTo(Math.sin(ag)*r0, -Math.cos(ag)*r0);
							ctx.lineTo(Math.sin(ag)*r1, -Math.cos(ag)*r1);
							ctx.closePath();
							ctx.strokeStyle = i%5==0?'#555':'#888';
							ctx.lineWidth = i%5==0?2:1;
							ctx.stroke();
						}
					}
				}
			}));
			mark.addChild(new ct.Text({
				renderInCanvas: true, x: 100, y: 12, text: 12, fill: '#444', textAlign: 'center', textBaseline: 'top'
			}));
			mark.addChild(new ct.Text({
				renderInCanvas: true, x: 184, y: 100, text: 3, fill: '#444', textAlign: 'right', textBaseline: 'middle'
			}));
			mark.addChild(new ct.Text({
				renderInCanvas: true, x: 100, y: 188, text: 6, fill: '#444', textAlign: 'center', textBaseline: 'bottom'
			}));
			mark.addChild(new ct.Text({
				renderInCanvas: true, x: 16, y: 100, text: 9, fill: '#444', textAlign: 'left', textBaseline: 'middle'
			}));
			mark.addChild(new ct.Text({
				renderInCanvas: true, x: 102, y: 56, text: 'BIDU', fill: '#444', textAlign: 'center', font: '14px sans-serif', shadow: '0px -1px 1px #FFF'
			}));
			mark.cache();
			
			clock.addChild(new ct.Shape({
				renderInCanvas: true,
				shadow: '0px 0px 15px #000',
				graphics: { type: 'circle', fill: '#CCC', radius: 100 }
			}));
			clock.addChild(new ct.Shape({
				renderInCanvas: true,
				graphics: { type: 'circle', stroke: '#3A3A3A', radius: 100, lineWidth: 5 }
			}));
			clock.addChild(mark);
			clock.addChild(hand2);
			clock.addChild(hand);
			clock.addChild(hand3);
			clock.addChild(new ct.Shape({
				renderInCanvas: true, x: 97, y: 97,
				graphics: { type: 'circle', fill: '#F00', radius: 3 }
			}));
			clock.on('click', function(){
				if (clock.transform.scaleX === 1) {
					mark.uncache();
					clock.to({transform: { scale: 2.2 }}, 300, 'backOut');
				} else {
					clock.to({transform: { scale: 1 }}, 300, 'backOut', function() {
						mark.cache();
					});
				}
			});
			parent.addChild(bg);
			parent.addChild(clock);
			
			ticker.add(function(delta) {
				hand.style('transform', { rotate: hand.transform.rotate+1/3600 });
				hand2.style('transform', { rotate: hand2.transform.rotate+1/60 });
				hand3.style('transform', { rotate: hand3.transform.rotate+1 });
				$fps.html(ticker.fps);
			});
			ticker.add(ct.Tween);
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
			
			var $fps = $('.op-show-fps'),
				ticker = this.ticker,
				paths = [[[137,133],[137,130,139,122,140,113]],[[140,113],[141,104,143,96,143,95],[143,94,143,94,144,94]],[[144,94],[146,90,154,81,155,80],[155,80,155,79,155,78]],[[155,78],[156,74,155,67,156,65],[156,64,159,63,162,60]],[[162,60],[167,57,174,53,177,52],[177,52,178,51,179,51]],[[179,51],[183,50,191,48,198,46]],[[198,46],[205,44,211,43,214,43],[215,43,216,43,218,43]],[[218,43],[223,42,231,43,238,43]],[[238,43],[248,43,256,43,258,43],[258,43,258,43,258,43]],[[258,43],[264,47,268,52,272,57]],[[272,57],[278,65,282,72,282,74]],[[282,74],[282,74,282,74,282,74],[283,76,285,88,285,94]],[[285,94],[286,95,286,97,286,97],[286,99,286,106,287,114]],[[287,114],[287,121,287,128,287,129],[287,130,287,131,287,134]],[[287,134],[286,139,286,149,285,154]],[[285,154],[285,156,285,157,285,157],[285,158,284,166,283,174]],[[283,174],[282,178,281,182,281,185],[280,187,280,190,278,193]],[[278,193],[277,197,275,201,273,204],[272,206,270,208,268,210]],[[268,210],[263,215,256,220,253,223]],[[253,223],[252,223,251,224,251,224],[249,225,242,231,236,234]],[[236,234],[235,234,235,235,234,235],[231,236,224,236,216,237]],[[217,237],[209,237,201,236,197,235]],[[197,235],[196,235,196,235,195,235],[190,232,184,228,179,225]],[[179,225],[176,223,174,221,172,220],[170,219,166,217,162,215]],[[162,215],[158,212,154,210,151,207],[149,206,148,204,147,202]],[[147,202],[145,199,144,195,143,193],[143,192,142,188,141,183]],[[141,183],[140,177,138,169,138,166],[138,166,138,165,138,163]],[[138,163],[137,157,136,146,136,144],[136,144,136,144,136,144]],[[136,144],[136,142,136,139,137,133]],[[137,135],[137,135,135,131,133,126]],[[133,126],[131,120,128,112,126,107]],[[126,107],[125,105,125,103,125,102],[124,100,124,94,123,88]],[[123,88],[123,82,123,76,123,73],[124,71,124,70,125,68]],[[125,68],[127,62,130,55,132,49]],[[132,49],[133,47,135,45,135,43],[137,41,140,38,144,33]],[[144,33],[149,28,154,23,158,19]],[[158,19],[160,17,162,15,163,15],[165,14,170,11,175,9]],[[175,9],[181,6,189,3,194,2]],[[194,2],[196,1,198,1,199,1],[202,1,208,1,214,1]],[[214,1],[221,2,229,2,231,3],[232,3,233,3,234,3]],[[234,3],[239,5,249,9,252,11]],[[252,11],[252,11,252,11,252,11],[255,13,267,21,268,22],[268,22,268,23,268,23]],[[268,23],[270,23,275,22,278,23],[280,24,283,25,287,27]],[[287,27],[292,29,296,33,300,38],[300,39,301,40,301,41]],[[301,41],[306,49,309,58,309,59]],[[309,59],[309,59,309,59,309,59],[309,61,307,71,306,73],[306,74,306,77,306,79]],[[306,79],[305,80,305,81,305,82],[305,84,307,92,307,94],[307,95,307,97,306,99]],[[306,99],[306,101,305,103,305,104],[305,106,301,111,301,113],[300,114,301,116,301,117]],[[301,117],[301,120,301,122,301,123],[300,124,297,124,296,125],[295,125,292,128,292,130],[292,131,291,132,291,132]],[[291,132],[291,135,290,140,289,141],[289,142,287,143,286,143]],[[128,114],[127,113,123,113,121,114]],[[121,114],[120,114,119,114,118,115],[117,116,114,121,114,123],[113,125,114,128,115,131]],[[115,131],[115,134,117,138,118,141],[119,144,120,147,121,150]],[[121,150],[123,154,124,158,126,163],[127,164,128,166,129,168]],[[129,168],[131,170,133,172,134,172],[136,173,138,171,139,169]],[[298,124],[299,124,301,125,301,126],[302,126,302,127,302,129]],[[302,129],[302,130,302,132,301,132],[301,134,298,139,298,141],[297,143,296,146,295,147]],[[295,147],[295,148,295,148,295,149],[295,150,293,154,292,156],[292,157,291,160,290,163],[290,164,289,165,289,166]],[[289,166],[288,172,286,177,282,177]],[[258,218],[258,219,258,222,258,224]],[[258,224],[257,227,257,229,257,230],[256,232,255,240,255,242],[255,243,255,243,254,244]],[[254,244],[254,248,252,254,252,256],[252,258,251,261,250,264]],[[250,264],[250,266,249,269,248,271],[248,273,246,279,244,282]],[[244,282],[243,284,243,285,242,286],[241,288,237,295,236,297],[236,298,235,299,235,300]],[[235,300],[234,308,236,307,225,304],[224,304,223,304,220,303]],[[220,303],[218,303,216,302,215,302],[214,302,208,302,207,301],[206,301,205,298,203,296]],[[203,296],[201,295,199,293,198,292],[196,291,189,290,187,290],[187,290,186,290,185,290]],[[185,290],[184,289,183,289,183,289],[182,288,177,284,173,279],[172,278,171,277,170,276]],[[170,276],[167,271,162,265,158,260]],[[158,260],[156,258,155,256,154,255],[152,251,149,248,146,244]],[[146,244],[144,241,142,239,141,237],[141,233,141,229,141,226]],[[141,226],[142,213,143,208,143,207],[143,207,143,207,143,206]],[[143,206],[143,203,143,197,144,194]],[[163,97],[164,96,167,93,169,92],[169,92,169,92,169,92]],[[169,92],[171,91,175,90,178,90],[181,89,185,90,186,90],[187,90,188,90,189,90]],[[189,90],[191,90,195,89,196,89],[198,89,206,94,208,95]],[[208,95],[208,95,208,95,208,95],[208,96,203,97,202,97],[201,97,191,96,190,96],[190,96,190,96,189,96]],[[189,96],[186,96,180,96,178,96],[177,96,170,96,169,96]],[[169,96],[169,96,169,96,169,96],[168,96,162,99,163,97]],[[238,99],[239,98,245,95,247,94],[248,94,249,94,250,94]],[[250,94],[252,94,255,94,256,94],[258,94,265,94,267,95],[267,95,269,96,270,96]],[[270,96],[271,97,272,98,272,98],[273,99,274,101,274,101],[274,102,270,102,268,101],[266,100,263,100,261,100]],[[261,100],[260,100,260,100,259,100],[258,99,251,100,249,100],[247,100,245,100,243,100],[243,100,242,99,241,99]],[[241,99],[239,99,236,100,238,99]],[[164,115],[166,114,170,109,172,108],[172,108,174,107,176,106]],[[176,106],[179,106,181,105,182,105],[185,105,190,105,191,106],[192,107,194,108,195,109]],[[195,109],[196,110,197,111,197,111]],[[170,110],[172,112,178,116,182,116],[183,116,184,116,185,116]],[[185,116],[189,115,195,115,196,114]],[[241,116],[243,114,244,111,249,110]],[[249,110],[250,110,251,110,252,110],[257,110,263,113,267,115]],[[267,115],[269,117,270,118,271,118]],[[243,114],[244,115,249,119,252,119],[253,119,255,119,257,119]],[[257,119],[261,118,266,117,268,116]],[[213,112],[213,115,213,118,212,120]],[[212,120],[210,126,208,129,206,133],[206,134,205,136,203,138]],[[203,138],[200,143,197,148,197,150],[196,153,197,155,197,156]],[[197,156],[198,158,199,159,199,159],[201,159,204,159,205,157],[205,155,208,153,210,153],[212,153,212,153,213,154]],[[213,154],[213,154,213,155,213,155],[214,156,216,159,218,159],[225,156,228,155,230,156]],[[230,156],[232,156,233,157,235,158],[237,159,241,156,241,154],[241,153,240,150,239,148]],[[239,148],[238,146,237,145,236,144],[231,139,229,132,229,131],[229,131,229,131,229,131]],[[229,131],[227,126,225,114,225,111]],[[185,181],[185,181,185,181,186,181]],[[186,181],[188,180,199,177,205,176]],[[205,176],[206,176,206,175,207,175],[212,175,215,178,219,178],[220,178,222,177,224,176]],[[224,176],[226,176,228,175,229,175],[230,175,238,179,243,181]],[[243,181],[244,182,246,182,247,182],[250,182,241,182,238,183],[236,184,235,185,233,187]],[[233,187],[231,189,228,191,227,192],[225,193,220,193,215,193]],[[215,193],[211,193,208,192,206,191],[205,190,201,187,198,185]],[[198,185],[196,184,195,183,194,183],[191,181,183,181,185,181]],[[185,181],[186,181,188,181,191,181]],[[191,181],[196,182,204,182,211,183]],[[211,183],[213,183,216,183,218,183],[222,183,226,183,231,183]],[[231,183],[239,182,245,182,246,182]],[[179,106],[178,107,178,109,178,111]],[[178,111],[178,111,178,112,178,112],[179,114,181,116,183,116],[185,116,189,115,189,112],[189,110,189,109,189,108]],[[189,108],[189,107,189,106,188,105]],[[247,111],[247,112,248,116,249,117],[250,118,251,119,252,119],[253,119,256,120,257,118],[257,117,258,117,258,116]],[[258,116],[258,115,259,113,259,113]],[[185,107],[186,106,183,109,183,109]],[[187,108],[186,109,184,112,184,112]],[[253,111],[254,110,251,113,250,113]],[[255,112],[255,113,254,114,253,115]],[[253,115],[252,115,252,115,251,115]],[[186,176],[185,176,182,178,182,180],[182,181,184,184,186,184]],[[246,179],[250,179,249,181,250,182],[250,183,250,183,250,183]],[[250,183],[249,184,247,186,245,185]],[[143,197],[141,197,134,200,131,202],[131,202,130,203,130,203]],[[130,203],[128,205,125,209,123,212],[123,213,122,217,120,221]],[[120,221],[117,227,114,236,113,237],[113,238,112,238,112,239]],[[112,239],[111,241,110,244,110,245],[110,247,111,252,111,259]],[[111,259],[112,264,113,271,114,276],[114,277,114,278,114,278]],[[114,278],[115,283,117,291,119,298]],[[119,298],[121,307,123,315,124,316],[124,316,124,317,124,317]],[[124,317],[125,320,129,329,130,330],[130,330,132,329,135,327]],[[135,327],[140,323,147,318,151,315]],[[151,315],[152,314,153,313,154,313],[157,311,162,306,167,302]],[[167,302],[172,298,177,293,178,293],[180,293,181,294,182,295]],[[182,295],[184,298,186,300,187,301],[190,303,194,303,196,304],[196,304,198,305,199,305]],[[199,305],[201,306,204,306,206,307],[208,307,214,306,219,306]],[[219,306],[222,306,225,305,226,306],[228,306,232,307,234,307]],[[236,309],[237,307,237,306,238,305]],[[238,305],[239,303,240,302,242,302],[243,301,249,297,255,293]],[[255,293],[258,291,262,289,263,287],[265,285,266,281,267,278]],[[267,278],[268,276,268,273,268,273],[268,272,274,266,278,263]],[[278,263],[281,260,283,259,284,259]],[[143,199],[142,199,134,203,132,205],[132,205,132,205,132,205]],[[132,205],[129,207,127,213,127,215],[127,215,129,218,131,223]],[[131,223],[135,229,140,236,142,239]],[[142,239],[143,240,143,241,143,241]],[[114,235],[111,235,103,235,102,235],[101,235,99,237,98,240]],[[98,240],[95,243,93,247,92,247],[91,248,87,249,82,250]],[[82,250],[76,252,69,255,63,256]],[[63,256],[59,257,55,258,55,259],[53,259,48,261,44,262]],[[44,262],[42,263,40,263,40,263],[39,264,33,269,28,274]],[[28,274],[25,277,23,279,22,280],[22,281,18,284,14,288]],[[14,288],[11,291,7,294,6,295]],[[280,243],[281,243,286,243,289,243]],[[289,243],[294,244,298,244,299,244],[299,244,305,246,309,247]],[[309,247],[311,248,313,249,314,249],[314,249,322,251,328,253]],[[328,253],[332,255,335,256,336,256],[336,256,343,257,347,257]],[[347,257],[351,258,353,258,354,258],[355,258,360,260,363,261],[363,262,364,263,365,264]],[[365,264],[368,268,371,274,372,275],[373,276,374,279,376,281]],[[376,281],[378,283,379,285,380,286],[381,288,386,293,390,295]],[[390,295],[390,295,390,295,391,295]],[[235,310],[234,313,234,326,233,329],[233,329,233,329,233,329]],[[233,329],[233,332,234,345,234,349]],[[234,349],[234,350,234,350,234,350]],[[284,259],[287,259,295,267,299,270]],[[299,270],[300,271,300,272,301,272],[302,274,309,281,313,285]],[[313,285],[315,286,315,286,316,286],[317,286,317,282,312,277],[311,276,310,274,308,272]],[[308,272],[304,268,299,262,294,258]],[[294,258],[292,255,290,253,288,252],[286,249,283,246,281,243]],[[281,243],[278,240,275,237,273,236],[271,234,269,232,267,229]],[[267,229],[263,225,259,221,258,220]],[[187,110],[186,112,183,115,183,115]],[[256,113],[256,113,256,113,256,114]],[[256,114],[255,115,253,117,252,118]],[[258,43],[264,40,267,37,268,34]],[[268,34],[269,31,269,28,268,26]],[[239,144],[241,146,244,151,246,153]],[[246,153],[246,154,247,154,247,154],[248,156,251,161,252,163]],[[196,145],[195,146,194,149,192,152]],[[192,152],[191,156,189,159,189,160]]];
				board = new ct.DisplayObject({
					renderInCanvas: true, width: 800, height: 480
				}),
				bg = new ct.Shape({
					renderInCanvas: true,
					graphics: { type: 'rect', fill: 'rgb(242,242,242)', width: 800, height: 480 }
				});
				boss = new ct.Shape({
					renderInCanvas: true,
					x: 175, y: 50, width: 1000, height: 1000,
					graphics: { type: 'lines', stroke: '#444', paths: [] }
				});
				
			var line, x, y, color, lineW,
				idx = 0, temp = null,
				random = function(min, scope){
					return min+Math.floor(Math.random()*scope);
				};
			board.on('mousedown', function(e) {
				x = e.offsetX;
				y = e.offsetY;
				color = 'rgb('+random(0,256)+','+random(0,256)+','+random(0,256)+')';
				lineW = random(10,10);
				line = new ct.Shape({ renderInCanvas: true, graphics: { type: 'line', stroke: color, lineWidth: lineW, path: [] }});
				line.path.push([x, y]);
				parent.addChild(line);
			});
			board.on('mousemove', function(e) {
				x = e.offsetX;
				y = e.offsetY;
				if (!temp) {
					temp = [x, y];
				} else {
					temp.push(x);
					temp.push(y);
					line.path.push(temp);
					temp = null;
				}
			});
			board.on('mouseup', function() {
				line = temp = null;
			});
			board.addChild(bg);
			board.addChild(boss);
			parent.addChild(board);

			var cached = false;
			ticker.add(function() {
				if (paths.length) {
					var line = paths.shift();
					boss.paths.push(line);
				} else if (!cached) {
					cached = true;
					boss.cache();
				}
				$fps.html(ticker.fps);
			});
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
			
			var $fps = $('.op-show-fps'),
				ticker = this.ticker;
				bg = new ct.Bitmap({
					renderInCanvas: true, image: 'images/snow.jpg', sourceRect:[0, 80, 800, 480]
				}),
				light = new ct.Shape({
					renderInCanvas: true, x: 32, y: -58,
					graphics: { type: 'rect', fill: 'center,rgba(225,225,105,0.3),rgba(225,225,105,0)', width: 200, height: 200 }
				}),
				fire = new ct.Shape({
					renderInCanvas: true, x: 624, y: 315, alpha: 0,
					graphics: { type: 'rect', fill: 'center,rgba(255,85,0,0.6),rgba(255,85,0,0)', width: 100, height: 100 }
				}),

				snow = new ct.ParticleSystem({
					renderInCanvas: true,
					particle: { type: 'snow', num: 50, width: 800, height: 480, image: 'images/particle.png' }
				}),
				timeline = new ct.Timeline();
				
			light.blendMode = 'lighter';
			fire.blendMode = 'lighter';
			timeline.addKeyFrame(light, { alpha: 0 }, 2400).addKeyFrame(light, { alpha: 1 }, 4800);
			timeline.addKeyFrame(fire, { alpha: 1 }, 1200).addKeyFrame(fire, { alpha: 0 }, 2400)
					.addKeyFrame(fire, { alpha: 1 }, 3600).addKeyFrame(fire, { alpha: 0 }, 4800);
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
		renderInCanvas: false,
		
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
		renderInCanvas: true,
		
		init: function(parent, ct) {
			this.parent = parent;
			this.ticker = new ct.Ticker();
			
			var $fps = $('.op-show-fps'),
				ticker = this.ticker;
			
			var bg = new ct.Bitmap({
					renderInCanvas: true, x: 0, y: 0,
					image: 'images/sky.png', width: 800, height: 480
				}),
				ground = new ct.Shape({
					renderInCanvas: true, x: 0, y: 396,
					graphics:{ type: 'rect', fill: '#111', width: 800, height: 480 }
				}),
				sun = new ct.Bitmap({
					renderInCanvas: true, x: 500, y: 100,
					image: 'images/sun.png', width: 371, height: 355
				}),
				tree = new ct.Bitmap({
					renderInCanvas: true, x: 500, y: 400, transform: { translateY: -307 },
					image: 'images/tree_big.png', width: 404, height: 307
				}),
				tree2 = new ct.Bitmap({
					renderInCanvas: true, x: 100, y: 400, transform: { translateY: -150 },
					image: 'images/tree_small.png', width: 173, height: 150
				}),
				grass = new ct.Bitmap({
					renderInCanvas: true, x: 0, y: 400, transform: { translateY: -33 },
					image: 'images/grass.png', width: 1185, height: 33
				}),
				bear = new ct.Sprite({
					renderInCanvas: true, x: 400, y: 400, transform: { translateY: -119 },
					spriteSheet: {
						images: [ 'images/bear_big.png' ],
						frames: { width: 220, height: 119, num: 32, cols: 32, rows: 1 },
						animations: { walk:[0, 31, 'walk', 2200] }
					}
				}),
				bear2 = new ct.Sprite({
					renderInCanvas: true, x: 190, y: 400, transform: { translateY: -82 },
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
			timeline.addKeyFrame(sun, { x: 800 }, 0).addKeyFrame(sun, { x: -600 }, 600000);
			timeline2.addKeyFrame(tree, { x: 800 }, 0).addKeyFrame(tree, { x: -600 }, 60000);
			timeline3.addKeyFrame(tree2, { x: 800 }, 0).addKeyFrame(tree2, { x: -600 }, 200000);
			timeline4.addKeyFrame(grass, { x: 800 }, 0).addKeyFrame(grass, { x: -1185 }, 50000);
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
		renderInCanvas: false,
		
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
	
	filter: {
		renderInCanvas: true,
		
		init: function(parent, ct) {
			this.parent = parent;
			this.ticker = new ct.Ticker();
			
			var $fps = $('.op-show-fps'),
				ticker = this.ticker,
				bmp = new ct.Bitmap({ renderInCanvas: true, width: 800, height: 480, image: 'images/flower.jpg' }),
				bmp1 = new ct.Bitmap({ renderInCanvas: true, width: 800, height: 480, image: 'images/flower.jpg' }),
				bmp2 = new ct.Bitmap({ renderInCanvas: true, width: 800, height: 480, image: 'images/flower.jpg' }),
				bmp3 = new ct.Bitmap({ renderInCanvas: true, width: 800, height: 480, image: 'images/flower.jpg' });
			bmp1.applyFilter('grayscale');
			bmp2.applyFilter('brightness');
			bmp3.applyFilter('abstract');
			parent.addChild(bmp);
			parent.addChild(bmp1);
			parent.addChild(bmp2);
			parent.addChild(bmp3);
			
			bmp3.to(3000).to({ alpha: 0},300);
			bmp2.to(6000).to({ alpha: 0},300);
			bmp1.to(9000).to({ alpha: 0},300);
			ticker.add(ct.Tween);
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
	
	eggs: {
		renderInCanvas: false,
		
		init: function(parent, ct) {
			
		},
		
		dispose: function() {
			
		}	
		
	}
	
}
