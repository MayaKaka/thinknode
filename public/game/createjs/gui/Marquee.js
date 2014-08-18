
(function() {
    "use strict";
    
var Marquee = cy.Panel.extend({
	type: 'Marquee',
	init: function(width, height) {
		this.Super_init(width, height);
		Marquee.apply(this);
	}
});

Marquee.apply = function(target) {
	var o = target;
	
};

cy.Marquee = Marquee;

})();
