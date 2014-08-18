


(function(){
	"use strict";
	
var CheckBox = Class.extend.call(cy.Container, {
	type: 'CheckBox',
	cursor: 'pointer',
	onChange: null,
	preventMove: true,
	backgroundBmp: null,
	contentBmp: null,
	selected: false,
	isnotContainer: true,
	
	_bmpNormal: null,
	_bmpSelected: null,
	_bmpDisabled: null,
	
	init: function(normal, selected, disabled){
		this.initialize();
		
		this._bmpNormal = new cy.Bitmap(normal);
		this._bmpSelected = new cy.Bitmap(selected);
		this._bmpDisabled = new cy.Bitmap(disabled||selected);
		this._resetUI('normal');
		
		CheckBox.apply(this);
	},
	
	getMeasuredRect: function(){
		return this.backgroundBmp.getMeasuredRect();
	},
			
	_resetUI: function (state) {
		if (!this.contentBmp) {
			this.addChild(this._bmpNormal, this._bmpSelected);
			this.backgroundBmp = this._bmpNormal;
			this.contentBmp = this._bmpSelected;
		}
		switch(state){
			case 'normal':
				this.contentBmp.visible = false;
				break;
			case 'selected':
				this.contentBmp.visible = true;
				break;
			case 'disabled':
				// To Do
				break;
		}
	}
});

CheckBox.apply = function(target){
	var o = target;
	o.addEventListener('click', function(e){
		o.selected = o.selected? false: true;
		if (o.selected) {
			o._resetUI('selected');
		} else {
			o._resetUI('normal');
		}
		o.onChange && o.onChange(e, o.selected);
	});
};

cy.CheckBox = CheckBox;

})();