"use strict";
/**
Video player
**/
Framework.UI.Video = class {
	/**
	@param {string} src - Asset source
	@param {number} x - X position
	@param {number} y - Y position
	@param {number} width - Width
	@param {number} height - Height
	@param {object} [options] - Optional default overrides
	@param {bool} [options.autoplay=false] - Autoplay
	@param {bool} [options.loop=false] - Loop
	@param {function} [options.callback] - Callback on play complete
	**/
	constructor(src, x, y, width, height, options) {
		var _options = new Framework.Util.Val(options).is(Object);
		this._video = Framework.Util.DOM.addVideo(
			new Framework.Util.Val(src).is(String).req().val(),
			new Framework.Util.Val(x).is(Number).req().val(),
			new Framework.Util.Val(y).is(Number).req().val(),
			new Framework.Util.Val(width).is(Number).req().val(),
			new Framework.Util.Val(height).is(Number).req().val(),
			_options.item('autoplay').is(Boolean).val(false),
			_options.item('loop').is(Boolean).val(false),
			_options.item('callback').is(Function).val()
		)
	}

	/**
	Updates the DOM width
	@type {number}
	**/
	set width(val) {
		Framework.Util.DOM.setAttribute(this._video, 'width', val);
	}

	/**
	Updates the DOM height
	@type {number}
	**/
	set height(val) {
		Framework.Util.DOM.setAttribute(this._video, 'height', val);
	}

	/**
	Cleans up the DOM
	**/
	destroy() {
		Framework.Util.DOM.removeElement(this._video);
	}

	/**
	Starts video
	**/
	play() {
		this._video.play();
	}

	/**
	Stops video
	**/
	stop() {
		this._video.pause();
	}
}

describe('Framework.UI.Video', function() {
	it('#constructor,loop,autoplay,destroy', function() {
		var el = new Framework.UI.Video('asset/noise.mpg', 0, 0, 100, 100);
		var el2 = new Framework.UI.Video('asset/noise.mpg', 0, 0, 100, 100, { loop: true, autoplay: true });
		el.destroy();
	});

	it('#play,stop', function() {
		var el = new Framework.UI.Video('asset/noise.mpg', 0, 0, 100, 100);
		el.play();
		el.stop();
	});
});