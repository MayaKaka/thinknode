
//键盘控制器
var Keyboard = Class.extend({
	ctrl: false,
	focus: null,
	init: function(){
		var o = this;
		$(".objects_panel").bind('click', function(){
			o.focus = 'objects_panel';
		});
		$(".render_panel").bind('click', function(e){
			o.focus = 'render_panel';
		});
		$(".assets_panel").bind('click', function(){
			o.focus = 'assets_panel';
		});
		$(".attr_panel").bind('click', function(){
			o.focus = false;
		});
		$(document).bind('keydown', function(e){
			if ((!o.focus)||(!Views.render.renderTarget)) {
				return;
			}
			var renderTarget = Views.render.renderTarget;
			// 'CTRL'
			if (e.keyCode === 17) {
				o.ctrl = true;
			} // 'Right'
			else if(e.keyCode === 39) {
				if(renderTarget.paused){
					var f = renderTarget.spriteSheet.getFrame(renderTarget._currentFrame|0);
					f.regX-=2;
				} else {
					renderTarget.x++;
				}
				
			} // 'Left' 
			else if(e.keyCode === 37) {
				if(renderTarget.paused){
					var f = renderTarget.spriteSheet.getFrame(renderTarget._currentFrame|0);
					f.regX+=2;
				} else {
					renderTarget.x--;
				}
			} // 'Down'
			else if(e.keyCode === 40) {
				if(renderTarget.paused){
					var f = renderTarget.spriteSheet.getFrame(renderTarget._currentFrame|0);
					f.regY-=2;
				} else {
					renderTarget.y++;
				}
			} // 'Up'
			else if(e.keyCode === 38) {
				if(renderTarget.paused){
					var f = renderTarget.spriteSheet.getFrame(renderTarget._currentFrame|0);
					f.regY+=2;
				} else {
					renderTarget.y--;
				}
			}
			if (e.keyCode >= 37 && e.keyCode <= 40) {
				Views.render.updateMark(Views.render.renderTarget);
				Views.attr.update(Views.render.renderTarget);
			}
			e.preventDefault();
		});
		$(document).bind('keyup', function(e){
			if ((!o.focus)||(!Views.render.renderTarget)) {
				return;
			}
			// 'CTRL'
			if (e.keyCode === 17) {
				o.ctrl = false;
				$('.show_image_canvas')[0].getContext('2d').clearRect(0,0,340,300);
				Views.preview.lockW = Views.preview.lockH = 0;
			} // 'S'
			else if (e.keyCode === 83) {
				if (o.ctrl) {
					var render = Views.render,
						renderTarget = render.renderTarget,
						preview = Views.preview,
						attr = Views.attr,
						bmp;
					if (renderTarget instanceof cy.Sprite) {
						var ss = renderTarget.spriteSheet,
							frame = ss.getFrame(renderTarget._currentFrame|0);
						frame.image = new Image();
						frame.image.src = $('.show_image').attr('src');
						if (preview.lockW>0 || preview.lockH>0) {
							frame.rect = {
								x: preview.lockX,
								y: preview.lockY,
								width: preview.lockW,
								height: preview.lockH
							};
						} else {
							frame.rect = {
								x:0,
								y: 0,
								width: $('.show_image')[0].naturalWidth,
								height: $('.show_image')[0].naturalHeight
							};
						}
						return;
					}				
					else if (renderTarget instanceof cy.Bitmap){
						bmp = renderTarget;
					} else if(renderTarget instanceof cy.Button) {
						bmp = attr.getBmp(renderTarget);
					} else {
						return;
					}
					bmp.image.src = $('.show_image').attr('src');
					if (preview.lockW>0 || preview.lockH>0) {
						bmp.sourceRect = {
							x: preview.lockX,
							y: preview.lockY,
							width: preview.lockW,
							height: preview.lockH
						};
					} else {
						bmp.sourceRect = null;
					}
					attr.update(renderTarget, attr.bmpState);
					render.updateMark(renderTarget);
				}
			} // 'C'
			else if(e.keyCode === 67) {
				if (o.ctrl) {
					o.copyTarget = Views.render.renderTarget;
					o.copyCount = 0;
				}
			} // 'V'
			else if(e.keyCode === 86) {
				if (o.ctrl && o.copyTarget) {
					o.copyCount++;
					var copy = Views.parseData(Views.exportData(o.copyTarget), null, Views.map),
						target = Views.render.renderTarget;
					copy.x += 2*o.copyCount;
					copy.y += 2*o.copyCount;
					Views.render.appendTo(copy, target);
				}
			} // 'X'
			else if(e.keyCode === 88) {
				if (o.ctrl) {
					var target = Views.render.renderTarget;
					if (target.root) return;
					var parent = target.parent,
						node = Views.tree.objTree.getNodeByParam('title', target.title);
					parent.removeChild(target);
					Views.tree.objTree.removeNode(node);
					
					o.copyTarget = target;
					o.copyCount = 0;
				}
			}
			e.preventDefault();
		});
	}
});