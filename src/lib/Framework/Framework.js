"use strict"
/**
@namespace
**/
var Framework = {
	/**
	The current build mode.  prod = no validation, debug = full validation.
	**/
	mode: 'prod',

	/**
	Initializes the framework within a given mode (see Framework.mode)
	@param {Framework.Runtime} runtime - The runtime controller
	@param {string} mode - Build mode
	**/
	init: function(runtime, mode) {
		if (mode)
			Framework.mode = mode;
		this.FPS = new FPSMeter({ decimals: 0, graph: true, theme: 'dark', left: '5px' });
		Framework.UI.Cursor.init(runtime.canvas);
	}
}