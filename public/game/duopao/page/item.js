define([
		"server",
		"widget/adSlider"
	], function (server, adSlider) {
    	"use strict";
   
	var itemInfo = {
		
		init: function() {
			adSlider.initSlider("slider");
		}
		
	};

	return itemInfo;
});