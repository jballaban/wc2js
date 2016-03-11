"use strict";
Game.Screen.Intro = class extends Framework.UI.Screen {
	constructor () {
		super(runtime.canvas);
		this._video = new Framework.IO.Video('asset/intro.mp4', 0, 0, 0, 0, { 
			callback: function() { 
				console.log('done');
			}.bind(this),
			autoplay: true
		});
	}

	resize(width, height) {
		super.resize(width, height);
		if (this._video != null) {
			this._video.width = this.width;
			this._video.height = this.height;
		}
	}

}