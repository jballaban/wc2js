"use strict";
Game.Screen.Intro = class extends Framework.UI.Screen {
	constructor () {
		super(runtime.canvas);
	}

	resize(width, height) {
		super.resize(width, height);
		if (this._video != null) {
			this._video.width = this.width;
			this._video.height = this.height;
		}
	}

	attach() {
		this._video = new Framework.UI.Video('asset/intro.mp4', 0, 0, 0, 0, { 
			callback: function() {
				Game.transition.screen(new Game.Screen.MainMenu())
			}.bind(this),
			autoplay: true
		});
		this.resize(this.width, this.height);
		super.attach();
	}

	destroy() {
		this._video.destroy();
		super.destroy();
	}
}