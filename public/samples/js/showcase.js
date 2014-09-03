A.setup(function(){
    require.config({ baseUrl: 'http://localhost/public/cartoon', paths:{ cartoon: "cartoon", excanvas: 'excanvas' } });
    require([ 'cartoon' ], function(ct) {
    	var cvsContainer = new ct.Canvas({
        	elem: $('.op-cartoon-api-cvs-container')[0],
            width: 538, height: 450
        });
        var divContainer = new ct.Container({
        	elem: $('.op-cartoon-api-div-container')[0],
        	width: 538, height: 450
        });
        var $fps = $('.op-cartoon-api-fps');
        var cvsTicker = new ct.Ticker(60),
        	divTicker = new ct.Ticker(60);
            
        function showSprite() {
        	var background = new ct.Shape({
        		renderInCanvas: true,
        		graphics: {
        			type: 'rect', width: 538, height: 450, fill: 'top,#66D,#AAF'
        		}     		
        	});
        	var sprite = new ct.Sprite({
        		renderInCanvas: true,
                x: -50, y: 150,
                spriteSheet: {
                	frames: { width: 165, height: 292, cols: 12, rows: 6, num: 64, img: 0 },
                    animations: { jump: [26, 63, 'run', 1100], run: [0, 25, 'run', 800] },
                    images: [ 'http://localhost/public/samples/images/runningGrant.png' ]
                }
           	});
           	var system = new ct.ParticleSystem({
           		renderInCanvas: true,
        		particle: {
        			type: 'rain', width: 538, height: 450, num: 80
        		}     		
        	});
        	
        	var timeline = new ct.Timeline();
        	timeline.addKeyFrame(sprite, { x: -50 }, 0, function(){ sprite.play('run'); })
        			.addKeyFrame(sprite, { x: 150 }, 800, function(){ sprite.play('jump'); })
        			.addKeyFrame(sprite, { x: 250 }, 1400)
        			.addKeyFrame(sprite, { x: 550 }, 2600);
            cvsContainer.addChild(background);
            cvsContainer.addChild(sprite);
            cvsContainer.addChild(system);
            cvsTicker.add(sprite);
            cvsTicker.add(system);
            cvsTicker.add(timeline);
            cvsTicker.add(cvsContainer);
            cvsTicker.start();
        }
			
		showSprite();
		divTicker.add(function() { $fps.html(divTicker.fps); });
		cvsTicker.add(function() { $fps.html(cvsTicker.fps); })       
	});
});