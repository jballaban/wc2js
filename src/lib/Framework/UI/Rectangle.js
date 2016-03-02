"use strict";
/**
Defines a rectangle shape for display
@example
var rectangle = new Framework.Sprite.Rectangle({ colour: '#F00', alpha: 0.5, fill: true }); // creates a solid red rectangle at half transparency
rectangle.draw(Runtime.canvas, 100, 100, 10, 10, 1); // draw at point (100,100) with a sisze of (10,10) at 100% of original 50% alpha
rectangle.radius = 0; // reset corner to sharp
rectangle.draw(Runtime.canvas, 100, 100, 10, 10, 0.1); // re-draw again but this time with sharp corners and only 10% of the original 50% alpha
**/
Framework.UI.Rectangle = class extends Framework.UI.iDrawable {
	/**
	@param {object} canvas - The canvas to draw too
	@param {object} [options] - Set of default properties
	@param {string} [options.colour='#000'] - Seed for {@link Framework.Sprite.Rectangle#colour}
	@param {number} [options.alpha=1] - Override base alpha
	@param {number} [options.radius=5] - Override corner radius
	@param {boolean} [options.fill=false] - Solid fill
	**/
	constructor(canvas, options) {
		var _options = new Framework.Util.Val(options).is(Object);
		super(canvas, _options.item('alpha').val(1));
		this.colour = _options.item('colour').val('#000');
		this.radius = _options.item('radius').val(5);
		this.fill = _options.item('fill').val(false);
	}

	/** 
	The current colour (HEX) state
	@type {string}
	**/
	get colour() {
		return this._colour;
	}
	set colour(val) {
		this._colour = new Framework.Util.Val(val).is(String).req().val();
	}
	
	/** 
	The current fill state (true is solid, false is outline)
	@type {bool}
	**/
	get fill() {
		return this._fill;
	}
	set fill(val) {
		this._fill = new Framework.Util.Val(val).is(Boolean).req().val();
	}

	/** 
	The curvature of the corners in pixels (0 = right angle)
	@type {number}
	**/
	get radius() {
		return this._radius;
	}
	set radius(val) {
		this._radius = new Framework.Util.Val(val).is(Number).between(0, null).req().val();
	}

	/**
	Draws the object to screen
	@param {object} canvas - The canvas to draw on
	@param {number} x - Left X coordinate of the screen to draw at
	@param {number} y - Top Y coordinate of the screen to draw at
	@param {number} w - Width
	@param {number} h - Height
	@param {decimal} a - Alpha to apply on-top of the existing object alpha setting (0 = transparent, 1 = opaque)
	**/
	draw(x, y, w, h, a) {
		this._canvas.globalAlpha = this._alpha * a;
		this._canvas.beginPath();
		this._canvas.moveTo(x + this._radius, y);
		this._canvas.lineTo(x + w - this._radius, y);
		this._canvas.quadraticCurveTo(x + w, y, x + w, y + this._radius);
		this._canvas.lineTo(x + w, y + h - this._radius);
		this._canvas.quadraticCurveTo(x + w, y + h, x + w - this._radius, y + h);
		this._canvas.lineTo(x + this._radius, y + h);
		this._canvas.quadraticCurveTo(x, y + h, x, y + h - this._radius);
		this._canvas.lineTo(x, y + this._radius);
		this._canvas.quadraticCurveTo(x, y, x + this._radius, y);
		this._canvas.closePath();
		if (this._fill) {
			this._canvas.fillStyle = this._colour;
			this._canvas.fill();
		}
		else {
			this._canvas.strokeStyle = this._colour;
			this._canvas.stroke();
		}
	}
}

describe('Framework.UI.Rectangle', function() {
	it('#constructor', function() {
		var rectangle = new Framework.UI.Rectangle(runtime.canvas);
		assert.equal(rectangle.colour, '#000');
		assert.equal(rectangle.radius, 5);
		assert.equal(rectangle.fill, false);
		var rectangle2 = new Framework.UI.Rectangle(runtime.canvas, {
			colour: 'red',
			radius: 2,
			fill: true
		});
		assert.equal(rectangle2.colour, 'red');
		assert.equal(rectangle2.radius, 2);
		assert.equal(rectangle2.fill, true);
	});

	it('#draw', function() {
		var rectangle = new Framework.UI.Rectangle(runtime.canvas);
		rectangle.draw(10, 10, 5, 5, 0.5);
		var rectangle2 = new Framework.UI.Rectangle(runtime.canvas, {
			fill: true,
			radius: 2
		});
		rectangle2.draw(10, 10, 5, 5, 0.5);
	});
});