
define(function(){
// 类式继承函数，参照  http://ejohn.org/blog/simple-javascript-inheritance/
var Class = function(){}, initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

Class.extend = function(props) {
	var superClass = this,
		superProto = this.prototype,
		subClass = function() {
			 if (!initializing && this.init) {
			  	 this.init.apply(this, arguments);
			}
		};
		
	if (superClass !== Class) {
		initializing = true;
		subClass.prototype = new superClass();
	}
	
	initializing = false;
	            
	var subProto = subClass.prototype;
	
	for (var name in props) {
		subProto[name] = (typeof(superProto[name]) === 'function' && 
			typeof(props[name]) === 'function' && fnTest.test(props[name])) ?
			(function(name, fn){
	        	return function() {
	        		var temp = this._super;
	            	this._super = superProto[name];
	           		
	           		var result = fn.apply(this, arguments);  
	           		this._super = temp;
	           		
	           		return result;
	        	};
	        })(name, props[name]) : props[name];
	}
	
	subClass.extend = arguments.callee;
	
	return subClass;
};

return Class;
});