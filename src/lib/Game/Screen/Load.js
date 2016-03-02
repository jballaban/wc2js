"use strict";
Game.Screen.Load = class extends Framework.UI.Screen {
	constructor(runtime, nextscreen) {
		super(runtime.canvas, {
			sprite: new Framework.UI.Image(runtime.canvas, 'asset/cover.jpg'),
			alpha: 0
		});
		this.addAnimation(new Framework.Util.Animate(this, 'alpha', 1, runtime.getTicks(3000)), function() {
			this.addAnimation(new Framework.Util.Animate(this, 'alpha', 0, runtime.getTicks(3000)), function() {
				runtime.setScreen(nextscreen);
			});
		}.bind(this));
	}
}