   
var RenderCtrl = cc.Class.extend({
	
	target: null,
	posMark: null,
	rotateMark: null,
	sizeMark: null,
	
	ctor: function(){
		
	},
	
	addScene: function(){
		var tag = prompt('Please Input The Name Of Scene :');
		if (tag) {
			var obj = gameViews.createDefault("Widget", null, viewMap);
			obj.setViewTag(tag);
			nodesTree.addRootNode(obj);
			viewRoots[tag] = obj;
		}	
	},	
	
	addNode: function(type) {
		if (!type) return;

        var target = this.target, parent, data, obj;
		if (!target) return;
		
        if (type.match(/Prefabs/g)) {
            type = type.split('_')[1];
            data = g_views.prefabs[type];
            obj = gameViews.parseData(data, gameStage.currentScene, viewMap);
        } 
        else if (type.match(/Animations/g)){
            type = type.split('_')[1];
            data = g_views.animations[type];
            obj = gameViews.parseData(data, gameStage.currentScene, viewMap);
        } 
        else if (type.match(/Views/g)) {
            type = type.split('_')[1];
            if(!type) return;
            obj = gameViews.createDefault(type, gameStage.currentScene, viewMap);
        }
		
		if (this.isContainer(target.type)) {
			parent = target;
		} else {
			parent = target.getParentView();
		}

		parent.addView(obj);
		nodesTree.addTreeNode(parent, obj);
	},
	
	isContainer: function(type){
		if (type==='Widget'||type==='Layout'||type==='ScrollView'||type==='ListView') {
			return true;
		}
		return false;
	},

    createPosMark: function() {
        if (!this.posMark) {
            this.posMark = ccui.ImageView.create();
            this.posMark.loadTexture('res/anchor_circle.png');
            this.posMark.setScale(1.4);
            
            // this.posMark.setTouchEnabled(true);
            // this.posMark.addTouchEventListener(this.handleTouchEvent, this.posMark);
            
            gameStage.innerStage.addView(this.posMark, 100);
        }
        this.posMark.setLocalZOrder(100);
        return this.posMark;
    },

    createAngleMark: function() {
        if (!this.angleMark) {
            this.angleMark = ccui.ImageView.create();
            this.angleMark.loadTexture('res/arrow.png');
            this.angleMark.setScaleX(0.7);
			this.angleMark.setScaleY(0.5);
            this.angleMark.setAnchorPoint(cc.p(0, 0.5));
            gameStage.innerStage.addView(this.angleMark, 99);
        }
        this.angleMark.setLocalZOrder(99);
        return this.angleMark;
    },

    createRectMark: function(){
        if (!this.rectMark) {
            this.rectMark = ccui.Layout.create();
            this.rectMark.setTouchEnabled(true);
            this.rectMark.addTouchEventListener(this.handleTouchEvent, this.rectMark);
  
            var drawNode = cc.DrawNode.create();
            this.rectMark.addNode(drawNode);
            this.rectMark.drawNode = drawNode;
            
            gameStage.innerStage.addView(this.rectMark, 98);
        }
        this.rectMark.setLocalZOrder(98);
        return this.rectMark;
    },

	mark: function(obj) {
		var size, box = obj.getBoundingBoxToWorld();
		
		if (obj.getSize) {
			size = obj.getSize();
		} else {
			size = cc.size(100, 100);
    		box.x -= 50;
    		box.y -= 50;
		}
		
    	var mtx = obj.getParent().nodeToWorldTransform(),
    		mtx0 = obj.nodeToWorldTransform(),
    		pos = obj.getPosition(),
    		sx = obj.getScaleX(), sy = obj.getScaleY(), 
    		width = (size.width || box.width)*sx,
    		height = (size.height || box.height)*sy,
    		endPos = cc.p(mtx.tx+pos.x*mtx.a, mtx.ty+pos.y*mtx.d),
    		endAnchor = obj.getAnchorPoint(),
    		endRotation = ((mtx0.a<0?180:360)-Math.atan(mtx0.b/mtx0.a)/Math.PI*180)%360;
    		
    	this.createPosMark().setPosition(endPos);
    	this.createRectMark().setSize(cc.size(width, height));
    	
    	if (obj instanceof ccui.Layout || obj instanceof ccui.ImageView) {
    		this.rectMark.setPosition(endPos);
    		this.rectMark.setAnchorPoint(endAnchor);
    		this.rectMark.setRotation(endRotation);
    	} else {
    		this.rectMark.setPosition(cc.p(box.x, box.y));
    		this.rectMark.setAnchorPoint(cc.p(0, 0));
    		this.rectMark.setRotation(0);
    	}

    	var vertices = [ cc.p(0, 0), cc.p(width, 0), cc.p(width, height), cc.p(0, height) ];
    	this.rectMark.drawNode.clear();
        this.rectMark.drawNode.drawPoly(vertices, cc.color(77,255,255,30), 1, cc.color(255, 255, 0, 155));
        
        this.createAngleMark().setPosition(endPos);
    	this.angleMark.setRotation(endRotation);
        
    	this.target = obj;
   },
   
   handleTouchEvent: function(sender, type) {
   		var target = renderCtrl.target;
  		
   		if (keyboardCtrl.frameTarget) {    
   			target = keyboardCtrl.frameTarget;
   		}

   		var mtx = target.getParent().nodeToWorldTransform();
        switch (type) {
            case ccui.Widget.TOUCH_BAGAN:
                this.targetX = target.getPosition().x;
                this.targetY = target.getPosition().y;
                break;
            case ccui.Widget.TOUCH_MOVED:
            	var dx = this._touchMovePos.x - this._touchStartPos.x,
            		dy = this._touchMovePos.y - this._touchStartPos.y;
            	target.setPosition(cc.p(Math.floor(this.targetX+dx/mtx.a), Math.floor(this.targetY+dy/mtx.d)));
                break;
            case ccui.Widget.TOUCH_ENDED:
            	
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
        
        renderCtrl.mark(renderCtrl.target);
        attrsCtrl.update(renderCtrl.target);
        timeline.update(renderCtrl.target);
   }

});    
    
