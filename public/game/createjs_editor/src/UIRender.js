
//渲染器
var Renderer = Class.extend({
	renderTarget: null,
	posMark: null,
	sizeMark: null,
	rotateMark: null,
	init: function(w, h){
		var o = this;
		/**启动渲染**/
		cy.Application.create({
			fps: 60,
			width: w+200,
			height: h+200,
			
			showFPS: true,
			scaleToFit: false,
			enableMouseOver: true,
			crossOriginAllow: false
		});
		App.stage.x = App.stage.y = 100;
		//重置部分属性
		cy.Panel.prototype.border = true;
		cy.Label.prototype.useTextCache = false;
		/**调整渲染区域位置**/
		cy.$('#gameScreen').css('marginLeft', -(w+200)/2);
		cy.$('#gameScreen').css('marginTop', -(h+200)/2);
		cy.$('.render_scroll').htmlElement.scrollLeft = (1280-800)/2;
		cy.$('.render_scroll').htmlElement.scrollTop = (1280-h-200)/2;
		/**位置标记**/
		var posMark = new cy.Bitmap('res/anchor_circle.png');
		posMark.scaleX = posMark.scaleY = 20/11;
		posMark.regX = posMark.regY = 5.5;
		posMark.cursor = 'move';
		/**尺寸标记**/
		var sizeMark = new cy.Bitmap('res/control.png');
		sizeMark.scaleX = sizeMark.scaleY = 30/56;
		sizeMark.regX = sizeMark.regY = 28;
		sizeMark.cursor = 'se-resize';
		/**旋转标记**/
		var rotateMark = new cy.ColorCircle();
		rotateMark.color = 'rgb(34,88,255)';
		rotateMark.radius = 8;
		rotateMark.cursor = 'crosshair';
		
		this.posMark = posMark;
		this.sizeMark = sizeMark;
		this.rotateMark = rotateMark;
		
		this.initStage();

		cy.$("#gameScreen").bind('drop', function(e){
			var renderTarget = o.renderTarget,
				name = e.dataTransfer.getData("Text");
			if (name === 'SpriteFrame'){
				var frames = renderTarget.spriteSheet._frames,
					image = new Image();
				image.src = 'res/unknown.png';
				frames.push({
					image: image,
					rect: {
						x: 0, y: 0,
						width: 128, height: 128
					},
					regX: 64,
					regY: 64
				});
				renderTarget.gotoAndStop(frames.length-1);
				Views.tree.updateSpriteNode(renderTarget);
				return;
			} else if (name === 'SpriteAnimation') {
				var animName = prompt('请输入动画的名称:');
				renderTarget.spriteSheet._data[animName] = {
					frames: [0],
				 	name: animName,
					next: animName,
					speed: 1
				};
				Views.tree.updateSpriteNode(renderTarget);
				return;
			} 
			var obj = Views.createEmpty(name, Views.map),
				root = App.stage.children[0];
			if (root.type === 'MovieClip') {
				root.itemCount = root.itemCount||1;
				obj.viewName = 'item_'+root.itemCount;
				root.itemCount++;
			}
			if (!renderTarget || name==='Scene') return;
			o.appendTo(obj, renderTarget);
			o.selectTarget(obj);
		});
	},
	initStage: function(){
		var stage = App.stage, o = this, posMark = this.posMark, sizeMark = this.sizeMark, rotateMark = this.rotateMark;
		var startX = 0, startY = 0, mtx = null, mtx1 = null, baseX = 0, baseY = 0,
			baseW = 0, baseH = 0, baseSx = 1, baseSy = 1;
		stage.on('mousedown',function(e){
			var renderTarget = o.renderTarget;
			if (e.target===sizeMark) {
				baseW = renderTarget.getMeasuredRect? renderTarget.getMeasuredRect().width: 0;
				baseH  = renderTarget.getMeasuredRect? renderTarget.getMeasuredRect().height: 0;
				baseSx = renderTarget.scaleX;
				baseSy = renderTarget.scaleY;
			} else if(e.target===rotateMark) {
				baseX = renderTarget.x;
				baseY = renderTarget.y;
			} else if (e.target===posMark) {
				baseX = renderTarget.x;
				baseY = renderTarget.y;
			} else {
				o.selectTarget(e.target);
				renderTarget = e.target;
				baseX = renderTarget.x;
				baseY = renderTarget.y;
			}
			startX = e.stageX;
			startY = e.stageY;
			mtx = renderTarget.parent.getConcatenatedMatrix();
		});
		stage.on('pressmove',function(e){
			var renderTarget = o.renderTarget,
				dx = e.stageX-startX,
				dy = e.stageY-startY;	
			if (Math.abs(dx) > 3) {
				if (e.target===sizeMark) {
					if (renderTarget instanceof cy.Panel || renderTarget instanceof cy.ColorRect) {
						renderTarget.width = Math.round((1+dx/mtx.a/baseW)*baseW);
					} else if (baseW>0) {
						renderTarget.scaleX = Math.round((1+dx/mtx.a/(baseW*baseSx))*baseSx*100)/100;
					}
				} else if (e.target===rotateMark) {
					
				} else {
					renderTarget.x = Math.round(dx/mtx.a + baseX);
				}
			}
			if (Math.abs(dy) > 3) {
				if (e.target===sizeMark) {
					if (renderTarget instanceof cy.Panel || renderTarget instanceof cy.ColorRect) {
						renderTarget.height = Math.round((1+dy/mtx.d/baseH)*baseH);
					} else if (baseH>0) {
						renderTarget.scaleY = Math.round((1+dy/mtx.d/(baseH*baseSy))*baseSy*100)/100;
					}
				} else if (e.target===rotateMark) {
					mtx1 = renderTarget.parent.getConcatenatedMatrix();
					mtx1.append(1,0,0,1,renderTarget.x,renderTarget.y);
					var ddx = e.stageX - mtx1.tx,
						ddy = e.stageY - mtx1.ty;
					if(ddx<0) {
						renderTarget.rotation = Math.round(Math.atan(ddy/ddx)/Math.PI*180)+180;
					} else {
						renderTarget.rotation = Math.round(Math.atan(ddy/ddx)/Math.PI*180);
					}
					
				} else {
					renderTarget.y = Math.round(dy/mtx.d + baseY);
				}
			}
			o.updateMark(renderTarget);
			Views.attr.update(o.renderTarget);
		});
		stage.on('pressup', function(){
			var renderTarget = Views.render.renderTarget;
			if (renderTarget === Views.line.currentItem) {
				Views.line.setFrameState(renderTarget);
			}
		});
	},
	appendTo: function(child, target) {
		if (child.root) {
			App.clearStage();
			App.stage.addChild(child);
			var node = { name: child.viewName, drag: false };
			var tree = Views.tree.makeTree(child, child.viewName);
			if(tree === 'parent'){
				node.isParent = true;
			} else {
				node.children = tree;
			}
			if (child.type === 'Sprite' || child.type === 'MovieClip') {
				Views.tree.objTree.addNodes(Views.tree.objTree.getNodeByParam('name', '动画'), node);
			} else {
				Views.tree.objTree.addNodes(Views.tree.objTree.getNodeByParam('name', '界面'), node);
			}
			
		} else {
			var parent = target.parent;
			if (target instanceof cy.Container && !(target instanceof cy.Button) && !(target instanceof cy.CheckBox)){
				parent =  target;
			}
			var name = parent.title?parent.title.split('_')[0]:parent.viewName,
				tree = Views.tree.makeTree({ children: [child] }, name),
				node = parent.title?Views.tree.objTree.getNodeByParam('title', parent.title):Views.tree.objTree.getNodeByParam('name', parent.viewName);
			console.log(parent, node);
			parent.addChild(child);
			Views.tree.objTree.addNodes(node, tree);
		}
		this.toggleTool(false);
	},
	selectTarget: function(o){
		this.drawDebug(o);
		this.updateMark(o);
		Views.attr.update(o);
		this.renderTarget = o;
	},
	drawDebug: function(o){
		if (this.renderTarget && this.renderTarget.type !== 'MovieClip') {
			this.renderTarget.drawDebug = null;
		}
		if (o.type==='Sprite') {
			o.drawDebug = function(ctx){
				var rect = this.getMeasuredRect();
				ctx.fillStyle = 'rgba(77,255,255,0.1)';
				ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
				ctx.lineWidth = 1;
				ctx.strokeStyle = '#EEE';
				ctx.beginPath();
				ctx.moveTo(-800, 0);
				ctx.lineTo(800, 0);
				ctx.moveTo(0, -800);
				ctx.lineTo(0, 800);
				ctx.closePath();
				ctx.stroke();
				ctx.strokeStyle = 'rgb(255,255,0)';
				ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
			};
		} else if (o.type==='MovieClip'){
			if (!o.drawDebug) {
				o.drawDebug = function(ctx){
					ctx.lineWidth = 1;
					ctx.strokeStyle = '#EEE';
					ctx.beginPath();
					ctx.moveTo(-800, 0);
					ctx.lineTo(800, 0);
					ctx.moveTo(0, -800);
					ctx.lineTo(0, 800);
					ctx.closePath();
					ctx.stroke();
				};
			}
		}
		else if (o.getMeasuredRect) {
			o.drawDebug = function(ctx){
				var rect = this.getMeasuredRect();
				ctx.fillStyle = 'rgba(77,255,255,0.1)';
				ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
				ctx.lineWidth = 1;
				ctx.strokeStyle = 'rgb(255,255,0)';
				ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
			};
		} else if (o.getMeasuredRadius) {
			o.drawDebug = function(ctx){
				var r = this.getMeasuredRadius();
				ctx.fillStyle = 'rgba(77,255,255,0.1)';
				ctx.lineWidth = 1;
				ctx.strokeStyle = 'rgb(255,255,0)';
				ctx.arc(0, 0, r, 0, Math.PI*2);
				ctx.fill();
				ctx.stroke();
			};
		} 
	},
	updateMark: function(o){
		var renderTarget = o, posMark = this.posMark, sizeMark = this.sizeMark, rotateMark = this.rotateMark;
		if (!renderTarget.parent) return;
		var mtx0 = renderTarget.parent.getConcatenatedMatrix(),
			mtx2 = renderTarget.getConcatenatedMatrix(),
			mtx1 = renderTarget.getConcatenatedMatrix();
		mtx0.append(1,0,0,1,renderTarget.x,renderTarget.y);
		mtx2.append(1,0,0,1,30+renderTarget.regX,renderTarget.regY);
		posMark.x = mtx0.tx-App.stage.x;
		posMark.y = mtx0.ty-App.stage.y;
		posMark.rotation = Math.atan(mtx1.b/mtx1.a)/Math.PI*180;
		rotateMark.x = mtx2.tx-App.stage.x;
		rotateMark.y = mtx2.ty-App.stage.y;
		rotateMark.rotation = posMark.rotation;
		var x = renderTarget.getMeasuredRect? renderTarget.getMeasuredRect().x: 0,
			y = renderTarget.getMeasuredRect? renderTarget.getMeasuredRect().y: 0,
			w = renderTarget.getMeasuredRect? renderTarget.getMeasuredRect().width: 0,
			h = renderTarget.getMeasuredRect? renderTarget.getMeasuredRect().height: 0;
		mtx1.append(1,0,0,1, w+x, h+y);
		sizeMark.x = mtx1.tx-App.stage.x;
		sizeMark.y = mtx1.ty-App.stage.y;
		sizeMark.rotation = posMark.rotation;
		App.stage.addChild(posMark, rotateMark, sizeMark);
		if (o.type==="Sprite") {
			rotateMark.visible = false;
			sizeMark.visible = true;
		} else if (o.type==="MovieClip") {
			rotateMark.visible = sizeMark.visible = false;
		} else {
			rotateMark.visible = sizeMark.visible = true;
		}
	},
	toggleTool: function(bool){
		if (bool) {
			$('.component_panel').css('overflow', 'visible');
		} else {
			$('.component_panel').css('overflow', 'hidden');
		}
	}
});