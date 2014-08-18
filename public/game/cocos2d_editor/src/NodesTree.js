
var NodesTree = cc.Class.extend({
	zTree: null,
	settings: {
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
					i0 = t0.title.split('_'),
					i1 = t1.title.split('_'), 
					o0 = viewMap[i0[1]];
				if (i1[0]===i1[1]) return false;
				var o1 = viewMap[i1[1]],
					parent;
				
				if (moveType==='inner' && t1.isParent) {
					parent = o0.getParentView();
					parent.removeView(o0);
					o1.addView(o0);
					return true;
				} else if (moveType==='prev') {
					parent = o0.getParentView();
					parent.removeView(o0);
					parent = o1.getParentView();
					var idx = parent.getChildren().indexOf(o1);
					parent.addViewAt(o0, idx);
					return true;
				} else if (moveType==='next') {
					parent = o0.getParentView();
					parent.removeView(o0);
					parent = o1.getParentView();
					var idx = parent.getChildren().indexOf(o1);
					parent.addViewAt(o0, idx+1);
					return true;
				}
				return false;
			},
			beforeClick: function(treeId, treeNode) {
				if (!treeNode.title) return;
				// cc.log("Select:", treeNode);
				var titles = treeNode.title.split('_'),
					root = viewMap[titles[0]],
					obj = viewMap[titles[1]],
					idx = titles[2],
					mark = titles[3];

				if(gameStage.currentScene!==root) {
					gameStage.replaceScene(root);
				}
				
				keyboardCtrl.frameTarget = null;
				if (mark === 'frame') {
					obj.playFrame(idx);
					keyboardCtrl.frameTarget = obj._frames[idx];
				} else if (mark === 'anim') {
					obj.playAnimation(idx);
				}

				renderCtrl.mark(obj);
				attrsCtrl.update(obj);	
			}
		}
	},
	
	ctor: function(){
		$(".nodes_panel #create_component").bind("click", function(){
			$(".nodes_panel .components_panel").show();
		});
		$(".nodes_panel .components_panel").bind("click", function(e){
			var type = e.target.lang;
			if (type==="Scene") {
				renderCtrl.addScene();
			} else {
				renderCtrl.addNode("Views_"+type);
			}
			$(".nodes_panel .components_panel").hide();
		});
	},
	save: function(data){
		var name = data.currentScene;
		data.scenes[name] = gameViews.exportData(viewRoot);
	},
	createTree: function(data){
		var zNodes = [],
			obj, node, name;
		
		if (data.currentScene) {
			name = data.currentScene;
		} else {
			for (var i in data.scenes) {
				name = i;
				break;
			}
		}
		data.currentScene = name;
		
		obj = gameViews.parseData(data.scenes[name], null, viewMap);
		obj.setViewTag(name);
		viewRoot = obj;
		
		node = this.createTreeNode(obj);
		node.name = name;
		node.drag = false;
		zNodes.push(node);
				
		var zTree = $.fn.zTree.init($("#nodes_tree"), this.settings, zNodes);
		zTree.setting.edit.drag.isCopy = true;
		zTree.setting.edit.drag.isMove = true;
		zTree.setting.edit.drag.prev = true;
		zTree.setting.edit.drag.inner = true;
		zTree.setting.edit.drag.next = true;
		this.zTree = zTree;
	},
	
	createTreeNode: function(obj){
		var o = this,
			node = { name: obj.type, title: obj.treeNodeTitle, drag: true },
			children;
			
		if (obj.getViewTag()) {
			node.name = obj.getViewTag();
		}

		if (renderCtrl.isContainer(obj.type)) {
			node.children = [];
			node.isParent = true;
			
			children = obj.getChildrenView();
			children.forEach(function(a, i){
				node.children.push(o.createTreeNode(a));
			});
			children = obj.getNodes?obj.getNodes():[];
			children.forEach(function(a, i){
				node.children.push(o.createTreeNode(a));
			});
			
		} else if (obj.type==='Animation') {
			node.children = [];
			node.isParent = true;
			obj._frames.forEach(function(a, i){
				node.children.push({
					name: (obj.getViewTag()||"frame")+'_'+i,
					title: obj.treeNodeTitle+'_'+i+'_frame',
					drag: false, isParent: false
				});
			});
			for (var i in obj._animations) {
				node.children.push({
					name: i,
					title: obj.treeNodeTitle+'_'+i+'_anim',
					drag: false, isParent: true
				});
			}
		}
		return node;
	},
	
	addTreeNode: function(parent, child) {
		var node = this.zTree.getNodeByParam('title', parent.treeNodeTitle);

		this.zTree.addNodes(node, [this.createTreeNode(child)]);
		
	},
	
	addFrameNode: function(parent) {
		var node = this.zTree.getNodeByParam('title', parent.treeNodeTitle),
			rootId = node.title.split('_')[0],
			childNodes = [];
		this.zTree.removeChildNodes(node);
		for (var i=0,l=parent._frames.length; i<l; i++) {
			childNodes.push({
				name: (parent.getViewTag()||"frame")+'_'+i,
				title: parent.treeNodeTitle+'_'+i+'_frame',
				drag: false, isParent: false
			});
		}
		for (var i in parent._animations) {
			childNodes.push({
				name: i,
				title: parent.treeNodeTitle+'_'+i+'_anim',
				drag: false, isParent: true
			});
		}
		this.zTree.addNodes(node, childNodes);
	},
	
	addRootNode: function(child){
		this.zTree.addNodes(null, [{
			name: child.getViewTag(), title:child.treeNodeTitle, drag: false, isParent: true
		}]);
	},
	
	removeTreeNode: function(child) {
		var node = this.zTree.getNodeByParam('title', child.treeNodeTitle),
			parent = child.getParentView();
		this.zTree.removeNode(node);
		return parent;
	},
	
	removeRootNode: function(child) {
		var node = this.zTree.getNodeByParam('name', child.getViewTag());
		delete viewRoots[child.getViewTag()];
		this.zTree.removeNode(node);
	},
	
	rename: function(target){
		var node = this.zTree.getNodeByParam('title', target.treeNodeTitle);
		node.name = target.getViewTag();
		this.zTree.updateNode(node);
	}
});