
(function(){
	
    var Observer = function(){
    	throw 'can not be instanced';
    };
    
	Observer._observers = {};
	
    Observer.register = function(cmd, handler){
    	var ob = Observer._observers[ cmd ];
		if( !ob ) {
			ob = Observer._observers[ cmd ] = [];
		}
		if ( ob.indexOf(handler) === -1 ) {
			ob.push(handler);
		}
    };
    
    Observer.unregister = function(cmd, handler){
    	var ob = Observer._observers[ cmd ];
		if( ob ) {
			if( typeof handler === 'number'){
				ob.splice( handler, 1 );
			} else {
				ob.forEach( function( a, b ){
					if( a === handler ) {
						ob.splice(  b, 1 );
					}
				});
			}
		}
   };
    
	Observer.notify = function( cmd, data ){
		var ob = Observer._observers[ cmd ];
		if( ob ) {
			ob.forEach( function( a, b ){
				a(data);
			});
		}
	};
	
	window.Observer = Observer;
})();