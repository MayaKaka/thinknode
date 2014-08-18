
(function() {
	"use strict";

var UICheckBox = cy.DOMObject.extend({
	type: 'UICheckBox',
	checked: false,
	onChange: null,
	
	_template: '<div></div>',
	_classes: null,
	
	init: function( element, params ){
		this.Super_init( element, params );
		if( !params || !params.ui ) {
			this._initUI( { classes: this.attr('classes').split(',') } );
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
			this._changeUI( this.checked ? 0 : -1);
		}
	},
	
	check: function( checked ) {
		this.checked = checked;
		this._changeUI( checked ? 0 : -1);
		this.onChange && this.onChange( checked );
	},
	
	_initUI: function( ui ){
		var o = this;
		this._classes = ui.classes;
		this.bind('click', function(){
			var checked = o.checked ? false : true;
			o.check( checked );
		});
	},
	
	_changeUI: function( classIdx ){
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

cy.UICheckBox = UICheckBox;

}());
