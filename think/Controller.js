
var Controller = global.defineClass({
	
	_before_init: function(app, req, res, action){
		this._finished = false;
		
		this._app = app;
		this._req = req;
		this._res = res;
		this._data = req.method==='GET'?req.query:req.body;
		this._files = req.files;
		
		this._module = action[0];
		this._contrl = action[1];
		this._method = action[2];
		this._paths  = action[3];
		
		this._renderData = { self: this };
		this._defaultTemplate = this._module+'/'+this._contrl+'/'+this._method+'.html';
		this._modelsPath = app.config['root_path']+'/'+app.config['app_path']+'/'+this._module+'/model/';
	},
	
	_log_end_time: function(data){
		if (this._app.config['app_debug']) {
			console.log('EXC', (new Date().getTime()-this._req.startTime)/1000+'s  result: '+data);
		}
	},
	
	_before_action: function(){
		if (!this._finished) {
			this.before && this.before(this._data, this._paths, this._files);
		}
	},
	
	_after_action: function(){
		if (!this._finished) {
			this.after && this.after(this._data, this._paths, this._files);
		}
	},
	
	_exec_action: function(){
		if (!this._finished) {
			this[this._method] && this[this._method](this._data, this._paths, this._files);
		}
	},
	
	assign: function(key, value){
		this._renderData[key] = value;
	},
	
	display: function(template){
		if (!this._finished) {
			template = template||this._defaultTemplate;
			this._res.render(template, this._renderData);
			this._finished = true;
		}
	},
	
	finish: function(data){
		if (!this._finished) {
			if (typeof(data) === "string") {
				this._res.send(data);
			} else {
				this._res.json(data);
			}
			this._finished = true;
		}
	},
	
	redirect: function(url){
		if (!this._finished) {
			this._res.redirect(url);
			this._finished = true;
		}
	},
	
	$model: function(name){
		var modelPath = this._modelsPath+name+'Model',
			modelClass = null,
			model = null;
		try {
			modelClass = require(modelPath);
		} catch(err) {
			
		}
		if (modelClass) {
			model = new modelClass(name, this._app);
		}
		return model;
	},
	
	$url: function(action, data, paths){
		var urlAction = action.charAt(0)==='/'?action:('/'+action),
			urlPath = '', urlData = '';
		
		// 请求为资源文件时,添加版本号
		if (urlAction.match(/\.[0-9|a-z]*$/)) {
			urlData = '?v='+this.$config('app_version');
		} else {
			// 请求为一般 action时
			if (paths instanceof Array) {
				paths.forEach(function(a, i){
					urlPath += '/'+a;
				});
			}
			urlPath += '.html';
			if (data instanceof Object) {
				for (var key in data) {
					if (!urlData) {
						urlData = '?';
					} else {
						urlData += '&';
					}
					urlData += key+'='+data[key];
				}
			}
		}
		
		return urlAction+urlPath+urlData;
	},
	
	$config: function(name){
		return this._app.config[name];
	}
});

module.exports = Controller;
