define([
		"server",
		"widget/gameList",
		"widget/adSlider"
	], function (server, gameList, adSlider) {
    	"use strict";
   
	var duopao = {
		
		init: function() {
			adSlider.initSlider("slider");
		}
		
	};

	return duopao;
});