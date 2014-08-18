
var UserController = global.defineClass('think/Controller', {
	
	list: function(data,paths,files){
		var self = this,
			user = this.$model('User');
		user.get('admin', function(result){
			self.finish(result);
		});
		
	},
	
	login: function(data){
		
	},
	
	regist: function(data){
		
	}
});

module.exports = UserController;