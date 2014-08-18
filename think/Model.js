
var Model = global.defineClass({
	
	tablename : 'member',
	querykey  : 'uid',
	
	_before_init: function(name, app){
		this.name = name;
		
		if (!app.database.connected) {
			app.database.connect(app);
		}
		if (!this.tablename) {
			this.tablename = this.name.toLowerCase();
		}
		
		app.database.instance(this);
	}

});

module.exports = Model;