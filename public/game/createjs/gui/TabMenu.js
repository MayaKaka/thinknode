
(function() {
    "use strict";
    
var TabMenu = cy.Panel.extend({
	type: 'TabMenu',
	currentIndex: -1,
	currentItem: null,
	onChange: null,
	
	init: function(width, height) {
		this.Super_init(width, height);
		TabMenu.apply(this);
	}
});

TabMenu.apply = function(target) {
	if (target.type!=='TabMenu') {
		target.type = 'TabMenu';
	}
	var o = target;
	o.addEventListener('click', function(e){
		var target = e.target;
		if (target.type==='Button' || target.type==='CheckBox'){
			var index = o.children.indexOf(target);
			if (index === -1) return;
			if (o.currentItem) {
				o.currentItem._resetUI('normal');
			}
			o.currentIndex = index;
			o.currentItem = target;
			o.currentItem._resetUI('selected');
			o.onChange && o.onChange(e, o.currentIndex, o.currentItem);
		}
	});
};

cy.TabMenu = TabMenu;

})();
