// Sets the require.js configuration for your application.
require.config( {

	baseUrl: "/public/game/cocos2d_editor/src",

	// 3rd party script alias names
	paths: {

		// Core Libraries
		"jquery": "/public/jquery/jquery-2.1.0.min",
		"underscore": "/public/jquery/underscore-min",
		"backbone": "/public/jquery/backbone-min",
		
		"jquery.query":"/public/jquery/jquery.query.min",
		"jquery.position":"/public/jquery/jquery.ui.position",
		"jquery.contextMenu":"/public/jquery/jquery.contextMenu",
		"jquery.ztree":"/public/jquery/jquery.ztree.all-3.5.min",
		"ccBoot":"/public/game/cocos2d/CCBoot"

	},

	// Sets the configuration for your third party scripts that are not AMD compatible
	shim: {

		"backbone": {
			"deps": [ "underscore", "jquery" ],
			"exports": "Backbone"
		}

	}

});

// Includes File Dependencies
require([
	"jquery",
	"backbone",
	"plugins",
	"preview"
], function ( $, Backbone, plugins ) {
	
	

});

var gameViews, gameStage;

var g_resources = [
		"res/bear.json",
		"res/bear0.plist",
		"res/logo.png"
	], 
	g_views;

var nodesTree = null,
	assetsTree = null,
	renderCtrl = null,
	attrsCtrl = null,
	toolsCtrl = null,
	timeline = null,
	keyboardCtrl = null,
	imagePreview = null,
	viewRoot = null,
	viewMap = {};

