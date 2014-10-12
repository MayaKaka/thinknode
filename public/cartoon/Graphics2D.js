
define(function (require, exports, module) {
	"use strict";
	   
var Graphics2D = function() {};

Graphics2D.get = function(type) {

	return Graphics2D.shapes[type];
}

Graphics2D.commonDrawShape = function(ctx, isFill, isStroke) {
	if (isFill) {
		ctx.fill();
	}
	if (isStroke) {
		ctx.stroke();
	}
}

Graphics2D.shapes = {
	rect: {
		type: 'rect',
		init: function(graphics) {
			this.style('fill', graphics.fill);
			this.style('stroke', graphics.stroke);
			this.style('lineWidth', graphics.lineWidth);
			this.style('size', graphics);
		},
		draw: function(ctx) {
			var isFill = this.fillStyle(ctx),
				isStroke = this.strokeStyle(ctx);
			if (isFill) {
				ctx.fillRect(0, 0, this.width, this.height);
			}
			if (isStroke) {
				ctx.strokeRect(0, 0, this.width, this.height);
			}
		}
	},
	
	circle: {
		type: 'circle',
		init: function(graphics) {
			this.style('fill', graphics.fill);
			this.style('stroke', graphics.stroke);
			this.style('lineWidth', graphics.lineWidth);
			this.style('radius', graphics.radius);
			this.style('angle', graphics.angle===undefined?360:graphics.angle);
		},
		draw: function(ctx) {
			var isFill = this.fillStyle(ctx),
				isStroke = this.strokeStyle(ctx),
				radius = this.radius;
			ctx.beginPath();
			ctx.arc(radius, radius, radius, 0, Math.PI*2*(this.angle/360), 0);
			if (this.angle < 360) {
				ctx.lineTo(radius, radius);
			}
			ctx.closePath();
			Graphics2D.commonDrawShape(ctx, isFill, isStroke);
		}
	},
	
	ellipse: {
		type: 'ellipse',
		init: function(graphics) {
			this.style('fill', graphics.fill);
			this.style('stroke', graphics.stroke);
			this.style('lineWidth', graphics.lineWidth);
			this.style('radiusXY', graphics);
		},
		draw: function(ctx) {
			var isFill = this.fillStyle(ctx),
				isStroke = this.strokeStyle(ctx),
				k = 0.5522848,
				rx = this.radiusX,
				ry = this.radiusY,
				kx = rx * k,
				ky = ry * k,
				w = rx * 2,
				h = ry * 2;
			ctx.beginPath();
			ctx.moveTo(0, ry);
			ctx.bezierCurveTo(0, ry-ky, rx-kx, 0, rx, 0);
			ctx.bezierCurveTo(rx+kx, 0, w, ry-ky, w, ry);
			ctx.bezierCurveTo(w, ry+ky, rx+kx, h, rx, h);
			ctx.bezierCurveTo(rx-kx, h, 0, ry+ky, 0, ry);
			ctx.closePath();
			Graphics2D.commonDrawShape(ctx, isFill, isStroke);
		}
	},
	
	line: {
		type: 'line',
		init: function(graphics) {
			this.style('stroke', graphics.stroke);
			this.style('lineWidth', graphics.lineWidth);
			this.path = graphics.path;
		},
		draw: function(ctx) {
			var isStroke = this.strokeStyle(ctx),
				path = this.path, 
				line;
			if (!isStroke) return;
			ctx.beginPath();
			if (path.length > 1) {
				for (var i=0,l=path.length; i<l; i++) {
					line = path[i];
					if (i === 0) {
						ctx.moveTo(line[0], line[1]);
					} else {
						if (line.length === 2) {
							ctx.lineTo(line[0], line[1]);	
						} else if (line.length === 4) {
							ctx.quadraticCurveTo(line[0], line[1], line[2], line[3]);		
						} else if (line.length === 6) {
							ctx.bezierCurveTo(line[0], line[1], line[2], line[3], line[4], line[5]);		
						}
					}
				}
			}
			ctx.stroke();
		}
	},
	
	ploygon: {
		type: 'ploygon',
		init: function(graphics) {
			this.style('fill', graphics.fill);
			this.style('stroke', graphics.stroke);
			this.points = graphics.points;
		},
		draw: function(ctx) {
			var isFill = this.fillStyle(ctx),
				isStroke = this.strokeStyle(ctx),
				points = this.points,
				point;
			ctx.beginPath();
			if (points.length > 2) {
				for (var i=0,l=points.length; i<l; i++) {
					point = points[i];
					if (i === 0) {
						ctx.moveTo(point[0], point[1]);
					} else {
						ctx.lineTo(point[0], point[1]);
					}
				}
			}
			ctx.closePath();
			Graphics2D.commonDrawShape(ctx, isFill, isStroke);
		}
	},
	
	polyStar: {
		type: 'polyStar',
		init: function(graphics) {
			this.style('fill', graphics.fill);
			this.style('stroke', graphics.stroke);
			this.style('radius', graphics.radius);
			this.sides = graphics.sides;
			this.cohesion = graphics.cohesion;
		},
		draw: function(ctx) {
			var isFill = this.fillStyle(ctx),
				isStroke = this.strokeStyle(ctx),
				radius = this.radius,
				sides = this.sides,
				cohesion = this.cohesion,
				angle, x, y;
			ctx.beginPath();
			for (var i=0; i<sides; i++) {
				angle = i/sides*Math.PI*2;
				x = (1-Math.sin(angle))*radius;
				y = (1-Math.cos(angle))*radius;
				if (i === 0) {	
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
				if (cohesion) {
					angle += Math.PI/sides;
					x = (1-Math.sin(angle)*cohesion)*radius;
					y = (1-Math.cos(angle)*cohesion)*radius;
					ctx.lineTo(x, y);
				}
			}
			ctx.closePath();
			Graphics2D.commonDrawShape(ctx, isFill, isStroke);
		}
	},
	
	roundRect: {
		type: 'roundRect',
		init: function() {
			
		},
		draw: function() {
			
		}
	},
	
	lines: {
		type: 'lines',
		init: function(graphics) {
			this.style('stroke', graphics.stroke);
			this.paths = graphics.paths;
		},
		draw: function(ctx) {
			var isStroke = this.strokeStyle(ctx),
				paths = this.paths,
				path, line;
			if (!isStroke) return;
			ctx.beginPath();
			for (var j=0, jl=paths.length; j<jl; j++) {
				path = paths[j];
				if (path.length > 1) {
					for (var i=0,l=path.length; i<l; i++) {
						line = path[i];
						if (i === 0) {
							ctx.moveTo(line[0], line[1]);
						} else {
							if (line.length === 2) {
								ctx.lineTo(line[0], line[1]);	
							} else if (line.length === 4) {
								ctx.quadraticCurveTo(line[0], line[1], line[2], line[3]);		
							} else if (line.length === 6) {
								ctx.bezierCurveTo(line[0], line[1], line[2], line[3], line[4], line[5]);		
							}
						}
					}
				}
			}
			ctx.stroke();
		}
	}
}

return Graphics2D;
});
