
(function() {
	"use strict";

var UIButton = cy.DOMObject.extend({
	type: 'UIButton',
	onClick: null,
	
	_template: '<input type="button" value="按钮"></input>',
	_classes: null,
	
	init: function( element, params ){
		this.Super_init( element, params );
		if( !params || !params.ui ) {
			var classes = this.attr('classes');
			classes && this._initUI( { classes: classes.split(',') } );
		}
	},
	
	param: function( name, value){
		switch( name ) {
			case 'ui':
				this._initUI( value );
				break;
			default:
				this.attr( name, value );
				break;
		}
	},

	disable: function( bool ) {
		this.disabled = this.htmlElement.disabled = bool;
		if( bool ) {
			this._changeUI(1);
		} else {
			this._changeUI(-1);
		}
	},
	
	_initUI: function( ui ){
		var o = this;
		this._classes = ui.classes;
		this.bind('touchstart', function(){
			o._changeUI(0);
		});
		this.bind('touchend', function(){
			o._changeUI(-1);
		});
		this.bind('mouseout', function(){
			o._changeUI(-1);
		});
		this.bind('click', function( e ){
			o.onClick && o.onClick( e );
		});
	},

	_changeUI:  function( classIdx ){
		var o = this,
			classes = this._classes;
		classes.forEach(function( a, b ){
			if( b === classIdx ) {
				o.addClass( a );	
			} else {
				o.removeClass( a );
			}
		});
	}
});

cy.UIButton = UIButton;
}());
