var fs = require('fs');

var IndexController = global.defineClass('think/Controller', {
	
	index: function(data,paths,files){
		var self = this,
			model = this.$model('Init');
		fs.readFile(__dirname+'/../data.sql', 'UTF-8', function(err, data){
			if (err) self.finish('error');
			if (data) {
				model.exec(data, function(){
					self.finish('success');
				});
			}
		});
	}
});

module.exports = IndexController;