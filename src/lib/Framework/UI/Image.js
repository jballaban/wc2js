"use strict";
/**
Defines an on-disk image to display
@example
<caption>Single sprite</caption>
var img = new Framework.UI.Image(Runtime.canvas, {alpha: 0.8, src: '/asset/person.jpg'}); // loads person.jpg at 80% alpha
rectangle.draw(100, 100, 10, 10, 1); // draw the image at point (100,100) and scales it to (10,10) at 100% of original alpha
@example
<caption>Spritesheet</caption>
var img = new Framework.UI.Image(
	Runtime.canvas, {
		alpha: 1, 
		src: '/asset/person_walking.jpg', 
		frames: [
			{ x: 0, y: 0, w: 10, h: 10 }, { x: 10, y: 0, w: 10, h: 10} // defines a sheet with a single row of 3 frames each (10x10)
		]
	}); // loads person_walking.jpg spritesheet at 100% alpha
img.draw(100, 100, 10, 10, 1); // draw the first frame of the spritesheet at point (100,100) and scales it to (10,10) at 100% of original alpha
img.nextFrame();
img.draw(100, 100, 10, 10, 1); // draws frame 2
img.nextFrame();
img.draw(100, 100, 10, 10, 1); // draws frame 3
img.nextFrame();
img.draw(100, 100, 10, 10, 1); // draws frame 1
@requires Framework/UI/UI.js
**/
Framework.UI.Image = class extends Framework.UI.iDrawable {
	/**
	@param {Object} canvas - Canvas element to draw to
	@param {Object} [options] - Set of default properties
	@param {string} options.src - The URL of the image (or spritesheet) to display
	@param {Object[]} [options.frames] - Splits src into a spritesheet.  Each element contains an x,y,w,h that crops the src sprite.
	@param {decimal} [options.alpha=1] - Seed for alpha
	**/
	constructor(canvas, src, options) {
		var _options = new Framework.Util.Val(options).is(Object);
		super(canvas, _options.item('alpha').val(1));
		this._frames = _options.item('frames').is(Array).val([]);
		this._frame = 0;
		this._src = new Image();
		this._src.src = new Framework.Util.Val(src).is(String).req().val();
	}

	/** Forces the specific frame **/
	setFrame(val) {
		this._frame = new Framework.Util.Val(val).is(Number).between(0, this._frames.length-1).val();
	}

	/**
	Pushes the current frame index to the next frame (will automatically cycle when at the end)
	**/
	nextFrame() {
		this._frame++;
		if (this._frame >= this._frames.length)
			this._frame = 0;
	}

	/**
	Draws the object to screen
	@param {number} x - Left X coordinate of the screen to draw at
	@param {number} y - Top Y coordinate of the screen to draw at
	@param {number} w - Width to scale the image
	@param {number} h - Height to scale the image
	@param {decimal} a - Alpha to apply on-top of the existing object alpha setting (0 = transparent, 1 = opaque)
	**/
	draw(x, y, w, h, a) {
		this._canvas.globalAlpha = this._alpha * a;
		if (this._frames.length == 0)
			this._canvas.drawImage(this._src, x, y, w, h);
		else {
			this._canvas.drawImage(this._src, 
				this._frames[this._frame].x, 
				this._frames[this._frame].y, 
				this._frames[this._frame].w || w, 
				this._frames[this._frame].h || h, 
				x, y, w, h);
		}
	}
}

describe('Framework.UI.Image', function() {
	it('#constructor', function() {
		var image = new Framework.UI.Image(runtime.canvas, 'url');
	});

	it('#setFrame,nextFrame', function() {
		var image = new Framework.UI.Image(runtime.canvas, 'url', {
			frames: [
				{ x: 0, y: 0, w: 10, h: 10},
				{ x: 10, y: 0, w: 10, h: 10}
			]
		});
		assert.equal(image._frame, 0);
		image.nextFrame();
		assert.equal(image._frame, 1);
		image.nextFrame();
		assert.equal(image._frame, 0);
		image.setFrame(1);
		assert.equal(image._frame, 1);
	});

	it('#draw', function() {
		var image = new Framework.UI.Image(runtime.canvas, 'url');
		image.draw(10, 10, 5, 5, 0.5);
		var image2 = new Framework.UI.Image(runtime.canvas, 'url', {
			frames: [
				{ x: 0, y: 0, w: 10, h: 10},
				{ x: 10, y: 0, w: 10, h: 10}
			]
		});
		image2.nextFrame();
		image2.nextFrame();
		image2.draw(10, 10, 5, 5, 0.5);
	});
});