"use strict";
/**
Introduction video screen
@extends Framework.UI.Screen
**/
Game.Screen.Intro = class extends Framework.UI.Screen {

	constructor () {
		super(runtime.canvas);
	}

	/**
	Resizes the video DOM to match screen
	@param {number} width
	@param {number} height
	@overrides
	**/
	resize(width, height) {
		super.resize(width, height);
		if (this._video != null) {
			this._video.width = this.width;
			this._video.height = this.height;
		}
	}

	/**
	Attaches the video DOM and starts playing it
	@overridesx
	**/
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

	/**
	Cleans up the video DOM
	@overrides
	**/
	destroy() {
		this._video.destroy();
		super.destroy();
	}
}