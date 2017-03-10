"use strict";
/**
Defines text for sceen output
@example
var text = new Framework.UI.Text(Runtime.canvas, '14pt Calibri', { label: 'Hello World', halign: 'centered' });
text.draw(0, 100, 500, 0, 1); // centeres the text Hello World within 0-500 range at 100 pixels from the top of screen.
@extends Framework.UI.iDrawable
**/
Framework.UI.Text = class extends Framework.UI.iDrawable {
	/**
	@param {object} canvas - The canvas to draw too
	@param {string} label - The text to display
	@param {string} font - The font to display the text in
	@param {?Object} [options] - Override default values
	@param {string} [options.colour=#000] - Html colour code of the text
	@param {number} [options.alpha=1] - The alpha setting for this element: 0 = transparent.. 1 = oqapue
	@param {string} [options.halign=left] - left, right or centered to draw width
	@param {number} [options.width=dynamic] - Sets the text width boundary for cropping
	**/
	constructor(canvas, label, font, options) {
		var _options = new Framework.Util.Val(options).is(Object);
		super(canvas, _options.item('alpha').val(1));
		this._label = new Framework.Util.Val(label).is(String).req().val();
		this._font = new Framework.Util.Val(font).is(String).req().val();
		this.colour = _options.item('colour').val('#000000');
		this._halign = _options.item('hAlign').is(String).in('left', 'right', 'centered').val('left');
		this._width = _options.item('width').is(Number).between(0, null).val(Framework.UI.iDrawable.getTextWidth(canvas, font, label));
	}

	/** 
	Font colour 
	@type {string}
	**/
	get colour() {
		return this._colour;
	}
	set colour(val) {
		this._colour = new Framework.Util.Val(val).is(String).req().val();
	}

	/**
	Draws the text to screen
	@param {number} x - X screen position
	@param {number} y - Y screen position
	@param {number} w - Width boundary to work within (assuming parent element)
	@param {number} h - Not implemented
	@param {decimal} a - Alpha setting
	**/
	draw(x, y, w, h, a) {
		var offsetX = 0;
		if (this._halign == 'right') {
			offsetX = w-this._width;
		} else if (this._halign == 'centered') {
			offsetX = w/2-this._width/2;
		}
		this._canvas.globalAlpha = this._alpha*a;
		this._canvas.font = this._font;
		this._canvas.fillStyle = this._colour;
		this._canvas.fillText(this._label, x+offsetX, y, Math.min(w, this._width));
	}
}

describe('Framework.UI.Text', function() {
	it('#constructor', function() {
		var text = new Framework.UI.Text(runtime.canvas, 'Test', '14pt Calibri');
		var redtext = new Framework.UI.Text(runtime.canvas, 'Test', '14pt Calibri', { colour: 'red' });
		assert.equal(redtext.colour, 'red');
	});

	it ('#draw', function() {
		var text = new Framework.UI.Text(runtime.canvas, 'Test', '14pt Calibri');
		text.colour = 'red';
		text.draw(1);
		assert.equal(text.colour, 'red');
	});
});