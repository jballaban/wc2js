"use strict";
/**
Object that represents the mouse position and interactions
@todo make all of the members private
**/
Framework.IO.Mouse = class {
	/**
	@param {Framework.UI.Element} element - The cursor element to attach this mouse instance too
	**/
	constructor(element){
		this.x = 0;
		this.y = 0;
		this.leftButtonPressed = false;
		this.element = new Framework.Util.Val(element).is(Framework.UI.Element).req().val();
	}

	/**
	Stub to be called when the left mouse button is no longer pressed.  Updates current state to not pressed and calls mouseClick on the currently focused element 
	@param {Framework.UI.Element} focus - The element pressed
	**/
	up(focus) {
		this.leftButtonPressed = false;
		if (focus != null)
			focus.mouseClick();
	}

	/**
	Stub to be called when the left mouse button is first pressed down and sets current button state to pressed
	**/
	down() {
		this.leftButtonPressed = true;
	}

	/**
	Stub to be called to reposition the mouse.  Updates the display elements' position to match
	@param {number} x - The screen x position of the mouse
	@param {number} y - The screen y position of the mouse
	**/
	move(x, y) {
		this.element.x = this.x = x;
		this.element.y = this.y = y;
	}
	
	/**
	Draws the mouse element at full alpha.
	**/
	draw() {
		this.element.draw(1);
	}
}

describe('Framework.IO.Mouse', function() {
	it('#constructor', function() {
		var el = new Framework.IO.Mouse(Framework.UI.Cursor.Pointer);
	});

	it('#up,down,move', function() {
		var el = new Framework.IO.Mouse(Framework.UI.Cursor.Pointer);
		assert.equal(el.leftButtonPressed, false);
		el.down();
		assert.equal(el.leftButtonPressed, true);
		el.up();
		assert.equal(el.leftButtonPressed, false);
		assert.equal(el.x, 0);
		assert.equal(el.y, 0);
		el.move(5, 6);
		assert.equal(el.x, 5);
		assert.equal(el.y, 6);
	});

	it ('#draw', function() {
		var el = new Framework.IO.Mouse(Framework.UI.Cursor.Pointer);
		el.draw();
	});
});
