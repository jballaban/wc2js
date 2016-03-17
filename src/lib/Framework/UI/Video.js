"use strict";
Framework.UI.Video = class {
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

	set width(val) {
		Framework.Util.DOM.setAttribute(this._video, 'width', val);
	}

	set height(val) {
		Framework.Util.DOM.setAttribute(this._video, 'height', val);
	}

	destroy() {
		Framework.Util.DOM.removeElement(this._video);
	}

	play() {
		this._video.play();
	}

	stop() {
		this._video.pause();
	}
}

describe('Framework.UI.Video', function() {
	it('#constructor,loop,autoplay,destroy', function() {
		var el = new Framework.IO.Video('asset/noise.mpg', 0, 0, 100, 100);
		var el2 = new Framework.IO.Video('asset/noise.mpg', 0, 0, 100, 100, { loop: true, autoplay: true });
		assert.equal(el._loop, false);
		assert.equal(el._autoplay, false);
		assert.equal(el2._loop, true);
		assert.equal(el2._autoplay, true);
		el.destroy();
	});

	it('#play,stop', function() {
		var el = new Framework.IO.Video('asset/noise.mpg', 0, 0, 100, 100);
		el.play();
		el.stop();
	});
});