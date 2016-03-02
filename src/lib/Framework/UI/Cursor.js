"use strict";
/**
Predefined cursor sprites
@property {object} Invisible - A cursor that cannot be seen (used to prevent null checks on a mouse object)
@property {object} Pointer - Finger pointer cursor
@example
var pointer = Framework.Mouse.Cursors.Pointer;
**/
Framework.UI.Cursor = {
	init: function(canvas) {
		Framework.UI.Cursor.Invisible = new Framework.UI.Element(canvas, { width: 1, height: 1 });
		Framework.UI.Cursor.Pointer = new Framework.UI.Element(canvas, { width: 26, height: 26, sprite: new Framework.UI.Image(canvas, 'asset/cursor.png') });
	}
}

describe('Framework.UI.Cursor', function() {
	it('#static', function() {
		assert.notEqual(Framework.UI.Cursor.Invisible, undefined);
		assert.notEqual(Framework.UI.Cursor.Pointer, undefined);
	});
});