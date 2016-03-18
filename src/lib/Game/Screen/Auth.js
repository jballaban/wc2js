"use strict";
/**
Holding screen while we auth the user
@extends Framework.UI.Screen
**/
Game.Screen.Auth = class extends Framework.UI.Screen {
	
	constructor() {
		super(runtime.canvas);
	}

	/**
	Called once authentication is complete
	@overrides
	**/
	loaded() {
		Game.transition.screen(new Game.Screen.MainMenu);
	}

	/**
	Attaches loading indicator
	@overrides
	**/
	attach() {
		this._loading = Framework.Util.DOM.addDiv('loading');
		super.attach();
	}

	/**
	Removes loading indicator
	@overrides
	**/
	destroy() {
		Framework.Util.DOM.removeElement(this._loading);
		super.destroy();
	}
}