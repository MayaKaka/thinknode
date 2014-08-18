
var IndexController = global.defineClass('think/Controller', {
	
	index: function(data,paths,files){
		this.display();
		// this.redirect('/home/index/logo');
		
	},
	
	result: function(){
		this.display();
	},
	
	logo: function(){
		this.display();
	},
	
	test: function(data){
		this.display();	
		return;
		this.assign('title', data.name);
		var self = this,
			user = this.$model('User'),
			cate = this.$model('Category'),
			docu = this.$model('Document');
		user.get('reg_ip', '0', function(result){
			docu.get(0, function(result){
				cate.where(null, function(result){
					self.assign('list', result);
					self.display();
				});
			});
		});
	},
	
	search: function(data){
		var self = this;
		var http = require('http');
		var opt = {
			host:'www.baidu.com',
			port:'80',
			method:'GET',				  //这里是发送的方法
			path:'/s?ie=utf-8&mod=1&isid=5C48D2D4DE595741&pstg=1&wd='+encodeURIComponent(data.wd)+'&rsv_bp=0&tn=baidu&rsv_spt=3&ie=utf-8&rsv_sid=6172_5826_6249_1443_5224_6504_4760_6017_6462_6428_6453_6500_6375&csor=3&_cr1=16924',  //这里是访问的路径
			headers:{
			  	//这里放期望发送出去的请求头
			   	"Content-Type": 'application/x-www-form-urlencoded',  
           		// "Content-Length": data.length
			}
		};
		//以下是接受数据的代码
		var body = '';
		var req = http.request(opt, function(res) {
			console.log("Got response: " + res.statusCode);
			res.on('data',function(d){
				body += d;
			}).on('end', function(){
			  	self.finish(body);
			});
		}).on('error', function(e) {
		  	console.log("opt error: " + e.message);
		});
		req.write(data + "\n");
		req.end();
	},
	
	getName: function(){
		return 'japan china';
	},
	
	getUrlToSelf: function(){
		return this.$url('home/index/index', {name:"hello", age:35}, ['20140515', 'abc']);
	}
});

module.exports = IndexController;
