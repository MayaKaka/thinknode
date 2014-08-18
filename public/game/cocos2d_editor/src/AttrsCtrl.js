
var AttrsCtrl = cc.Class.extend({
	ctor: function(){
		var o = this;
		// modify properties of display node 
		$('.attrs_panel').bind('change', function(e){
			var attrName = e.target.id,
				value = e.target.value,
				target = renderCtrl.target;
			switch (attrName) {
				// Node._viewTag
				case 'tag': target.setViewTag(value); nodesTree.rename(target);
					break;
				// Node.transform
				case 'x':   target.setPositionX(parseFloat(value));
					break;
				case 'y':   target.setPositionY(parseFloat(value));
					break;
				case 'xy':  target.setPosition(cc.p(parseFloat(value),parseFloat(value)));
					break;
				case 'ry':  target.setRotationX(parseFloat(value));
					break;
				case 'ry':  target.setRotationY(parseFloat(value));
					break;
				case 'rxy': target.setRotation(parseFloat(value));
					break;
				case 'sx':  target.setScaleX(parseFloat(value));
					break;
				case 'sy':  target.setScaleY(parseFloat(value));
					break;
				case 'sxy': target.setScale(parseFloat(value));
					break;
				case 'ax': 
				case 'ay':  target.setAnchorPoint(cc.p(parseFloat($('.attrs_panel #ax').val()), parseFloat($('.attrs_panel #ay').val())));
					break;
				case 'axy': target.setAnchorPoint(cc.p(parseFloat($('.attrs_panel #axy').val()), parseFloat($('.attrs_panel #axy').val())));
					break;
				// Node.property
				case 'opacity': target.setOpacity && target.setOpacity(parseFloat(value));
					break;
				case 'visible': target.setVisible(e.target.checked);
					break;
				case 'zOrder': target.setLocalZOrder(parseFloat(value));
					break;
				case 'width': 
				case 'height': target.setSize(cc.size(parseFloat($('.attrs_panel #width').val()), parseFloat($('.attrs_panel #height').val())));
					break;
				// ScrollView.innerSize
				case 'innerWidth': 
				case 'innerHeight': target.setInnerContainerSize(cc.size(parseFloat($('.attrs_panel #innerWidth').val()), parseFloat($('.attrs_panel #innerHeight').val())));
					break;
				// Text
				case 'text': target.setText(value); 
					break;
				case 'btext': target.setAnchorPoint(cc.p(0.5, 0.5)); target.setTitleText(value); 
					break;
				case 'fontName': target.setFontName(value); 
					break;
				case 'bfontName': target.setTitleFontName(value); 
					break;
				case 'fontSize': target.setFontSize(parseFloat(value)); 
					break;
				case 'bfontSize': target.setTitleFontSize(parseFloat(value)); 
					break;
				case 'color': target.setColor(gameViews.parseColor(value)); 
					break;
				case 'bcolor': target._titleRenderer.setColor(gameViews.parseColor(value));
					break;
				// ScrollView | ListView
				case 'direction': 
				case 'ldirection': target.setDirection(parseFloat(value)); 
					break;
				case 'bounce': 
				case 'lbounce': target.setBounceEnabled(e.target.checked); 
					break;
				// Button.state | CheckBox.state
				case "state": 
				case "cstate": target.state = parseFloat(value);
					break;
				// ImageView._imageRenderer | Button._renderer | Animation._currentFreme
				case '_sizeX': case '_sizeY': case '_sizeWidth': case '_sizeHeight':
				case 'b_sizeX': case 'b_sizeY': case 'b_sizeWidth': case 'b_sizeHeight':
				case 'f_sizeX': case 'f_sizeY': case 'f_sizeWidth': case 'f_sizeHeight':
					var render = o.getRender(target);
					o.setTextureRect(target, render);
					target.onSizeChanged && target.onSizeChanged();
					break;
				// Animation._currentFrame.getPosition()
				case 'offsetX':
					target._currentFrame.setPositionX(parseFloat(value));
					break;
				case 'offsetY':
					target._currentFrame.setPositionY(parseFloat(value));
					break;
				// Animation._defaultAnimationName
				case 'defaultAnim':
					target.setDefaultAnimation(value);
					break;
				case 'defaultTween':
					target.getComp("mc").setDefaultAnimation(value);
					break;
				// Particle
				case 'particleType':
					target.createParticle(value, target._particleFileName);
					break;
				
				default: return;
			}
			attrsCtrl.update(target);
			renderCtrl.mark(target);
			timeline.update(renderCtrl.target);
		});
		$('.attrs_panel .clipImage').bind('click', function(e){
			// clip the image of ImageView | Button | Animation
			imagePreview.showClip($('.attrs_panel .'+renderCtrl.target.type+' .imageUrl').val());
		});
		$('.attrs_panel .imageUrl').bind('click', function(e){
			if ($(this).val()) {
				// show the image of ImageView | Button | Animation
				imagePreview.showImage($(this).val());
			}
		});
		$('.attrs_panel .changeImage').bind('click', function(e){
			var url = imagePreview.imageUrl;
			if (!url) return;
			// add texture to ImageView | Button | Animation
			o.addTexture(renderCtrl.target, url);
		});
		$('.attrs_panel #addFrame').bind('click', function(e){
			// add Animation Frame
			renderCtrl.target.addFrame('res/image.png', cc.rect(0,0,80,80), cc.p(0, 0));
			nodesTree.addFrameNode(renderCtrl.target);
		});
		$('.attrs_panel #autoFrame').bind('click', function(e){
			// auto generate Animation frames
			var cols = parseFloat(prompt('Please Input The Cols :')),
				rows = parseFloat(prompt('Please Input The Rows :')),
				img = $('.preview_image img')[0];
			if (cols && rows && img) {
				var w = img.naturalWidth,
					h = img.naturalHeight,
					tw = Math.floor(w / cols),
					th = Math.floor(h / rows);
				var frames = [];
				for(var j=0,jl=rows; j<jl; j++) {
					for(var i=0,il=cols; i<il; i++) {
						renderCtrl.target.addFrame(
							img.src, cc.rect(i*tw, j*th, tw, th), cc.p(-Math.floor(tw/2),-Math.floor(th/2))
						);	
					}
				}
				nodesTree.addFrameNode(renderCtrl.target);
			}
		});
		$('.attrs_panel #addAnim').bind('click', function(e){
			// add Animation animation
			renderCtrl.target.addAnimation(
				$('.attrs_panel #animName').val(), 
				parseFloat($('.attrs_panel #startFrame').val()), 
				parseFloat($('.attrs_panel #endFrame').val()), 
				$('.attrs_panel #animName').val(),
				parseFloat($('.attrs_panel #speed').val()));
			nodesTree.addFrameNode(renderCtrl.target);
		});
		$('.attrs_panel #apply').bind('click', function(e){
			// apply to prefabs | animations
			var tag = renderCtrl.target.getViewTag();
			tag = tag.charAt(0).toUpperCase() + tag.substring(1, tag.length);
			var name = prompt('Please Input The Name Of Prefab :', tag),
				target = renderCtrl.target;
			if (!name) return;	
			if (target instanceof ccp.Animation) {
				g_views.animations[name] = gameViews.exportData(target);
				assetsTree.updateAnimTree(g_views, "Animations");
			} else {
				g_views.prefabs[name] = gameViews.exportData(target);
				assetsTree.updateAnimTree(g_views, "Prefabs");
			}
		});
		$(".attrs_panel h3").bind("click", function(){
			$(this).next("table").toggleClass("none");
		});
	},
	update: function(obj) {
		var o = this;
		// show properties of Node
		$('.attrs_panel #type').val(obj.type);
		$('.attrs_panel #tag').val(obj.getViewTag());
		// show transform
		$('.attrs_panel #x').val(obj.getPosition().x);
		$('.attrs_panel #y').val(obj.getPosition().y);
		$('.attrs_panel #xy').val(obj.getPosition().x);
		$('.attrs_panel #rx').val(obj.getRotationX());
		$('.attrs_panel #ry').val(obj.getRotationY());
		$('.attrs_panel #rxy').val(obj.getRotation());
		$('.attrs_panel #sx').val(obj.getScaleX());
		$('.attrs_panel #sy').val(obj.getScaleY());
		$('.attrs_panel #sxy').val(obj.getScaleX());
		$('.attrs_panel #ax').val(obj.getAnchorPoint().x);
		$('.attrs_panel #ay').val(obj.getAnchorPoint().y);
		$('.attrs_panel #axy').val(obj.getAnchorPoint().x);
		// show property
		$('.attrs_panel #width').val(obj.getSize?obj.getSize().width:0);
		$('.attrs_panel #height').val(obj.getSize?obj.getSize().height:0);
		$('.attrs_panel #opacity').val(obj.getOpacity?obj.getOpacity():255);
		$('.attrs_panel #visible').attr('checked', obj.isVisible());
		$('.attrs_panel #zOrder').val(obj.getLocalZOrder());
		
		if (renderCtrl.isContainer(obj.type) && obj.type!=='Widget') {
			$('.attrs_panel #width').attr('disabled', false);
			$('.attrs_panel #height').attr('disabled', false);
		} else {
			$('.attrs_panel #width').attr('disabled', true);
			$('.attrs_panel #height').attr('disabled', true);
		}
		
		// update components
		var selectDOM = $('.attrs_panel .component table tbody');
		var htmls = [];
		if (obj._comps) {
			for (var i in obj._comps) {
				htmls.push([
					'<tr>',
					'<td>Name</td><td><input type="text" value="'+ i +'" readonly="true"/></td>',
                	'<td class="rt">Class</td><td><input type="text" value="'+ obj._comps[i][0] +'" readonly="true" ondragover="allowDrop(event)" ondrop="changeComp(event)" name="'+i+'" onclick="editComp(event)" /></td>',
                	'<td><input class="delComp" type="button" value="Delete" onclick=delComp("'+i+'") /></td>',
                	'</tr>'
				].join(''));
			}
		}
		htmls.push('<tr><td colspan="5"><input class="addComp" type="button" value="Add Component" onclick=addComp() /></td></tr>');
		selectDOM.html(htmls.join(""));
		// update tweens
		/*
		selectDOM = $('.attrs_panel .tween table tbody');
		htmls = [];
		if (obj._tweens) {
			for (var i in obj._tweens) {
				htmls.push([
					'<tr>',
					'<td>Animation</td><td><input type="text" value="'+ i +'" readonly="true"/></td>',
					'<td><input type="button" value="Play" name="'+i+'" onclick=playTween("'+i+'") /></td>',
                	'<td><input type="button" value="Edit" name="'+i+'" onclick=editTween("'+i+'") /></td>',
                	'<td><input type="button" value="Delete" name="'+i+'" onclick=delTween("'+i+'") /></td>',
                	'</tr>'
				].join(''));
			}
			htmls.push('<tr><td>defaultAnim</td><td><input id="defaultTween" type="text" value="'+ obj.getComp("mc")._defaultAnimationName +'"/></td></tr>');
		}
		
		htmls.push('<tr><td colspan="5"><input class="addTween" type="button" value="Add Tween" onclick=addTween() /></td></tr>');
		selectDOM.html(htmls.join(""));
		*/
		$('.attrs_panel>div').each(function(i, a){
			if (a.className === "public"||a.className === "transform"||a.className === "property"||a.className === "component"||a.className === "tween") return;
			if (a.className === obj.type){
				$(this).show();	
			} else{
				$(this).hide();
			}
		});

		switch (obj.type) {
			case 'Widget':
				break;
			case 'Layout':
				if (obj._backGroundImageFileName) {
					$('.attrs_panel .Layout .imageUrl').val(gameViews.getUrl(obj._backGroundImageFileName, true));
				} else {
					$('.attrs_panel .Layout .imageUrl').val('');
				}
				break;
			case 'Text':
				$('.attrs_panel #text').val(obj.getStringValue());
				$('.attrs_panel #fontName').val(obj._labelRenderer.getFontName());
				$('.attrs_panel #fontSize').val(obj._labelRenderer.getFontSize());
				$('.attrs_panel #color').val(gameViews.exportColor(obj.getColor()));
				break;
			case 'ImageView':
				$('.attrs_panel .ImageView .imageUrl').val(gameViews.getUrl(obj._textureFile, true));
				o.updateTextureRect(obj);
				break;
			case 'Button':
				if (obj.getTitleText()) {
					$('.attrs_panel #btext').val(obj.getTitleText());
					$('.attrs_panel #bfontName').val(obj.getTitleFontName());
					$('.attrs_panel #bfontSize').val(obj.getTitleFontSize());
					$('.attrs_panel #bcolor').val(gameViews.exportColor(obj.getTitleColor()));
					$('.attrs_panel #bfontName').parent().parent().show();
					$('.attrs_panel #bfontSize').parent().parent().show();
					$('.attrs_panel #bcolor').parent().parent().show();
				} else {
					$('.attrs_panel #btext').val('');
					$('.attrs_panel #bfontName').parent().parent().hide();
					$('.attrs_panel #bfontSize').parent().parent().hide();
					$('.attrs_panel #bcolor').parent().parent().hide();
				}
				if (!obj.state) obj.state = 1; 
				$('.attrs_panel .Button .imageUrl').val(gameViews.getUrl(
					obj.state===1?obj._normalFileName:obj.state===2?obj._clickedFileName:obj._disabledFileName, 
					true));
				o.setState(obj);
				o.updateTextureRect(obj);
				break;
			case 'CheckBox':
				if (!obj.state) obj.state = 1;
				$('.attrs_panel .CheckBox .imageUrl').val(gameViews.getUrl(obj.state===1?obj._backGroundFileName:obj._frontCrossFileName, true));
				o.setState(obj);
				break;
			case 'ScrollView':
				$('.attrs_panel #innerWidth').val(obj.getInnerContainerSize().width);
				$('.attrs_panel #innerHeight').val(obj.getInnerContainerSize().height);
				$('.attrs_panel #direction').val(obj.getDirection());
				$('.attrs_panel #bounce').attr('checked', obj.isBounceEnabled());
				break;
			case 'ListView':
				$('.attrs_panel #ldirection').val(obj.getDirection());
				$('.attrs_panel #lbounce').attr('checked', obj.isBounceEnabled());
				break;
			case 'Animation':
				if (obj._currentFrame) {
					$('.attrs_panel .Animation .imageUrl').val(gameViews.getUrl(obj._currentFrame.getTexture().getHtmlElementObj().src, true));
					o.updateTextureRect(obj);
					$('.attrs_panel #offsetX').val(obj._currentFrame.getPosition().x);
					$('.attrs_panel #offsetY').val(obj._currentFrame.getPosition().y);	
				} else {
					$('.attrs_panel .Animation .imageUrl').val("");
					o.updateTextureRect(obj);
					$('.attrs_panel #offsetX').val("");
					$('.attrs_panel #offsetY').val("");
				}
				if (obj._defaultAnimationName) {
					$('.attrs_panel #defaultAnim').val(obj._defaultAnimationName);
				} else {
					$('.attrs_panel #defaultAnim').val("");
				}
				if (obj._currentAnimation) {
					$('.attrs_panel #animName').val(obj._currentAnimation.name);
					$('.attrs_panel #startFrame').val(obj._currentAnimation.start);
					$('.attrs_panel #endFrame').val(obj._currentAnimation.end);
					$('.attrs_panel #speed').val(obj._currentAnimation.speed);
				}  else {
					$('.attrs_panel #animName').val("");
					$('.attrs_panel #startFrame').val("");
					$('.attrs_panel #endFrame').val("");
					$('.attrs_panel #speed').val("");
				}
				break;
			case 'Particle':
				$('.attrs_panel #particleType').val(obj._particleType);
				$('.attrs_panel .Particle .imageUrl').val(gameViews.getUrl(obj._particleFileName, true));
				break;
		}
	},
	
	// change component
	changeComp: function(target, name, url) {
		if (url.match(/.js$/g)) {
			var className = url.replace(/.js$/g, ""),
				index = className.lastIndexOf("/");
			className = className.substring(index+1, className.length);
			target._comps[name] = [className, url];
			attrsCtrl.update(target);
		}
	},
	
	// get render
	getRender: function(target) {
		if (target.type === "ImageView") {
			return target._imageRenderer;
		} else if (target.type === "Button") {
			return target.state===1?target._buttonNormalRenderer:
				   target.state===2?target._buttonClickedRenderer: 
				   					target._buttonDisableRenderer;
		} else if (target.type === "CheckBox") {
			return target.state===1?target._backGroundBoxRenderer:target._frontCrossRenderer;
			
		} else if (target.type === "Animation") {
			return target._currentFrame;
		}
		return null;
	},
	
	// set Button|CheckBos state
	setState: function(target) {
		if (target.type === "Button") {
			target.state===1?target.onPressStateChangedToNormal():
			target.state===2?target.onPressStateChangedToPressed(): 
				   					target.onPressStateChangedToDisabled();
		} else if (target.type === "CheckBox") {
			target.state===1?target.onPressStateChangedToNormal():target.onPressStateChangedToPressed();
		}
	},
	
	// set texture rect
	setTextureRect: function(target, render) {
		var header = target.type==="ImageView"?"":
					target.type==="Button"?"b":
					target.type==="CheckBox"?"c":
					target.type==="Animation"?"f":"";
		render.setTextureRect(cc.rect(
			parseFloat($('.attrs_panel #'+header+'_sizeX').val()), 
			parseFloat($('.attrs_panel #'+header+'_sizeY').val()),
			parseFloat($('.attrs_panel #'+header+'_sizeWidth').val()), 
			parseFloat($('.attrs_panel #'+header+'_sizeHeight').val())
		));
	},
	
	// update texture rect
	updateTextureRect: function(target) {
		var render = this.getRender(target);
		var header = target.type==="ImageView"?"":
					target.type==="Button"?"b":
					target.type==="CheckBox"?"c":
					target.type==="Animation"?"f":"";
		var rect = render?render.getTextureRect():{x:"",y:"",width:"",height:""};
		$('.attrs_panel #'+header+'_sizeX').val(rect.x);
		$('.attrs_panel #'+header+'_sizeY').val(rect.y);
		$('.attrs_panel #'+header+'_sizeWidth').val(rect.width);
		$('.attrs_panel #'+header+'_sizeHeight').val(rect.height);
	},
	
	// clip texture rect
	clipTextureRect: function(target, rect) {
		var render = this.getRender(target);
		render.setTextureRect(rect);
		target._updateSize && target._updateSize();
		renderCtrl.mark(target);
		attrsCtrl.update(target);
	},
	
	// add new texture
	addTexture: function(target, url){
		url = gameViews.getUrl(url);
		// case "ImageView"
		if (target.type === "ImageView") {
			this.reloadTexture(target, 'loadTexture', url);
		} 
		// case "Button"
		else if (target.type === "Button") {
			target.state===1?this.reloadTexture(target, 'loadTextureNormal', url):
			target.state===2?this.reloadTexture(target, 'loadTexturePressed', url): 
				   			 this.reloadTexture(target, 'loadTextureNormal', url);
		} 
		// case "CheckBox"
		else if (target.type === "CheckBox") {
			target.state===1?(this.reloadTexture(target, 'loadTextureBackGround', url)
							  && this.reloadTexture(target, 'loadTextureBackGroundSelected', url)):
							  this.reloadTexture(target, 'loadTextureFrontCross', url);
			
		} 
		// case "Animation"
		else if (target.type === "Animation") {
			target._currentFrame.initWithFile(url);
			target._currentFrame.setAnchorPoint(cc.p(0, 0));
		} 
		// case "Layout"
		else if (target.type === "Layout") {
			target.setBackGroundImageScale9Enabled(true);
        	target.setBackGroundImage(url);
		} 
		// case "Particle"
		else if (target.type === "Particle") {
			target.createParticle(target._particleType, url);
		}
		renderCtrl.mark(target);
		attrsCtrl.update(target);
	},
	
	// load new texture
	reloadTexture: function(target, funcName, url) {
		target[funcName](url);
		// update render clip rect
		var render = this.getRender(target);
		if (render) {
			render.addLoadedEventListener(function(){
				var size = render.getTexture().getContentSize();
				render.setTextureRect(cc.rect(0,0,size.width,size.height));
				
				target.onSizeChanged && target.onSizeChanged();
				renderCtrl.mark(target);
				attrsCtrl.update(target);
			});
		}
	}

});