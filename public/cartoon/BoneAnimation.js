
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
		this._initBones(props);
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
	
	_initBones: function(props) {
		this._bones = {};
		this._animations = {};
		
		var bones = props.bones,
			animations = props.animations,
			bone, displayObj;
		// 创建骨骼节点
		for (var i=0, l=bones.length; i<l; i++) {
			bone = bones[i];

			if (bone.image) { // 图像节点
				displayObj = new Bitmap({
					renderMode: this.renderMode,
					x: 0, y: 0, width: bone.width, height: bone.height,
					image: bone.image
				});
			} else { // 容器节点
				displayObj = new DisplayObject({
					renderMode: this.renderMode,
					x: 0, y: 0, width: bone.width, height: bone.height
				});
			}
			
			if (!bone.parent) { // 添加根节点
				this.addChild(displayObj);
			}
			
			this._bones[bone.tag] = displayObj;
		}
		
		for (var i=0, l=bones.length; i<l; i++) {
			bone = bones[i];

			if (bone.parent) { // 添加子节点
				this._bones[bone.parent].addChild(this._bones[bone.tag]);	
			}		
		}
		
		for (var i in animations) {
			this._animations[i] = animations[i];
		}
	},
	
	_initTimeline: function(animation) {
		var timeline = new Timeline(),
			data, bone, frames, frame;
			
		for (var j=0, jl=animation.length; j<jl; j++) {
			data = animation[j];
			bone = this._bones[data.tag];
			frames = data.frames;
			timeline.get(bone);
			
			for (var i=0, l=frames.length; i<l; i++) {
				frame = frames[i];
				timeline.addKeyframe(frame, frame.time);
			}
		}

		return timeline;
	}
	
});

return BoneAnimation;
});