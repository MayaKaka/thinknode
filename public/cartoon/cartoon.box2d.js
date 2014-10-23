
define(function (require, exports, module) {
	"use strict";
	   
var cartoon = require('cartoon');

// Box2D库文件
cartoon.Box2D = require('../extension/Box2D');
cartoon.PhysicsSystem = require('../extension/PhysicsSystem');

return cartoon;
});