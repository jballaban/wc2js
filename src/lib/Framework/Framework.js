"use strict"
/**
Library container
@namespace
**/
var Framework = {
	mode: 'prod', // dev or prod,
	init: function(runtime, mode) {
		if (mode)
			Framework.mode = mode;
		this.FPS = new FPSMeter({ decimals: 0, graph: true, theme: 'dark', left: '5px' });
		Framework.UI.Cursor.init(runtime.canvas);
		console.log(Framework.mode);
	}
}