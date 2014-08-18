
define(function(){
// 类式继承函数
var Class = function() {}, _ready_ = false, _empty_ = {};

Class.extend = function(props) {
	var Cls = function() {
		if (_ready_) {
		  	this.init && this.init.apply(this, arguments);
		}
	};
		
	if (this !== Class) {
		_ready_ = false;
		Cls.prototype = new this();
	}
	
	_ready_ = true;
	            
	var p = Cls.prototype;
	
	for (var name in props) {
	    if (typeof(p[name]) === 'function' && !_empty_[name]) {
	        p['Super_'+name] = p[name];
	    }
		p[name] = props[name];	
	}
		
	Cls.extend = arguments.callee;
	
	return Cls;
};

return Class;
});