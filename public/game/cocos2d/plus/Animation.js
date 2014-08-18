(function() {
	"use strict";

var Animation = cc.Node.extend({
	
	_size: null,
	_paused: true,
	_frames: null,
	_animations: null,
	_currentFrame: null,
	_currentFrameIndex: -1,
	_currentAnimation: null,
	_defaultAnimationName: null,
	_delayTime: 0,
	_deltaTime: 0,
	_interval: 0,
	
	onAnimationEnd: null,
	
	ctor: function() {
		this._super();
		this._images = [];
		this._frames = [];
		this._animations = {};
		this._interval = 1.0 / 60;
		this._size = cc.size(0, 0);
		this._paused = true;
		this.schedule(this._tick, this._interval);
	},
	
	onEnter: function() {
		this._super();
		
		if (this._defaultAnimationName) {
			this.playAnimation(this._defaultAnimationName);
		}
	},
	
	onExit:function() {
		this.pause();
			
		this._frames.forEach(function(a, i){
			a.release();
		});
		// cc.log('release');
        this._super();
    },
    
    getSize: function(){
    	return this._size;	
    },
    
	loadData: function(data, urlHead) {
		urlHead = urlHead || '';
		for (var i=0,l=data.images.length; i<l; i++) {
			// this._images.push(cc.TextureCache.getInstance().addImage(data.images[i]));
			this._images.push(urlHead+data.images[i]);
		}
		var sprite, frame;
		for (var i=0,l=data.frames.length; i<l; i++) {
			frame = data.frames[i];
			this.addFrame(this._images[frame[4]], 
				cc.rect(frame[0], frame[1], frame[2], frame[3]),
				cc.p(frame[5]||0, frame[6]||0));
		}
		for (var i in data.animations) {
			this.addAnimation(
				i, data.animations[i][0], data.animations[i][1],
				data.animations[i][2],
				data.animations[i][3]
			);
		}
		if (data.defaultAnimation) this.setDefaultAnimation(data.defaultAnimation);
	},
	
	addFrame: function (image, rect, pos) {
		var sprite = cc.Sprite.create(image, rect);
		sprite.setAnchorPoint(cc.p(0, 0));
		sprite.setPosition(pos);
		sprite.retain();
		// sprite.pos = pos;
		this._frames.push(sprite);
	},
	
	removeFrame: function(index) {
		var frame = this._frames.splice(index, 1)[0];
		frame.release();
		// cc.log('release');
	},
	
	playFrame: function(index) {
		if (!this._paused) {
			this.pause();
		}
		this._playFrame(index);
	},
	
	getCurrentFrame: function() {
		return this._currentFrame;
	},
	
	addAnimation: function(name, start, end, loop, speed) {
		this._animations[name] = {
			name: name,
			start: start,
			end: end,
			next: true,
			speed: speed
		};
	},
	
	removeAnimation: function(name) {
		delete this._animations[name];
	},
	
	setDefaultAnimation: function(name) {
		this._defaultAnimationName = name;
	},	
	
	playAnimation: function(name, loop) {
		if (this._paused) {
			this.play();
		}
		
		var animation = this._animations[name];
		if (!animation) return;
		
		if (loop!==undefined) {
			animation.next = loop;
		}
		
		this._currentAnimation = animation;
		this._currentFrameIndex = 0;
		this._delayTime = this._interval/animation.speed;
		this._deltaTime = 0;
		// this.getScheduler().setTimeScale(animation.speed);
	},

	getCurrentAnimation: function() {
		return this._currentAnimation;
	},
	
	getCurrentAnimationName: function(){
		return this._currentAnimation.name;
	},
	
	getAnimationDelay: function(name) {
		var animation = this._animations[name];
		if (!animation) return 0;
		
		return this._interval/animation.speed*1000*(animation.end-animation.start+1);
	},
	
	pause: function(){
		this._paused = true;
		// this.unschedule(this._tick, this._interval);
	},
	
	play: function(){
		this._paused = false;
		// this.schedule(this._tick, this._interval);
	},
	
	_tick: function(delta) {
		if (this._paused) return;
		
		var animation = this._currentAnimation;
		if (!animation) return;
		
		var frameIndex = this._currentFrameIndex+animation.start;
		this._playFrame(frameIndex);
		
		this._deltaTime += delta;
		if (this._deltaTime >= this._delayTime) {
			// 延迟补偿
			this._deltaTime -= this._delayTime;
			// 当延迟超出补偿范围时，将延迟修正为 0
			if (this._deltaTime > this._delayTime) {
				// alert("DeltaTime was unexpected: "+(this._deltaTime-this._delayTime)*1000);
				this._deltaTime = 0;    //(this._deltaTime%this._delayTime)*this._delayTime;
			}
			this._currentFrameIndex++;
			frameIndex++;
		}
		
		if (frameIndex > animation.end) {
			this._currentFrameIndex = 0;
			if (animation.next === false) {
				this.pause();
			} 	
			this.onAnimationEnd && this.onAnimationEnd(animation.name);
		}
	},
	
	_playFrame: function(index) {
		var frame = this._frames[index];

		if (this._currentFrame) {
			this.removeChild(this._currentFrame);
		}
		this._currentFrame = frame;
		this._updateSize(frame);
		// this._currentFrame.setPosition(cc.p(frame.pos.x, frame.pos.y));
		// cc.log("Hand: ("+this.getPosition().x+","+this.getPosition().y+")      CurrentFrame: ("+frame.getPosition().x+","+frame.getPosition().y+") anchor("+frame.getAnchorPoint().x+","+frame.getAnchorPoint().y+")");
		this.addChild(this._currentFrame);
	},
	
	_updateSize: function(frame) {
		frame = frame || this._currentFrame;
		if (frame) {
			this._size.width = frame.getContentSize().width;
    		this._size.height = frame.getContentSize().height;
		}
	}
});

Animation.create = function(){
	return new Animation();
};

ccp.Animation = Animation;
}());