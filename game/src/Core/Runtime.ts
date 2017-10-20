import { Logger, Level } from "Util/Logger";
import { Game } from "Game";
import { Screen } from "UI/Screen";
import { Viewport } from "../UI/Viewport";

export class Runtime {

	public static ctx: CanvasRenderingContext2D;
	private static dt: number = 0;
	private static now: number;
	private static last: number = window.performance.now();
	private static step: number = 1 / 60;
	private static screen: Screen;
	private static fps: FPSMeter;

	public static init(): void {
		var canv: HTMLCanvasElement = document.createElement("canvas");
		document.body.appendChild(canv);
		this.ctx = canv.getContext("2d");
		Viewport.init();
		Runtime.fps = new FPSMeter(null, {
			decimals: 0,
			graph: 1,
			left: "5px"
		});
	}

	public static start(startscreen: Screen): void {
		Runtime.screen = startscreen;
		requestAnimationFrame(Runtime.frame);
	}

	public static update(step: number): void {
		Runtime.screen.update(step);
	}

	public static render(): void {
		Runtime.screen.render();
	}

	private static frame(): void {
		Runtime.fps.tickStart();
		Runtime.now = window.performance.now();
		Runtime.dt += Math.min(1, (Runtime.now - Runtime.last) / 1000);
		while (Runtime.dt > Runtime.step) {
			Runtime.dt = Runtime.dt - Runtime.step;
			Runtime.update(Runtime.step);
		}
		Runtime.render();
		Runtime.fps.tick();
		requestAnimationFrame(Runtime.frame);
	}

}