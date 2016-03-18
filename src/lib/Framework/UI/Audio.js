"use strict";
Framework.UI.Audio = class {
	/**
	Creates an audio element and attaches to dom
	@param {string} src - Audio source
	@param {object} [options] - Optional parameters
	@param {bool} [options.autoplay=false] - If the audio should play immediatelly on load
	@param {bool} [options.loop=false] - If the recording should loop on end
	**/
	constructor(src, options) {
		var _options = new Framework.Util.Val(options).is(Object);
		this._audio = Framework.Util.DOM.addAudio(
			src, 
			_options.item('autoplay').is(Boolean).val(false),
			_options.item('loop').is(Boolean).val(false));
	}

	/**
	Detaches the element from dom
	**/
	destroy() {
		this._audio.parentNode.removeChild(this._audio);
	}

	/**
	Starts the recording
	**/
	play() {
		this._audio.play();
	}

	/**grunt 
	Stops recording
	**/
	stop() {
		this._audio.pause();
	}
}

describe('Framework.UI.Audio', function() {
	it('#constructor,loop', function() {
		var el = new Framework.UI.Audio('asset/noise.mpg');
		var el2 = new Framework.UI.Audio('asset/noise.mpg', { loop: true, autoplay: true });
	});

	it('#play,stop', function() {
		var el = new Framework.UI.Audio('asset/noise.mpg');
		el.play();
		el.stop();
	});
});