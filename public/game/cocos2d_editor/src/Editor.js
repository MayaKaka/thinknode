var MainScene = ccui.Widget.extend({
	ctor: function(){
		this._super();
		var helloLbl = ccui.Text.create();
		helloLbl.setText('  Hello, HTML5 Gamer !');
		helloLbl.setFontName('tahoma');
		helloLbl.setFontSize(40);
		helloLbl.setColor(cc.color(150, 150, 150));
		helloLbl.setPosition(cc.p(g_views.width/2,g_views.height/2-50));
		this.addView(helloLbl);
		
		var logo = ccui.ImageView.create();
		logo.loadTexture("res/logo.png");
		logo.setPosition(cc.p(g_views.width/2,g_views.height/2+100));
		this.addView(logo);
	}
});



var ToolsCtrl = cc.Class.extend({
	ctor: function() {
		$('.tools_panel #export').bind('click', function(){
			nodesTree.save(g_views);
			$.ajax({
		        url: '/home/editor/export_data_cc',
		        type: 'POST',
		        dataType: 'json',
		        data: {
		        	name: g_views.name,
		            data: JSON.stringify(g_views)
		        }
		    }).done(function(data){
		    
		    });	
		});
		// run game on new window
		$('.tools_panel #run').bind('click', function(){
			window.open('../cocos2d_project/'+g_views.name+'/index.html');
		});
		// scale the canvas container
		$('.tools_panel #zoom').bind('change', function(){
			var zoom = $(this).val()/50;
			$('#Cocos2dGameContainer').css('transform', 'scale('+ zoom +','+ zoom +')');
		});
		// change canvas background color
		$('.tools_panel #background').bind('change', function(){
			document.getElementById('gameCanvas').style.backgroundColor =  $(this).val();
		});
		// canvas default background color
		$('.tools_panel #background').val('#000');
		// change start scene
		$("#startScene").bind("change", function(e){
			g_views.startScene = e.target.value;
		});
		$("#currentScene").bind("change", function(e){
			nodesTree.save(g_views);
			g_views.currentScene = e.target.value;
			nodesTree.createTree(g_views);
			
			gameStage.replaceScene(viewRoot);
			renderCtrl.mark(viewRoot);
			attrsCtrl.update(viewRoot);
		});
		// prevent browser default events
	    $(document).on({ 
	        dragleave: function(e) { e.preventDefault(); },  // dragleave
	        drop: function(e) { e.preventDefault(); },   	 // drop
	        dragenter: function(e) { e.preventDefault(); },  // dragenter
	        dragover: function(e) { e.preventDefault(); },   // dragover 
	    });
	},
	
	updateScenes: function(){
		var scenes = g_views.scenes,
			htmls = [];
		for (var i in scenes) {
			htmls.push("<option value=\""+ i +"\">"+ i +"</option>");
		}
		$("#startScene").html(htmls.join(""));
		$("#currentScene").html(htmls.join(""));
		
		$("#startScene").val(g_views.startScene);
		$("#currentScene").val(g_views.currentScene);
	}
});

var KeyboardCtrl = cc.Class.extend({
	ctrl: false,
	alt: false,
	frameTarget: null,
	copyTarget: null,
	ctor: function(){
		var o = this;
		$(document).bind('keydown', function(e){
			// 'CTRL'
			if (e.keyCode === 17) {
				o.ctrl = true;
			} // 'Alt'
			else if(e.keyCode === 18) {
				o.alt = true;
			} // 'Right'
			else if(e.keyCode === 39) {
				if (o.alt) {
					o.frameTarget && o.frameTarget.setPositionX(o.frameTarget.getPositionX()+1);
					e.preventDefault();
				}
			} // 'Left' 
			else if(e.keyCode === 37) {
				if (o.alt) {
					o.frameTarget && o.frameTarget.setPositionX(o.frameTarget.getPositionX()-1);
					e.preventDefault();
				}
			} // 'Down'
			else if(e.keyCode === 40) {
				if (o.alt) {
					o.frameTarget && o.frameTarget.setPositionY(o.frameTarget.getPositionY()-1);
					e.preventDefault();
				}
			} // 'Up'
			else if(e.keyCode === 38) {
				if (o.alt) {
					o.frameTarget && o.frameTarget.setPositionY(o.frameTarget.getPositionY()+1);
					e.preventDefault();
				}
			} // 'C'
			else if(e.keyCode === 67) {
				if (o.alt) {
					o.copyTarget = gameViews.exportData(renderCtrl.target);
					// cc.log(o.copyTarget);
				}
			} // 'V'
			else if(e.keyCode === 86) {
				if (o.alt && o.copyTarget) {
					// cc.log(o.copyTarget);
					var target = renderCtrl.target,
						obj = gameViews.parseData(o.copyTarget, gameStage.currentScene, viewMap);

					if (renderCtrl.isContainer(target.type)) {
						parent = target;
					} else {
						parent = target.getParentView();
					}
					parent.addView(obj);
					nodesTree.addTreeNode(parent, obj, o.copyTarget);
				}
			}
			 // 'D'
			else if(e.keyCode === 68) {
				if (o.alt) {
					var target = renderCtrl.target,
						rootId = target.treeNodeTitle.split('_')[0],
						nodeId = target.treeNodeTitle.split('_')[1],
						parent;
					if (rootId === nodeId) {
						if (o.frameTarget) {
							var idx = target._frames.indexOf(o.frameTarget);
							target.removeFrame(idx);
							nodesTree.addFrameNode(target);
						} else {
							parent = nodesTree.removeRootNode(target);
							parent.removeView(target);
						}
					} else {
						parent = nodesTree.removeTreeNode(target);
						parent.removeView(target);
					}
					
				}
			}// Enter
			else if(e.keyCode === 13) {
				if (o.alt) {
					var target = renderCtrl.target;
					if (target.type === 'Animation') {
						target.playAnimation('all');
						attrsCtrl.update(target);
					}
				}
			} 
		});
		$(document).bind('keyup', function(e){
			// 'CTRL'
			if (e.keyCode === 17) {
				o.ctrl = false;
			} // 'Alt'
			else if(e.keyCode === 18) {
				o.alt = false;
			} // 'S'
			else if (e.keyCode === 83) {

			} // 'C'
			else if(e.keyCode === 67) {

			} // 'V'
			else if(e.keyCode === 86) {

			} // 'D'
			else if(e.keyCode === 68) {
				
			} // 'X'
			else if(e.keyCode === 88) {
		
			}
		});
	}
});

var ImagePreview = cc.Class.extend({
	imageUrl: null,
	ctor: function(){
		var clipCanvas = $('.clip_canvas')[0],
			clipCtx = clipCanvas.getContext('2d'),
			startX = 0, startY = 0, endX = 0, endY = 0,
			rectW = 0, rectH = 0,
			down = false, o = this;
		
		$('.clip_canvas').bind('mousedown', function(e){
			startX = e.offsetX;
			startY = e.offsetY;
			down = true;
		});
		$('.clip_canvas').bind('mousemove', function(e){
			if (down) {
				clipCtx.clearRect(0,0,clipCanvas.width,clipCanvas.height);
				endX = e.offsetX;
				endY = e.offsetY;
				rectW = endX - startX;
				rectH = endY - startY;
				if (rectW>0 && rectH>0) {
					$(".clip_data").html("x："+startX+"，  y："+startY+"，  width："+rectW+"， height："+rectH);
					clipCtx.strokeStyle = "red";
					clipCtx.strokeRect(startX, startY, rectW, rectH);	
				}
			}
		});
		$('.clip_content').bind('mouseup', function(){
			down = false;
			if (rectW>0 && rectH>0) { 
				attrsCtrl.clipTextureRect(renderCtrl.target, cc.rect(startX, startY, rectW, rectH));
			}
		});
		$('.clip_panel').bind('click', function(e){
			if (e.target === this) {
				var target = renderCtrl.target;
				$('.clip_panel').hide();
				target.onSizeChanged && target.onSizeChanged();
				attrsCtrl.update(target);
				renderCtrl.mark(target);
			}
		});

		$('.preview_script #editScript').bind('click', function(){
			var url = $(".preview_panel #filePath").val();
			window.open('ace_editor.html?name='+ g_views.name  +'&url='+ url);
		});
	},
	showImage: function(url){
		$('.preview_image').show();
		$('.preview_script').hide();
		this.imageUrl = url;
		$('.preview_image').html('');
		var image = new Image();
		image.src = gameViews.getUrl(url);
		image.onload = function () {
			var frame = $('.preview_panel')[0],
				width = frame.clientWidth,
				height = frame.clientHeight,
				imgWid = image.naturalWidth,
				imgHet = image.naturalHeight;
			if (imgWid/width < imgHet/height) {
				$(image).css("width", height/imgHet*imgWid+"px");
				$(image).css("height", height+"px");
				
			} else {
				$(image).css("width", "100%");
				$(image).css("height", "auto");
			}
		};
		$(image).appendTo('.preview_image');
	},
	showScript: function(className, filePath) {
		$('.preview_image').hide();
		$('.preview_script').show();
		$('.preview_panel #className').val(className);
		$('.preview_panel #filePath').val(filePath);
	},
	showClip: function(url) {
		this.type = type;
		var img = new Image();
		img.src = gameViews.getUrl(url);
		img.onload = function(){
			var w = img.width, h = img.height,
				top = (window.innerHeight-h)/2;
			$('.clip_canvas').attr('width', w);
			$('.clip_canvas').attr('height', h);
			$('.clip_content').css('width', w+'px');
			$('.clip_content').css('height', h+'px');
			$('.clip_content').css('margin-top', (top>0?top:0)+'px');
			$('.clip_data').css('top', (top>0?(top-30):0)+'px');
			$('.clip_data').css('margin-left', (-w/2)+'px');
		};
		$('.clip_content img').remove();
		$(img).appendTo('.clip_content');
		$('.clip_panel').show();
	}
});