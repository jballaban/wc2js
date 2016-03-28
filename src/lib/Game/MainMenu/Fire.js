"use strict";
/**
Fire effect
@extends Framework.UI.Element
**/
Game.MainMenu.Fire = class extends Framework.UI.Element {
	constructor() {
		super(runtime.canvas.foreground, {
			width: '100%',
			height: '100%'
		});
		this.particles = [];
		this.particle_count = 400;
		for(var i = 0; i < this.particle_count; i++)
			this.particles.push(new Game.MainMenu.Fire.Particle());
	}

	update() {
		super.update();
		for(var i = 0; i < this.particles.length; i++) {
			var p = this.particles[i];
			p.remaining_life--;
			p.radius--;
			//regenerate particles
			if(p.remaining_life < 0 || p.radius < 0)
				p = this.particles[i] = new Game.MainMenu.Fire.Particle(this.width, this.height);
			p.location.x += p.speed.x;
			p.location.y += p.speed.y;
			p.opacity = Math.round(p.remaining_life/p.life*100)/100;
		}
	}

	draw() {
		this._canvas.globalCompositeOperation = "lighter";
		for(var i = 0; i < this.particles.length; i++)
			this.particles[i].draw(this._canvas);
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
		this.life = (Math.random() > 0.5) ? Math.random()*10 : Math.random()*20;
		this.remaining_life = this.life;
		this.r = Math.round(Math.random()*255);
		this.g = Math.round(Math.random()*100);
		this.b = Math.round(Math.random()*100);
		this.opacity = 0;
	}

	draw(canvas) {
		canvas.beginPath();
		var gradient = canvas.createRadialGradient(this.location.x, this.location.y, 0, this.location.x, this.location.y, this.radius);
		gradient.addColorStop(0, "rgba("+this.r+", "+this.g+", "+this.b+", "+this.opacity+")");
		gradient.addColorStop(0.5, "rgba("+this.r+", "+this.g+", "+this.b+", "+this.opacity+")");
		gradient.addColorStop(1, "rgba("+this.r+", "+this.g+", "+this.b+", 0)");
		canvas.fillStyle = gradient;
		canvas.arc(Math.round(this.location.x), Math.round(this.location.y), this.radius, Math.PI*2, false);
		canvas.fill();
	}
}

/*

	
	

	
	
	
	
	
	
}
*/