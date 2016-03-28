"use strict";
/**
Defines a button for sceen output and interaction
@extends Framework.UI.Element
@todo move colour out of options into mandatory
@todo update Sprite param to reference an interface
**/
Framework.UI.Button = class extends Framework.UI.Element {
	/**
	@param {object} canvas - The canvas to draw too
	@param {?object} [options] - Set and override default values
	@param {decimal} [options.alpha=1] - Override base alpha setting
	@param {?Framework.UI.Text} [options.text] - Text sprite to display
	@param {Framework.Sprite} [options.sprite={@link Framework.UI.Rectangle}] - The sprite to use for the button.  Defaults to rectangle
	@param {?Framework.Sprite} [options.hoversprite] - If set on hover this sprite will be displayed
	@param {?Framework.Sprite} [options.icon] - Icon to display with the button
	@param {?function} [options.click] - Callback if element is clicked
	**/
	constructor(canvas, options) {
		var _options = new Framework.Util.Val(options).is(Object);
		options = options || {};
		options.alpha = _options.item('alpha').is(Number).val(1);
		options.sprite = _options.item('sprite').is(Framework.UI.iDrawable).val(new Framework.UI.Rectangle(canvas, { fill: true, colour: _options.item('colour').is(String).val(null) }));
		super(new Framework.Util.Val(canvas).is(Object).req().val(), options);
		this.text = _options.item('text').is(Framework.UI.Text).val();
		this._nonHoverSprite = options.sprite;
		this._hoverSprite = _options.item('hoversprite').is(Framework.UI.iDrawable).val();
		if (this._hoverSprite == null && _options.item('hovercolour').val() != null) {
			this._hoverSprite = new Framework.UI.Rectangle(canvas, { fill: true, colour: _options.item('hovercolour').is(String).val(null) });
		}
		this._icon = _options.item('icon').is(Framework.UI.iDrawable).val();
		this._click = _options.item('click').is(Function).val();
	}

	/**
	Updates sprite to hovered state.
	@type {boolean}
	**/
	get hovered() {
		return super.hovered;
	}
	set hovered(val) {
		if (this.hovered == val) return;
		super.hovered = val;
		if (this._hoverSprite == null) return;
		this.sprite = val ? this._hoverSprite : this._nonHoverSprite;
	}

	/**
	Returns the button's icon
	@type {Framework.UI.iDrawable}
	**/
	get icon() {
		return this._icon;
	}

	/**
	Fires the click callback if it was set.  See constructor options.click.
	@overrides
	**/
	mouseClick() {
		if (this._click != null)
			this._click();
	}

	/**
	Draws button, icon and text if set
	@param {number} a - The alpha setting to apply
	**/
	draw(a) {
		super.draw(a);
		if (this._icon != null) {
			this._icon.draw(this.x+10, this.y-2+this.height/2-20/2, 20, 20, this.alpha*a);
		}
		if (this.text != null)
			this.text.draw(this.x+5+(this._icon == null ? 0 : 25), this.y+5+this.height/2, this.width-10, this.alpha*a);
	}
}


describe('Framework.UI.Button', function() {
	it('#constructor', function() {
		var el = new Framework.UI.Button(runtime.canvas);
		var el2 = new Framework.UI.Button(runtime.canvas, {
			alpha: 0.5,
			text: new Framework.UI.Text(runtime.canvas, 'Hi', '14pt Calibri'),
			sprite: new Framework.UI.Rectangle(runtime.canvas),
			icon: new Framework.UI.Rectangle(runtime.canvas)
		});
		assert.equal(el2.alpha, 0.5);
	});

	it ('#hovered', function() {
		var el = new Framework.UI.Button(runtime.canvas);
		assert.equal(el.hovered, false);
		el.hovered = true;
		assert.equal(el.hovered, true);
	});

	it ('#mouseClick', function(done) {
		var el = new Framework.UI.Button(runtime.canvas, { 
			click: function() { done(); }
		});
		el.mouseClick();
	});

	it ('#draw,update', function() {
		var el = new Framework.UI.Button(runtime.canvas);
		el.update();
		el.draw(1);
	});

});