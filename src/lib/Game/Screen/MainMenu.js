"use strict";
Game.Screen.MainMenu = class extends Framework.UI.Screen {
	constructor() {
		super(runtime.canvas, {
			sprite: new Framework.UI.Image(runtime.canvas, 'asset/background.jpg'),
			mouse: new Framework.IO.Mouse(Framework.UI.Cursor.Pointer)
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
		menu.addMenu('vertical', this.createMenu('Watch Intro', function() {
			runtime.setScreen(new Game.Screen.Intro());
		}));
		menu.addMenu('vertical', this.createMenu('Play Now'));
		menu.addMenu('vertical', this.createMenu('Settings'));
	}

	createMenu(text, fn) {
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

	/*
		options = options || {};
		options.mouse = new Framework.Mouse.Mouse(Framework.Mouse.Cursors.Pointer);
		super(options);
		this.loading = 'background';
		
		
		this.menu.addElement(new Framework.Button({
			width: 140,
			height: 40,
			y: 55,
			vPosition: 'relative',
			hPosition: 'centered',
			sprite: new Framework.Sprite.Rectangle({colour:'#ccc'}),
			hoversprite: new Framework.Sprite.Rectangle({colour:'#ac8'}),
			text: new Framework.Text({font:'14pt Calibri', label:'Play'}),
			click: function() {
				Runtime.setScreen(new Game.PlayScreen());
			}
		}));
		this.menu.addElement(new Framework.Button({
			width: 140,
			height: 40,
			y: 105,
			vPosition: 'relative',
			hPosition: 'centered',
			sprite: new Framework.Sprite.Rectangle({colour:'#ccc'}),
			hoversprite: new Framework.Sprite.Rectangle({colour:'#ac8'}),
			text: new Framework.Text({font:'14pt Calibri', label:'Map Edit'}),
			click: function() {
				Runtime.setScreen(new Game.EditorScreen());
			}
		}));
		this.menu.addElement(new Framework.Button({
			width: 140,
			height: 40,
			y: 155,
			vPosition: 'relative',
			hPosition: 'centered',
			sprite: new Framework.Sprite.Rectangle({colour:'#ccc'}),
			hoversprite: new Framework.Sprite.Rectangle({colour:'#ac8'}),
			text: new Framework.Text({font:'14pt Calibri', label:'Settings'}),
			click: function() {
				this.modal.active = true;
				this.modal.show = true;
			}.bind(this)
		}));
		this.addElement(this.menu);
		this.modal = new Framework.Modal({
			active:false,
			show:false
		});
		let settings = this.modal.addElement(new Framework.Element({
			width:230,
			height:230,
			vPosition:'centered',
			hPosition:'centered',
			sprite: new Framework.Sprite.Image({src:'asset/Menu/background.png' })
		}));
		settings.addElement(new Framework.Checkbox({
			width: 180,
			height: 40,
			y:20,
			sprite: null,
			hoversprite: new Framework.Sprite.Rectangle({colour:'#fff', alpha:0.3}),
			vPosition: 'relative',
			hPosition: 'centered',
			checked: Game.Settings.playIntro, 
			text: new Framework.Text({font:'14pt Calibri', label:'Play Intro Video', hovercolour:'#F91' }),
			click: function() {
				Game.Settings.playIntro = this.checked;
			}
		}));
		settings.addElement(new Framework.Checkbox({
			width: 180,
			height: 40,
			y: 65,
			vPosition: 'relative',
			hPosition: 'centered',
			sprite: null,
			hoversprite: new Framework.Sprite.Rectangle({colour:'#fff', alpha:0.3}),
			text: new Framework.Text({font:'14pt Calibri', label:'Fullscreen'}),
			checked: Game.Settings.fullscreen,
			click: function() {
				Game.Settings.fullscreen = this.checked;
			}
		}));
		settings.addElement(new Framework.Checkbox({
			width: 180,
			height: 40,
			y: 110,
			vPosition: 'relative',
			hPosition: 'centered',
			sprite: null,
			hoversprite: new Framework.Sprite.Rectangle({colour:'#fff', alpha:0.3}),
			text: new Framework.Text({font:'14pt Calibri', label:'Play Music'}),
			checked: Game.Settings.playMusic,
			click: function() {
				Game.Settings.playMusic = this.checked;
			}
		}));
		settings.addElement(new Framework.Checkbox({
			width: 180,
			height: 40,
			y: 155,
			vPosition: 'relative',
			hPosition: 'centered',
			sprite: null,
			hoversprite: new Framework.Sprite.Rectangle({colour:'#fff', alpha:0.3}),
			text: new Framework.Text({font:'14pt Calibri', label:'Lock Mouse'}),
			checked: Game.Settings.lockMouse,
			click: function() {
				Game.Settings.lockMouse = this.checked;
			}
		}));
		this.addElement(this.modal);
		
	}

	reposition() {
		super.reposition();
		this.modal.width = this.width;
		this.modal.height = this.height;
		this.modal.reposition();
	}

	update() {
		if (this.loading=='background') {
			this.sprite.alpha+=.02;
			if (this.loading=='background' && this.sprite.alpha >= 1)
				this.loading = 'menu'
		}
		if (this.loading=='menu') {
			this.menu.alpha+=.05;
			if (this.loading == 'menu' && this.menu.alpha >=1)
				this.loading = '';
		}
		super.update();
	}
	*/
}