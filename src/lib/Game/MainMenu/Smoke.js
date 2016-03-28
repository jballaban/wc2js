"use strict";
/**
Fire effect
@extends Framework.UI.Element
**/
Game.MainMenu.Smoke = class extends Framework.UI.Element {
	constructor() {
		super(runtime.canvas.foreground, {
			width: '100%',
			height: '100%'
		});
		this.particles = [];
		for (var i=0;i<100;i++)
			this.particles.push(this.addElement(new Game.MainMenu.Smoke.Particle(runtime.canvas.foreground)));
	}

	resize() {
		super.resize();
		for (var i=0;i<this.particles.length;i++) {
			this.particles[i].x = Framework.Util.Math.random(0, this.width);
			this.particles[i].y = Framework.Util.Math.random(0, this.height);
		}
	}
}

Game.MainMenu.Smoke.Particle = class extends Framework.UI.Element {
	constructor(canvas) {
		super(canvas, {
			sprite: new Framework.UI.Image(runtime.canvas.foreground, 'asset/MainMenu/smoke.png'),
			width: 256,
			height: 256
		});
		this.reset();
	}

	reset() {
		this.x = Framework.Util.Math.random(-128, this.parent == null ? 0 : this.parent.width-128);
		this.y = this.parent == null ? 0 : this.parent.height;
		this.alpha = 1;
		this.vector = { 
			x: Framework.Util.Math.random(-2, 2), 
			y: Framework.Util.Math.random(-1, -3), 
			a: Framework.Util.Math.random(-0.01, -0.001)
		}
	}

	update() {
		this.x += this.vector.x;
		this.y += this.vector.y;
		this.alpha = Math.max(0, this.alpha+this.vector.a);
		if (this.y < -256 || this.x <-256 || this.x > this.parent.width || this.alpha == 0) {
			this.reset();
		}
		super.update();
	}
}