
(function(window){
    // "use strict";
    
var Class = function() {}, ready = false, empty = {};

// 类式继承
Class.extend = function(props) {
    
    var Cls = function ( ) {
        if( ready ){
            this.init && this.init.apply(this, arguments);
        }
    };
    // 原型继承
    if( this !== Class ) {
        // 避免通过构造函数 生成多余的参数
        ready = false;
        Cls.prototype = new this();
    }
    ready = true;

    var p = Cls.prototype;

    for (var name in props) {
		//原型链上已存在此方法，且不是obj的方法时
        if( typeof(p[name]) === 'function' && !empty[name] ) {
            // 重写方法，保留父类的函数调用
            p['Super_'+name] = p[name];
        }
        p[name] = props[name];
    }
	
    // 传递继承的方法
    Cls.extend = arguments.callee;
    return Cls;
};

window.Class = Class;

// 创建新的命名空间，与 createjs库区别开
window.cy = window.cy || {};
// 复制createjs的类到 cy里面
if(createjs){
	for( var name in createjs ) {
		cy[name] = createjs[name];
	}
}

})(this);
