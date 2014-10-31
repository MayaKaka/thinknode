
define(function (require, exports, module) {
	"use strict";
	   
var cartoon = require('cartoon');

// THREE库文件
cartoon.THREE = require('../extension/THREE');
cartoon.Object3DFactory = require('../extension/Object3DFactory');
cartoon.GLCanvas = require('../extension/GLCanvas');

return cartoon;
});