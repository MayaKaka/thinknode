
define(function (require, exports, module) {
	"use strict";
	   
var DisplayObject = require('DisplayObject');

var Sprite = DisplayObject.extend({
	
	animationName: '',
	
	_paused: true,
		
    _sourceImages: null,
    _sourceImageIndex: -1,
    
    _animations: null,
    _currentAnimation: null,
    
    _frames: null,
    _currentFrame: null,
    
    _deltaTime: -1,
   	_frameIndex: -1,
    
    init: function(props) {
		this._super(props);		
		this._initSpriteSheet(props.spriteSheet);
	},
	
    play: function(name){
    	var animation = this._animations[name];
    	
        if (animation) {
        	this.animationName = name;        	
            this._currentAnimation  = animation;
 
            this._deltaTime = 0;
            this._frameIndex = 0;
            this._paused = false;
  		}
    },
    
    gotoAndStop: function(index) {
    	var frame = this._frames[index];
    	
    	this._playFrame(frame);
    	this._paused = true;
    },
    
    update: function(delta){
     	if (this._paused || !this._currentAnimation) return;
     	
     	var anim = this._currentAnimation,
     		start = anim[0],
     		end = anim[1],
     		next = anim[2],
     		delay = anim[3];
     	
     	var pos, index;
     	
     	if (delay > 0) {
     		pos = this._deltaTime/delay,
     		index = Math.floor((end-start+1)*pos+start);
     		this._deltaTime += delta;
     	} else {
     		index = this._frameIndex+start;
     		this._frameIndex += 1;
     	}

     	var frame = this._frames[ index>end? end: index ];
        this._playFrame(frame);
		
        if (delay > 0 ? (this._deltaTime > delay) : (this._frameIndex > end-start)) {
        	next = (this.animationEnd && this.animationEnd()) || next;
            if (next) {
                this.play(next);	
            } else {
            	this._deltaTime = 0;
            	this._frameIndex = 0;
            }
        }
	},
       
    draw: function(ctx){
     	var frame = this._currentFrame;
     	 
     	if (frame) {
	     	var	image = this._sourceImages[frame[4]];
	     	if (image && image.complete) {
	     		ctx.drawImage(image, frame[0], frame[1], frame[2], frame[3], frame[5], frame[6], frame[2], frame[3]);
	     	}
     	}
     },

	_initSpriteSheet: function(spriteSheet) {
		this._initImages(spriteSheet.images);
        this._initFrames(spriteSheet.frames);
        this._animations = spriteSheet.animations;
     },
	
	_initImages: function(images) {
		this._sourceImages = [];
		
		var image;
		
		for(var i=0,l=images.length; i<l; i++) {
			if (this.renderInCanvas) {
				image = new Image();
				image.src = images[i];
			} else {
				image = images[i];
			}
			this._sourceImages.push(image);
		}
	},
	
	_initFrames: function(frames, append) {
		if (!append) {
			this._frames = [];
		}
		
		if (frames instanceof Array) {
			for (var i=0,l=frames.length; i<l; i++) {
				if (frames[i] instanceof Array) {
					this._frames.push(frames[i]);
				} else {
					this._initFrames(frames[i], true);
				}
			}
		} else {
			for (var j=0, jl=frames.rows; j<jl; j++) {
				for (var i=0, il=frames.cols; i<il; i++) {
					if ((j*frames.cols+i) === frames.num) {
						break;
					} else {
						this._frames.push([
							i*frames.width, j*frames.height,
							frames.width, frames.height,
							frames.img||0, 0, 0
						]);	
					}
				}
			}	
		}
	},
	
	_playFrame: function(frame) {
		if (this.renderInCanvas) {
        	this._currentFrame = frame;
        } else {
        	if (this.width !== frame[2] || this.height !== frame[3]) {
        		this.style('size', { width: frame[2], height: frame[3] })
        	}
        	if (this._sourceImageIndex !== frame[4]) {
        		this.elemStyle.backgroundImage = 'url('+this._sourceImages[frame[4]]+')';
        		this.elemStyle.backgroundRepeat = 'no-repeat';
        		this._sourceImageIndex = frame[4];
        	}
        	this.elemStyle.backgroundPosition = '-'+frame[0]+'px -'+frame[1]+'px';
        }
	}
});

return Sprite;
});