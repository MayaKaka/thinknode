
var Timeline = cc.Class.extend({
	
	target: null,
	targetData: null,
	targetMC: null,
	
	ctor: function() {
		$(".line_frames tbody").bind("click", function(e){
			var id = e.target.id;
			if(id) {
				var name = id.split("_")[0],
					frame = id.split("_")[1];
				$(".line_frames tbody .select").removeClass("select");
				$(".line_frames tbody .frame_"+frame).addClass("select");
			}
		});
		$(".line_frames tbody").bind("click", function(e){
			var id = e.target.id;
			if(id) {
				timeline.handleClick(id);
			}
		});
		$(".line_panel #close").bind("click", function(){
			$(".line_panel").hide();
			timeline.target = timeline.targetData = timeline.targetMC = null;
		});
		var htmls = [];
		for (var i=0;i<100;i++) {
			if(i%5===0) {
				htmls.push('<div class="num">'+i+'</div>');
			} else {
				htmls.push('<div class="num"></div>');
			}
		}
		$(".line_marks").html(htmls.join(""));
		
		$.contextMenu({
	        selector: '.line_frames .frame', 
	        callback: function(key, options) {
	        	var target = options.$trigger[0];
	        	var id = target.id;
	        	if (id) {
	        		var name = id.split("_")[0],
						frame = id.split("_")[1],
						item;
					target = timeline.target;
					if (name === "owner") {
						item = target;
					} else {
						item = target.query(name);
					}

	        		if (item) {
	        			if (key==="AddKey") {
	        				timeline.addKeyFrame(name, item, frame);
	        			} else if(key==="DelKey") {
	        				timeline.delKeyFrame(name, item, frame);
	        			} else if (key==="AddTween") {
	        				timeline.addTween(name, item, frame);
	        			} else if(key==="DelTween") {
	        				timeline.delTween(name, item, frame);
	        			}
	        		}
	        	}
	        },
	        items: {
	            "AddKey": {name: "Add KeyFrame", icon: "edit", accesskey: "AddKey"},
	            "DelKey": {name: "Del KeyFrame", icon: "cut", accesskey: "DelKey"},
	            "AddTween": {name: "Add Tween", icon: "edit", accesskey: "AddTween"},
	            "DelTween": {name: "Del Tween", icon: "cut", accesskey: "DelTween"}
	        }
	    });
	},
	handleClick: function(id){
		var name = id.split("_")[0],
			frame = id.split("_")[1];
		$(".line_frames tbody .select").removeClass("select");
		$(".line_frames tbody .frame_"+frame).addClass("select");
		var mc = timeline.target.getComp("mc");
			obj = name==="owner"?timeline.target:timeline.target.query(name);
		mc.gotoAndStop(frame);

		renderCtrl.mark(obj);
		attrsCtrl.update(obj);
	},
	addKeyFrame: function(name, item, frame){
		if (!this.targetData[name]) {
			this.targetData[name] = {0:{st: this.getState(item), ht: false}};
		}
		var data = this.targetData[name];
		data[frame] = {
			st: {},   // current frame state
			ht: false // has tween animation
		};
		this.updateItem(item, data, name, frame);
	},
	delKeyFrame: function(name, item, frame){
		if (this.targetData[name]) {
			var data = this.targetData[name];
			if (data[frame]) {
				delete data[frame];
				this.updateItem(item, data, name, frame);
			}
		}
	},
	addTween: function(name, item, frame){
		if (this.targetData[name]) {
			var data = this.targetData[name];
			if (data[frame]) {
				data[frame].ht = true;
				this.updateItem(item, data, name, frame);
			}
		}
	},
	delTween: function(name, item, frame){
		if (this.targetData[name]) {
			var data = this.targetData[name];
			if (data[frame] && data[frame].ht) {
				data[frame].ht = false;
				this.updateItem(item, data, name, frame);
			}
		}
	},
	updateItem: function(item, data, name, frame) {
		var mc = this.targetMC;		
		
		var last = 0, delta = 0, func,
			line = mc.timeline,
			tween = ccp.Tween.get(item);
		for (var i in data) {
			i = parseFloat(i);
			delta = i - last;
			for (var s=last+1;s<i;s++) {
				if (data[i].ht) {
					$("#"+name+"_"+s).html("-");
				} else {
					$("#"+name+"_"+s).html("");
				}
			}
			$("#"+name+"_"+i).html("●");
			last = i;
			// if has tween animation
			if (data[i].ht) {
				tween.to(data[i].st, delta);
			} else {
				tween.wait(delta).to(data[i].st);
			}
		}
		for (var s=last+1;s<100;s++) {
			$("#"+name+"_"+s).html("");
		}
		line.addTween(tween);
		
		if (line.duration < last+1) {
			line.duration = last+1;
		}
		mc.gotoAndStop(frame);
	},
	updateState: function(item, name) {
		var mc = this.targetMC,
			frame = mc._prevPosition;
		if (this.targetData[name]) {
			var data = this.targetData[name];
			cc.log(frame, data, this.getState(item));
			if (data[frame]) {
				data[frame].st = this.getState(item);
				
				this.updateItem(item, data, name, frame);
			}
		}
	},
	getState: function(item){
		var st = {};
		st.x = item.getPositionX();
		st.y = item.getPositionY();
		st.ro = item.getRotation();
		st.sx = item.getScaleX();
		st.sy = item.getScaleY();
		st.ax = item.getAnchorPoint().x;
		st.ay = item.getAnchorPoint().y;
		st.op = item.getOpacity?item.getOpacity():255;
		st.vi = item.isVisible();
		st.z = item.getLocalZOrder();
		return st;
	},
	
	select: function(target, data) {

		var result = {};
		this.target = target;
		this.targetData = data;
		this.targetMC = target.getComp("mc");
		result["owner"] = target;
		result = this.queryAll(target, result);
		this.showList(result);
		this.handleClick("owner_0");
		
		$(".line_panel").show();
	},
	
	update: function(target){
		var name = target.getViewTag();
    	if (timeline.target) {
        	var item;
            if (timeline.target === target) {
            	item = target;
            	timeline.updateState(item, "owner");
            } else {
            	item = timeline.target.query(name);
            	if (item === target) {
            		timeline.updateState(item, name);
            	}
            }
    	}
	},
	
	queryAll: function(target, result) {
	
		var children = target.getChildrenView(),
			child;
		
		for (var i=0,l=children.length; i<l; i++) {
			child = children[i];
			if (child.getViewTag()) {
				result[child.getViewTag()] = child;
			}
			this.queryAll(child, result);
		}
		
		children = target.getNodes?target.getNodes():[];
		for (var i=0,l=children.length; i<l; i++) {
			child = children[i];
			if (child.getViewTag()) {
				result[child.getViewTag()] = child;
			}
			this.queryAll(child, result);
		}
		
		return result;
	},
	
	showList: function(result) {

		var dom = $(".line_frames tbody");
		
		var htmls = [], html, className;
		for(var n in result) {
			html = ["<tr><td class=\"node\">"+ n +'</td><td class="frame normal"></td>'];
			for(var i=0;i<100;i++) {
				className = "frame frame_"+i;
				if (i%5===0) {
					className += " mark";
				} else {
					className += " normal";
				}
				html.push('<td class="'+className+'" id="'+n+"_"+i+'"></td>');
			}
			html.push("</tr>");
			htmls.push(html.join(""));
		}
		
		dom.html(htmls.join(""));
		
		var data = this.targetData,
			item,
			itemData;
		for(var i in data) {
			if (i==="owner") {
				item = this.target;
			} else {
				item = this.target.query(i);
			}
			
			if (item) {
				itemData = data[i];
				this.updateItem(item, itemData, i, 0);
			}
		}
	}
});
