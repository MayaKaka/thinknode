
define(function (require, exports, module) {
	"use strict";
	   
var Class = require('Class');

var requestAnimationFrame = 
		window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame || 
		window.oRequestAnimationFrame || 
		window.msRequestAnimationFrame || window.setTimeout;
					
var cancelAnimationFrame = 
		window.cancelAnimationFrame || 
		window.webkitCancelAnimationFrame || 
		window.mozCancelAnimationFrame || 
		window.oCancelAnimationFrame || 
		window.msCancelAnimationFrame || window.clearTimeout;						   
						   				   					
var Ticker = Class.extend({
	
	fps: -1,
	
	_paused: true,
	_timer: null,
	
	_interval: -1,
	_targets: null,
	_useAnimationFrame: false,
	
	init: function(interval, useAnimationFrame) {
		this.fps = 0;
		
		this._interval = interval || (1000/60).toFixed(2);
	    this._targets = [];
	    
	    if (useAnimationFrame === undefined || useAnimationFrame === 'auto' || useAnimationFrame === true) {
	    	this._useAnimationFrame = requestAnimationFrame !== window.setTimeout;
	    }
	},
	
	isActive: function() {
		return !this._paused;
	},
	
	start: function() {
	 	this._clearTimer();
	    this._paused = false;
	    this._setTimer();
	},
	 	
	stop: function() {
		this._paused = true;
	},

	has: function(target) {
		var t = this._targets, l = t.length;
        for (var i=l-1;i>=0;i--) {
        	if(t[i] === target) {
            	return true;
            }
        }
        return false;
   	},
	
	add: function(target) {
		if (!this.has(target)) {
			if (target._ticker) {
				target._ticker.remove(target);
			}
			if (target.update instanceof Function) {
				target._ticker = this;
			}
        	this._targets.push(target);
 		}
	},
    
    remove: function(target) {
    	var t = this._targets, l = t.length;
        for (var i=l-1;i>=0;i--) {
        	if(t[i] === target) {
        		if (target._ticker) {
            		target._ticker = null;
            	}
            	t.splice(i, 1);
            	break;
        	}
        }
    },
    
    removeAll: function() {
    	this._targets = [];
    },

	_clearTimer: function() {
		if (this._timer) {
			var cancelFrame = this._useAnimationFrame? cancelAnimationFrame: window.clearTimeout;
			cancelFrame(this._timer);
	    	this._timer = null;
	    }
	},
	
	_setTimer: function() {
		var self = this;
		
		var nowTime = 0, lastTime = 0, deltaTime = 0,
		 	afTime = 0, lastAfTime = 0, deltaAfTime = 0,
	        timePoints = [], timeTemp = 0;
	       
	    var delay = self._interval,
	    	afDelay = (delay-1)*0.97,
	        useAnimationFrame = self._useAnimationFrame,
	        nextFrame = useAnimationFrame? requestAnimationFrame: window.setTimeout;
	        	
	    var hasTick = function(){
	        if (!useAnimationFrame) {
	        	return true;
	        }
	
	        if (lastAfTime === 0) {
	        	lastAfTime = new Date().getTime();
	        	return true;
	        } else {
	        	afTime = new Date().getTime();
	        	deltaAfTime = afTime - lastAfTime;
	        	if (deltaAfTime > afDelay) {
	        		lastAfTime = afTime;
	        		return true;
	        	}
	        }
	        return false;
		};
	        
	    var tick = function(){
			if (lastTime === 0) {
		    	lastTime = new Date().getTime();
		    } else {
				nowTime = new Date().getTime();
		        deltaTime = nowTime - lastTime;
		        lastTime = nowTime;
		        timePoints.push(deltaTime);
		        // 计算执行 fps
		        if (timePoints.length === 5) {
					for (var i=0,l=timePoints.length; i<l; i++) {
		            	timeTemp += timePoints[i];
		            }
		            self.fps = Math.floor(5000/timeTemp);
		            timePoints = [];
		            timeTemp = 0;
		        }
			}
			
		    // 执行当前帧
		    self._exec(deltaTime);		
		};
	              
		var nextTick = function(){
			if (hasTick()) {
				tick();
	        }
	            
	        self._clearTimer();
	            
	        if (!self._paused && !Ticker._destroyed) {
	        	self._timer = nextFrame(nextTick, delay); 
	        }
		};
	        
	    nextTick();
    },
     
   	_exec: function(delta) {
    	var targets = this._targets, 
    		target;
    	
        for(var i=0,l=targets.length;i<l;i++){
        	if (this._paused || Ticker._destroyed) break;
            target = targets[i];
        	if (target.update instanceof Function) {
        		target.update(delta);
            } else if (target instanceof Function) {
            	 target(delta);
            }
        }
	}
});
	
Ticker._destroyed = false;

Ticker.destroy = function() {
	this._destroyed = true;
}

return Ticker;
});