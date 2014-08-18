(function() {
	"use strict";
	
var Notification = function(){
   	throw 'can not be instanced';
};
    
	Notification._Notifications = {};
	
    Notification.register = function(cmd, handler){
    	var ob = Notification._Notifications[ cmd ];
		if( !ob ) {
			ob = Notification._Notifications[ cmd ] = [];
		}
		if ( ob.indexOf(handler) === -1 ) {
			ob.push(handler);
		}
    };
    
    Notification.unregister = function(cmd, handler){
    	var ob = Notification._Notifications[ cmd ];
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
    
	Notification.notify = function( cmd, data ){
		var ob = Notification._Notifications[ cmd ];
		if( ob ) {
			ob.forEach( function( a, b ){
				a(data);
			});
		}
	};
	
ccp.Notification = Notification;
}());