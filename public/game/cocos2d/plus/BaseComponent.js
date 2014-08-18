(function() {
	"use strict";

if(!cc.Component.extend) cc.Component.extend = cc.Class.extend;

var BaseComponent = cc.Component.extend({
	
	_className: null,
	_filePath: null,
	
	ctor: function(name, className, filePath) {
		this._super();
		if (name) {
			this.setName(name);
		}
		if (className) {
			this._className = className;
		}
		if (filePath) {
			this._filePath = filePath;
		}
	},
	
	getClassName: function(){
		return this._className;
	},
	
	getFilePath: function(){
		return this._filePath;
	},
	
	update: function(delta){
		if (this.onUpdate) {
			// JSB bug: delta === 1
            if (delta >= 1) {
                delta = 0.0167;
            }
			this.onUpdate(delta);
		}
	}
	/*
	onEnter: function() {},
	onData: function(data) {},
	onUpdate: function(data) {},
	onExit: function() {}
	*/
});

ccp.BaseComponent = BaseComponent;
}());