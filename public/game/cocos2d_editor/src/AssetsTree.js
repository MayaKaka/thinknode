
// Assets Tree & Resource List Panel
var AssetsTree = cc.Class.extend({
	zTree: null,
	settings: {
		view: { dblClickExpand: false, showLine: true, selectedMulti: false },
		data: { simpleData: { enable:true, idKey: "id", pIdKey: "pId", rootPId: "" } },
		callback: {
			beforeClick: function(treeId, treeNode) {
				if (!treeNode) return;
				
				var url = (treeNode.title||'') + treeNode.name;
				
				if (treeNode.isParent) {
					// e.g: open folder  "res/images"|"src/test"|"Resource"|"Scripts"|"Prefabs"|"Animations"
					if (treeNode.isLoaded||url==="Resources"||url==="Scripts"||url==="Prefabs"||url==="Animations") {
						assetsTree.showList(treeNode.children, url);
					} 
					// e.g: load resource from  "res/images"|"src/test"
					else if (url.match(/res\//g) || url.match(/src\//g)) {
						assetsTree.getResourceList(url, treeNode);
					}
				}
				// e.g: "res/image/logo.png"
				else if (url.match(/(png|jpg|gif)$/g)) {
					// remove "res/" : "image/logo.png"
					url = url.replace(/res\//g, "");
					// show image
					imagePreview.showImage(url);
				} 
				// e.g: "src/test/TestController.js"
				else if (url.match(/js$/g)) {
					var name = url.substring(url.lastIndexOf('/')+1, url.length);
					// get name : "TestController" from "src/test/TestController.js" 
					name = name.replace(/.js$/g, "");
					// remove "src/" to : "test/TestController.js" 
					url = url.replace(/src\//g, "");
					// show script
					imagePreview.showScript(name, url);
				}
			}
		}
	},
	
	ctor: function(){
		var o = this;
		$('.resource_list').bind('click', function(e){
			$(".resource_tool .components_panel").hide();
			
			var url = e.target.lang;
			if (url.match(/(png|jpg|gif)$/g)) {
				// show image
				imagePreview.showImage(url);
				
			} else if (url.match(/js$/g)) {
				// show script
				imagePreview.showScript(e.target.name, url);

			} else if (url && url.indexOf(".")===-1) {
				// open folder
				var name = url.substring(url.lastIndexOf("/")+1, url.length),
					node = assetsTree.zTree.getNodeByParam("name", name);
				assetsTree.zTree.selectNode(node);
				assetsTree.settings.callback.beforeClick(null, node);

			} else {
				return;
			}
			// change selected
			$('.resource_item_selected').removeClass('resource_item_selected');
			$(e.target).addClass('resource_item_selected');
		});
		$(".resource_tool #create_script").bind("click", function(){
			$(".resource_tool .components_panel").show();
		});
		$(".resource_tool .components_panel").bind("click", function(e){
			var type = e.target.lang;
			if (type) {
				// create new resource
				assetsTree.createResource(type);
			}
			$(".resource_tool .components_panel").hide();
		});
		
		$.contextMenu({
	        selector: '.resource_panel', 
	        callback: function(key, options) {
	        	if (key==="Parent") {
	        		// return parent directory
	        		var arr = assetsTree.baseUrl.split("/");
	        		arr.pop();
	        		assetsTree.selectFolder(arr.join("/"));
	        	} else {
	        		// create new resource
	        		assetsTree.createResource(key);
	        	}
	        },
	        items: {
	            "Folder": {name: "New Folder", icon: "edit", accesskey: "Folder"},
	            "Class": {name: "New Class", icon: "cut", accesskey: "Class"},
	            // first unused character is taken (here: o)
	            "Node": {name: "New Node", icon: "copy", accesskey: "Node"},
	            // words are truncated to their first letter (here: p)
	            "Component": {name: "New Component", icon: "paste", accesskey: "Component"},
	            "Parent": {name: "Parent Directory", icon: "edit", accesskey: "Parent"}
	        }
	    });
	    
	    $.contextMenu({
	        selector: '.resource_item', 
	        callback: function(key, options) {
	        	// delete resource
	        	var target = options.$trigger[0].children[0];
	        	assetsTree.deleteResource(target);
	        },
	        items: {
	            "delete": {name: "Delete", icon: "delete"}
	        }
	    });
	},
	
	getAssets: function(){
		var o = this;
		// get resource list
		this.getResourceList("res", this.zTree.getNodeByParam('name', 'Resources'));

		// get script list
		this.getResourceList("src", this.zTree.getNodeByParam('name', 'Scripts'));
	},
	
	createTree: function(data){
		var resTree = [], preTree = [], sptTree = [], 
			parTree = [], armTree = [], aniTree = [];
		
		// create all tree	
		var zNodes = [
				{ name: 'Resources', isParent: true, drag: false, children: resTree },
				{ name: 'Scripts', isParent: true, drag: false, children: sptTree },
				{ name: 'Prefabs', isParent: true, drag: false, children: preTree },
				// { name: 'Particles', isParent: true, drag: false, children: parTree },
				// { name: 'Armatures', isParent: true, drag: false, children: armTree },
				{ name: 'Animations', isParent: true, drag: false, children: aniTree }
			];
			
		var a;
		for (var i in data.prefabs) {
			a = data.prefabs[i];
			preTree.push({ name: i, title: "Prefabs_"});
		}
		for (var i in data.animations) {
			a = data.animations[i];
			aniTree.push({ name: i, title: "Animations_"});
		}
		
		this.zTree = $.fn.zTree.init($("#assets_tree"), this.settings, zNodes);
	},
		
	updateAnimTree: function(data, type){
		// update prefab|animation tree
		var node = this.zTree.getNodeByParam("name", type);
		this.zTree.removeChildNodes(node);
		var tree = [], typeName = type.toLowerCase();
		for (var i in data[typeName]) {
			a = data[typeName][i];
			tree.push({ name: i, title: type+"_"});
		}
		this.zTree.addNodes(node, tree);
	},
	
	getResourceList: function(url, treeNode) {
		$.ajax({
			url: '/home/editor/get_resource_list_cc',
			type: 'GET',
			dataType: 'json',
			data:{
				name: g_views.name,
				url: url
			}
		}).done(function(data){
			treeNode.isLoaded = true;
			assetsTree.updateResourceTree(data, treeNode);
			assetsTree.showList(treeNode.children, url);
		});
	},

	updateResourceTree: function(data, treeNode){
		// update resource tree
		var zTree = this.zTree, o = this, list = [];
		this.zTree.removeChildNodes(treeNode);
		data.forEach(function(a, i){
			var isParent = false;
			if (a.indexOf('.')===-1) {
				isParent = true;
			}
			list.push({ 
				pId: treeNode.id, isParent: isParent, 
				title: a.substring(0, a.lastIndexOf('/')+1), 
				name: a.substring(a.lastIndexOf('/')+1, a.length)
			});
		});
		zTree.addNodes(treeNode, list);
	},
	
	baseUrl: "",
	
	showList: function(children, url){
		children = children || [];
		url = url==="Resources"?"res":url==="Scripts"?"src":url;
		this.baseUrl = url;

		var list = [];
		// show assets
		children.forEach(function(a, i){
			url = (a.title||"") + a.name;
			// e.g: case "res/image/logo.png"
			if (url.match(/(png|jpg|gif)$/g)) {
				url = url.replace("res/","");
				list.push([
					'<div class="resource_item">',
						'<img src="'+gameViews.getUrl(url)+'" width="70" height="70" lang="'+url+'" ondragstart="bindDrag(event)" style="cursor:pointer;">',
						'<div class="label">'+a.name+'</div>',
					'</div>'
				].join(''));
			} 
			// e.g: case "Prefabs/SceneUI"|"Animations/Bird"
			else if(url.match(/Prefabs/g) || url.match(/Animations/g)) {
				list.push([
					'<div class="resource_item">',
						'<img src="res/image.png" width="70" height="70" lang="'+url+'" ondragstart="bindDrag(event)" style="cursor:pointer;">',
						'<div class="label">'+a.name+'</div>',
					'</div>'
				].join(''));
			}  
			// e.g: case "src/test/TestController.js"
			else if(url.match(/js$/g)) {
				url = url.replace("src/","");
				list.push([
					'<div class="resource_item">',
						'<img src="res/file.jpg" width="70" height="70" lang="'+url+'" ondragstart="bindDrag(event)" style="cursor:pointer;" name="'+a.name.replace(/\.js$/g, "")+'">',
						'<div class="label">'+a.name+'</div>',
					'</div>'
				].join(''));
			} 
			// e.g: case "res/action.plist"|"src/g_views.json"
			else if(url.indexOf('.')>-1) {
				list.push([
					'<div class="resource_item">',
						'<img src="res/file.jpg" width="70" height="70" lang="'+url+'" draggable="false">',
						'<div class="label">'+a.name+'</div>',
					'</div>'
				].join(''));
			} 
			// e.g: case "res/image"|"src/test"
			else {
				list.push([
					'<div class="resource_item">',
						'<img src="res/docu.jpg" width="70" height="70" draggable="false" lang="'+url+'" style="cursor:pointer;">',
						'<div class="label">'+a.name+'</div>',
					'</div>'
				].join(''));
			}
		});
		$('.resource_list').html(list.join(''));
	},

	createResource: function(type) {
		var url = assetsTree.baseUrl;
		if (url === "Prefabs" || url === "Animations") return;
		// only can create script on "src/..." 
		if (type!=="Folder" && !url.match("src")) return;
		
		var className = prompt('Please Input The Name Of '+type);
		
		// e.g: create resource "src/test"|"src/test/TestScript.js"
		url = url+"/"+className;
		if (className) {
			if (className.match(/^[_a-zA-Z][a-zA-Z0-9]*$/g)) {
				$.ajax({
				    url: '/home/editor/create_resource_cc',
				    type: 'POST',
				    data: {
				        name: g_views.name,
				        className: className,
				        type: type.toLowerCase(),
				        url: url
				    }
				}).done(function(data){
					assetsTree.selectFolder();
				});	
			} else {
				alert("Error Name");
			}		
		}
	},
	
	deleteResource: function(target) {
		var url = target.lang;
		if (url.match(/(png|jpg|gif)$/g)) {
			url = "res/"+url;
		} else if (url.match(/js$/g)) {
			url = "src/"+url;
		} else if (url.match(/Prefabs/g)) {
			delete g_views.prefabs[url.split('_')[1]];
			assetsTree.updateAnimTree(g_views, "Prefabs");
			var node = assetsTree.zTree.getNodeByParam("name", "Prefabs");
			assetsTree.zTree.selectNode(node);
			assetsTree.settings.callback.beforeClick(null, node);
			return;
		} else if (url.match(/Animations/g)) {
			delete g_views.animations[url.split('_')[1]];
			assetsTree.updateAnimTree(g_views, "Animations");
			var node = assetsTree.zTree.getNodeByParam("name", "Animations");
			assetsTree.zTree.selectNode(node);
			assetsTree.settings.callback.beforeClick(null, node);
			return;
		}
		$.ajax({
			url: '/home/editor/delete_resource_cc',
			type: 'POST',
			data: {
				name: g_views.name,
				url: url
			}
		}).done(function(data){
			assetsTree.selectFolder();
		});
	},
	
	selectFolder: function(url){
		var url = url || assetsTree.baseUrl,
			name = url.substring(url.lastIndexOf("/")+1, url.length);
		name = name==="src"?"Scripts":name==="res"?"Resources":name;
		
		var	node = assetsTree.zTree.getNodeByParam("name", name);
		assetsTree.getResourceList(url, node);
	}
});