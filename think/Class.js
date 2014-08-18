
var Class = function(){}, ready = true;

Class.extend = function(props){
	var superClass = this,
		prototype = null;
	
	ready = false;
	prototype = new superClass();
	ready = true;
	
	for (var key in props) {
		prototype[key] = props[key];
	}
	
	var subClass = function(){
		if (ready) {
			this._before_init && this._before_init.apply(this, arguments);
			this.init && this.init.apply(this, arguments);
		}
	};
	
	subClass.prototype = prototype;
	subClass.extend = arguments.callee;
	
	return subClass;
};

module.exports = Class;