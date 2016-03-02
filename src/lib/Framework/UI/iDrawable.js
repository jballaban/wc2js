"use strict";
/**
Defines a drawable screen object
**/
Framework.UI.iDrawable = class {
	/**
	@param {object} canvas - The canvas to draw too
	@param {decimal} alpha - Alpha setting of the object
	**/
	constructor(canvas, alpha) {
		this._canvas = new Framework.Util.Val(canvas).is(Object).req().val();
		this.alpha = alpha;
	}

	/** 
	The current alpha state (0 is transparent.. 1 is opaque)
	@type {decimal}
	**/
	get alpha() {
		return this._alpha;
	}
	set alpha(val) {
		this._alpha = new Framework.Util.Val(val).is(Number).between(0, 1).req().val();
	}

	/**
	@abstract
	@todo throw not implemented exception
	**/
	draw() {}

	/**
	@abstract
	@todo throw not implemented exception
	**/
	update() {}

	/**
	Returns the width of the text against the given canvas and font
	@param {object} canvas - The canvas to write against
	@param {string} font - The string representation of the font to use
	@param {string} text - The text to measure
	@returns {number} - The pixel width
	**/
	static getTextWidth(canvas, font, text) {
		new Framework.Util.Val(canvas).is(Object).req();
		new Framework.Util.Val(font).is(String).req();
		new Framework.Util.Val(text).is(String).req();
		canvas.font = font;
		return canvas.measureText(text).width;
	}
}

describe('Framework.UI.iDrawable', function() {
	it('#constructor', function() {
		var el = new Framework.UI.iDrawable(runtime.canvas, 0.5);
		assert.equal(el.alpha, 0.5);
	})

	it('#getTextWidth', function() {
		assert.equal(Framework.UI.iDrawable.getTextWidth(runtime.canvas, 'Test', '14pt Calibri'), 1);
	});
});