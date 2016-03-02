"use strict";
Game.Tiles = {};
Game.Tiles.Summer = class extends Framework.Element {
	constructor(options) {
		super(options);
		if (options.tileWidth == null || options.tileHeight == null || options.tilesWidth == null || options.tilesHeight == null) {
			console.log('tileWidth, tileHeight, tilesWidth and tilesHeight are required');
			debugger;
		}
		this.tileWidth = options.tileWidth;
		this.tileHeight = options.tileHeight;
		this.tilesWidth = options.tilesWidth;
		this.tilesHeight = options.tilesHeight;
		this.set = this._getSet();
		this._seed();
	}

	mapCoordToTile(x, y) { 
		if (x >= this.tileWidth*this.tilesWidth ||  y >= this.tileHeight*this.tilesHeight)
			return null;
		return {
			tileX: Math.floor(x / this.tileWidth),
			tileY: Math.floor(y / this.tileHeight)
		}
	}
	
	mapTileToIndex(tileX, tileY) {
		return tileY*this.tilesWidth+tileX;
	}

	insert(tileX, tileY, type, ignoretypes) {
		var el = this.elements[this.mapTileToIndex(tileX, tileY)];
		//if (Game.Tiles.Type.equals(el.connections, type)) return; // same type ignore
		if (ignoretypes == undefined)
			ignoretypes = [];
		else if (ignoretypes.length == undefined)
			ignoretypes = [ignoretypes];
		for (var i=0;i<ignoretypes.length;i++)
			if (Game.Tiles.Type.find(el.connections, ignoretypes[i])) return; // has ignoretype	
		var adjacent = this.getAdjacent(tileX, tileY);
		if (type.base != null) {
			ignoretypes.push(type);
			for (var i=0;i<adjacent.length;i++) {
				if (adjacent[i] == null) continue;
				var tile = this.mapCoordToTile(adjacent[i].x, adjacent[i].y);
				this.insert(tile.tileX, tile.tileY, type.base, type);
			}
		}
		this._setConnection(el, [0,1,2,3], type);
		if (adjacent[1-1] != null)
			this._setConnection(adjacent[1-1], [1], type);
		if (adjacent[2-1] != null)
			this._setConnection(adjacent[2-1], [0,1], type);
		if (adjacent[3-1] != null)
			this._setConnection(adjacent[3-1], [0], type);
		if (adjacent[4-1] != null)
			this._setConnection(adjacent[4-1], [1,3], type);
		if (adjacent[6-1] != null)
			this._setConnection(adjacent[6-1], [0,2], type);
		if (adjacent[7-1] != null)
			this._setConnection(adjacent[7-1], [3], type);
		if (adjacent[8-1] != null)
			this._setConnection(adjacent[8-1], [2,3], type);
		if (adjacent[9-1] != null)
			this._setConnection(adjacent[9-1], [2], type);
	}

	getAdjacent(tileX, tileY) {
		var adjacent = [];
		adjacent.push(tileX > 0 && tileY < this.tilesHeight-1 ? this.elements[this.mapTileToIndex(tileX-1,tileY+1)] : null);
		adjacent.push(tileY < this.tilesHeight-1 ? this.elements[this.mapTileToIndex(tileX,tileY+1)] : null);
		adjacent.push(tileX < this.tilesWidth-1 && tileY < this.tilesHeight ? this.elements[this.mapTileToIndex(tileX+1,tileY+1)] : null);
		adjacent.push(tileX > 0 ? this.elements[this.mapTileToIndex(tileX-1,tileY)] : null);
		adjacent.push(null);
		adjacent.push(tileX < this.tilesWidth-1 ? this.elements[this.mapTileToIndex(tileX+1,tileY)] : null);
		adjacent.push(tileX > 0 && tileY > 0 ? this.elements[this.mapTileToIndex(tileX-1,tileY-1)] : null);
		adjacent.push(tileY > 0 ? this.elements[this.mapTileToIndex(tileX,tileY-1)] : null);
		adjacent.push(tileX < this.tilesWidth-1 && tileY > 0 ? this.elements[this.mapTileToIndex(tileX+1,tileY-1)] : null);
		return adjacent;
	}

	getSprite(connections) {
		for (var i=0;i<this.set.length;i++) {
			if (Game.Tiles.Type.equals(this.set[i].connections, connections)) {
				var sourceX = this.set[i].sourceX;
				var sourceY = this.set[i].sourceY;
				var length = this.set[i].length;
				if (this.set[i].random != null && Math.random()<.01) {
					sourceX = this.set[i].random.sourceX;
					sourceY = this.set[i].random.sourceY;
					length = this.set[i].random.length;
				}
				var sourceX = sourceX + (Math.floor(Math.random()*length));
				while (sourceX >= 19) {
					sourceX=sourceX-19;
					sourceY+=1;
				}
				return new Framework.Sprite.Image({
					src: 'asset/Terrain/Summer.png',
					frames: [ { x: (32+1)*sourceX, y: (32+1)*sourceY, w: 32, h: 32 } ]
				});
			}
		}
		return null;
	}

	_setConnection(tile, positions, type) {
		for (var i=0;i<positions.length;i++)
			tile.connections[positions[i]] = type;
		tile.sprite = this.getSprite(tile.connections) || new Framework.Sprite.Rectangle({ colour: '#F00', fill: true, radius: 0 });
	}

	update() {} //override for performance since tiles don't update (unless we implement moving water)

	_seed() {
		for (var y=0; y<this.tilesHeight; y++) {
			for (var x=0; x<this.tilesWidth; x++) {
				var el = this.addElement(new Game.Tiles.Tile({ 
					x: x*this.tileWidth, y: y*this.tileHeight, width: this.tileWidth, height: this.tileHeight
				}));
				this._setConnection(el, [0,1,2,3], Game.Tiles.Type.Dirt);
			}
		}
	}

	_getSet() {
		var D = Game.Tiles.Type.Dirt;
		var G = Game.Tiles.Type.Grass;
		var W = Game.Tiles.Type.Water;
		var S = Game.Tiles.Type.Shade;
		var L = Game.Tiles.Type.LongGrass;
		var O = Game.Tiles.Type.Ocean;
		var set = [
			// long grass
			{ connections: [L, L, 
							L, L], sourceX: 3, sourceY: 19, length: 1, random: { sourceX: 4, sourceY: 19, length: 7 } },
			{ connections: [L, G, 
							G, G], sourceX: 10, sourceY: 12, length: 2 },
			{ connections: [G, L,
							G, G], sourceX: 12, sourceY: 12, length: 2 },
			{ connections: [L, L,
							G, G], sourceX: 14, sourceY: 12, length: 3 },
			{ connections: [G, G,
							L, G], sourceX: 17, sourceY: 12, length: 2 },
			{ connections: [L, G,
							L, G], sourceX: 0, sourceY: 13, length: 3 },
			{ connections: [G, L,
							L, G], sourceX: 3, sourceY: 13, length: 2 },
			{ connections: [L, L,
							L, G], sourceX: 5, sourceY: 13, length: 2 },
			{ connections: [G, G,
							G, L], sourceX: 7, sourceY: 13, length: 2 },
			{ connections: [L, G, // ?
							G, L], sourceX: 9, sourceY: 13, length: 2 },
			{ connections: [G, L,
							G, L], sourceX: 11, sourceY: 13, length: 3 },
			{ connections: [L, L, // ?
							G, L], sourceX: 14, sourceY: 13, length: 2 },
			{ connections: [G, G,
							L, L], sourceX: 16, sourceY: 13, length: 3 },
			{ connections: [L, G,
							L, L], sourceX: 0, sourceY: 14, length: 2 },
			{ connections: [G, L,
							L, L], sourceX: 2, sourceY: 14, length: 2 },
			// shade
			{ connections: [S, S, 
							S, S], sourceX: 3, sourceY: 18, length: 3, random: { sourceX: 3, sourceY: 18, length: 11 } },
			{ connections: [S, D, 
							D, D], sourceX: 9, sourceY: 9, length: 1 },
			{ connections: [D, S, 
							D, D], sourceX: 10, sourceY: 9, length: 2 },
			{ connections: [S, S, 
							D, D], sourceX: 12, sourceY: 9, length: 3 },
			{ connections: [D, D, 
							S, D], sourceX: 15, sourceY: 9, length: 1 },
			{ connections: [S, D, 
							S, D], sourceX: 17, sourceY: 9, length: 3 },
			{ connections: [S, S, // ?
							S, D], sourceX: 1, sourceY: 10, length: 1 },
			{ connections: [D, S, // ?
							S, D], sourceX: 2, sourceY: 10, length: 1 },
			{ connections: [S, S, // ?
							S, S], sourceX: 3, sourceY: 10, length: 1 },
			{ connections: [D, D, 
							D, S], sourceX: 4, sourceY: 10, length: 1 },
			{ connections: [S, S, 
							D, S], sourceX: 5, sourceY: 10, length: 1 },
			{ connections: [D, S, 
							S, D], sourceX: 6, sourceY: 10, length: 1 },
			{ connections: [D, S, 
							D, S], sourceX: 7, sourceY: 10, length: 3 },
			{ connections: [S, D, // ?
							D, S], sourceX: 10, sourceY: 10, length: 1 },
			{ connections: [D, D, 
							S, S], sourceX: 11, sourceY: 10, length: 3 },
			{ connections: [S, D,  // ?
							S, S], sourceX: 14, sourceY: 10, length: 1 },
			{ connections: [D, S,  // ?
							S, S], sourceX: 15, sourceY: 10, length: 1 },
			// dirt
			{ connections: [D, D, 
							D, D], sourceX: 11, sourceY: 17, length: 3, random: { sourceX: 14, sourceY: 17, length: 8 } },
			// grass
			{ connections: [G, G,
							G, G], sourceX: 14, sourceY: 18, length: 1, random: { sourceX: 15, sourceY: 18, length: 7 } },
			{ connections: [D, G,
							G, G], sourceX: 4, sourceY: 14, length: 2 },
			{ connections: [G, D, 
							G, G], sourceX: 6, sourceY: 14, length: 2 },
			{ connections: [D, D, 
							G, G], sourceX: 8, sourceY: 14, length: 3 },
			{ connections: [G, G, 
							D, G], sourceX: 11, sourceY: 14, length: 2 },
			{ connections: [D, G, 
							D, G], sourceX: 13, sourceY: 14, length: 3 },
			{ connections: [G, D, 
							D, G], sourceX: 16, sourceY: 14, length: 2 },
			{ connections: [D, D, 
							D, G], sourceX: 18, sourceY: 14, length: 1 },
			{ connections: [G, G, 
							G, D], sourceX: 0, sourceY: 15, length: 2 },
			{ connections: [D, G, 
							G, D], sourceX: 2, sourceY: 15, length: 2 },
			{ connections: [G, D, 
							G, D], sourceX: 4, sourceY: 15, length: 3 },
			{ connections: [D, D, 
							G, D], sourceX: 7, sourceY: 15, length: 1 },
			{ connections: [G, G, 
							D, D], sourceX: 8, sourceY: 15, length: 3 },
			{ connections: [D, G, 
							D, D], sourceX: 11, sourceY: 15, length: 2 },
			{ connections: [G, D, 
							D, D], sourceX: 13, sourceY: 15, length: 2 },
			// water
			{ connections: [W, W, 
							W, W], sourceX: 5, sourceY: 17, length: 3 },
			{ connections: [W, D, 
							D, D], sourceX: 16, sourceY: 10, length: 2 },
			{ connections: [D, W, 
							D, D], sourceX: 18, sourceY: 10, length: 2 },
			{ connections: [W, W, 
							D, D], sourceX: 1, sourceY: 11, length: 3 },
			{ connections: [D, D, 
							W, D], sourceX: 4, sourceY: 11, length: 2 },
			{ connections: [W, D, 
							W, D], sourceX: 6, sourceY: 11, length: 3 },
			{ connections: [D, W, 
							W, D], sourceX: 9, sourceY: 11, length: 1 },
			{ connections: [W, W, 
							W, D], sourceX: 10, sourceY: 11, length: 2 },
			{ connections: [D, D, 
							D, W], sourceX: 12, sourceY: 11, length: 2 },
			{ connections: [W, D, 
							D, W], sourceX: 14, sourceY: 11, length: 1 },
			{ connections: [D, W, 
							D, W], sourceX: 15, sourceY: 11, length: 3 },
			{ connections: [W, W, 
							D, W], sourceX: 18, sourceY: 11, length: 2 },
			{ connections: [D, D, 
							W, W], sourceX: 1, sourceY: 12, length: 3 },
			{ connections: [W, D, 
							W, W], sourceX: 4, sourceY: 12, length: 2 },
			{ connections: [D, W, 
							W, W], sourceX: 6, sourceY: 12, length: 2 },
			{ connections: [D, W, 
							W, D], sourceX: 8, sourceY: 12, length: 1 },
			{ connections: [W, D, 
							D, W], sourceX: 9, sourceY: 12, length: 1 },
			// ocean
			{ connections: [O, O, 
							O, O], sourceX: 8, sourceY: 17, length: 3 },
			{ connections: [O, W, 
							W, W], sourceX: 15, sourceY: 15, length: 2 },
			{ connections: [W, O, 
							W, W], sourceX: 17, sourceY: 15, length: 2 },
			{ connections: [O, O, 
							W, W], sourceX: 0, sourceY: 16, length: 3 },
			{ connections: [W, W, 
							O, W], sourceX: 3, sourceY: 16, length: 2 },
			{ connections: [O, W, 
							O, W], sourceX: 5, sourceY: 16, length: 3 },
			{ connections: [W, O, 
							O, W], sourceX: 8, sourceY: 16, length: 2 },
			{ connections: [O, O, 
							O, W], sourceX: 10, sourceY: 16, length: 1 },
			{ connections: [W, W, 
							W, O], sourceX: 11, sourceY: 16, length: 2 },
			{ connections: [O, W, 
							W, O], sourceX: 13, sourceY: 16, length: 2 },
			{ connections: [W, O, 
							W, O], sourceX: 15, sourceY: 16, length: 3 },
			{ connections: [O, O, 
							W, O], sourceX: 18, sourceY: 16, length: 1 },
			{ connections: [W, W, 
							O, O], sourceX: 0, sourceY: 17, length: 3 },
			{ connections: [O, W, 
							O, O], sourceX: 3, sourceY: 17, length: 1 },
			{ connections: [W, O, 
							O, O], sourceX: 4, sourceY: 17, length: 1 },
			{ connections: [W, W, 
							O, O], sourceX: 0, sourceY: 17, length: 3 }
		];
		return set;
		console.log(set)
	}
}

Game.Tiles.Type = {
	Dirt: { id: 0 },
	Water: { id: 1 },
	Grass: { id: 2 },
	Shade: { id: 3 },
	LongGrass: { id: 4 },
	Ocean: { id: 5 },
	equals: function(type1, type2) {
		if (type2 == null) return false;
		if (type1.length == undefined)
			return type1.id == type2.id;
		for (var i=0;i<type1.length;i++) {
			if (!Game.Tiles.Type.equals(type1[i], type2.length==undefined? type2: type2[i]))
				return false;
		}
		return true;
	},
	find: function (type1, type2) {
		for (var i=0;i<type1.length;i++) {
			if (Game.Tiles.Type.equals(type1[i], type2))
				return true;
		}
		return false;
	}
}
Game.Tiles.Type.Dirt.base = null;
Game.Tiles.Type.Water.base = Game.Tiles.Type.Dirt;
Game.Tiles.Type.Ocean.base = Game.Tiles.Type.Water;
Game.Tiles.Type.Grass.base = Game.Tiles.Type.Dirt;
Game.Tiles.Type.Shade.base = Game.Tiles.Type.Dirt;
Game.Tiles.Type.LongGrass.base = Game.Tiles.Type.Grass;

Game.Tiles.Tile = class extends Framework.Element {
	constructor(options) {
		super(options);
		this.connections = [null, null, null, null];
		this.hoversprite = new Framework.Sprite.Rectangle({ colour: '#FF0',  alpha:0.1, fill: true, radius: 18 });
	}

	draw(a) {
		super.draw(a);
		if (this.hovered)
			this.hoversprite.draw(this.calculatedX, this.calculatedY, this.width, this.height, this.alpha*a);
	}
}