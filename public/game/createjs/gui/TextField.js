
(function(){
	"use strict";
	
var TextField = Class.extend.call(cy.DOMElement, {
	type: 'TextField',

	init: function( className, isPassword ) {
		var element = document.createElement('input');
		element.className = className||'textfield';
		if( isPassword ) {
			element.type = 'password';
		} else {
			element.type = 'text';
		}
		element.state = 'blur';
		element.onfocus = element.onblur = TextField._handleFocusOrBlur;
		this.initialize( element );
	},
	
	focus: function(){
		this.htmlElement.focus();
	},
	
	blur: function(){
		this.htmlElement.blur();
	},
	
	getText: function(){
		return this.htmlElement.value;
	},
	
	setText: function( val ){
		this.htmlElement.value = val;
	},
	
	setMaxLength: function( len ){
		this.htmlElement.maxLength = len;
	}
});

TextField._handleFocusOrBlur = function(e){
	var target = e.target; 
	if (e.type === 'focus') {
		target.state = 'focus';
	} else {
		target.state = 'blur';
	}
};

cy.TextField = TextField;

})();