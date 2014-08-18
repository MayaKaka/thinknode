
//属性管理器
var Attr = Class.extend({
	bmpState: 'none',
	init: function() {
		var o = this;
		$('.button_url').click(function(){
			var url = $(this).attr('lang');
			Views.preview.show(url);
		});
		$('.attr_panel #regCenterX').click(function(e){
			var renderTarget = Views.render.renderTarget,
				rect = renderTarget.getMeasuredRect();
			renderTarget.regX = Math.round(rect.width/2);
			Views.attr.update(renderTarget);
			Views.render.updateMark(renderTarget);
		});
		$('.attr_panel #regCenterY').click(function(e){
			var renderTarget = Views.render.renderTarget;
				rect = renderTarget.getMeasuredRect();
			renderTarget.regY = Math.round(rect.height/2);
			Views.attr.update(renderTarget);
			Views.render.updateMark(renderTarget);
		});
		$('.attr_panel #save').click(function(){
			var renderTarget = Views.render.renderTarget;
			if (renderTarget === Views.line.currentItem) {
				Views.line.setFrameState(renderTarget);
			}
		});
		$('.attr_panel #del').click(function(){
			var target = Views.render.renderTarget;
			if(confirm('删除将不可恢复，确定删除该对象？')){
				if (target.root) {
					var parent = target.parent,
					node = Views.tree.objTree.getNodeByParam('name', target.viewName);
					parent.removeChild(target);
					Views.tree.objTree.removeNode(node);
					delete Views.roots[target.viewName];
				} else {
					var parent = target.parent,
					node = Views.tree.objTree.getNodeByParam('title', target.title);
					parent.removeChild(target);
					Views.tree.objTree.removeNode(node);
				}
			}
		});
		$('.private_bitmap #repeat').click(function(e){
			var w = parseFloat(prompt('请输入 Width:')),
				h = parseFloat(prompt('请输入 Height:'));
			if(w&&h){
				var renderTarget = Views.render.renderTarget;
				renderTarget.repeatFill(w, h);
				renderTarget.repeatW = w;
				renderTarget.repeatH = h;
				Views.attr.update(renderTarget);
				Views.render.updateMark(renderTarget);
			}
		});
		$('.private_animation #save').click(function(e){
			var renderTarget = Views.render.renderTarget;
				name = $('.private_animation #name').val(),
				start = parseFloat($('.private_animation #start').val()),
				end = parseFloat($('.private_animation #end').val()),
				next = $('.private_animation #next').val(),
				speed = parseFloat($('.private_animation #speed').val());
			var frames = renderTarget.spriteSheet._frames,
				arr = [];
			for(var i=start; i<=end; i++) {
				arr.push(i);
			}
			// console.log(next);
			renderTarget.spriteSheet._data[name] = {
				frames: arr,
			 	name: name,
				next: next=="true"?true:next=="false"?false:(next||name),
				speed: speed
			};
		});
		$('.private_animation #auto').click(function(){
			var cols = parseFloat(prompt('列')),
				rows = parseFloat(prompt('行'));
			if(cols>0 && rows>0) {
				var renderTarget = Views.render.renderTarget,
					image = new Image(),
					img = $('.show_image')[0],
					w = img.naturalWidth/cols,
					h = img.naturalHeight/rows;
				image.src = img.src;
				var ss = new cy.SpriteSheet({
					"images": [image],
					"frames": {"regX": w/2, "height": h, "count": cols*rows, "regY": h/2, "width": w},
					"animations": {
						"all":[0, cols*rows-1, 'all', 1]
					}
				});
				renderTarget.spriteSheet = ss;
				renderTarget.gotoAndStop(0);
				var node = Views.tree.objTree.getNodeByParam('name', renderTarget.viewName);
				Views.tree.objTree.removeChildNodes(node);

				setTimeout(function(){
					Views.tree.objTree.addNodes(node, Views.tree.makeTree(renderTarget, renderTarget.viewName));
				},500);
			}
		});
		$('.private_movieclip #edit').click(function(){
			$('.anim_panel').show();
			Views.line.show(Views.render.renderTarget);
		});
		
		//切换按钮的状态
		$('.attr_panel #state').click(function(e){
			var renderTarget = Views.render.renderTarget,
				s = $(this).html(), src = '';
			if (s === 'normal') {
				o.bmpState = 'selected';
				renderTarget._resetUI('selected');
			} else if (s === 'selected') {
				o.bmpState = 'disabled';
				renderTarget._resetUI('disabled');
			} else {
				o.bmpState = 'normal';
				renderTarget._resetUI('normal');
			}
			Views.attr.update(renderTarget, o.bmpState);
			Views.render.updateMark(renderTarget);
		});
		$('.attr_panel').bind('change', function(e){
			var renderTarget = Views.render.renderTarget,
				target = e.target,
				name = target.id,
				val = target.value;
			switch(name) {
				case 'viewName':
				case 'text':
				case 'color':
				case 'fontFamily':
				case 'textAlign':
				case 'applyType':
					renderTarget[name] = val;
					break;
				case 'x': case 'y': case 'width': case 'height': case 'highlight':
				case 'regX': case 'regY': case 'scaleX': case 'scaleY':
				case 'rotation': case 'alpha': case 'fontSize': case 'lineWidth':
					renderTarget[name] = parseFloat(val);
					Views.render.updateMark(renderTarget);
					break;
				case 'visible':
				case 'mouseEnabled':
				case 'overflow':
				case 'effect':
					renderTarget[name] = target.checked;
					break;
				case 'border':
					if(target.checked) {
						renderTarget[name] = new createjs.Shadow("#000000", 1, 1, 1);
					} else {
						renderTarget[name] = null;
					}
					break;
				case 'class':
					renderTarget.htmlElement.className = val;
					break;
				case 'clip':
					var bmp = o.getBmp(renderTarget);
					bmp.sourceRect = target.checked? {
						x:0, y:0, width:bmp.image.width, height:bmp.image.height
					}: null;
					Views.attr.update(renderTarget, o.bmpState);
					break;
				case 'clipX': case 'clipY': case 'clipW': case 'clipH':
					var name = name==='clipX'?'x':name==='clipY'?'y':name==='clipW'?'width':'height',
						bmp = o.getBmp(renderTarget);
					bmp.sourceRect[name] = parseFloat(val);
					break;
				case 'lblText':
					renderTarget.setText(val);
					break;
				case 'lblColor':
					if(renderTarget.contentLbl) {
						renderTarget.contentLbl.color = val;
					}
					break;
				case 'rectX': case 'rectY': case 'rectW': case 'rectH':
					var name = name==='rectX'?'x':name==='rectY'?'y':name==='rectW'?'width':'height',
						f = renderTarget.spriteSheet.getFrame(renderTarget._currentFrame|0);
					
					f.rect[name] = parseFloat(val);
					break;
				case 'frameX': case 'frameY':
					var name = name==='frameX'?'regX':'regY',
						f = renderTarget.spriteSheet.getFrame(renderTarget._currentFrame|0);
					f[name] = parseFloat(val);
					break;
			}
			if (renderTarget === Views.line.currentItem) {
				Views.line.setFrameState(renderTarget);
			}
		});
	},
	getBmp: function(target){
		if (target instanceof cy.Bitmap) {
			return target;
		} else if (target instanceof cy.Button) {
			if (this.bmpState === 'normal') {
				return target._bmpNormal;
			} else if (this.bmpState === 'selected') {
				return target._bmpSelected;
			} else {
				return target._bmpDisabled;
			}
		}
	},
	update: function(obj, state){
		var o = this;
		$('.attr_base #type').val(obj.type);
		$('.attr_base #viewName').val(obj.viewName||'');
		if (obj.root) {
			$('.attr_base #viewName')[0].disabled = true;
		} else {
			$('.attr_base #viewName')[0].disabled = false;
		}
		$('.attr_public #x').val(obj.x);
		$('.attr_public #y').val(obj.y);
		$('.attr_public #width').val(obj.getMeasuredRect?obj.getMeasuredRect().width:obj.getMeasuredWidth?obj.getMeasuredWidth():0);
		$('.attr_public #height').val(obj.getMeasuredRect?obj.getMeasuredRect().height:obj.getMeasuredHeight?obj.getMeasuredHeight():0);
		$('.attr_public #regX').val(obj.regX);
		$('.attr_public #regY').val(obj.regY);
		$('.attr_public #scaleX').val(obj.scaleX);
		$('.attr_public #scaleY').val(obj.scaleY);
		$('.attr_public #rotation').val(obj.rotation);
		$('.attr_public #alpha').val(obj.alpha);
		$('.attr_public #visible').attr('checked', obj.visible);
		// $('.attr_public #mouseEnabled').attr('checked', obj.mouseEnabled);
		
		if(obj.type === 'Panel' || obj.type === 'ColorRect'){
			$('.attr_public #width')[0].disabled = false;
			$('.attr_public #height')[0].disabled = false;
		}else{
			$('.attr_public #width')[0].disabled = true;
			$('.attr_public #height')[0].disabled = true;	
		}
		
		if(obj instanceof cy.Panel){
			$('.private_panel').show();
			$('.private_panel #overflow')[0].checked = obj.overflow;
			$('.private_panel #applyType').val(obj.applyType||'none');
		}else{
			$('.private_panel').hide();
		}
		if(obj instanceof cy.Label){
			$('.private_label').show();
			$('.private_label #fontSize').val(obj.fontSize);
			$('.private_label #fontFamily').val(obj.fontFamily);
			$('.private_label #lineWidth').val(obj.lineWidth);
			$('.private_label #color').val(obj.color);
			$('.private_label #border').attr('checked', !!obj.border);
			$('.private_label #textAlign').val(obj.textAlign);
			$('.private_label #text').val(obj.text);
		}else{
			$('.private_label').hide();
		}
		if(obj instanceof cy.Bitmap){
			o.bmpState = 'none';
			var src = obj.image.src;
			$('.private_bitmap').show();
			$('.private_bitmap #url').attr('lang', src);
			$('.private_bitmap #url').html(src.substring(src.lastIndexOf('/')+1, src.length));
			$('.private_bitmap #highlight').val(obj.highlight);
			if(obj.sourceRect){
				$('.private_bitmap #clip').attr('checked', true);
				$('.private_bitmap #clipRect').show();
				$('.private_bitmap #clipX').val(obj.sourceRect.x);
				$('.private_bitmap #clipY').val(obj.sourceRect.y);
				$('.private_bitmap #clipW').val(obj.sourceRect.width);
				$('.private_bitmap #clipH').val(obj.sourceRect.height);
			} else {
				$('.private_bitmap #clip').attr('checked', false);
				$('.private_bitmap #clipRect').hide();
			}
			if (obj.repeatW) {
				$('.private_bitmap #repeatSize').val(obj.repeatW+','+obj.repeatH);
			} else {
				$('.private_bitmap #repeatSize').val('');
			}
		}else{
			$('.private_bitmap').hide();
		}	
		if(obj instanceof cy.Button){
			o.bmpState = state || 'normal';
			var bmp = this.getBmp(obj);
			var src = bmp.image.src;

			$('.private_button').show();
			$('.private_button #lblText').val(obj.contentLbl?obj.contentLbl.text:'');
			$('.private_button #lblColor').val(obj.contentLbl?obj.contentLbl.color:'#FFF');
			$('.private_button #url').attr('lang', src);
			$('.private_button #url').html(src.substring(src.lastIndexOf('/')+1, src.length));
			if(bmp.sourceRect){
				$('.private_button #clip').attr('checked', true);
				$('.private_button #clipRect').show();
				$('.private_button #clipX').val(bmp.sourceRect.x);
				$('.private_button #clipY').val(bmp.sourceRect.y);
				$('.private_button #clipW').val(bmp.sourceRect.width);
				$('.private_button #clipH').val(bmp.sourceRect.height);
			} else {
				$('.private_button #clip').attr('checked', false);
				$('.private_button #clipRect').hide();
			}
			$('.private_button #state').html(o.bmpState);
			$('.private_button #effect').attr('checked', obj.effect);
		}else{
			$('.private_button').hide();
		}	
		if(obj instanceof cy.ColorRect){
			$('.private_colorrect').show();
			$('.private_colorrect #color').val(obj.color);	
		}else {
			$('.private_colorrect').hide();
		}
		if(obj instanceof cy.ColorCircle){
			$('.private_colorcircle').show();
			$('.private_colorcircle #color').val(obj.color);	
		}else {
			$('.private_colorcircle').hide();
		}
		if(obj instanceof cy.TextField || obj instanceof cy.TextArea){
			$('.private_textfield').show();
			$('.private_textfield #class').val(obj.htmlElement.className);	
		}else {
			$('.private_textfield').hide();
		}
		if(obj instanceof cy.Sprite){
			$('.private_frame').hide();
			$('.private_animation').hide();
			if (obj.paused) {
				$('.private_frame').show();
				var f = obj.spriteSheet.getFrame(obj.currentFrame);
				var src = f.image.src;
				$('.private_frame #url').attr('lang', src);
				$('.private_frame #url').html(src.substring(src.lastIndexOf('/')+1, src.length));
				$('.private_frame #rectX').val(f.rect.x);
				$('.private_frame #rectY').val(f.rect.y);
				$('.private_frame #rectW').val(f.rect.width);
				$('.private_frame #rectH').val(f.rect.height);
				$('.private_frame #frameX').val(f.regX);
				$('.private_frame #frameY').val(f.regY);
			} else {
				$('.private_animation').show();
				var anim = 	obj.spriteSheet.getAnimation(obj.currentAnimation);
				$('.private_animation #name').val(obj.currentAnimation);
				$('.private_animation #start').val(anim.frames[0]);
				$('.private_animation #end').val(anim.frames[anim.frames.length-1]);
				$('.private_animation #next').val(anim.next);
				$('.private_animation #speed').val(anim.speed);
			}
		}else{
			$('.private_frame').hide();
			$('.private_animation').hide();
		}
		if(obj instanceof cy.MovieClip){
			$('.private_movieclip').show();
		} else {
			$('.private_movieclip').hide();
			if(obj.root) $('.anim_panel').hide();
		}
	}
});