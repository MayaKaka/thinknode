
(function() {
    "use strict";
    
var ListView = cy.Panel.extend({
	type: 'ListView',
	
	init: function(width, height) {
		this.Super_init(width, height);
		ListView.apply(this);
	}
});

ListView.apply = function(target) {
	var o = target;
	o.addEventListener('tick', function(e){
		ListView.reset(o);
	});
};

ListView.reset = function(target){
	if (target.type!=='ListView') {
		target.type = 'ListView';
	}
	var o = target;
	var children = o.children;
	var height = 0,
		oHeight = 0,
		child = null,
		lastChild = null;
	for (var i=0,l=children.length; i<l; i++) {
		child = children[i];
		if (lastChild&&lastChild.isVisible()) {
			height = ListView.getChildHeight(lastChild);
			oHeight += (height + (child.margin||0));
			child.y = oHeight;
		}
		lastChild = child;
	}
	height = ListView.getChildHeight(lastChild);
	oHeight += height;
	o.height = oHeight;
};

ListView.getChildHeight = function(child){
	return child.height>0? child.height:
		   child.getMeasuredRect? child.getMeasuredRect().height: 0;
};

cy.ListView = ListView;

})();
