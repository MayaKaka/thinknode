define(function (require, exports, module) {
   
var Class = require('Class');

var Timeline = Class.extend({
	targets: null,
	
	_paused: true,
	
	init: function() {
		this.targets = [];
		this.detlaTime = 0;
		this.finish = false;
	},
		
	addKeyFrame: function(target, props, timepoint) {
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
			start[i] = target.style(i);
		}
		
		queue.push([props, timepoint]);
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
				if (step[1] !== 0) {
					steps.push({
						from: 0, to: step[1],
						start: start, end: step[0]
					})
				}
				from = step[1];
				start = this._mergeProps(start, step[0]);
			} else {
				steps.push({
					from: from, to: step[1],
					start: start, end: step[0]
				})
				from = step[1];
				start = this._mergeProps(start, step[0]);
			}
		}
		target.data('tl_steps', steps);
		
		return this;
	},
	
	removeKeyFrame: function() {
		
	},
	
	update: function(delta) {
		this.detlaTime += delta;
		delta = this.detlaTime;
		
		var targets = this.targets,
			target,
			steps,
			step,
			pos;
			max = 0;
			
		for (var j=0,jl=targets.length; j<jl; j++) {
			target = targets[j];
			steps = target.data('tl_steps');
			
			for (var i=0,l=steps.length; i<l; i++) {
				step = steps[i];
				if (delta>=step.from && delta<=step.to) {
					pos = (delta-step.from)/(step.to-step.from);
					for (var key in step.end) {
						target._stepStyle(key, {
							pos: pos, start: step.start[key], end: step.end[key]
						});
					}
				}
			}
			if (max < step.to) {
				max = step.to;
			}
		}
		
		if (delta > max) {
			this.detlaTime = 0;
		}
	},
	
	_mergeProps: function(origin, props) {
		var temp = {};

		for (var i in origin) {
			temp[i] = origin[i];	
		}
		if (props) {
			for (var i in props) {
				temp[i] = props[i];
			}		
		}
		
		return temp;
	}
});

return Timeline;
});