"use strict";
Game.Screen.Auth = class extends Framework.UI.Screen {
	constructor() {
		super(runtime.canvas);
		this._loading = null;
	}

	set alpha(val) {
		if (this._loading != null)
			Framework.Util.DOM.setAttribute(this._loading, 'style', 'opacity:'+val);
		super.alpha = val;
	}

	get alpha() {
		return super.alpha;
	}

	loaded() {
		Game.transition.screen(new Game.Screen.MainMenu);
	}

	attach() {
		this._loading = Framework.Util.DOM.addDiv('loading');
		super.attach();
	}

	destroy() {
		Framework.Util.DOM.removeElement(this._loading);
		super.destroy();
	}
}