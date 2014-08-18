$(function(){
	console.log(123);
	var cj = createjs,
		sWidth = window.innerWidth,
		sHeight = window.innerHeight;
	var $canvas = $('<canvas style="position:fixed;width:110px;height:110px;" width=110 height=110></canvas>');
	// $canvas.appendTo(document.body);
	
	$canvas.css('left','0px');
	$canvas.css('top', '0px');
	
	var stage = new cj.Stage($canvas[0]);
	
	var bg = new cj.Shape();
	bg.graphics.beginFill('#000000').drawRect(0,0,200,200);
	var img = new cj.Bitmap('/public/home/img/ball.jpg');
	img.scaleX = img.scaleY = 0.5;
	stage.addChild(img);
	img.image.onload = function(){
		stage.update();
	};
	
	document.body.style.overflow = 'hidden';
	for(var i=0;i<3;i++){
		var $img = $('<img src="/public/home/img/ball.jpg" width=80 style="border-radius:5em;">');
		$img.css('left', Math.floor(Math.random()*window.innerWidth));
		$img.box2d({'shape':'circle','density':1, 'restitution':0.8, 'friction':0.2, 'y-velocity':25});
	}
	
});