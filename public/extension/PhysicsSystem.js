
define(function (require, exports, module) {
	"use strict";
		
var Class = require('Class'),
	Box2D = require('Box2dWeb');

var b2Vec2 = Box2D.Common.Math.b2Vec2,
	b2BodyDef = Box2D.Dynamics.b2BodyDef,
	b2Body = Box2D.Dynamics.b2Body,
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
	b2World = Box2D.Dynamics.b2World,
	b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

var PhysicsSystem = Class.extend({
	
	_scale: 30,
	_ticksPerSec: 30,
	
	_world: null,
	_worldSize: null,
	
	createWorld: function(canvas, scale, ticksPerSec) {
		this._world = new b2World(new b2Vec2(0, 10), true);
		this._scale = scale;
		this._ticksPerSec = ticksPerSec;
		
		var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite(canvas._context2d);
		debugDraw.SetDrawScale(scale);
		debugDraw.SetFillAlpha(0.3);
		debugDraw.SetLineThickness(1.0);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		debugDraw.m_sprite.graphics.clear = function(){};
		
		this._worldSize = { width: canvas.width/scale, height: canvas.height/scale };
		this._world.SetDebugDraw(debugDraw);
	},
	
	createGround: function() {
		var fixDef = new b2FixtureDef();
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;
        
        var world = this._world,
        	bodyDef = new b2BodyDef();

        bodyDef.type = b2Body.b2_staticBody;
        bodyDef.position.x = this._worldSize.width/2;
        bodyDef.position.y = this._worldSize.height;
        fixDef.shape = new b2PolygonShape();
        fixDef.shape.SetAsBox(this._worldSize.width/2, 0.5);
        world.CreateBody(bodyDef).CreateFixture(fixDef);
	},
	
	createObject: function(displayObj, type) {
		var fixDef = new b2FixtureDef();
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;
        
        var world = this._world,
        	scale = this._scale,
        	bodyDef = new b2BodyDef();
			
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.x = displayObj.x/scale;
        bodyDef.position.y = displayObj.y/scale;
       
       	if (displayObj.radius) {
       		fixDef.shape = new b2CircleShape(displayObj.radius/scale);
       	} 
       	else if (type === 'circle') {
        	fixDef.shape = new b2CircleShape(displayObj.width/scale/2);
        } 
        else {
        	fixDef.shape = new b2PolygonShape();
        	fixDef.shape.SetAsBox(displayObj.width/scale/2, displayObj.height/scale/2);
        }
        displayObj.style('transform', { translateX: -displayObj.width/2, translateY: -displayObj.height/2 });
        
        var body = world.CreateBody(bodyDef).CreateFixture(fixDef);
        body.m_userData = { displayObj: displayObj };
	},
	
	update: function() {
		var world = this._world;
		
		world.Step(1/this._ticksPerSec, 10, 10);
		world.ClearForces();
		
		this._updateObjects();
	},
	
	drawDebug: function() {
		this._world.DrawDebugData();
	},
	
	_updateObjects: function() {
		var world = this._world,
			scale = this._scale,
			PI2 = Math.PI * 2,
			R2D = 180 / Math.PI;
			
		var i = 0, 
			f, xf, data,
	   		b = world.m_bodyList;
	   		
	    while (b) {
	    	f = b.m_fixtureList;
	      	while (f) {
	        	if (f.m_userData) {
	        		xf = f.m_body.m_xf;
	        		data = f.m_userData;
	          		displayObj = data.displayObj;
	          		x = xf.position.x * scale;
	          		y = xf.position.y * scale;
	          		r = Math.round(((f.m_body.m_sweep.a + PI2) % PI2) * R2D * 100) / 100;
	          
	          		displayObj.style('pos', { x: x, y: y });
	          		displayObj.style('transform', { rotate: r });
	        	}
	        	f = f.m_next;
	      	}
	      	b = b.m_next;
	    }
	}
	
});
         
      
return PhysicsSystem;
});