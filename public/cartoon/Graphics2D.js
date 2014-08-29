
define(function (require, exports, module) {
   
var Graphics2D = function() {};

Graphics2D.get = function(type) {

	return Graphics2D.shapes[type];
}

var commonDrawShape = function(ctx, fillStyle, strokeStyle) {
	if (fillStyle) {
		ctx.fillStyle = fillStyle;
		ctx.fill();
	}
	if (strokeStyle) {
		ctx.lineWidth = 1;
		ctx.strokeStyle = strokeStyle;
		ctx.stroke();
	}
}

Graphics2D.shapes = {
	Rect: {
		type: 'Rect',
		init: function(graphics) {
			this.style('fill', graphics.fill);
			this.style('stroke', graphics.stroke);
			this.style('size', graphics);
		},
		draw: function(ctx) {
			var fillStyle = this.fillStyle(ctx),
				strokeStyle = this.strokeStyle(ctx);
			if (fillStyle) {
				ctx.fillStyle = fillStyle;
				ctx.fillRect(0, 0, this.width, this.height);
			}
			if (strokeStyle) {
				ctx.strokeStyle = strokeStyle;
				ctx.strokeRect(0, 0, this.width, this.height);
			}
		}
	},
	
	Circle: {
		type: 'Circle',
		init: function(graphics) {
			this.style('fill', graphics.fill);
			this.style('stroke', graphics.stroke);
			this.style('radius', graphics.radius);
			this.style('angle', typeof(graphics.angle)==='number'?graphics.angle:360);
		},
		draw: function(ctx) {
			var radius = this.radius;
			ctx.beginPath();
			ctx.arc(radius, radius, radius, 0, Math.PI*2*(this.angle/360), 0);
			ctx.lineTo(radius, radius);
			ctx.closePath();
			commonDrawShape(ctx, this.fillStyle(ctx), this.strokeStyle(ctx));
		}
	},
	
	Ellipse: {
		type: 'Ellipse',
		init: function(graphics) {
			this.style('fill', graphics.fill);
			this.style('stroke', graphics.stroke);
			this.style('radiusXY', graphics);
		},
		draw: function(ctx) {
			var k = 0.5522848,
				rx = this.radiusX,
				ry = this.radiusY;
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
			commonDrawShape(ctx, this.fillStyle(ctx), this.strokeStyle(ctx));
		}
	},
	
	Line: {
		type: 'Line',
		init: function(graphics) {
			this.style('stroke', graphics.stroke);
			this.path = graphics.path;
		},
		draw: function(ctx) {
			var path = this.path, 
				line;		
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
			ctx.strokeStyle = this.strokeColor;
			ctx.stroke();
		}
	},
	
	Ploygon: {
		type: 'Ploygon',
		init: function(graphics) {
			this.style('fill', graphics.fill);
			this.style('stroke', graphics.stroke);
			this.points = graphics.points;
		},
		draw: function(ctx) {
			var points = this.points,
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
			commonDrawShape(ctx, this.fillStyle(ctx), this.strokeStyle(ctx));
		}
	},
	
	PolyStar: {
		type: 'PolyStar',
		init: function(graphics) {
			this.style('fill', graphics.fill);
			this.style('stroke', graphics.stroke);
			this.style('radius', graphics.radius);
			this.sides = graphics.sides;
			this.cohesion = graphics.cohesion;
		},
		draw: function(ctx) {
			var radius = this.radius,
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
			commonDrawShape(ctx, this.fillStyle(ctx), this.strokeStyle(ctx));
		}
	},
	
	RoundRect: {
		type: 'RoundRect',
		init: function() {
			
		},
		draw: function() {
			
		}
	},
	
	Lines: {
		type: 'Lines',
		init: function(graphics) {
			this.style('stroke', graphics.stroke);
			this.paths = graphics.paths;
		},
		draw: function(ctx) {
			var paths = this.paths,
				path, line;
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
			ctx.strokeStyle = this.strokeColor;
			ctx.stroke();
		}
	}
}

return Graphics2D;
});
