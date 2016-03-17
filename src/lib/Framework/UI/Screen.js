"use strict";
/**
Full screen container - i.e. game vs editor vs loading
@extends Framework.Element
@example
var screen = new Framework.Screen();
screen.addElement(new Framework.Button());
screen.draw(1);
**/
Framework.UI.Screen = class extends Framework.UI.Element {

	constructor (canvas, options) {
		var _options = new Framework.Util.Val(options);
		options = options || {};
		options.width = _options.item('width').is(Number).val(0);
		options.height = _options.item('height').is(Number).val(0);
		super(canvas, options);
	}
	
	resize(width, height) {
		this._originalWidth = width;
		this._originalHeight = height;
		super.resize();
	}

	attach() {
		// abstract method when screen is activated
	}

	destroy() {
		// abstract method for you to clean up your shit!
	}

	/**
	Clears the entire screen and draws all child elements
	@param {number} a - Alpha setting
	**/
	draw(a) {
		this._canvas.clearRect(0, 0, this.width, this.height);
		super.draw(a);
	}
}

describe('Framework.UI.Screen', function() {
	it('#constructor', function() {
		var el = new Framework.UI.Screen(runtime.canvas);
		el.draw(1);
	});
});