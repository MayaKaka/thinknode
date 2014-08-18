
//树管理器
var Tree = Class.extend({
	objTree: null,
	assTree: null,
	objTreeSetting: {
		edit: { enable: true, showRemoveBtn: false, showRenameBtn: false, drag: { } },
		view: { dblClickExpand: false, showLine: true, selectedMulti: false },
		data: {
			keep: { parent:true, leaf:true },
			simpleData: { enable:true, idKey: "id", pIdKey: "pId", rootPId: "" } },
		callback: {
			beforeDrag: function(treeId, treeNodes) {
				for (var i=0,l=treeNodes.length; i<l; i++) {
					if (treeNodes[i].drag === false) {
						return false;
					}
				}
				return true;
			},
			beforeDrop: function(treeId, treeNodes, targetNode, moveType) {
				var t0 = treeNodes[0],
					t1 = targetNode,
					o0 = Views.map[t0.title.split('_')[1]];
				if (!t1.title) return false;
				var o1 = Views.map[t1.title.split('_')[1]];
				if (moveType==='inner' && t1.isParent) {
					o1.addChild(o0);
					return true;
				} else if (moveType==='prev') {
					o0.parent.removeChild(o0);
					var idx = o1.parent.children.indexOf(o1);
					o1.parent.addChildAt(o0, idx);
					return true;
				} else if (moveType==='next') {
					o0.parent.removeChild(o0);
					var idx = o1.parent.children.indexOf(o1);
					o1.parent.addChildAt(o0, idx+1);
					return true;
				}
				return false;
			},
			beforeClick: function(treeId, treeNode) {
				if (treeNode.name ==='界面' || treeNode.name ==='动画') return;
				var root, obj;
				if (treeNode.title) {
					root = Views.roots[treeNode.title.split('_')[0]];
					obj = Views.map[treeNode.title.split('_')[1]];
				} else {
					obj = Views.roots[treeNode.name];
				}
				if (!obj) {
					obj = root;
					if (treeNode.isParent) {
						obj.gotoAndPlay(treeNode.title.split('_')[1]);
					} else {
						obj.gotoAndStop(treeNode.title.split('_')[1]);
					}	
				} else if (obj.root) {
					App.clearStage();
					App.stage.addChild(obj);
					obj.gotoAndStop && obj.gotoAndStop(0);
				} else if(root) {
					if (App.stage.children[0]!==root) {
						App.clearStage();
						App.stage.addChild(root);
					}
				}
				Views.render.selectTarget(obj);
			}
		}
	},
	assTreeSetting: {
		view: { dblClickExpand: false, showLine: true, selectedMulti: false },
		data: { simpleData: { enable:true, idKey: "id", pIdKey: "pId", rootPId: "" } },
		callback: {
			beforeClick: function(treeId, treeNode) {
				if (!treeNode.isParent) {
					Views.preview.show(treeNode.title || treeNode.name);
				} else {
					if (treeNode.children && treeNode.children.length > 0) return;
					$.ajax({
						url: '/home/editor/get_image_list',
						type: 'GET',
						dataType: 'json',
						data:{
							dir: (treeNode.title || treeNode.name) + '/'
						}
					}).done(function(data){
						Views.tree.makeAssTree(data, treeNode);
					});
				}
				return true;
			}
		}
	},
	init: function(){
		cy.$("#objects_tree").bind('drop', function(e){
			var name = e.dataTransfer.getData("Text");
			if (name === 'SpriteFrame' || name === 'SpriteAnimation') return;
			var vname = prompt('请输入 '+ name +'的名称:');
			if (vname) {
				var obj = Views.createEmpty(name, Views.map);
				obj.root = true;
				obj.viewName = vname;
				Views.roots[vname] = obj;
				Views.render.appendTo(obj);
			}
		});
		$(".assets_panel #refresh").click(function(){
			$.ajax({
				url: '/home/editor/get_image_list',
				type: 'GET',
				dataType: 'json',
				data: {}
			}).done(function(data){
				Views.tree.createAssetsTree(data);
			});
		});
	},
	makeTree: function(obj, root){
		var o = this;
		if (obj.children && !obj.isnotContainer) {
			if(obj.children.length === 0) return 'parent';
			var arr = [];
			obj.children.forEach(function(aa, bb){
				aa.title =  root+'_'+aa.id;
				var node = {
					name: aa.type+(aa.viewName?('【'+aa.viewName+'】'):''),
					title: aa.title,
					drag: true
				};
				var tree = o.makeTree(aa, root);
				if(tree) {
					if(tree === 'parent'){
						node.isParent = true;
					} else {
						node.children = tree;
					}	
				}
				arr.push(node);
			});
			return arr;
		} else if(obj.spriteSheet) {
			var frames = obj.spriteSheet._frames;
			var arr = [];
			frames.forEach(function(aa, bb){
				var node = {
					name: root+'→ '+bb,
					title: root+'_'+bb,
					drag: false
				};
				arr.push(node);
			});
			var data = obj.spriteSheet._data;
			for(aa in data){
				var node = {
					name: aa,
					title: root+'_'+aa,
					isParent: true
				};
				arr.push(node);
			}
			return arr;
		} else {
			return false;
		}
	},
	createObjectsTree: function(data){
		var setting = this.objTreeSetting, a;
		var uiTree = [], animTree = [],
			zNodes = [
				{ name: '界面', drag: false, isParent: true, children: uiTree },
				{ name: '动画', drag: false, isParent: true, children: animTree }
			];
		
		for(var name in Views.roots){
			a = Views.roots[name];
			var node = {
				name: name,
				drag: false
			};
			var tree = this.makeTree(a, name);
			if(tree) {
				if(tree === 'parent'){
					node.isParent = true;
				} else {
					node.children = tree;
				}	
			}
			if (a.type === 'Sprite' || a.type === 'MovieClip') {
				animTree.push(node);
			} else {
				uiTree.push(node);
			}
		}
		var zTree = $.fn.zTree.init($("#objects_tree"), setting, zNodes);
		zTree.setting.edit.drag.isCopy = true;
		zTree.setting.edit.drag.isMove = true;
		zTree.setting.edit.drag.prev = true;
		zTree.setting.edit.drag.inner = true;
		zTree.setting.edit.drag.next = true;
		this.objTree = zTree;
	},
	assCount: 0,
	makeAssTree: function(data, treeNode){
		var zTree = $.fn.zTree.getZTreeObj("assets_tree"), o = this;
		data.forEach(function(a, i){
			var fileType = a.substring(a.length-3, a.length);
				isParent = false;
			if (fileType!=='png' && fileType!=='jpg' && fileType!=='gif'){
				isParent = true;
			}
			zTree.addNodes(treeNode, {id:(3111 + o.assCount++), pId:treeNode.id, isParent:isParent, title:a, name: a.substring(a.lastIndexOf('/')+1, a.length)});
		});
	},
	createAssetsTree: function(data){
		var setting = this.assTreeSetting, zNodes = [];
		data.forEach(function(a, i){
			var node = { name: a };
			var fileType = a.substring(a.length-3, a.length);
			if( fileType!=='png' && fileType!=='jpg' && fileType!=='gif'){
				node.isParent = true;
			}
			zNodes.push(node);
		});
		var zTree = $.fn.zTree.init($("#assets_tree"), setting, zNodes);
	},
	updateSpriteNode: function(renderTarget){
		var node = Views.tree.objTree.getNodeByParam('name', renderTarget.viewName);
		this.objTree.removeChildNodes(node);
		this.objTree.addNodes(node, Views.tree.makeTree(renderTarget, renderTarget.viewName));
	}
});

//图片预览
var Preview = Class.extend({
	imageZoom: 1,
	lockX: 0,
	lockY: 0,
	lockW: 0,
	lockY: 0,
	init: function(){
		var o = this;
		$('.show_image_canvas').bind('mouseover', function(){
			Views.keyboard.focus = 'preview_panel';	
		});
		$('.show_image_canvas').bind('mousemove', function(e){
			var x = e.offsetX,
				y = e.offsetY,
				sx = Math.round(x/o.imageZoom),
				sy = Math.round(y/o.imageZoom);
			if (Views.keyboard.ctrl) {
				o.lockW = sx-o.lockX;
				o.lockH = sy-o.lockY;
				$('.show_image_pos').html(o.lockX+','+o.lockY+','+o.lockW+','+o.lockH);
				var ctx = $('.show_image_canvas')[0].getContext('2d');
				ctx.clearRect(0,0,340,300);
				ctx.strokeStyle = '#FF0';
				ctx.strokeRect(o.lockX*o.imageZoom, o.lockY*o.imageZoom, o.lockW*o.imageZoom, o.lockH*o.imageZoom);
			} else {
				o.lockX = sx;
				o.lockY = sy;
				$('.show_image_pos').html(sx+','+sy);
			}
		});
	},
	show: function(url){
		if(typeof(url) !== 'string') {
			url = url.target.lang;
		}
		var o = this;
		if (url.indexOf("http://")===-1) {
			url = '../createjs_project/'+url;
		}
		$('.show_image').remove();
		var img = $('<img class="show_image" src="'+url+'">'),
			canvas = $('.show_image_canvas');
		img[0].onload =  function(){
			var w = img[0].width,
				h = img[0].height,
				sx = 1, sy = 1, s = 1;
			$('.show_image_info').html(w+' * '+h);
			$('.show_image_pos').html('');
			if (w>330) { sx = 330/w; }
			if (h>290) { sy = 290/h; }
			s = sx<=sy? sx:sy;
			o.imageZoom = s;
			img[0].width = w = img[0].width*s;
			img[0].height = h = img[0].height*s;
			img.css('margin-left', -w/2+'px');
			img.css('margin-top', -h/2+'px');
			canvas[0].width = w;
			canvas[0].height = h;
			canvas.css('width', w+'px');
			canvas.css('height', h+'px');
			canvas.css('margin-left', -w/2+'px');
			canvas.css('margin-top', -h/2+'px');
			img.appendTo('.image_panel');
		};
	}
});