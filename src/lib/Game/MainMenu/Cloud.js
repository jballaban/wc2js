"use strict";
/**
Cloud effect
@extends Framework.UI.Element
**/
Game.MainMenu.Cloud = class extends Framework.UI.Element {
	constructor(inc) {
		new Framework.Util.Val(inc).is(Number).between(1,3).req();
		super(runtime.canvas.foreground, {
			sprite: new Framework.UI.Image(runtime.canvas.foreground, 'asset/MainMenu/cloud_'+inc+'.png'),
			width: inc==1?1118:inc==2?1186:1459,
			height: inc==1?448:inc==2?479:473,
			alpha: 0
		});
	}

	/**
	Called to start animations once the element has been attached to a screen
	**/
	attach() {
		this._cycle();
	}

	_cycle() {
		this.clearAnimations();
		this.x = Framework.Util.Math.random(-1000, this.parent == null ? 0 : this.parent.width-700);
		var screenheight = this.parent == null ? 0 : this.parent.height;
		this.y = Framework.Util.Math.random(screenheight-400, screenheight);
		this.addAnimation(new Framework.Util.Animate(this, 'alpha', 1, runtime.getTicks(Framework.Util.Math.random(5000, 7000))), function() {
			this.addAnimation(new Framework.Util.Animate(this, 'alpha', 0, runtime.getTicks(Framework.Util.Math.random(1000, 10000))), function() {
				this._cycle();
			}.bind(this));
		}.bind(this));
		this.addAnimation(new Framework.Util.Animate(this, 'y', -499, runtime.getTicks(30000)));
	}
}