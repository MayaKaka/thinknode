
define(function (require, exports, module) {
   
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
	
	fps: 0,
	
	_fps: 60,
	_timer: null,
	_interval: 0,
	_paused: true,
	_targets: null,
	_compensation: false,
	_useAnimationFrame: false,
	
	init: function(fps, useAnimationFrame, compensation) {
		
		this._fps = fps>1? fps: 1;
		this._interval = (1000/fps).toFixed(2);
	    this._targets = [];
	    
	    if (useAnimationFrame === 'auto') {
	    	this._useAnimationFrame = cancelAnimationFrame !== window.setTimeout;
	    } else if (useAnimationFrame) {
	    	this._useAnimationFrame = useAnimationFrame;
	    }
	    
	    if (compensation) this._compensation = compensation;
	},
	
	isActive: function() {
		return !this._paused;
	},
	
	start: function() {
	 	this._clearTimer();
	    this._paused = false;
	    this._setTimer(this);
	},
	 	
	stop: function() {
		this._paused = true;
	},

	has: function(ticker) {
		var t = this._targets, l = t.length;
        for (var i=l-1;i>=0;i--) {
        	if(t[i] === ticker) {
            	return true;
            }
        }
        return false;
   	},
	
	add: function(ticker) {
		if (!this.has(ticker)) {
        	this._targets.push(ticker);
 		}
	},
    
    remove: function(ticker) {
    	var t = this._targets, l = t.length;
        for (var i=l-1;i>=0;i--) {
        	if(t[i] === ticker) {
            	t.splice(i, 1);
            	break;
        	}
        }
    },

	_clearTimer: function() {
		if (this._timer) {
			var cancelFrame = this._useAnimationFrame? cancelAnimationFrame: window.clearTimeout;
			cancelFrame(this._timer);
	    	this._timer = null;
	    }
	},
	
	_setTimer: function(self) {
		var nowTime = 0, lastTime = 0, deltaTime = 0,
		 	afTime = 0, lastAfTime = 0, deltaAfTime = 0;
	        
	    var timePoints = [], timeTemp = 0,
	        timeRate = 1, timeFixed = 0, timeRateBase = 1.1;
	       
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
			
		    if (self._compensation) {
		    	// 启用延迟补偿
		        if (self.fps>0) {
			    	timeRate = self._fps/self.fps;
			        // 计算延迟补偿
			        timeFixed += timeRate>timeRateBase? (timeRate-1): 0;
			        if (timeFixed >= 1 && timeFixed < 6) {
			        	timeRate = Math.floor(timeFixed+1);
			        } else {
			        	timeRate = 1;
					}
				}
				// 使用延迟补偿会有跳帧的感觉，可关闭
				for(var i=0; i<timeRate; i++){
			    	self._exec(deltaTime);
			    }
			    if (timeRate>1) {
			        // 清空延迟
			        timeFixed = 0;
			    }
			} else {
		    	// 执行当前帧
		    	self._exec(deltaTime);
		    }		
		};
	              
		var nextTick = function(){
			if (hasTick()) {
				tick();
	        }
	            
	        self._clearTimer();
	            
	        if (!self._paused && !Ticker.destroyed) {
	        	self._timer = nextFrame(nextTick, delay); 
	        }
		};
	        
	    nextTick();
    },
     
   	_exec: function(delta) {
    	var targets = this._targets, 
    		target,
    		execIndex = 0;
    	
        for(var i=0,l=targets.length;i<l;i++){
        	if (this._paused || Ticker.destroyed) break;
            target = targets[i];
        	if (target instanceof Function) {
            	target(delta);
            } else {
            	target.update && target.update(delta);
            }
        }
	}
});
	
Ticker.destroyed = false;
	
return Ticker;
});