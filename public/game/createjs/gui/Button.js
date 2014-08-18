


(function(){
	"use strict";
	
var Button = Class.extend.call(cy.Container, {
	type: 'Button',
	cursor: 'pointer',
	onClick: null,
	preventMove: false,
	contentBmp: null,
	contentLbl: null,
	disabled: false,
	effect: false,
	isnotContainer: true,
	
	_bmpNormal: null,
	_bmpSelected: null,
	_bmpDisabled: null,
	_startSX: null,
	_startSY: null,
	
	init: function(normal, selected, disabled, text){
		this.initialize();
		
		this._bmpNormal = new cy.Bitmap(normal);
		this._bmpSelected = new cy.Bitmap(selected);
		this._bmpDisabled = new cy.Bitmap(disabled||selected);
		this._resetUI('normal');
		
		if (text) this.setText(text);
		Button.apply(this);
	},
	
	reset: function() {
		var contentLbl = this.contentLbl,
			rect = this.getMeasuredRect();
		if (contentLbl && !contentLbl.visible && rect.width>0) {
			contentLbl.textAlign = 'center';
			contentLbl.x = rect.width/2;
			contentLbl.y = (rect.height-28)/2;
			contentLbl.visible = true;
		}
	},
	
	draw: function(ctx, ignoreCache) {
		if (!ignoreCache) this.reset();
		return this.Super_draw(ctx, ignoreCache);
	},
	
	setText: function(text) {
		if (this.contentLbl) {
			this.contentLbl.text = text;
		} else {
			this.contentLbl = new cy.Label(text);
			this.contentLbl.visible = false;
			this.addChild(this.contentLbl);
		}
	},
	
	getText: function(){
		return this.contentLbl? this.contentLbl.text: null;
	},
	
	getMeasuredRect: function(){
		return this.contentBmp.getMeasuredRect();
	},
	
	disable: function(flag) {
		this.disabled = flag;
		if (flag) {
			this.mouseEnabled = false;
			this._resetUI('disabled');
		} else {
			this.mouseEnabled = true;
			this._resetUI('normal');
		}
	},
	
	_resetUI: function(state, effect) {
		this.contentBmp && this.removeChild(this.contentBmp);
		switch(state){
			case 'normal':
				this.contentBmp = this._bmpNormal;
				break;
			case 'selected':
				this.contentBmp = this._bmpSelected;
				break;
			case 'disabled':
				this.contentBmp = this._bmpDisabled;
				break;
		}
		this.addChildAt(this.contentBmp, 0);
		if (effect) {
			var t = cy.Tween.get(this);
			switch(state){
				case 'normal':
					if (this._startSX && this._startSY) {
						t.to({ scaleX:this._startSX, scaleY:this._startSY }, 50);
					}
					break;
				case 'selected':
					if (!(this._startSX && this._startSY)) {
						this._startSX = this.scaleX;
						this._startSY = this.scaleY;
					}
					t.to({ scaleX:this._startSX*1.2, scaleY:this._startSY*1.2 }, 50);
					break;
				case 'disabled':
					break;
			}
		}
		// this._bmpNormal.tintLighter = 
		// this._bmpSelected.tintLighter = 
		// this._bmpDisabled.tintLighter = 0;
	}
});

Button.apply = function(target) {
	var o = target;
	var handleEvent = function(e){
		switch (e.type) {
			case 'mousedown':
				o._resetUI('selected', o.effect);
				break;
			case 'pressup':
				o._resetUI('normal', o.effect);
				break;
			case 'rollout':
				if (!o.disabled && o.parent.type!=='TabMenu') {
					o._resetUI('normal', o.effect);
				}
				break;
			case 'click':
				o.onClick && o.onClick(e);
				break;
			case 'rollover':
				o._bmpNormal.tintLighter = 
				o._bmpSelected.tintLighter = 
				o._bmpDisabled.tintLighter = 0.1;
			break;
		}
	};
		
	o.addEventListener('mousedown', handleEvent);
	o.addEventListener('pressup', handleEvent);
	// o.addEventListener('rollover', handleEvent);
	o.addEventListener('rollout', handleEvent);
	o.addEventListener('click', handleEvent);
};

cy.Button = Button;

})();