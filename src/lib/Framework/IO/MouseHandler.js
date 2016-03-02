"use strict";
/**
Handler class for the mouse object and reacts to events & state change
@namespace
@listens mousedown
@listens mouseup
@listens mousemove
@listens pointerlockchange
@todo update private methods
@example
var handler = Framework.Mouse.MouseHandler;
handler.update(currentScreen); // current screen object
handler.draw();
**/
Framework.IO.MouseHandler = {
	init: function(maxX, maxY) {
		this.setMaxX(maxX);
		this.setMaxY(maxY);
		this._x = 0;
		this._y = 0;
		this._focus = null;
		this._mouse = null;
		this._locked = false;
		document.addEventListener('mousedown', function(e){
			Framework.IO.MouseHandler.mouseDown(e);
		}.bind(this));

		document.addEventListener('mousemove', function(e) { 
			Framework.IO.MouseHandler.mouseMove(e); 
		});

		document.addEventListener('mouseup', function(e) {
			Framework.IO.MouseHandler.mouseUp(e);
		}.bind(this));

		document.addEventListener('pointerlockchange', function(){
			this.needsLock = (document.pointerLockElement === null);
		}.bind(this));
	},

	setMaxX: function(x) {
		new Framework.Util.Val(x).is(Number).req().between(0, null);
		this._maxX = x;
	},

	setMaxY: function(y) {
		new Framework.Util.Val(y).is(Number).req().between(0, null);
		this._maxY = y;
	},

	/**
	Determines if the mouse should be locked (virtual) or not (default)
	@param {boolean} lock - True locks the mouse so movement is virtual.  False releases the mouse to default.
	@fires document.body.requestPointerLock - for locking
	@fires document.exitPointerLock - for releasing
	**/
	setLock: function(lock) {
		new Framework.Util.Val(lock).is(Boolean).req();
		this._locked = lock;
		if (lock)
			document.body.requestPointerLock();
		else
			document.exitPointerLock();
	},

	/**
	Resets the current mouse focus and object
	@param {Framework.Mouse.Mouse} mouse - The mouse element to attach
	**/
	bind: function(mouse) {
		new Framework.Util.Val(mouse).is(Framework.IO.Mouse).req();
		this._focus = null;
		this._mouse = mouse;
	},

	/**
	Updates the provided screen based on the mouse position
	@param {Framework.Screen} screen - The screen to apply the mouse to
	**/
	update: function(screen) {
		new Framework.Util.Val(screen).is(Framework.UI.Screen).req();
		var newfocus = screen.elementAt(this._x, this._y);
		if (newfocus != this._focus) {
			// TODO: This mouseOut may not be accurate?
			if (this._focus != null)
				this._focus.mouseOut();
			this._focus = newfocus;
			if (this._focus != null) {
				this._focus.mouseOver();
				this._mouse = this._focus.mouse;
				if (this._mouse != null)
					this._mouse.move(this._x, this._y);
			}
		}
	},

	/**
	 the mouse to screen
	**/
	draw: function() {
		if (this._mouse != null)
			this._mouse.draw();
	},

	/**
	Called when on mouse left button release.  Proxy for {@link Framework.Mouse.Mouse#up}
	**/
	mouseUp: function(e) {
		if (this._mouse != null)
			this._mouse.up(this._focus);
	},

	/**
	Called when on mouse move.  Proxy for {@link Framework.Mouse.Mouse#move}
	**/
	mouseMove: function(e) {
		if(!this._locked){
			this._x = e.clientX;
			this._y = e.clientY;
		}
		else{
			this._x += e.movementX;
			this._y += e.movementY;
			if(this._x < 0) {
				this._x = 0;
			}else if(this._x >= this._maxX){
				this._x = this._maxX-1;
			}
			if(this._y < 0) {
				this._y = 0;
			}else if(this._y >= this._maxY){
				this._y = this._maxY-1;
			}
		}
		if (this._mouse != null)
			this._mouse.move(this._x, this._y);
	},

	/**
	Called when on mouse left button press.  Proxy for {@link Framework.Mouse.Mouse#down}
	**/
	mouseDown: function(e) {
		e.preventDefault();
		if (this._mouse != null)
			this._mouse.down();
	}
}


describe('Framework.IO.MouseHandler', function() {
	it('#init', function() {
		// called in test.js
		assert.equal(Framework.IO.MouseHandler._maxX, 100);
		assert.equal(Framework.IO.MouseHandler._maxY, 100);
	});

	it ('#setmaxX,setMaxY,setLock,bind', function() {
		Framework.IO.MouseHandler.setMaxX(105);
		assert.equal(Framework.IO.MouseHandler._maxX, 105);
		assert.equal(Framework.IO.MouseHandler._locked, false);
		Framework.IO.MouseHandler.setLock(true);
		assert.equal(Framework.IO.MouseHandler._locked, true);
		Framework.IO.MouseHandler.bind(new Framework.IO.Mouse(Framework.UI.Cursor.Invisible));
	});

	it ('#mouseUp,mouseDown,mouseMove', function() {
		var e = {
			preventDefault: function () {}
		}
		Framework.IO.MouseHandler.mouseUp(e);
		Framework.IO.MouseHandler.mouseDown(e);
		Framework.IO.MouseHandler.mouseMove(5, 5);
	});

	it ('#update,draw', function() {
		// Framework.IO.MouseHandler.update();
		Framework.IO.MouseHandler.draw();
	});
});