"use strict";
/**
Main game screen
@extends Framework.UI.Screen
**/
Game.Screen.MainMenu = class extends Framework.UI.Screen {
	constructor() {
		super(runtime.canvas, {
			sprite: new Framework.UI.Image(runtime.canvas, 'asset/background.jpg'),
			mouse: new Framework.IO.Mouse(Framework.UI.Cursor.Pointer),
			alpha: 0
		});
		var menu = new Framework.UI.Menu(runtime.canvas, {
			vAlign: 'centered',
			hAlign: 'centered',
			padding: 20,
			colour: '#000000'
		});
		menu.sprite.alpha = 0.5;
		menu.sprite.radius = 10;
		menu.addListener('hover', Game.trigger.button.hoverBackground(menu));
		this.addElement(menu);
		menu.addMenu('vertical', this._createMenu('Watch Intro', function() {
			Game.transition.screen(new Game.Screen.Intro());
		}));
		menu.addMenu('vertical', this._createMenu('Play Now'));
		menu.addMenu('vertical', this._createMenu('Settings'));
	}

	/**
	Fades screen in
	@overrides
	**/
	attach() {
		Game.transition.appear();
	}

	_createMenu(text, fn) {
		var menu = new Framework.UI.Button(runtime.canvas, {
			width: 150,
			height: 30,
			colour: '#F5F6CE',
			text: new Framework.UI.Text(runtime.canvas, text, Game.style.button.bigFont, { hAlign: 'centered', colour: '#333333' }),
			alpha: 0.9,
			click: fn
		});
		menu.addListener('hover', Game.trigger.button.hover(menu, '#F4FA58', '#000000'));
		return menu;
	}
}