
var Think = function(){};

Think.start = function(app, global, express){
	// 定义新的类
	global.defineClass = function(subClass, props) {
		if (!subClass) return null;
		if (typeof(subClass) === 'object' && !(subClass instanceof Function)) {
			props = subClass;
			subClass = require(app.config['root_path']+'/think/Class');
		} else if(typeof(subClass) === 'string') {
			props = props||{};
			subClass = require(app.config['root_path']+'/'+subClass);
		} else {
			return null;
		}
		
		return subClass.extend(props);
	};
	// 配置模板引擎
  	app.engine('html', require(app.config['render_engine']).renderFile);
  	// 配置静态路径
	app.config['static_paths'].forEach(function(a, i){
		app.use('/'+a, express.static(app.config['root_path']+'/'+a));
	});
	// 匹配非静态资源请求
	var regExp = eval('/^(\\/(?!'+app.config['static_paths'].join('|')+'))/'),
		regSplit = /\/|\.|\?/,
		regSuffix = /\.[0-9|a-z]*$/,
		defaultAction = app.config['default_action'].split(regSplit),
		shortActions = app.config['shortcut_actions'];
	for (var i in shortActions) {
		shortActions[i] = shortActions[i].split(regSplit);
	}
	// 处理请求路由
	app.all(regExp, function(req, res){
		req.startTime = new Date().getTime();
		// 去除  action 后缀
		var path = req.path.replace(regSuffix, ''),
			path = path.substring(1, path.length),
			paths = path?path.split(regSplit):[];
		if (paths.length>0) {
			// 匹配简略 action
			var shortcut = shortActions[paths[0]];
			if (shortcut) {
				paths.shift();
				paths = shortcut.concat(paths);
			}
		} else {
			// 启用默认 action
			paths = defaultAction.concat(paths);
		}
		// 读取 action 参数
		var actionModule = paths[0]||'index',
			actionContrl = paths[1]||'index',
			actionMethod = paths[2]||'index';
		
		// 读取 控制器
		var contrlName = actionContrl.charAt(0).toUpperCase()+actionContrl.substring(1,actionContrl.length)+'Controller',
			contrlPath = app.config['root_path']+'/application/'+actionModule+'/controller/'+contrlName,
			contrlClass = null,
			controller = null;
			
		try {
			contrlClass = require(contrlPath);
		} catch(err) {
			
		}
		// 执行 控制器 action
		if (contrlClass instanceof Function) {
			paths.splice(0,3);
			controller = new contrlClass(app, req, res, [actionModule, actionContrl, actionMethod, paths]);

			controller._before_action();
			controller._exec_action();
			controller._after_action();
		} else {
			console.error('error: not found controller '+ contrlPath);
			res.send(404);
		}
	});
};

module.exports = Think;
