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
	
	/**
	Resizes the screen to fit maximum viewport and then updates children
	@param {number} width - Viewport width
	@param {number} height - Viewport height
	**/
	resize(width, height) {
		this._originalWidth = width;
		this._originalHeight = height;
		super.resize();
	}

	/**
	Abstract method for when the screen is activated
	**/
	attach() {}

	/**
	Abstract method for when the screen is deactived (aka implement your garbage collection)
	**/
	destroy() {}

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