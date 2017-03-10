"use strict";
/**
Defines an interactive menu area (really a container for buttons)
@extends Framework.UI.Element
**/
Framework.UI.Menu = class extends Framework.UI.Element {
	/**
	@param {object} canvas - The canvas to draw too
	@param {?object} [options] - Set of default options to apply.  See {@link Framework.Element} for details.  options.mouse and options.sprite are automatically added to options before calling base.
	@param {Framework.UI.iDrawable} [options.sprite=Framework.UI.Rectangle] - The background sprite to apply
	@param {number} [options.width=dynamic to children] - Menu width
	@param {number} [options.height=dynamic to children] - Menu Height
	@param {number} [options.padding] - Padding to apply around menu
	**/
	constructor(canvas, options) {
		options = options || {};
		var _options = new Framework.Util.Val(options).is(Object);
		//options.mouse = _options.item('mouse').val(new Framework.IO.Mouse(Framework.UI.Cursor.Pointer));
		options.sprite = _options.item('sprite').val(new Framework.UI.Rectangle(canvas, { colour: _options.item('colour').val('#000000'), alpha: _options.item('alpha').val(1), fill: _options.item('fill').val(true) }));
		options.width = _options.item('width').val('%');
		options.height = _options.item('height').val('%');
		var padding = _options.item('padding').is(Number).val(0);
		if (padding > 0) {
			options.width = options.width.toString()+'+'+padding;
			options.height = options.height.toString()+'+'+padding;
		}
		super(canvas, options);
		this._xIndex = this._yIndex = this._padding = padding;
	}

	/**
	Adds a menu item with some logic
	@param {string} direction - vertical or horizontal
	@param {Framework.UI.iDrawable} - The item to add
	**/
	addMenu(direction, el) {
		el.y = this._yIndex;
		el.x = this._xIndex;
		switch (direction) {
			case 'vertical' :
				this._yIndex += el.height + this._padding;
				break;
			default:
				throw new Error('Unknown direction');
		}
		this.addElement(el);
	}
}

describe('Framework.UI.Menu', function() {
	it('#constructor', function() {
		var el = new Framework.UI.Menu(runtime.canvas);
	});
});