
define(function (require, exports, module) {
	"use strict";
	   
var DisplayObject = require('DisplayObject'),
	Timeline = require('Timeline'),
	Bitmap = require('Bitmap');

var BoneAnimation = DisplayObject.extend({
	
	animationName: '',
	
	_paused: true,
	_bones: null,
	_animations: null,
	_currentAnimation: null,
	_timeline: null,
	
	init: function(props) {
		this._super(props);
		
		this._initBones(props.bones, props.animations);
	},

	play: function(name) {
		var animation = this._animations[name];

        if (animation) {
        	this.animationName = name;
            this._currentAnimation = animation;
            
            this._timeline = this._initTimeline(animation);
            this._paused = false;
  		}
	},
	
	update: function(delta) {
		if (this._paused || !this._currentAnimation) return;

		this._timeline.update(delta);
	},
	
	_initBones: function(bones, animations) {
		this._bones = {};
		this._animations = {};
		
		var displayObj,
			tag, 
			bone;
		
		for (var i=0, l=bones.length; i<l; i++) {
			bone = bones[i];

			if (bone.image) {
				displayObj = new Bitmap({
					renderInCanvas: this.renderInCanvas,
					x: 0, y: 0, width: bone.width, height: bone.height,
					image: bone.image
				});
			} else {
				displayObj = new DisplayObject({
					renderInCanvas: this.renderInCanvas,
					x: 0, y: 0, width: bone.width, height: bone.height
				});
			}
			
			if (!bone.parent) {
				this.addChild(displayObj);
			}
			
			this._bones[bone.tag] = displayObj;
		}
		
		for (var i=0, l=bones.length; i<l; i++) {
			bone = bones[i];

			if (bone.parent) {
				this._bones[bone.parent].addChild(this._bones[bone.tag]);	
			}		
		}
		
		for (var i in animations) {
			this._animations[i] = animations[i];
		}
	},
	
	_initTimeline: function(data) {
		var timeline = new Timeline(),
			bone, frames, frame;
			
		for (var j=0,jl=data.length; j<jl; j++) {
			bone = this._bones[data[j].tag];
			frames = data[j].frames;
			timeline.get(bone);
			for (var i=0,l=frames.length; i<l; i++) {
				frame = frames[i];
				timeline.addKeyframe(frame, frame.time);
			}
		}

		return timeline;
	}
	
});

return BoneAnimation;
});