"use strict";
Game.Screen.Intro = class extends Framework.UI.Screen {
	constructor () {
		super(runtime.canvas);
		this._video = new Framework.IO.Video('asset/intro.mp4', 0, 0, 0, 0, { 
			callback: function() { 
				console.log('done');
			}.bind(this),
			autoplay: false
		});
		this._playing = false;
	}

	update() {
		if (!this._playing) {
			this._playing = true;
			this._video.play();
		}
		super.update();
	}

	set width(val) {
		super.width = val;
		if (this._video != null)
			this._video.width = val;
	}

	set height(val) {
		super.height = val;
		if (this._video != null)
			this._video.height = val;
	}
}