
//时间轴
var Line = Class.extend({
	mc: null,
	items: null,
	currentItem: null,
	currentRow: 0,
	currentKey: 0,
	currentTD: null,
	init: function(){
		var o = this;
		$('.keyframe_panel').click(function(){
			$('.keyframe_panel').hide();
		});
		$('.keyframe_panel #add_keyframe').click(function(){
			o.addKeyframe();
		});	
		$('.keyframe_panel #remove_keyframe').click(function(){
			o.removeKeyframe();
		});
		$('.keyframe_panel #add_tween').click(function(){
			o.addTween();
		});	
		$('.keyframe_panel #remove_tween').click(function(){
			o.removeTween();
		});	
		$('.anim_panel .t_head').on('click',function(e){
			var target = e.target;
			if (target.id) {
				o.mc.gotoAndStop(parseInt(target.id));
			}
		});
		$('.anim_panel .t_head').on('mouseout', function(e){
			// o.mc.gotoAndPlay(0);
		});
		$('.anim_panel #play').click(function(e){
			o.mc.gotoAndPlay(0);
		});
		$('.anim_panel #reset').click(function(e){
			o.mc.gotoAndStop(0);
		});
	},
	addKeyframe: function(){
		var mc = this.mc, item = this.currentItem;
		if (!mc.data) {
			mc.data = {};
		}
		if (!mc.data[item.viewName]) {
			mc.data[item.viewName] = [];
		}
		var data = mc.data[item.viewName];
		data[this.currentKey] = {
			params: this.getFrameState(item),
			haveTween:false
		};
		this.updateTween();
	},
	removeKeyframe: function(){
		var mc = this.mc, item = this.currentItem;
		var data = mc.data[item.viewName];
		if(!data) return;
		data[this.currentKey] = null;
		this.updateTween();
	},
	addTween: function(){
		var mc = this.mc, item = this.currentItem;
		var data = mc.data[item.viewName];
		if(!data) return;
		data[this.currentKey].haveTween = true;
		this.updateTween();
	},
	removeTween: function(){
		var mc = this.mc, item = this.currentItem;
		var data = mc.data[item.viewName];
		if(!data) return;
		data[this.currentKey].haveTween = false;
		this.updateTween();
	},
	updateTween: function(){
		var o = this,
			mc = this.mc, 
			tl = mc.timeline,
			item = this.currentItem,
			data = mc.data[item.viewName];
		mc.gotoAndStop(0);
		tl.removeTween(item.mc_tween);
		var T = cy.Tween.get(item),
			last = 0;
		for(var i=0,l=data.length;i<l;i++){
			if (data[i]) {
				if (data[i].haveTween) {
					T.to(data[i].params, i-last);
					for(var j=last+1;j<i;j++){
						$('.anim_panel #'+o.currentRow+'_'+j).html('—');
					}
				} else {
					T.wait(i-last).to(data[i].params);
				}
				$('.anim_panel #'+o.currentRow+'_'+i).html('●');
				last = i;
			} else {
				$('.anim_panel #'+o.currentRow+'_'+i).html('');
			}
		}
		// T = cy.Tween.get(item).to({x:300, y:300}, 30);
		tl.addTween(T);
		mc.gotoAndStop(this.currentKey);
		mc.loop = true;
		if(tl.duration<last+1) {
			tl.duration = last+1;
		}
		item.mc_tween = T;
		Views.render.selectTarget(item);
		console.log(data);
	},
	getChildren: function(child, arr){
		var o = this;
		if(child.children){
			child.children.forEach(function(a, i){
				arr.push(a);
				o.getChildren(a, arr);
			});
		};
	},
	bindEvent: function(){
		var o = this;
		$('.anim_panel .t_body').click(function(e){
			var mc = o.mc, 
				tl = mc.timeline,
 				target = e.target;
  			if (target.id) {
  				o.selectItem(target);
  			}
  		});
	},
	selectItem: function(target){
		var o = this;
		var i = target.id.split('_')[0], 
  			j = target.id.split('_')[1];
  		$('.keyframe_panel').show();
  		o.currentTD = target;
  		o.currentItem = o.items[i];
  		o.currentRow = parseInt(i);
  		o.currentKey = parseInt(j);
  		$('.anim_panel .select').removeClass('select');
  		$(target).addClass('select');
  		mc.gotoAndStop(o.currentKey);
  		Views.render.selectTarget(o.currentItem);
	},
	show: function(mc){
		window.mc = mc;
		this.mc = mc;
		this.items = [];
		this.getChildren(mc, this.items);
		var htmls = [];
  		htmls.push('<th style="width:120px;">动画对象</th>');
  		for (var i=0;i<101;i++) {
  			if(i%5===0) {
  				htmls.push('<th id='+i+'>'+i+'</th>');
  			} else {
  				htmls.push('<th id='+i+'>.</th>');
  			}
  		}
  		$('.anim_frame .t_head').html(htmls.join(''));
  		htmls = [];
  		
  		for (var i=0;i<this.items.length;i++){
  			htmls.push('<tr><td>'+this.items[i].viewName+'</td>');
  			
  			for (var j=0;j<101;j++) {
  				if(j%5===0) {
  					htmls.push('<td class="td_mark" id="'+i+'_'+j+'"></td>');
  				} else {
  					htmls.push('<td id="'+i+'_'+j+'"></td>');
  				}	
  			}
  			htmls.push('</tr>');
  		}
  		$('.anim_panel').show();
  		$('.anim_frame .t_body').html(htmls.join(''));
  		this.bindEvent();
  		var o = this, data = null;
  		for (var i=0;i<this.items.length;i++){
  			data = mc.data && mc.data[this.items[i].viewName];
  			if (data) {
  				o.currentItem = o.items[i];
  				o.currentRow = parseInt(i);
  				o.updateTween();
  			}
  		}
  		o.currentItem = null;
  		o.currentRow = 0;
  		mc.gotoAndStop(0);
	},
	setFrameState: function (target) {
		var mc = this.mc, item = this.currentItem;
		var data = mc.data[item.viewName];
		if(!data) return;
		var p = data[this.currentKey].params;
		p.x = target.x;
		p.y = target.y;
		p.scaleX = target.scaleX;
		p.scaleY = target.scaleY;
		p.regX = target.regX;
		p.regY = target.regY;
		p.alpha = target.alpha;
		p.rotation = target.rotation;
		p.visible = target.visible;
		switch (target.type) {
			case 'Bitmap':
				p.highlight = target.highlight;
				break;
			case 'Panel':
				p.width = target.width;
				p.height = target.height;
				break;
		}
		this.updateTween();
	},
	getFrameState: function (item){
		var p = {
			x: item.x, 
			y: item.y,
			regX: item.regX,
			regY: item.regY,
			scaleX: item.scaleX,
			scaleY: item.scaleY,
			alpha: item.alpha,
			rotation: item.rotation,
			visible: item.visible
		};
		switch (item.type) {
			case 'Bitmap':
				p.highlight = item.highlight;
				break;
			case 'Panel':
				p.width = item.width;
				p.height = item.height;
				break;
		}
		return p;
	}
});
