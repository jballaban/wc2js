"use strict";
/**
Cloud effect
@extends Framework.UI.Element
**/
Game.MainMenu.Cloud = class extends Framework.UI.Element {
	constructor(inc) {
		new Framework.Util.Val(inc).is(Number).between(1,3).req();
		super(runtime.canvas, {
			sprite: new Framework.UI.Image(runtime.canvas, 'asset/MainMenu/cloud_'+inc+'.png'),
			width: '1477',
			height: '499',
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
		this.x = Framework.Util.Math.random(-1000, this.parent == null ? 1477 : this.parent.width);
		this.y = Framework.Util.Math.random(-400, this.parent == null ? 400 : this.parent.height-200);
		this.addAnimation(new Framework.Util.Animate(this, 'alpha', 1, runtime.getTicks(Framework.Util.Math.random(5000, 7000))), function() {
			this.addAnimation(new Framework.Util.Animate(this, 'alpha', 0, runtime.getTicks(Framework.Util.Math.random(5000, 15000))), function() {
				this._cycle();
			}.bind(this));
		}.bind(this));
		this.addAnimation(new Framework.Util.Animate(this, 'x', -1000, runtime.getTicks(30000)));
	}
}