"use strict";
/**
Main game screen
@extends Framework.UI.Screen
**/
Game.MainMenu.Screen = class extends Framework.UI.Screen {
	constructor() {
		super(runtime.canvas.foreground, {
			mouse: new Framework.IO.Mouse(Framework.UI.Cursor.Pointer),
			alpha: 0
		});
		this.drawBackground = true;
		this.background = new Framework.UI.Image(runtime.canvas.background, 'asset/MainMenu/background.jpg');
		
		this.addElement(new Game.MainMenu.Fire());
		this.addElement(new Game.MainMenu.Smoke());
		this._addMenu();
		this.settings = new Game.Settings.Modal();
		this.addElement(this.settings);
	}

	/**
	Fades screen in
	@overrides
	**/
	attach() {
		Game.transition.appear();
	}

	get alpha() {
		return super.alpha;
	}
	set alpha(val) {
		super.alpha = val;
		this.drawBackground = true;
	}

	resize(width, height) {
		super.resize(width, height);
		this.drawBackground = true;
	}

	draw(a) {
		if (this.background && this.drawBackground) {
			this.background.draw(0, 0, this.width, this.height, this.alpha);
			this.drawBackground = false;
		}
		super.draw(a);
	}

	_addMenu() {
		var menu = new Framework.UI.Menu(runtime.canvas.foreground, {
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
			Game.transition.screen(new Game.Intro.Screen());
		}));
		menu.addMenu('vertical', this._createMenu('Play Now'));
		menu.addMenu('vertical', this._createMenu('Settings', function() {
			this.settings.appear();
		}.bind(this)));
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