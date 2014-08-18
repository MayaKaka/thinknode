



require([
	"jquery",
	"backbone"
], function( $, Backbone ){
	
	var PreviewModel = Backbone.Model.extend({
		
		defaults: function(){
			return {
				title: "Image Preview",
				imageUrl: "",
				scriptName: "",
				filePath: "",
				clipRect: { x:0, y:0, width:0, height:0 }
				
			};
		},
		
		saveClipRect: function(x, y, width, height) {
			this.get("clipRect").x = x;
			this.get("clipRect").y = x;	
			this.get("clipRect").width = width;	
			this.get("clipRect").height = height;	
		}

	});
	
	
	var PreviewCollection = Backbone.Collection.extend({
		model: PreviewModel,
		
		
	});
	
	var PreviewView = Backbone.View.extend({
		el: $(".preview_panel"),
		
		events: {
			"click #editScript": "onEditScript"
		},
		
		initialize: function() {
			this.imageView = $(".preview_image");
			this.scriptView = $("preview_scrip");
			console.log(this.imageView);
		},
		
		onEditScript: function() {
			
		}
		
	});
	
	return new PreviewView();
	
});
