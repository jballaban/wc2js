import { Logger, Level } from "lib/Logger";
import { Game } from "Game";
import { Screen } from "lib/Screen";

export class Runtime {

	public static ctx: CanvasRenderingContext2D;
	public static width: number;
	public static height: number;
	public static screen: Screen;

	private static dt: number = 0;
	private static now: number;
	private static last: number = window.performance.now();
	private static step: number = 1 / 60;

	public static init(): void {
		var canv: HTMLCanvasElement = document.createElement("canvas");
		document.body.appendChild(canv);
		this.ctx = canv.getContext("2d");
	}

	public static start(startscreen: Screen): void {
		window.onresize = Runtime.resize;
		this.screen = startscreen;
		this.resize();
		requestAnimationFrame(Runtime.frame);
	}

	public static update(step: number): void {
		Runtime.screen.update();
	}

	public static render(step: number): void {
		Runtime.screen.render();
	}

	private static frame(): void {
		Game.FPS.tickStart();
		Runtime.now = window.performance.now();
		Runtime.dt += Math.min(1, (Runtime.now - Runtime.last) / 1000);
		while (Runtime.dt > Runtime.step) {
			Runtime.dt = Runtime.dt - Runtime.step;
			Runtime.update(Runtime.step);
		}
		Runtime.render(Runtime.step);
		Game.FPS.tick();
		requestAnimationFrame(Runtime.frame);
	}

	private static resize(): void {
		Runtime.width = Runtime.ctx.canvas.width = window.innerWidth;
		Runtime.height = Runtime.ctx.canvas.height = window.innerHeight;
		Runtime.ctx.clearRect(0, 0, Runtime.ctx.canvas.width, Runtime.ctx.canvas.height);
		Logger.debug("Runtime: Screen resized: " + Runtime.width + ", " + Runtime.height);
		// sRuntime.screen.resize();
	}
}