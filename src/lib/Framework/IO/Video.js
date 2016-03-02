"use strict";
Framework.IO.Video = class {
	constructor(src, x, y, width, height, options) {
		var _options = new Framework.Util.Val(options).is(Object);
	    this._video = document.createElement('video');
	    var source = document.createElement('source');
	    source.setAttribute('src', new Framework.Util.Val(src).is(String).req().val());
	    source.setAttribute('type', 'video/mp4');
	    var x = new Framework.Util.Val(x).is(Number).req().val();
	    var y = new Framework.Util.Val(y).is(Number).req().val();
	    this._video.setAttribute('style', 'left:'+x+';top:'+y+';');
	    this.width = new Framework.Util.Val(width).is(Number).req().val();
	    this.height = new Framework.Util.Val(height).is(Number).req().val();
	    this._video.appendChild(source);
    	this.autoplay = _options.item('autoplay').is(Boolean).val(false);
    	this.loop = _options.item('loop').is(Boolean).val(false);
		this._callback = _options.item('callback').is(Function).val();
		if (this._callback != null) {
		    this._video.onended = function() {
		    	this._callback();
		    }.bind(this);
		}
		document.body.appendChild(this._video);
	}

	set width(val) {
		this._video.setAttribute('width', val);
	}

	set height(val) {
		this._video.setAttribute('height', val);
	}

	destroy() {
		this._video.parentNode.removeChild(this._video);
	}

	play() {
		this._video.play();
	}

	set loop(val) {
		this._loop = val;
		if (val)
			this._video.setAttribute('loop', 'true');
		else
			this._video.removeAttribute('loop');
	}

	stop() {
		this._video.pause();
	}

	set autoplay(val) {
		this._autoplay = val;
		if (val)
			this._video.setAttribute('autoplay', 'true');
		else
			this._video.removeAttribute('autoplay');
	}
}

describe('Framework.IO.Video', function() {
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