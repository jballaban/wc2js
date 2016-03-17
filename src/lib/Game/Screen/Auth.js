"use strict";
Game.Screen.Auth = class extends Framework.UI.Screen {
	constructor() {
		super(runtime.canvas);
		this._loading = Framework.Util.DOM.addDiv('loading');
	}

	destroy() {
		Framework.Util.DOM.removeElement(this._loading);
		super.destroy();
	}
}