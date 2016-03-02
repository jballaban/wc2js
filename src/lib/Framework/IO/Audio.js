"use strict";
Framework.IO.Audio = class {
	constructor(src, options) {
		var _options = new Framework.Util.Val(options).is(Object);
	    var audio = document.createElement('audio');
	    audio.setAttribute('hidden', 'true');
	    var source = document.createElement('source');
	    source.setAttribute('src', new Framework.Util.Val(src).is(String).req().val());
	    source.setAttribute('type', 'audio/mpeg');
	    audio.appendChild(source);
    	this._audio = audio;
    	this.autoplay = _options.item('autoplay').is(Boolean).val(false);
    	this.loop = _options.item('loop').is(Boolean).val(false);
    	document.body.appendChild(audio);
	}

	destroy() {
		this._audio.parentNode.removeChild(this._audio);
	}

	play() {
		this._audio.play();
	}

	set loop(val) {
		this._loop = val;
		if (val)
			this._audio.setAttribute('loop', 'true');
		else
			this._audio.removeAttribute('loop');
	}

	stop() {
		this._audio.pause();
	}

	set autoplay(val) {
		this._autoplay = val;
		if (val)
			this._audio.setAttribute('autoplay', 'true');
		else
			this._audio.removeAttribute('autoplay');
	}
}

describe('Framework.IO.Audio', function() {
	it('#constructor,loop', function() {
		var el = new Framework.IO.Audio('asset/noise.mpg');
		var el2 = new Framework.IO.Audio('asset/noise.mpg', { loop: true, autoplay: true });
		assert.equal(el._loop, false);
		assert.equal(el._autoplay, false);
		assert.equal(el2._loop, true);
		assert.equal(el2._autoplay, true);
	});

	it('#play,stop', function() {
		var el = new Framework.IO.Audio('asset/noise.mpg');
		el.play();
		el.stop();
	});
});