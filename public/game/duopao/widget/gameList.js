define([
		"server",
		"template",
		"text!/views/home/platform/list.html"
	], function (server, template, html) {
    	"use strict";
   	
    var render = template.compile(html),
    	$document = $(document),
		$content = $("#content .gl_list_list"),
		$loading = $("#content .item_loading");
    
    var isLoading = false,
    	loadCount = 0;
    
    $document.on("scroll", function(e){
    	if (isLoading || loadCount>=4) return;
    	
    	var innerHeight = window.innerHeight,
    		offsetTop = $content[0].offsetTop-(window.scrollY===undefined?document.documentElement.scrollTop:window.scrollY),
    		clientHeight = $content[0].clientHeight;

    	if ((clientHeight+offsetTop)<=innerHeight) {
    		gameList.reqList();
    	}
    });
    
	var gameList = {
		getList: function(data){
			isLoading = true;
			$loading.show();
			isLoading = false;
			loadCount++;
			var fragment = document.createElement("div");
			fragment.innerHTML = render(data);
			$(fragment).appendTo($content);
			setTimeout(function(){
				$loading.hide();
			},2000);
		},
		reqList: function(){
			var o = this;
			$.ajax({
				url: '/home/platform/list',
				type: 'get',
				dataType: 'json',
				success: function(data){
					o.getList(data);
				}
			});
		}
	};

	return gameList;
});
