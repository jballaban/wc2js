"use strict";
Game.PlayScreen = class extends Framework.Screen {
	constructor(options){
		super(options);
		this.mouse = new Framework.Mouse.Mouse(Framework.Mouse.Cursors.Pointer);
		this.sprite = new Framework.Sprite.Image({src: 'asset/play/background.jpg'});
		this.minimap = new Framework.Element({
			x: 40,
			y: 80,
			width: 250,
			height: 250,
			sprite: new Framework.Sprite.Image({src: 'asset/play/mini.png'})	
		});
		this.play = new Framework.Element({
			x: 40+250+40,
			y: 40,
			sprite: new Framework.Sprite.Image({src: 'asset/play/interior.png'})					
		});
		this.menuModal = new Framework.Modal({
			active:false,
			show:false
		});
		let settings = this.menuModal.addElement(new Framework.Element({
			width:230,
			height:230,
			vPosition:'centered',
			hPosition:'centered',
			sprite: new Framework.Sprite.Image({src:'asset/Menu/background.png' })
		}));
		settings.addElement(new Framework.Checkbox({
			width: 180,
			height: 40,
			y: 20,
			vPosition: 'relative',
			hPosition: 'centered',
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
			y: 65,
			vPosition: 'relative',
			hPosition: 'centered',
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
			y: 110,
			vPosition: 'relative',
			hPosition: 'centered',
			hoversprite: new Framework.Sprite.Rectangle({colour:'#fff', alpha:0.3}),
			text: new Framework.Text({font:'14pt Calibri', label:'Lock Mouse'}),
			checked: Game.Settings.lockMouse,
			click: function() {
				Game.Settings.lockMouse = this.checked;
			}
		}));
		settings.addElement(new Framework.Button({
			width: 180,
			height: 40,
			y:155,
			hoversprite: new Framework.Sprite.Rectangle({colour:'#fff', alpha:0.3}),
			vPosition: 'relative',
			hPosition: 'centered',
			text: new Framework.Text({font:'14pt Calibri', label:'Exit Game', hovercolour:'#F91' }),
			click: function() {
				Runtime.setScreen(new Game.MenuScreen());
			}
		}));
		let menubtn = new Framework.Menu({
			vPosition: 'absolute',
			hPosition: 'absolute',
			y: 40,
			x: 40,
			width: 250,
			height: 40,
			colour: '#000',
			sprite: new Framework.Sprite.Rectangle({colour:'#ccc', alpha: 0.5}),
		});
		menubtn.addElement(new Framework.Button({
			vPosition: 'relative',
			hPosition: 'relative',
			y: 5,
			x: 5, 
			width: 240,
			height: 30, 
			text: new Framework.Text({font:'14pt Calibri', label:'Menu', halign:'centered', colour:'#ddd'}),
			click: function() {
				Runtime.screen.menuModal.show = true;
				Runtime.screen.menuModal.active = true;
			},
			sprite: new Framework.Sprite.Image({src:'asset/play/button.jpg'}),
			hoversprite: new Framework.Sprite.Image({src:'asset/play/button2.jpg'})
		}));
		this.addElement(menubtn);
		this.addElement(this.minimap);
		this.addElement(this.play);
		this.addElement(this.menuModal);
	}

	reposition() {
		super.reposition();
		this.menuModal.width = this.width;
		this.menuModal.height = this.height;
		this.play.width = this.width-40-250-40-40;
		this.play.height = this.height-40-40;
		this.menuModal.reposition();
	}	
}