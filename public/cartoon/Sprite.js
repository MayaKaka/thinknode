
define(function (require, exports, module) {
   
var DisplayObject = require('DisplayObject');

var Sprite = DisplayObject.extend({
	
	animationName: '',
	
	_paused: true,
		
    _sourceImages: null,
    _sourceImageIndex: -1,
    
    _animations: null,
    _currentAnimation: null,
    
    _frames: null,
    _frameIndex: -1,
    _frameDelay: -1,
    _currentFrame: null,
    
    init: function(props) {
		this._super(props);		
		this._initSpriteSheet(props.spriteSheet);
	},
	
    play: function(name){
    	var animation = this._animations[name];
    	
        if (animation) {
        	this.animationName = name;
        	
            this._currentAnimation  = animation;
            this._frameIndex = 0;
            this._frameDelay = 0;
            
            this._paused = false;
  		}
    },
    
    gotoAndStop: function(index) {
    	var frame = this._frames[index];
    	
    	this._playFrame(frame);
    	this._paused = true;
    },
    
    update: function(){
     	if (this._paused || !this._currentAnimation) return;
     	
     	var anim = this._currentAnimation,
     		start = anim[0],
     		end = anim[1],
     		next = anim[2],
     		delay = anim[3];
     		
     	var frame = this._frames[start+this._frameIndex];
  	   
        this._playFrame(frame);              
        this._frameDelay++;
                
        if (this._frameDelay > delay) {
        	this._frameDelay = 0;
            this._frameIndex++;
            
            if(this._frameIndex > end-start){
            	next = (this.animationEnd && this.animationEnd()) || next;
                if (next) {
                	this.play(next);	
                } else {
                	this._frameIndex = 0;
                	// this._paused = true;
                }
            }
      	}
	},
       
    draw: function(ctx){
     	var frame = this._currentFrame;
     	 
     	if (frame) {
	     	var	image = this._sourceImages[frame[4]];
	     	if (image && image.complete) {
	     		ctx.drawImage(image, frame[0], frame[1], frame[2], frame[3], 0, 0, frame[2], frame[3]);
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
					if ((j*frames.cols+i) === frames.numFrames) {
						break;
					} else {
						this._frames.push([
							i*frames.width, j*frames.height,
							frames.width, frames.height,
							0, 0, 0
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