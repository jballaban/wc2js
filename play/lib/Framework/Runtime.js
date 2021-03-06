"use strict";
/**
Runtime controller
**/
Framework.Runtime = class {
	/**
	@param {?object} [options] - Default values
	@param {?number} [options.updatespersecond=60] - The number of updates that should be attempted to do per second.
	**/
	constructor(canvas, options) {
		var _options = new Framework.Util.Val(options).is(Object);
		this._millisecondsperupdate = 1000 / (_options.item('updatespersecond').is(Number).between(0, null).val(60));
		this._last = window.performance.now();
		this._updatemillisecondsremaining = 0;
		this._canvas = new Framework.Util.Val(canvas).is(Object).val();
		this._screen = null;
		this._resize();
		Framework.IO.MouseHandler.init(0, 0);
		window.onresize = this._resize.bind(this);
	}

	/**
	Current screen
	@type {Framework.UI.Screen}
	**/
	get screen() {
		return this._screen;
	}

	/**
	Current draw canvas
	@type {object}
	**/
	get canvas() {
		return this._canvas;
	}

	/**
	Calculates the number of ticks required for specific duration
	@param {number} duration - Time in milliseconds
	@returns {number}
	**/
	getTicks(duration) {
		return Math.ceil(duration / this._millisecondsperupdate);
	}

	/**
	Attemps to take over fullscreen control
	**/
	setFullscreen() {
		document.documentElement.webkitRequestFullscreen();
	}

	/**
	Changes current screen.  Will call destroy on old screen and then attach on new one.
	@param {Framework.UI.Screen} screen - The new screen
	**/
	setScreen(screen) {
		screen.resize(this._width, this._height);
		Framework.IO.MouseHandler.setMaxX(screen.width);
		Framework.IO.MouseHandler.setMaxY(screen.height);
		if (this._screen != null)
			this._screen.destroy();
		this._screen = new Framework.Util.Val(screen).is(Framework.UI.Screen).req().val();
		this._screen.attach();
	}

	/**
	Resizes the current screen / canvas to current browser size
	**/
	_resize() {
		this._width = window.innerWidth;
		this._height = window.innerHeight;
		this.canvas.resize(this._width, this._height);
		if (this._screen != null)
			this._screen.resize(this._width, this._height);
	}

	_update () {
		this._screen.update();
		Framework.IO.MouseHandler.update(this._screen);
	}

	_draw () {
		this._screen.draw(1);
		Framework.IO.MouseHandler.draw();
	}

	_sleep (milliseconds) {
	  var start = new Date().getTime();
	  for (var i = 0; i < 1e7; i++) {
	    if ((new Date().getTime() - start) > milliseconds){
	      break;
	    }
	  }
	}

	_frame () {
		let now = window.performance.now();
		let dt = now - this._last + this._updatemillisecondsremaining; // number of milliseconds passed + remainder from last frame
		let updates = Math.floor(dt / this._millisecondsperupdate);
		this._updatemillisecondsremaining = dt - updates * this._millisecondsperupdate;
		for (let i=0; i<updates; i++)
			this._update();
		this._draw();
		this._last = now;
		Framework.FPS.tick();
	}

	/**
	Starts the game cycle
	**/
	start () {
		Framework.FPS.tickStart();
		this._frame();
		setInterval(function() { this._frame(); }.bind(this), 0);
	}	
}

describe('Framework.Runtime', function() {
	it('#all', function() {
		
	});
});