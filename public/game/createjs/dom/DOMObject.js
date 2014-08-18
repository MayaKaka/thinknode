/*
* DOMObject
*
*/
(function() {
	"use strict";

var DOMObject=  Class.extend.call(cy.DOMElement, {
	type: 'DOMObject',
	children: null,
	disabled: false,
	_css3Animation: null,
	tickChildren: true,
	
	init: function (element, params) {
		if( !element ) return;
		
		var htmlElement;
		// 参数为 element, params 时
		if( element.nodeType || element === window ){
			htmlElement = element;
		}
		// 参数为 selector / htmlText, params 时
		else if( typeof(element) === 'string' ){
			if( element.charAt(0) === '<' && element.charAt( element.length - 1 ) === '>' ){
				htmlElement = this._parseHTML( this._adaptCssText( element ) );
			} 
			else {
				htmlElement = document.querySelector( element );
			}
		}
		// 参数为 params, template 时
		else if( typeof(element) === 'object' ){
			if( this._template ) {
				htmlElement = this._parseHTML( this._adaptCssText( this._template ) );
			} else {
				htmlElement = document.createElement('div');
			}
			params = arguments[0];
		}

		if (htmlElement) {
			htmlElement.domObject = this;
			params && this._initParams( params );
			this.initialize(htmlElement);
			this.children = [];
		}
	},
	
	html: function( htmlText ){
		if( htmlText === undefined ){
			return this.htmlElement.innerHTML;
		} else {
			this.htmlElement.innerHTML = htmlText;
		}	
	},
	
	val: function( value ){
		var element = this.htmlElement;
		if( value === undefined ){
			return 'value' in element ? element.value : element.innerHTML;
		} else {
			'value' in element ? ( element.value = value ) : ( element.innerHTML = value );
		}
	},
	
	attr: function( name, value ){
		var element = this.htmlElement;
		if( value === undefined ) {
			return element.hasAttribute( name ) ? element.getAttribute( name ) : element[ name ];
		} else {
			element.hasAttribute( name ) ? element.setAttribute( name, value ) : ( element[ name ] = value );			
		}
	},

	css: function(cssStyle, value){
		var style = this.htmlElement.style;
		if( typeof(cssStyle) === 'string' ) {
			if( value === undefined ){
				style.cssText = this._adaptCssText( cssStyle );
			}
			else {
				if( typeof(value) === 'number' && DOMObject.CSS_ENUMS_PX.indexOf( cssStyle ) !== -1 ) {
					style[cssStyle] = value + 'px';
				}
				else {
					cssStyle = this._adaptCssStyle( cssStyle );
					style[ cssStyle ] = value ;
				}
			}
		}
		else if( typeof(cssStyle) === 'object' ) {
			for( var name in cssStyle ) {
				this.css( name, cssStyle[name] );
			}	
		}
	},

	param: function( name, value ){
		this.attr( name, value );	
	},

	addClass: function( className ){
		var classList = this.htmlElement.classList;
		if( classList ) {
			classList.add( className );
		}
	},

	removeClass: function( className ){
		var classList = this.htmlElement.classList;
		if( classList ) {
			classList.remove( className );
		}
	},

	hasClass: function( className ){
		var classList = this.htmlElement.classList;
		if( classList ) {
			return classList.contains( className );
		}
	},

	toggleClass: function( className ) {
		var classList = this.htmlElement.classList;
		if( classList ) {
			classList.toggle( className );
		}
	},

	handleEvent: function( eventObj ){
		if( eventObj.type === 'tick') {
			this.dispatchEvent( eventObj );
		}		
	},

	dispatchNativeEvent: function( eventName, eventObj ) {
		var listeners = this._listeners;
		if ( listeners ) {
			eventName = this._adaptEventName( eventName );
			var arr = listeners[ eventName ];
			if( arr ) {
				if( !eventObj ) {
					eventObj = document.createEvent( 'HTMLEvents' );
					eventObj.initEvent( eventName, true, true );
				}
				for( var i=0,l=arr.length; i<l; i++ ) {
					arr[i]( eventObj );
				}
			}
		}
	},

	bind: function( eventName, handler ){
		if( typeof(eventName) === 'string' ) {
			eventName = this._adaptEventName( eventName );
			this.addEventListener( eventName, handler );

			if(eventName === 'tick') {
				var listeners = cy.Ticker._listeners;
				if( listeners.indexOf( this ) === -1 ) {
					cy.Ticker.addEventListener('tick', this);
				}
			} else {
				var o = this,
					element = this.htmlElement;
				if( !element[ 'on' + eventName ] ) {
					element[ 'on' + eventName ] = function (e) {
						if( !o.disabled ) {
							o.dispatchNativeEvent( eventName, e );
						}
					};
				}
			}
		}
		else if( typeof(eventName) === 'object' ) {
			for( var name in eventName ) {
				this.bind( name, eventName[name] );
			}	
		}
	},

	unbind: function( eventName, handler ){
		eventName = this._adaptEventName( eventName );
		this.removeEventListener( eventName, handler );
		var element = this.htmlElement;
		if( !this.hasEventListener( eventName ) ) {
			if( eventName === 'tick') {
				cy.Ticker.removeEventListener('tick', this);
			} else {
				element[ 'on' + eventName ] = null;
			}
		}
	},
	
	show: function( type ){
		this.htmlElement.style.display = type || 'block';		
	},

	hide: function(){
		this.htmlElement.style.display = 'none';
	},

	getChild: function(){
		var args = arguments,
			length = args.length,
			child = this.htmlElement;
		for( var i=0;i<length;i++){
			child = child.children[ args[i] ];
		}
		return cy.$( child );
	},

	getChildren: function(){
		var children = this.htmlElement.children,
			results = [];
		for(var i=0,l=children.length; i<l; i++){
			results.push( cy.$( children[i] ) );
		}
		return results;
	},

	addChild: function( child ){
		if( child instanceof Array ) {
			var fragment = document.createDocumentFragment(), c;
			for( var i=0,l=child.length; i<l; i++ ) {
				c = child[i];
				fragment.appendChild( c.htmlElement || c );
				this.children.push(c);
			}
			this.htmlElement.appendChild( fragment );
		} else {
			this.htmlElement.appendChild( child.htmlElement || child );
			this.children.push(child);
		}
	},
	
	removeChild: function( child ){
		this.htmlElement.removeChild( child.htmlElement || child );
		var index = this.children.indexOf(child);
		this.children.splice(child, 1);
	},


	appendTo: function( parent ){
		var element = this.htmlElement,
			parent = parent.htmlElement || parent;
		parent.appendChild( element );
	},

	remove: function(){
		var element = this.htmlElement,
			parent = element.parentNode;
		parent && parent.removeChild( element );
	},

	animate: function( params, duration, timingFunc, delay, callback ){
		if( !this._css3Animation ) this._css3Animation = new cy.CSS3Animation( this );
		this._css3Animation.add( params, duration, timingFunc, delay, callback );
		this._css3Animation.play( );
		return this;
	},
	
	_adaptCssText: function( cssText ){
		var prefix = DOMObject.CSS_PREFIX[1];
		cssText = cssText.replace( /transform|transition|animation|filter/g, 
			function( matchStr ) {
				if ( prefix.length > 0 ) {
					return prefix + matchStr;
				}
				return matchStr;
			});
		if( prefix === '-webkit-' || prefix === '-moz-' ) {
			cssText = cssText.replace( /keyframes/g, prefix + 'keyframes' );
		}
		return cssText;
	},

	_adaptCssStyle: function( cssStyle ){
		if( cssStyle === 'float' || cssStyle === 'cssFloat') {
			return DOMObject.CSS_FLOAT;
		}
		var prefix = DOMObject.CSS_PREFIX[0];
		cssStyle = cssStyle.replace( /transform|transition|animation|filter/g, 
			function( matchStr ) {
				if( prefix.length > 0 ) {
					return prefix + matchStr.charAt(0).toUpperCase() + matchStr.substring(1);
				} 
				return matchStr;
			});
		return cssStyle;
	},
	
	_adaptEventName: function( eventName ){
		var isMobile = !!cy.UserAgent.mobile;
		switch (eventName) {
			case 'click':
				eventName = isMobile ? 'touchend' : 'click';
				break;
			case 'touchstart':
			case 'mousedown':
				eventName = isMobile ? 'touchstart' : 'mousedown';
				break;
			case 'touchmove':
			case 'mousemove':
				eventName = isMobile ? 'touchmove' : 'mousemove';
				break;
			case 'touchend':
			case 'mouseup':
				eventName = isMobile ? 'touchend' : 'mouseup';
				break;
			case 'orientationchange':
			case 'resize':
				eventName = isMobile ? 'orientationchange' : 'resize';
				break;
			case 'touchcancel':
				eventName = isMobile ? 'touchcancel' : 'mouseup';
				break;
		}
		return eventName;
	},
	
	_parseHTML: function( data ){
		var tempDiv = DOMObject.TEMP_DIV;
		tempDiv.innerHTML = data;
		var child = tempDiv.firstChild;
		tempDiv.removeChild(child);
		return child;
	},

	_parseXML: function(){},

	_initParams: function( params ){
		for( var name in params ) {
			this._initParam( name, params[name] );
		}
	},
	_initParam: function( name, value ) {
		switch (name) {
			case 'styles':
				this.css( value );
				break;
			case 'events':
				this.bind( value );
				break;
			case 'children':
				this.addChild( value );
				break;
			case 'html':
				this.html( value );
				break;
			default:
				this.param( name, value );
				break;
		}
	}
	
});		
	
	DOMObject.TEMP_DIV = document.createElement('div');
	
	DOMObject.CSS_PREFIX = ( function () {
			var style = DOMObject.TEMP_DIV.style;
			return 'webkitTransform' in style ? [ 'webkit', '-webkit-', 'webkitTransitionEnd', 'webkitAnimationEnd' ] :
				   'MozTransform' in style ? [ 'Moz', '-moz-', 'transitionend', 'animationend' ] :
				   'msTransform' in style ? [ 'ms', '-ms-', 'MSTransitionEnd', 'MSAnimationEnd' ] :
				   'OTransform' in style ? [ 'O', '-o-', 'oTransitionEnd', 'oAnimationEnd' ] : 
				   [ '', '', 'transitionend', 'animationend'];
		})();
	
	DOMObject.CSS_FLOAT = (function(){
			var style = DOMObject.TEMP_DIV.style;
			return 'cssFloat' in style ? 'cssFloat' : 'float';
		})();	
	
	DOMObject.CSS_ENUMS_PX = [ 
			'width', 'height',
			'top', 'right', 'bottom', 'left', 
			'marginLeft', 'marginRight', 'marginBottom', 'marginTop',
			'borderRadius', 'fontSize', 'lineHeight' 
		];

//获取 DOMElement的 DOMObject对象
cy.$ = function( element, params ){
	if( typeof(element) === 'string' && element.charAt(0) !== '<' ) {
		element = document.querySelector( element );
	}
	return element? (element.domObject? element.domObject: new DOMObject(element, params)): null;
};

cy.ajax = function(params, callback){
	var xhr = new XMLHttpRequest();
	var data = '';
	if (params.data) {
		for (var n in params.data) {
			if (data) data += '&';
			data += n+'='+params.data[n];
		}
	}
	if (params.type === 'POST' || params.type === 'post') {
		xhr.open('POST', params.url, true);
		xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
		xhr.send(data);
	} else {
		if (data) data = '?'+data;
		xhr.open('GET', params.url+data, true);
		xhr.send(null);
	}
	xhr.onreadystatechange = function() {
	    if (xhr.readyState == 4) {
	        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
	            callback && callback(xhr.responseText);
	        } else {
	            alert("Request was unsuccessful: " + xhr.status);
	        }
	    }
	};
};

cy.DOMObject = DOMObject;

}());
