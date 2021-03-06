"use strict";
/**
Modal overlay
@extends Framework.UI.Element
**/
Framework.UI.Modal = class extends Framework.UI.Element {
	/**
	@param {object} canvas - The canvas to draw too
	@params {?options} [options] - Override details.  See {@link Framework.Element} for details.  Automatically adds a semi-transparent gray rectangle to options.sprite before passing to base.
	@param {Framework.UI.iDrawable} [options.sprite=Framework.UI.Rectangle] - The sprite to apply, defaults to 80% black
	**/
	constructor(canvas, options) {
		options = options || {};
		var _options = new Framework.Util.Val(options).is(Object);
		options.sprite = _options.item('sprite').val(new Framework.UI.Rectangle(canvas, {
			colour: '#000000', 
			alpha: 0.8,
			radius: 0,
			fill: true
		} ));
		options.width = _options.item('width').val('100%');
		options.height = _options.item('height').val('100%');
		super(canvas, options);
	}

	/**
	On click anywhere on the modal (i.e. not handled higher up) will close itself down.  Still passes event through to {@link Framework.UI.Element#mouseCLick}
	**/
	mouseClick() {
		this.active = this.show = false;
		super.mouseClick();
	}
}

describe('Framework.UI.Modal', function() {
	it('#constructor', function() {
		var el = new Framework.UI.Modal(runtime.canvas);
	});

	it('#mouseClick', function() {
		var el = new Framework.UI.Modal(runtime.canvas);
		assert.equal(el.active, true);
		assert.equal(el.show, true);
		el.mouseClick();
		assert.equal(el.active, false);
		assert.equal(el.show, false);
	});
});