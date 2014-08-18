(function() {
	"use strict";

var MovieClip = ccp.BaseComponent.extend({
	
	mode: null,
	startPosition: 0,
	loop: true,
	currentFrame : 0,
	timeline : null,
	paused : false,
	actionsEnabled : true,
	autoReset : true,
	frameBounds : null,
	_synchOffset : 0,
	_prevPos : -1,
	_prevPosition : 0,
	_managed: null,
	
	ctor: function(name, className, filePath) {
		this._super(name, "MovieClip", "plus/MovieClip.js");
		this.initialize(MovieClip.INDEPENDENT, 0, true);
	},
	
	initialize: function(mode, startPosition, loop, labels) {
		this.mode = mode || MovieClip.INDEPENDENT;
		this.startPosition = startPosition || 0;
		this.loop = loop;
		var props = {paused:true, position:startPosition, useTicks:true};

		this.timeline = new ccp.Timeline(null, labels, props);
		this._managed = {};
	},
	
	onEnter: function() {
		if (this._data && this._defaultAnimationName)	{
			this.playAnimation(this._defaultAnimationName);
		}
	},
	
	_data: null,
	_defaultAnimationName: "",
	
	loadData: function(data, defaultAnimation) {
		this._data = data;
		
		if (defaultAnimation) {
			this.setDefaultAnimation(defaultAnimation);	
		}
	},
	
	setDefaultAnimation: function(defaultAnimation){
		this._defaultAnimationName = defaultAnimation;	
	},
	
	playAnimation: function(name, loop) {
		var data = this._data[name];
		
		if (loop!==undefined) {
			this.loop = loop;
		}
		
		var line = this.timeline;
		line.removeAllTweens();
		if (data) {
			for (var i in data) {
				this.addItem(i, data[i]);
			}
		}
		this.gotoAndPlay(0);
	},
	
	addItem: function(name, data) {
		var item;
		if (name === "owner") {
			item = this.getOwner();
		} else {
			item = this.getOwner().query(name);
		}
		
		if (!item) return;
		
		var last = 0, delta = 0,
			line = this.timeline,
			tween = ccp.Tween.get(item);
		for (var i in data) {
			i = parseFloat(i);
			delta = i - last;
			// if has tween animation
			if (data[i].ht) {
				tween.to(data[i].st, delta);
			} else {
				tween.wait(delta).to(data[i].st);
			}
			last = i;
		}
		line.addTween(tween);
		
		if (line.duration < last+1) {
			line.duration = last+1;
		}
	},
	
	play: function() {
		this.paused = false;
	},

	pause: function() {
		this.paused = true;
	},

	gotoAndPlay: function(positionOrLabel) {
		this.paused = false;
		this._goto(positionOrLabel);
	},

	gotoAndStop: function(positionOrLabel) {
		this.paused = true;
		this._goto(positionOrLabel);
	},

	getLabels: function() {
		return this.timeline.getLabels();
	},

	getCurrentLabel: function() {
		this._updateTimeline();
		return this.timeline.getCurrentLabel();
	},

	onUpdate: function(delta) {
		if (!this.paused && this.mode == MovieClip.INDEPENDENT) {
			this._prevPosition = (this._prevPos < 0) ? 0 : this._prevPosition + (delta/0.0167);
			this._updateTimeline();
		}
	},

	_goto : function(positionOrLabel) {
		var pos = this.timeline.resolve(positionOrLabel);
		if (pos == null) { return; }
		// prevent _updateTimeline from overwriting the new position because of a reset:
		if (this._prevPos == -1) { this._prevPos = NaN; }
		this._prevPosition = pos;
		this._updateTimeline();
	},
	
	_reset: function() {
		this._prevPos = -1;
		this.currentFrame = 0;
	},

	_updateTimeline: function() {
		var tl = this.timeline;
		var synched = this.mode != MovieClip.INDEPENDENT;
		tl.loop = (this.loop==null) ? true : this.loop;

		// update timeline position, ignoring actions if this is a graphic.
		if (synched) {
			tl.setPosition(this.startPosition + (this.mode==MovieClip.SINGLE_FRAME?0:this._synchOffset), ccp.Tween.NONE);
		} else {
			tl.setPosition(this._prevPos < 0 ? 0 : this._prevPosition, this.actionsEnabled ? null : ccp.Tween.NONE);
		}

		this._prevPosition = tl._prevPosition;
		if (this._prevPos == tl._prevPos) { return; }
		this.currentFrame = this._prevPos = tl._prevPos;

		for (var n in this._managed) { this._managed[n] = 1; }

		var tweens = tl._tweens;
		for (var i=0, l=tweens.length; i<l; i++) {
			var tween = tweens[i];
			var target = tween._target;
			if (target == this || tween.passive) { continue; } // TODO: this assumes actions tween has this as the target. Valid?
			var offset = tween._stepPosition;

			// state tween.
			// this._setState(target.state, offset);
		}
	},

	_setState: function(state, offset) {
		if (!state) { return; }
		for (var i=state.length-1;i>=0;i--) {
			var o = state[i];
			var target = o.t;
			var props = o.p;
			for (var n in props) { target[n] = props[n]; }
			this._addManagedChild(target, offset);
		}
	},
	
	_addManagedChild: function(child, offset) {
		if (child._off) { return; }
		// this.addChildAt(child,0);

		if (child instanceof MovieClip) {
			child._synchOffset = offset;
			// TODO: this does not precisely match Flash. Flash loses track of the clip if it is renamed or removed from the timeline, which causes it to reset.
			if (child.mode == MovieClip.INDEPENDENT && child.autoReset && !this._managed[child.id]) { child._reset(); }
		}
		this._managed[child.id] = 2;
	}
	
});

	MovieClip.INDEPENDENT = "independent";
	MovieClip.SINGLE_FRAME = "single";
	MovieClip.SYNCHED = "synched";


var MovieClipPlugin = function() {
	  throw("MovieClipPlugin cannot be instantiated.");
	};

	MovieClipPlugin.priority = 100; // very high priority, should run first

	MovieClipPlugin.install = function() {
		ccp.Tween.installPlugin(MovieClipPlugin, ["startPosition"]);
	};

	MovieClipPlugin.init = function(tween, prop, value) {
		return value;
	};

	MovieClipPlugin.step = function() {
		// unused.
	};

	MovieClipPlugin.tween = function(tween, prop, value, startValues, endValues, ratio, wait, end) {
		if (!(tween.target instanceof MovieClip)) { return value; }
		return (ratio == 1 ? endValues[prop] : startValues[prop]);
	};

	MovieClipPlugin.install();

ccp.MovieClip = MovieClip;
}());