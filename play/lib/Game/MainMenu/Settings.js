"use strict";
/**
Settings screen
@extends Framework.UI.Modal
**/
Game.MainMenu.Settings = class extends Framework.UI.Modal {
	constructor() {
		super(runtime.canvas.foreground, { active: false, show: false, alpha: 0 });
		this._addMenu();
	}

	/**
	Fades in the settings modal and options
	**/
	appear() {
		this.active = this.show = true;
		this.addAnimation(new Framework.Util.Animate(this, 'alpha', 1, runtime.getTicks(500)));
	}

	/**
	@overrides
	Fades out the modal before cleaning up
	**/
	mouseClick(reallyExit) {
		var exit = new Framework.Util.Val(reallyExit).is(Boolean).val(false)
		if (exit)
			super.mouseClick();
		this.addAnimation(new Framework.Util.Animate(this, 'alpha', 0, runtime.getTicks(500)), function() {
			this.mouseClick(true);
		}.bind(this));
	}

	_addMenu() {
		var menu = new Framework.UI.Menu(runtime.canvas.foreground, {
			vAlign: 'centered',
			hAlign: 'centered',
			padding: 20,
			sprite: new Framework.UI.Image(runtime.canvas.foreground, 'asset/MainMenu/settings.png', {
				alpha: 0.8
			})
		});
		this.addElement(menu);
		menu.addMenu('vertical', this._createCheckbox('Fullscreen', false));
		menu.addMenu('vertical', this._createMenu('Close', function() {
			this.mouseClick();
		}.bind(this)));
	}

	_createCheckbox(text, state, fn) {
		var menu = new Framework.UI.Checkbox(runtime.canvas.foreground, {
			width: 150,
			height: 30,
			colour: '#F5F6CE',
			text: new Framework.UI.Text(runtime.canvas.foreground, text, Game.style.button.bigFont, { hAlign: 'centered', colour: '#333333' }),
			alpha: 0.9,
			checked: state,
			click: fn
		});
		menu.addListener('hover', Game.trigger.button.hover(menu, '#F4FA58', '#000000'));
		return menu;
	}

	_createMenu(text, fn) {
		var menu = new Framework.UI.Button(runtime.canvas.foreground, {
			width: 150,
			height: 30,
			colour: '#F5F6CE',
			text: new Framework.UI.Text(runtime.canvas.foreground, text, Game.style.button.bigFont, { hAlign: 'centered', colour: '#333333' }),
			alpha: 0.9,
			click: fn
		});
		menu.addListener('hover', Game.trigger.button.hover(menu, '#F4FA58', '#000000'));
		return menu;
	}
}