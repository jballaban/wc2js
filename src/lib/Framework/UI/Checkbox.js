"use strict";
/**
Defines a checkbox for sceen output and interaction
@extends Framework.UI.Button
**/
Framework.UI.Checkbox = class extends Framework.UI.Button {
	/**
	@param {object} canvas - The canvas to draw too
	@param {object} options - Options to pass to base constructor.  See {@link Framework.UI.Button} for details
	@param {Framework.UI.Image} [options.icon=Framework.UI.Image] - The checkbox icon itself.  First frame is off, second frame is on.  By default will use checkmark.
	@param {boolean} [options.checked=false] - If the checkbox should be selected to start
	**/
	constructor(canvas, options) {
		options = options || {};
		var _options = new Framework.Util.Val(options);
		options.icon = _options.item('icon').is(Framework.UI.Image).val(new Framework.UI.Image(canvas, 'asset/checkbox.png', { frames: [ { x: 21, y:0, w:20, h:20 }, { x: 0, y:0, w:20, h:20 } ] }));
		super(new Framework.Util.Val(canvas).is(Object).req().val(), options);
		this.checked = _options.item('checked').is(Boolean).val(false);
	}

	/** 
	If the checkbox is selected or not.  Updates the icon to reflect 
	@type {boolean}
	**/
	get checked() {
		return this._checked;
	}
	set checked(val) {
		this._checked = new Framework.Util.Val(val).is(Boolean).req().val();
		this.icon.setFrame(this._checked ? 1 : 0);
	}

	/**
	Updates the checked status then calls base
	**/
	mouseClick() {
		this.checked = true;
		super.mouseClick();
	}
}

describe('Framework.UI.Checkbox', function() {
	it('#constructor', function() {
		var el = new Framework.UI.Checkbox(runtime.canvas);
		var el2 = new Framework.UI.Checkbox(runtime.canvas, {
			checked: true
		});
		assert.equal(el2.checked, true);
	});

	it ('#checked, icon', function() {
		var el = new Framework.UI.Checkbox(runtime.canvas);
		assert.equal(el.checked, false);
		assert.equal(el.icon._frame, 0);
		el.checked = true;
		assert.equal(el.icon._frame, 1);
		assert.equal(el.checked, true);

	});

	it ('mouseClick', function() {
		var el = new Framework.UI.Checkbox(runtime.canvas);
		el.mouseClick();
		assert.equal(el.checked, true);
	});
});