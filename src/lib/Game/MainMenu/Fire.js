"use strict";
/**
Fire effect
@extends Framework.UI.Element
**/
Game.MainMenu.Fire = class extends Framework.UI.Element {
	constructor() {
		super(runtime.canvas, {
			width: '100%',
			height: '100%'
		});
		this.particles = [];
		this.particle_count = 600;
		for(var i = 0; i < this.particle_count; i++)
			this.particles.push(new Game.MainMenu.Fire.Particle());
	}

	update() {
		super.update();
		for(var i = 0; i < this.particles.length; i++) {
			var p = this.particles[i];
			p.remaining_life--;
			p.radius--;
			p.location.x += p.speed.x;
			p.location.y += p.speed.y;
			//regenerate particles
			if(p.remaining_life < 0 || p.radius < 0) {
				this.particles[i] = new Game.MainMenu.Fire.Particle(this.width, this.height);
			}
		}
	}

	draw() {
		this._canvas.globalCompositeOperation = "lighter";
		for(var i = 0; i < this.particles.length; i++) {
			var p = this.particles[i];
			this._canvas.beginPath();
			//changing opacity according to the life.
			//opacity goes to 0 at the end of life of a particle
			p.opacity = Math.round(p.remaining_life/p.life*100)/100
			//a gradient instead of white fill
			var gradient = this._canvas.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
			gradient.addColorStop(0, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
			gradient.addColorStop(0.5, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
			gradient.addColorStop(1, "rgba("+p.r+", "+p.g+", "+p.b+", 0)");
			this._canvas.fillStyle = gradient;
			this._canvas.arc(Math.round(p.location.x), Math.round(p.location.y), p.radius, Math.PI*2, false);
			this._canvas.fill();
		}
		this._canvas.globalCompositeOperation = "source-over";
	}
}

Game.MainMenu.Fire.Particle = class {
	constructor(width, y) {
		if (width == undefined) width = 0;
		if (y == undefined) y = 0;
		this.speed = {x: -2+Math.random()*5, y: -10+Math.random()*10};
		this.location = {x: Math.random()*width, y: y};
		this.radius = 10+Math.random()*20;
		this.life = Math.random()*20;
		this.remaining_life = this.life;
		this.r = Math.round(Math.random()*255);
		this.g = Math.round(Math.random()*100);
		this.b = Math.round(Math.random()*100);
	}
}

/*

	
	

	
	
	
	
	
	
}
*/