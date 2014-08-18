
// bind drag event
function bindDrag(ev){
	ev.dataTransfer.setData("lang", ev.target.lang);
}

// allow drop event 
function allowDrop(ev) {
	ev.preventDefault();
}

// add new node
function addNode(ev) {
	var type = ev.dataTransfer.getData("lang");
	renderCtrl.addNode(type);
}

// add new texture
function addTexture(ev){
	var url = ev.dataTransfer.getData("lang");
	attrsCtrl.addTexture(renderCtrl.target, url);
}

// add component
function addComp(e) {
    var name = prompt('Please Input The Name Of Component :'),
    	className = "NoneComponent";
        // className = name?prompt('Please Input The ClassName Of Component :'):'';
    if(name && className) {
        renderCtrl.target._comps = renderCtrl.target._comps || {};
        renderCtrl.target._comps[name] = [className];
        attrsCtrl.update(renderCtrl.target);
    }
}

// del component
function delComp(name) {
	delete renderCtrl.target._comps[name];
	attrsCtrl.update(renderCtrl.target);
}

// change component
function changeComp(ev) {
	var name = ev.target.name,
		url = ev.dataTransfer.getData("lang");
	attrsCtrl.changeComp(renderCtrl.target, name, url);
}

// edit component
function editComp(ev) {
	var name = ev.target.name,
		comp = renderCtrl.target._comps[name];
	imagePreview.showScript(comp[0], comp[1]);
}

// add tween
function addTween(name) {
	var name = prompt('Please Input The Name Of Animation :');
    if(name) {
    	var target = renderCtrl.target;
    	if (!target._tweens) {
    		target._tweens = {};
    		var mc = new ccp.MovieClip("mc");
        	target.addComp(mc);
        	mc.loadData(target._tweens);
    	}
        target._tweens[name] = {};
        attrsCtrl.update(target);
    }
}

function playTween(name) {
	renderCtrl.target.getComp("mc").playAnimation(name, false);
}

function editTween(name) {
	var data = renderCtrl.target._tweens[name];
	timeline.select(renderCtrl.target, data);
}

function delTween(name) {
	delete renderCtrl.target._tweens[name];
	var isEmpty = true;
	for (var i in renderCtrl.target._tweens) {
		isEmpty = false;
	}
	if (isEmpty) delete renderCtrl.target._tweens;
	attrsCtrl.update(renderCtrl.target);
}

function upload(ev){
	ev.preventDefault();
	// only can upload to "res/..."
	if(!assetsTree.baseUrl.match("res")) return;
    // get image list
	var fileList = ev.dataTransfer.files;
	var img = document.createElement('img');
	// check the length of files
	if(fileList.length == 0){ return; }
    // check is image or not
    if(fileList[0].type.indexOf('image') === -1) { return; }
	// start upload file
	var xhr = new XMLHttpRequest();
	xhr.open("post", "/home/editor/file_upload", true);
	xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	xhr.upload.addEventListener("progress", function(e){
		if(e.lengthComputable){
			var loaded = Math.ceil((e.loaded / e.total) * 100);
        }
   	}, false);
	xhr.onload = function(e) {
		cc.log(e.target.responseText);
		var url = assetsTree.baseUrl,
			name = url.substring(url.lastIndexOf("/")+1, url.length),
			node = assetsTree.zTree.getNodeByParam("name", name==="res"?"Resources":name);
		assetsTree.selectFolder();
	};
	
    var form = new FormData();
    form.append('name', g_views.name);
    form.append('url', assetsTree.baseUrl);
    
    for (var i=0;i<fileList.length;i++) {
    	form.append("file_"+i, fileList[i]);
    }
	xhr.send(form);
}

