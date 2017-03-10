"use strict";
var EditorMouse = class extends Framework.Mouse.Mouse {
	constructor() {
		super(Framework.Mouse.Cursors.Pointer);
	}

	move(x, y) {
		super.move(x, y);
		if (this.leftButtonPressed)
			this.insert();
	}

	down() {
		super.down();
		this.insert();
	}

	insert() {
		if ((Runtime.screen.elementAt(this.x, this.y) instanceof Game.Tiles.Tile)) {
			let tilePos = Runtime.screen.tileset.mapCoordToTile(this.x, this.y);
			Runtime.screen.tileset.insert(tilePos.tileX, tilePos.tileY, Runtime.screen.insertTile);
		}
	}
}

Game.EditorScreen = class extends Framework.Screen {
	constructor(options) {
		options = options || {};
		options.mouse = new EditorMouse();
		super(options);
		this.tileset = new Game.Tiles.Summer({ tileWidth:32, tileHeight:32, tilesWidth: 50, tilesHeight: 50});
		this.insertTile = Game.Tiles.Type.Water;
		this.addElement(this.tileset);
		var buttonwidth = 100;
		var menu = new Framework.Menu({
			vPosition: 'absolute',
			hPosition: 'absolute',
			x: window.innerWidth-(buttonwidth+5)*7-5,
			y: 0,
			width: (buttonwidth+5)*7+5,
			height: 40,
			colour: '#000'
		});
		let relativeX = 5;
		var groundmenu = new Framework.Button({
			vPosition: 'centered',
			hPosition: 'relative',
			x: relativeX,
			width: buttonwidth,
			height: 30, 
			sprite: new Framework.Sprite.Rectangle({colour:'#eee'}),
			hoversprite: new Framework.Sprite.Rectangle({colour:'#ccc'}),
			text: new Framework.Text({font:'14pt Calibri', label:'Dirt'}),
			icon: this.tileset.getSprite([Game.Tiles.Type.Dirt, Game.Tiles.Type.Dirt, Game.Tiles.Type.Dirt, Game.Tiles.Type.Dirt])
		});
		groundmenu.mouseClick = function() {
			Runtime.screen.insertTile = Game.Tiles.Type.Dirt;
		}
		menu.addElement(groundmenu);
		relativeX+=buttonwidth+5;
		var shademenu = new Framework.Button({
			vPosition: 'centered',
			hPosition: 'relative',
			x: relativeX,
			width: buttonwidth,
			height: 30, 
			sprite: new Framework.Sprite.Rectangle({colour:'#eee'}),
			hoversprite: new Framework.Sprite.Rectangle({colour:'#ccc'}),
			text: new Framework.Text({font:'14pt Calibri', label:'Shade'}),
			icon: this.tileset.getSprite([Game.Tiles.Type.Shade, Game.Tiles.Type.Shade, Game.Tiles.Type.Shade, Game.Tiles.Type.Shade])
		});
		shademenu.mouseClick = function() {
			Runtime.screen.insertTile = Game.Tiles.Type.Shade;
		}
		menu.addElement(shademenu);
		relativeX+=buttonwidth+5;
		var grassmenu = new Framework.Button({
			vPosition: 'centered',
			hPosition: 'relative',
			x: relativeX,
			width: buttonwidth,
			height: 30, 
			sprite: new Framework.Sprite.Rectangle({colour:'#eee'}),
			hoversprite: new Framework.Sprite.Rectangle({colour:'#ccc'}),
			text: new Framework.Text({font:'14pt Calibri', label:'Grass'}),
			icon: this.tileset.getSprite([Game.Tiles.Type.Grass, Game.Tiles.Type.Grass, Game.Tiles.Type.Grass, Game.Tiles.Type.Grass])
		});
		grassmenu.mouseClick = function() {
			Runtime.screen.insertTile = Game.Tiles.Type.Grass;
		}
		menu.addElement(grassmenu);
		relativeX+=buttonwidth+5;
		var longgrassmenu = new Framework.Button({
			vPosition: 'centered',
			hPosition: 'relative',
			x: relativeX,
			width: buttonwidth,
			height: 30, 
			sprite: new Framework.Sprite.Rectangle({colour:'#eee'}),
			hoversprite: new Framework.Sprite.Rectangle({colour:'#ccc'}),
			text: new Framework.Text({font:'14pt Calibri', label:'L. Grass'}),
			icon: this.tileset.getSprite([Game.Tiles.Type.LongGrass, Game.Tiles.Type.LongGrass, Game.Tiles.Type.LongGrass, Game.Tiles.Type.LongGrass])
		});
		longgrassmenu.mouseClick = function() {
			Runtime.screen.insertTile = Game.Tiles.Type.LongGrass;
		}
		menu.addElement(longgrassmenu);
		relativeX+=buttonwidth+5;
		var watermenu = new Framework.Button({
			vPosition: 'centered',
			hPosition: 'relative',
			x: relativeX,
			width: buttonwidth,
			height: 30, 
			sprite: new Framework.Sprite.Rectangle({colour:'#eee'}),
			hoversprite: new Framework.Sprite.Rectangle({colour:'#ccc'}),
			text: new Framework.Text({font:'14pt Calibri', label:'Water'}),
			icon: this.tileset.getSprite([Game.Tiles.Type.Water, Game.Tiles.Type.Water, Game.Tiles.Type.Water, Game.Tiles.Type.Water])
		});
		watermenu.mouseClick = function() {
			Runtime.screen.insertTile = Game.Tiles.Type.Water;
		}
		menu.addElement(watermenu);
		relativeX+=buttonwidth+5;
		var oceanmenu = new Framework.Button({
			vPosition: 'centered',
			hPosition: 'relative',
			x: relativeX,
			width: buttonwidth,
			height: 30, 
			sprite: new Framework.Sprite.Rectangle({colour:'#eee'}),
			hoversprite: new Framework.Sprite.Rectangle({colour:'#ccc'}),
			text: new Framework.Text({font:'14pt Calibri', label:'Ocean'}),
			icon: this.tileset.getSprite([Game.Tiles.Type.Ocean, Game.Tiles.Type.Ocean, Game.Tiles.Type.Ocean, Game.Tiles.Type.Ocean])
		});
		oceanmenu.mouseClick = function() {
			Runtime.screen.insertTile = Game.Tiles.Type.Ocean;
		}
		menu.addElement(oceanmenu);
		relativeX+=buttonwidth+5;
		var exitmenu = new Framework.Button({
			vPosition: 'centered',
			hPosition: 'relative',
			x: relativeX, 
			width: buttonwidth,
			height: 30, 
			sprite: new Framework.Sprite.Rectangle({colour:'#eee'}),
			hoversprite: new Framework.Sprite.Rectangle({colour:'#ccc'}),
			text: new Framework.Text({font: '14pt Calibri', label:'Exit'})
		});
		exitmenu.mouseClick = function() {
			Runtime.setScreen(new Game.MenuScreen());
		}
		menu.addElement(exitmenu);
		this.addElement(menu);
	}
}