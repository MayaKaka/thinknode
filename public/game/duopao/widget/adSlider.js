define([
		"server",
		"template"
		//"text!template/ads.ejs"
	], function (server, template, html) {
    	"use strict";

   	html = "<div></div>";

    var render = template.compile(html),
		$content = $("#content .swipe-wrap");
    
    var swipe = null;
    
	var adSlider = {
		initSlider: function(id){
			
			swipe = new Swipe(document.getElementById(id), {
			  startSlide: 2,
			  speed: 400,
			  auto: 2000,
			  continuous: true,
			  disableScroll: false,
			  stopPropagation: false,
			  callback: function(index, elem) {},
			  transitionEnd: function(index, elem) {}
			});
		}
	};

	return adSlider;
});
