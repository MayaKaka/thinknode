
//载入对象结构数据
$(function(){
	$.ajax({
		url: '/home/editor/import_data',
		type: 'GET',
		dataType: 'json',
		data: {
			name: request('name')
		}
	}).done(function(data){
		console.log(data);
		Views.name = data.name;
		Views.width = data.width;
		Views.height = data.height;
		Views.views = data.views;
		Views.isEditor = true;
		Views.render = new Renderer(data.width, data.height);
		Views.tree = new Tree();
		Views.attr = new Attr();
		Views.line = new Line();
		Views.keyboard = new Keyboard();
		Views.preview = new Preview();
		Views.importData(Views.views);
		Views.tree.createObjectsTree();
		//载入资源数据
		$.ajax({
			url: '/home/editor/get_image_list',
			type: 'GET',
			dataType: 'json',
			data: {
				name: Views.name
			}
		}).done(function(data){
			Views.tree.createAssetsTree(data);
		});
		$('#zoom').bind('change', function(){
			App.zoom = $(this).val()/50;
			cy.$('#zoom_value').val(App.zoom*100+'%');
			cy.$('#gameScreen').css('transform','scale('+App.zoom+','+App.zoom+')');
		});
		$('#run').click(function(){
			window.open('../createjs_project/'+Views.name+'/index.html');
		});
		$('#create').click(function(){
			Views.render.toggleTool(true);
		});
		$('.component_panel').click(function(e){
			if (e.target.name) {
				Views.render.toggleTool(false);
			}
		});
		//导出数据
		$('#export').bind('click', function(){
			var v = {}, a;
			for (var name in Views.roots) {
				a = Views.roots[name];
				v[name] = Views.exportData(a);
			}
			var data = JSON.stringify({
						name: Views.name,
						width: Views.width,
						height: Views.height,
						views: v
				});
			// console.log(data);
			$.ajax({
				url: '/home/editor/export_data',
				type: 'POST',
				dataType: 'json',
				data: {
					name: Views.name,
					data: data
				}
			}).done(function(data){
				console.log('导出成功');
			});
		});
		var resize = function(){
			var winHeight = window.innerHeight,
				widgetHeight = winHeight - 45;
			$(".objects_tree").css("height", widgetHeight+"px");
			$(".render_scroll").css("height", widgetHeight+"px");
		};
		$(window).on("resize", resize);
		resize();
	});
});
