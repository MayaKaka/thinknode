/*
 * CSS3Animation
 */

(function() {
	"use strict";
	
var nextFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback) { return setTimeout(callback, 1); };
	})(),
	
	cancelFrame = (function () {
		return window.cancelRequestAnimationFrame ||
			window.webkitCancelAnimationFrame ||
			window.webkitCancelRequestAnimationFrame ||
			window.mozCancelRequestAnimationFrame ||
			window.oCancelRequestAnimationFrame ||
			window.msCancelRequestAnimationFrame ||
			clearTimeout;
	})();
	
var CSS3Animation = Class.extend({
	name: 'CSS3Animation',
	target: null,
	_paused: true,
	_queue: null,
	_isIE9: (cy.UserAgent.browser.ie === 9? true:false),
	
	init: function( target ){
		this.target = target;
		this._paused = true;
		this._queue = [];
	},
	
	add: function( params, duration, timingFunc, delay, callback ){
		var data = [ params, duration, timingFunc, delay, callback ];
		this._queue.push( data );
	},
	
	play: function(){
		if( this._paused ) {
			this._paused = false;
			this._next();
		}
	},
	
	_next: function(){
		if ( this._queue.length > 0 ) {			
			var o = this,
				target = this.target,
				element = target.htmlElement,
				style = element.style,
				endEvent = cy.DOMObject.CSS_PREFIX[2],
				currentAnimation = this._queue.shift();

			var animationend = function(e){
				element.removeEventListener( endEvent, animationend );
				style.WebkitTransition = style.MozTransition = style.msTransition = style.OTransition = 
				style.transition = '';

				nextFrame( function() {
					if ( currentAnimation[4] ) {
						currentAnimation[4]();
					}
					nextFrame( function() {
						o._next();
					});
				});
			};
		
			style.WebkitTransition = style.MozTransition = style.msTransition = style.OTransition = 
			style.transition = 'all ' + (currentAnimation[1] || 0)/1000 + 's ' + 
							   (currentAnimation[2] || 'linear') + ' ' + 
							   (currentAnimation[3] || 0)/1000 + 's';
			if( this._isIE9 ){
				var t = setTimeout(function(){
					clearTimeout(t);
					animationend();
				}, currentAnimation[1] || 1);
			}else{
				element.addEventListener( endEvent, animationend, false );
			}
			
			
			var params = currentAnimation[0];
			nextFrame( function() {
				for ( name in params ) {
					target.css( name, params[ name ] );
				}
			});
		} else {
			this._paused = true;
		}
	}

});

cy.CSS3Animation = CSS3Animation;

}());
