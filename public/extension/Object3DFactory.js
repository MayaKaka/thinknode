
define(function (require, exports, module) {
	"use strict";
	   
var THREE = require('../extension/THREE');

var Object3DFactory = function() {};

Object3DFactory.create = function(type, data) {
	
}

Object3DFactory.objects = {
	light: function(data) {
		
	},
	plane: function(data) {
		
	},
	cube: function(data) {
		
	},
	sprite: function(data) {
		
	},
	model: function(data) {
		
	}
};

return Object3DFactory;
});