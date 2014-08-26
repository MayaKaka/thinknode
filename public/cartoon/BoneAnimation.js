
define(function (require, exports, module) {
   
var DisplayObject = require('DisplayObject'),
	Bitmap = require('Bitmap');

var BoneAnimation = DisplayObject.extend({
	
	animationName: '',
	
	_paused: true,
	
	_bones: null,
	_animations: null,
	_currentAnimation: null,
	
	_frameIndex: -1,
	_tweens: null,
	
	init: function(elem, props) {
		this._super(elem, props);
	
		this._initBones(props.bones, props.animations);
	},

	play: function(name) {
		var animation = this._animations[name];

        if (animation) {
        	this.animationName = name;
            
            this._currentAnimation = animation;
            this._frameIndex = 0;
            this._frameMax = 0;
            this._initTweens();
            
            this._paused = false;
  		}
	},
	
	update: function() {
		if (this._paused || !this._currentAnimation) return;
		
		var tweens = this._tweens,
			bones = this._bones,
			index = this._frameIndex,
			tween, bone, section, 
			start, end, pos;
		
		for (var j in tweens) {
			tween = tweens[j];
			bone = bones[j];
			section = null;
			
			for (var i=0,l=tween.length; i<l; i++) {	
				if (index >= tween[i].start.index && index <= tween[i].end.index) {
					section = tween[i];
					break;
				}
			}
			
			if (section) {
				start = section.start;
				end = section.end;
				pos = (index-start.index)/(end.index-start.index);
				
				end.pos && bone.step('pos', { pos: pos, start: start.pos, end: end.pos });
				end.transform && bone.step('transform', { pos: pos, start: start.transform, end: end.transform });
			}
		}
		
		this._frameIndex++;
		
		if (this._frameIndex > this._frameMax) {
			this._frameIndex = 0;
            // this._paused = true;
		}
	},
	
	_initBones: function(bones, animations) {
		this._bones = {};
		this._animations = {};
		
		var relation = {}, parents = [];
		
		var bone, bmp;
		for (var i=0, l=bones.length; i<l; i++) {
			bone = bones[i];
			
			if (bone.imageUrl) {
				bmp = new Bitmap(null, {
					renderInCanvas: this.renderInCanvas,
					pos: { x: 0, y: 0},
					size: { width: bone.width, height: bone.height },
					imageUrl: bone.imageUrl
				});
			} else {
				bmp = new DisplayObject(null, {
					renderInCanvas: this.renderInCanvas,
					pos: { x: 0, y: 0},
					size: { width: bone.width, height: bone.height }
				});
			}
			
			if (bone.parent) {
				if (!relation[bone.parent]) {
					relation[bone.parent] = [ bone.tag ];
				} else {
					relation[bone.parent].push(bone.tag);
				}
			} else {
				parents.push(bone.tag);
				this.addChild(bmp);
			}
			
			this._bones[bone.tag] = bmp;
		}
		
		for (var i=0, l=parents.length; i<l; i++) {
			this._addBonesByTag(parents[i], relation, this._bones);
		}
		
		for (var i in animations) {
			this._animations[i] = animations[i];
		}
		
	},
	
	_addBonesByTag: function(tag, relation, bones) {
		var bone, boneTag, parent;
		
		if (relation[tag]) {
			parent = bones[tag];
			for (var i=0, l=relation[tag].length; i<l; i++) {
				boneTag = relation[tag][i];
				bone = bones[boneTag];
				parent.addChild(bone);
				this._addBonesByTag(boneTag, relation, bones, bone);
			}
		}
	},
	
	_initTweens: function() {		
		this._tweens = {};
		
		var animation = this._currentAnimation,
			bones = this._bones,
			bone, state;
			
		for (var i=0,l=animation.length; i<l; i++) {
			state = animation[i];
			bone = bones[state.tag];
			this._setBoneState(bone, state);
		}
		
	},
	
	_setBoneState: function(bone, state) {
		var tweens = this._tweens,
			frames = state.frames,
			step = frames[0].index===0? frames[0]: null,
			section,
			step, delta = 0;
		
		if (step) {
			step.pos && bone.style('pos', step.pos);
			step.transform && bone.style('transform', step.transform);	
		}
		
		step = {
			index: 0,
			pos: this._mergeProps(bone.style('pos')),
			transform: this._mergeProps(bone.style('transform'))
		};
		
		tweens[state.tag] = [];
		
		for (var i=0,l=frames.length; i<l; i++) {
			if (frames[i].index !== 0) {
				section = {
					start: step,
					end: frames[i]
				};
				tweens[state.tag].push(section);
				step = {
					index: frames[i].index,
					pos: this._mergeProps(step.pos, frames[i].pos),
					transform: this._mergeProps(step.transform, frames[i].transform)
				};
				
				if (this._frameMax < frames[i].index) {
					this._frameMax = frames[i].index;
				}
			}
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

return BoneAnimation;
});