define([
		"server"
	], function (server) {
    	"use strict";
   
   	var $pull = $(".pull-list");
   	var $list = $(".pull-list .pull-list-block");
   	
	var duopao = {
		
		init: function() {
			// $list.addClass("pull-list-block-wookmark");
			$list.wookmark({
	        	// Prepare layout options.
	        	autoResize: true, // This will auto-update the layout when the browser window is resized.
	        	container: $('.pull-list'), // Optional, used for some extra CSS styling
	        	offset: 10, // Optional, the distance between grid items
	        	outerOffset: 10, // Optional, the distance to the containers border
	        	// itemWidth: 210 // Optional, the width of a grid item
	      	});
		}
	};

	return duopao;
});