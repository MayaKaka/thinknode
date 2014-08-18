
(function() {
    "use strict";
    
var Layer = Class.extend.call(cy.Container, {
	type: 'Layer',
	
	init: function(){
		this.initialize();
	}
	
});

cy.Layer = Layer;

})();