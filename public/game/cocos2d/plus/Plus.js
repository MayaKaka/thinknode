(function(scope) {
	"use strict";

cc.Node.prototype.addView = function(child, tag) {
	var zOrder = this.getChildrenView().length;
	if (tag) child.setTag(tag);
	// ListView -----> Widget
	if (this instanceof ccui.ListView) {
		child.setLocalZOrder(zOrder);
        this.pushBackCustomItem(child);
	}
	// All -----> Widget
	else if (child instanceof ccui.Widget) {
		this.addChild(child, zOrder);
	} 
	else {
		// Widget -----> Node
		if (this instanceof ccui.Widget) {
			this.addNode(child, zOrder);
		}
		// Node -----> Node
		else {
			this.addChild(child, zOrder);
		}
	}
};

cc.Node.prototype.addViewAt = function(child, index, tag) {
	var children = this.getChildrenView();
	for (var i=index; i<children.length; i++) {
		children[i].setLocalZOrder(i+1);
	}
	if (tag) child.setTag(tag);
	// ListView -----> Widget
	if (this instanceof ccui.ListView) {
        this.pushBackCustomItem(child, index);
	} 
	// All -----> Widget
	else if (child instanceof ccui.Widget) {
		this.addChild(child, index);
	} 
	else {
		// Widget -----> Node
		if (this instanceof ccui.Widget) {
			this.addNode(child, index);
		} 
		// Node -----> Node
		else {
			this.addChild(child, index);
		}
	}
};

cc.Node.prototype.removeView = function(child) {
	var children = this.getChildrenView(),
		index = this.getIndex? this.getIndex(child): children.indexOf(child);
	if (index>-1) {
		for (var i=index+1; i<children.length; i++) {
			children[i].setLocalZOrder(i-1);
		}
	}
	// ListView -----> Widget
	if (this instanceof ccui.ListView) {
        this.removeItem(index);
	} 
	// All -----> Widget
	else if (child instanceof ccui.Widget) {
		this.removeChild(child);
	} 
	else {
		// Widget -----> Node
		if (this instanceof ccui.Widget) {
			this.removeNode(child);
		}
		// Node -----> Node
		else {
			this.removeChild(child);
		}
	}
};

cc.Node.prototype.getChildrenView = function(useNodeGetChildren) {
	if (useNodeGetChildren) {
		return cc.Node.prototype.getChildren.call(this);
	} else if (this instanceof ccui.ListView) {
		return this.getItems();
	} else {
		return this.getChildren();
	}
};

cc.Node.prototype.getParentView = function() {
	var parent = this.getParent();
	
	if (!parent.type) parent = parent.getParent();
	
	return parent;
};

// var queryCount = 0; 

cc.Node.prototype.query = function(tag) {

	var children = this.getChildrenView(),
		child;
	// 子节点遍历查询
	for (var i=0,l=children.length; i<l; i++) {
		child = children[i];
		// queryCount++;
		// cc.log(queryCount);
		if (child.getViewTag()===tag) {
			return child;
		}
	}
	// 逐级节点遍历查询
	for (var i=0,l=children.length; i<l; i++) {
		child = children[i].query(tag);
		if (child) return child;
	}
	
	// 当  Widget 下嵌套  Node 时, 遍历子节点中的  Node 
	children = this.getNodes?this.getNodes():[];
	// 子节点遍历查询
	for (var i=0,l=children.length; i<l; i++) {
		child = children[i];
		// queryCount++;
		// cc.log(queryCount);
		if (child.getViewTag()===tag) {
			return child;
		}
	}
	// 逐级节点遍历查询
	for (var i=0,l=children.length; i<l; i++) {
		child = children[i].query(tag);
		if (child) return child;
	}
	
	return null;
};

cc.Node.prototype.queryAll = function(tag, list) {
	
	var children = this.getChildrenView(),
		child, list = list || [];
	
	for (var i=0,l=children.length; i<l; i++) {
		child = children[i];
		// queryCount++;
		// cc.log(queryCount);
		if (child.getViewTag()===tag) {
			list.push(child);
		}
		child.queryAll(tag, list);
	}
	
	children = this.getNodes?this.getNodes():[];
	for (var i=0,l=children.length; i<l; i++) {
		child = children[i];
		// queryCount++;
		// cc.log(queryCount);
		if (child.getViewTag()===tag) {
			list.push(child);
		}
		child.queryAll(tag, list);
	}
	
	return list;
};

cc.Node.prototype._viewTag = ""; 

cc.Node.prototype.setViewTag = function(tag) {
	this._viewTag = tag;
};

cc.Node.prototype.getViewTag = function(tag) {
	return this._viewTag;
};

cc.Node.prototype._comps = null;

cc.Node.prototype.addComp = function(component) {
	var name = component.getName();
	if (name) {
		this.addComponent(component);
	}
};

cc.Node.prototype.getComp = function(name) {
	return this.getComponent(name);
};

cc.Node.prototype.removeComp = function(component) {
	this.removeComponent(component);
};

var ccp = scope.ccp = scope.ccp || {};

ccp._root = scope;

ccp._xhr = null;

ccp.ajax = function(param){
	var xhr = new XMLHttpRequest(),
		data = '';
	if (param.data) {
		for (var n in param.data) {
			if (data) data += '&';
			data += n+'='+param.data[n];
		}
	}
	if (param.type === 'POST' || param.type === 'post') {
		xhr.open('POST', param.url, true);
		xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
		xhr.send(data);
	} else {
		if (data) data = '?'+data;
		xhr.open('GET', param.url+data, true);
		xhr.send(null);
	}
	
	this._xhr = xhr;
	xhr.onreadystatechange = function() {
	    if (xhr.readyState === 4) {
	        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
	        	if (xhr.callback) {
	        		if (param.dataType==='JSON' || param.dataType==='json') {
	        			xhr.callback(JSON.parse(xhr.responseText));
	        		} else {
	        			xhr.callback(xhr.responseText);
	        		}
	        	}
	        } else {
	            alert("Request was unsuccessful: " + xhr.status);
	        }
	    }
	};
	return this;
};

ccp.call = function(callback) {
	if (this._xhr) {
		this._xhr.callback = callback;
	}
};

}(this));