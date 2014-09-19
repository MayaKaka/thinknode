
define(function (require, exports, module) {
	"use strict";
	   
var Class = require('Class');

var Timeline = Class.extend({
	
	targets: null,
	deltaTime: -1,
	
	_paused: true,
	
	init: function() {
		this.targets = [];
		this.deltaTime = 0;
		this.finish = false;
	},
	
	setNowTime: function(timepoint) {
		this.deltaTime = timepoint;
	},
		
	addKeyFrame: function(target, props, timepoint, callback) {
		var queue = target.data('tl_queue'),
			start = target.data('tl_start');
			
		if (!queue) {
			queue = [];
			start = {};
			target.data('tl_queue', queue);
			target.data('tl_start', start);
			this.targets.push(target);
		}
		for (var i in props) {
			start[i] = this._clone(target.style(i));
		}
		
		queue.push([props, timepoint, callback]);
		queue.sort(function(a, b) {
			return a[1]-b[1];
		})
		
		var steps = [], 
			step,
			from = 0,
			max = 0;
		for (var i=0,l=queue.length; i<l; i++) {
			step = queue[i];
			if (i === 0) {
				steps.push({
					from: step[1]===0?-1:0, to: step[1],
					start: start, end: step[0],
					cb: step[2]
				})
			} else {
				steps.push({
					from: from, to: step[1],
					start: start, end: step[0],
					cb: step[2]
				})
			}
			from = step[1];
			start = this._merge(start, step[0]);
		}
		target.data('tl_steps', steps);

		return this;
	},
	
	removeKeyFrames: function(target) {
		target.data('tl_queue', null);
		target.data('tl_start', null);
		target.data('tl_steps', null);
		target.data('tl_cur_step', null);
	},
	
	update: function(delta) {
		var deltaTime = this.deltaTime,
			targets = this.targets,
			target,
			steps,
			step,
			cur,
			pos,
			max = 0;
		
		for (var j=0,jl=targets.length; j<jl; j++) {
			target = targets[j];
			steps = target.data('tl_steps');
			
			for (var i=0,l=steps.length; i<l; i++) {
				step = steps[i];
				if (deltaTime>=step.from && deltaTime<=step.to) {
					pos = (deltaTime-step.from)/(step.to-step.from);
					for (var key in step.end) {
						target._stepStyle(key, {
							pos: pos, start: step.start[key], end: step.end[key]
						});
					}
					cur = target.data('tl_cur_step');
					if (cur) {
						if (cur !== step) {
							cur.cb && cur.cb();
							target.data('tl_cur_step', step);
						}
					} else {
						target.data('tl_cur_step', step);
					}
				}
			}
			if (max < step.to) {
				max = step.to;
			}
		}
		
		if (deltaTime > max) {
			this.deltaTime = 0;
		} else {
			this.deltaTime += delta;
			
		}
	},
	
	_clone: function(origin) {
		var temp;
		if (typeof(origin) === 'object') {
			temp = {};
			for (var i in origin) {
				temp[i] = this._clone(origin[i]);
			}
 		} else {
			temp = origin;
		}		
		return temp;
	},
	
	_merge: function(origin, extension) {
		var temp = this._clone(origin);
		
		if (typeof(extension) === 'object') {
			for (var i in extension) {
				if (typeof(temp[i]) === 'object' && typeof(extension[i]) === 'object') {
					for (var j in extension[i]) {
						temp[i][j] = extension[i][j];
					}
				} else {
					temp[i] = extension[i];
				}
			}
 		} else {
			temp = extension;
		}
		return temp;
	}
});

return Timeline;
});