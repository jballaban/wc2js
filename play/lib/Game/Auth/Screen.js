"use strict";
/**
Holding screen while we auth the user
@extends Framework.UI.Screen
**/
Game.Auth.Screen = class extends Framework.UI.Screen {
	
	constructor() {
		super(runtime.canvas.foreground);
	}

	/**
	Called once authentication is complete
	@overrides
	**/
	loaded() {
		Game.transition.screen(new Game.MainMenu.Screen());
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