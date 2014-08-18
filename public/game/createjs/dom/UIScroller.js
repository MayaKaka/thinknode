

(function() {
	"use strict";

var UIScroller = cy.DOMObject.extend({
	type: 'UIScroller',
	content: null,
	_template: '<div style="overflow:hidden;"><div></div></div>',
	_iScroll: null,
	
	init: function( element, params ){
		this.Super_init( element, params );
		this.content = this.getChild( 0 );
		params && params.items && this._initItems( params.items );
		this._initScroll();
	},
	
	param: function( name, value ){
		switch( name ) {
			case 'items': break;
			default:
				this.attr( name, value );
				break;
		}	
	},

	scrollTo: function( x, y, duration, flag ){
		if ( this._iScroll ) {
			this._iScroll.scrollTo( x, y, duration, flag );
	//		this._iScroll.scrollTo(0,10,200,true);
		}
	},

	scrollToElement: function( selector, duration ){
		if ( this._iScroll ) {
			this._iScroll.scrollToElement( selector, duration );
	//		this._iScroll.scrolToElement("li:nth-child(10)",100);
		}
	},

	refresh: function() {
		if ( this._iScroll ) { 
			this._iScroll.refresh();
		}
	},

	destroy: function() {
		this.Super_destroy();
		if ( this._iScroll ) {
			this._iScroll.destroy();
		}
	},

	moved: function() {
		if ( this._iScroll ) {
			return this._iScroll.moved;
		}
		return false;
	},
	
	_initItems: function( items ){
		this.content.addChild( items );
	},

	_initScroll: function( ui ){
		if( this._iScroll ){
			this._iScroll.destroy();
			this._iScroll = null;
		}

		this._iScroll = new IScroll( this.htmlElement, {
			scrollbars: true,
	//		scrollbars: 'custom',        // 可以利用一系列的css来自定义滚动条的呈现
	//		interactiveScrollbars: true,
			
	//		bounceEasing: 'elastic',     // 启用或禁用边界的反弹,默认为true
	//		bounceTime: 1200,         
			
	//		mouseWheel: true,
	//		wheelAction: 'zoom',
	//		zoom: true,                  // 放大和缩小.想要这个功能,只需要设置放大的参数zoom为true即可实现利用手势来放大和缩小
	//		snap: true,				 	 // 捕捉的功能会促使scroller去重新定义位置,这样可以制作更加花哨的传送带效果 (snap:"li")
	//		snapSpeed: 400,
	//		tap: true,		
	//		momentum: false,			 // 启用或禁用惯性,默认为true,此参数在你想要保存资源的时候非常有用
	//		startX: -359,
	//		startY: -85,
	//		probeType: 3,
	//		useTransition: false,
	//		click: true,
	//		eventPassthrough: true, 
	//		keyBindings: true,
	//		indicators: {
	//			el: document.getElementById('minimap'),
	//			interactive: true
	//		},
	//		freeScroll: true,
			scrollX: true,
			scrollY: true
		});
	}

});

cy.UIScroller = UIScroller;

}());