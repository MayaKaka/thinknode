
define(function (require, exports, module) {
  
var Class = require('Class');

var PrivateData = Class.extend({
	
	_data: null,
	
	init: function() {
		this._data = {};
	},
	
	get: function(key) {
		return this._data[key];
	},
	
	set: function(key, value) {
		this._data[key] = value;
		return value;
	}
});

return PrivateData;
});