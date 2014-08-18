
module.exports = {
	app_name         : 'Think One',
	app_port         : 80,
	app_debug        : true,
	app_version      : '1.0.0',
	
	root_path        : __dirname,
	app_path         : 'application',
	public_path      : 'public',
	views_path       : 'views',
 
	static_paths     : ['public', 'views'],

	logs_path    	 : 'runtime/logs',
	caches_path    	 : 'runtime/caches',
	uploads_path     : 'runtime/uploads',

	render_engine    : 'ejs',
	
	default_action   : 'home/index/index',
	shortcut_actions : {
						'i' :  'home/index/index',
						's' :  'home/index/search',
						'r' :  'home/index/result',
						'e' :  'home/editor/index',
						'p' :  'home/platform/index',
						't' :  'home/test/index'
					   },
	
	db_type        : 'mysql',
	db_enabled	   : true,
	db_host        : 'localhost',
	db_port        : 3306,
	db_user  	   : 'root',
	db_password    : 'root',
	db_name        : 'app_onethink',
	db_prefix      : 'onethink',
	
	dir_cocos2d          : __dirname+'/public/game/cocos2d/',
	dir_cocos2d_editor   : __dirname+'/public/game/cocos2d_editor/',
	dir_cocos2d_project  : __dirname+'/public/game/cocos2d_project/',
	
	dir_createjs         : __dirname+'/public/game/createjs/',
	dir_createjs_editor  : __dirname+'/public/game/createjs_editor/',
	dir_createjs_project : __dirname+'/public/game/createjs_project/',

	ua_test_safari       : '"chrome.exe" --user-agent="Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3 like Mac OS X; zh-cn) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8F190 Safari/6533.18.5"',
	ua_test_ipad         : '"chrome.exe" --user-agent="Mozilla/5.0 (iPad; CPU OS 5_1 like Mac OS X; en-us) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9B176 Safari/7534.48.3"',
	ua_test_wx           : '"chrome.exe" --user-agent="Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Mobile/10B329 MicroMessenger/5.0.1"',
	ua_cross_access      : '"chrome.exe" --disable-web-security'
};
