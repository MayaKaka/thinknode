var fs = require('fs')
  , rd = require('rd')
  , FileUtil = require('../widget/FileUtil');
  
var EditorController = global.defineClass('think/Controller', {
	
	init: function(app) {
		
		this.dirCocos2d = this.$config('dir_cocos2d');
		this.dirCocos2dEditor = this.$config('dir_cocos2d_editor');
		this.dirCocos2dProject = this.$config('dir_cocos2d_project');
		
		this.dirCreatejs = this.$config('dir_createjs');
		this.dirCreatejsEditor = this.$config('dir_createjs_editor');
		this.dirCreatejsProject = this.$config('dir_createjs_project');
	},
	
	index: function(){
		this.display();
	},
	
	/*
	 *
	 * CreateJs 编辑器相关
	 * 
	 */
	get_projects: function(){
		var self = this,
			dir = this.dirCreatejsProject;
		
		fs.readdir(dir, function(err, files){
			if(err) console.log(err);
			self.finish(files);
		});
	},
	
	create_project: function(data) {
		var self = this,
			name = data.name,
			title = data.title,
			width = parseFloat(data.width),
			height = parseFloat(data.height);
		
		var templatePath = this.dirCreatejs+'template/',
			projectPath  = this.dirCreatejsProject+name+'/';
			
		fs.mkdir(projectPath,777,function(){
			FileUtil.copyFile(templatePath+'index.html', projectPath+'index.html', [['title',title], ['width',width], ['height',height]]);
			FileUtil.copyFile(templatePath+'local.html', projectPath+'local.html', [['title',title], ['width',width], ['height',height]]);
			fs.mkdir(projectPath+'res/',777,function(){});
			fs.mkdir(projectPath+'src/',777,function(){
				FileUtil.copyFile(templatePath+'src/view.js', projectPath+'src/view.js', [['name',name], ['title',title], ['width',width], ['height',height], ['x',width/2], ['y',height/2]]);
				FileUtil.copyFile(templatePath+'src/view.json', projectPath+'src/view.json', [['name',name], ['title',title], ['width',width], ['height',height], ['x',width/2], ['y',height/2]]);
				FileUtil.copyFile(templatePath+'src/main.js', projectPath+'src/main.js');
				FileUtil.copyFile(templatePath+'src/style.css', projectPath+'src/style.css');
				console.log('create sucess:+'+projectPath);
				self.redirect('/home/editor/index');
			});
		});
	},
	
	del_project: function(data){
		if (data.name!=='ye') {
			var basePath = this.dirCreatejsProject+data.name;
			FileUtil.deleteFolderRecursive(basePath);
			console.log('delete sucess:+'+basePath);
		}
		this.finish('');
	},

	import_data: function(data) {
		var self = this,
			filePath = this.dirCreatejsProject+data.name+'/src/view';
		fs.readFile(filePath+'.json','UTF-8',function(err, data){
			if(err) console.log(err);
			self.finish(data);
		});
	},
	
	export_data: function(data) {
		var self = this,
			filePath = this.dirCreatejsProject+data.name+'/src/view';
		fs.writeFile(filePath+'.json',req.body.data,'UTF-8',function(err){
			if(err) console.log(err);
			fs.writeFile(filePath+'.js','var Views = '+data.data+';','UTF-8',function(err){
				if(err) console.log(err);
				console.log('export sucess:+'+filePath);
				self.finish('');
			});
		});
	},
	
	get_image_list: function(data) {
		var self = this, dirPath, basePath;
		if (data.dir) {
			dirPath = this.dirCreatejsProject+data.dir;
			basePath = data.dir;
		} else {
			dirPath = this.dirCreatejsProject+data.name+'/res/';
			basePath = data.name+'/res/';
		}
		fs.readdir(dirPath, function(err, files){
			if(err) console.log(err);
			if(files){
				files.forEach(function(a, i){
					files[i] = basePath+a;
				});
			}
			self.finish(files);
		});
	},
	
	/**
	 *
	 * Cocos2d 编辑器相关
	 * 
	 */
	get_projects_cc: function(){
		var self = this,
			dir = this.dirCocos2dProject;
		
		fs.readdir(dir, function(err, files){
			if(err) console.log(err);
			self.finish(files);
		});
	},
	
	create_project_cc: function(data) {
		var self = this,
			name = data.name,
			title = data.title,
			width = parseFloat(data.width),
			height = parseFloat(data.height);
		
		var templatePath = this.dirCocos2d+'template/',
			projectPath  = this.dirCocos2dProject+name+'/';
			
		fs.mkdir(projectPath,777,function(){
			FileUtil.copyFile(templatePath+'index.html', projectPath+'index.html', [['title',title], ['width',width], ['height',height]]);
			FileUtil.copyFile(templatePath+'main.js', projectPath+'main.js');
			FileUtil.copyFile(templatePath+'project.json', projectPath+'project.json');
			fs.mkdir(projectPath+'res/',777,function(){});
			fs.mkdir(projectPath+'src/',777,function(){
				FileUtil.copyFile(templatePath+'src/g_views.js', projectPath+'src/g_views.js', [['name',name], ['title',title], ['width',width], ['height',height], ['x',width/2], ['y',height/2]]);
				FileUtil.copyFile(templatePath+'src/g_views.json', projectPath+'src/g_views.json', [['name',name], ['title',title], ['width',width], ['height',height], ['x',width/2], ['y',height/2]]);
				FileUtil.copyFile(templatePath+'src/g_resources.js', projectPath+'src/g_resources.js');
				FileUtil.copyFile(templatePath+'src/MainController.js', projectPath+'src/MainController.js');
				console.log('create sucess:+'+projectPath);
				self.redirect('/home/editor/index');
			});
		});	
	},
	
	del_project_cc: function(data){
		if (data.name!=='sguo') {
			var basePath = this.dirCocos2dProject+data.name;
			FileUtil.deleteFolderRecursive(basePath);
			console.log('delete sucess:+'+basePath);
		}
		this.finish('');
	},
		
	import_data_cc: function(data){
		var self = this,
			dir = this.dirCocos2dProject+data.name+'/src/g_views';
		fs.readFile(dir+'.json','UTF-8',function(err, data){
			if(err) console.log(err);
			self.finish(data);
		});
	},
	
	export_data_cc: function(data){
		var self = this,
			proPath = this.dirCocos2dProject+data.name,
			basePath = proPath+'/src',
			filePath = basePath+'/g_views';
		fs.writeFile(filePath+'.json',data.data,'UTF-8',function(err){
			if(err) console.log(err);
			// 异步列出目录下的所有文件
			rd.read(basePath, function (err, files) {
			  	if (err) throw err;
			  	var list = [], result;
			  	files.forEach(function(a, i){
			  		a = a.substring(a.lastIndexOf("\src"), a.length);
			  		if (a.match(/.js$/g)) {
			  			a = a.replace(/\\/g,"/");
			  			if(a==="src/MainController.js"){
			  				list.unshift('"'+a+'"');
			  			} else {
			  				list.push('"'+a+'"');
			  			}
			  		}
			  	});
			  	result = list.toString();
			  	result.replace(/,/g, ',\n');
			  	fs.readFile(proPath+'/project.json','UTF-8',function(err, data){
					if(err) console.log(err);
					var idx0 = data.indexOf('"src/MainController.js"'),
						idx1 = data.lastIndexOf("]"),
						str = data.substring(idx0, idx1);
					fs.writeFile(proPath+'/project.json',data.replace(str, result),'UTF-8');
				});
			});
			fs.writeFile(filePath+'.js','var g_views = '+data.data+';','UTF-8',function(err){
				if(err) console.log(err);
				console.log('export sucess:+'+filePath);
				self.finish('');
			});
		});
	},
	
	get_resource_list_cc: function(data){
		var self = this,
			dir = this.dirCocos2dProject+data.name+'/'+data.url;
	
		fs.readdir(dir, function(err, files){
			if(err) console.log(err);
			if(files){
				files.forEach(function(a, i){
					files[i] = data.url+"/"+a;
				});
			}
			self.finish(files);
		});
	},
	
	create_resource_cc: function(data){
		var filePath = this.dirCocos2dProject+data.name+'/'+data.url,
			templatePath = this.dirCocos2d+'template/',
			type = data.type;
		if (type === "folder") {
			fs.mkdir(filePath,777);
		} else if (type === "class") {
			FileUtil.copyFile(templatePath+'class.js', filePath+'.js', [['className',data.className]]);
		} else if (type === "node") {
			FileUtil.copyFile(templatePath+'node.js', filePath+'.js', [['className',data.className]]);
		} else if (type === "component") {
			FileUtil.copyFile(templatePath+'component.js', filePath+'.js', [['className',data.className]]);
		}
		this.finish('');
	},
	
	import_script_cc: function(data){
		var self = this,
			filePath = this.dirCocos2dProject+data.name+'/src/'+data.url;
		fs.readFile(filePath,'UTF-8',function(err, data){
			if(err) console.log(err);
			// console.log(data);
			self.finish(data);
		});
	},
	
	export_script_cc: function(data){
		var self = this,
			result = data.result||"",
			filePath = this.dirCocos2dProject+data.name+'/src/'+data.url;
		fs.writeFile(filePath, result, 'UTF-8',function(err, data){
			if(err) console.log(err);
			// console.log(data);
			self.finish(data);
		});
	},
	
	file_upload: function(data,paths,files) {
		var basePath = this.dirCocos2dProject+data.name+"/"+data.url;
		for (var i in files) {
			FileUtil.handleUpload(files[i], basePath, this);
		}
	},
	
	delete_resource_cc: function(data) {
		var filePath = this.dirCocos2dProject+data.name+"/"+data.url;
		if (filePath.indexOf(".")>-1) {
			fs.unlink(filePath);
		} else {
			FileUtil.deleteFolderRecursive(filePath);
		}
		this.finish('');
	}
	
});

module.exports = EditorController;