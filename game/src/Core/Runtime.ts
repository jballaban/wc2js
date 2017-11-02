import { Logger, Level } from "../Util/Logger";
import { Game } from "../Game";
import { Screen } from "../UI/Screen";
import { Camera } from "./Camera";
import { ContextLayer } from "./ContextLayer";
import { MouseHandler } from "../IO/MouseHandler";

export class Runtime {

	private static last: number;
	private static _screen: Screen;
	private static fps: FPSMeter;
	public static ctx: ContextLayer;

	public static init(): void {
		Runtime.ctx = new ContextLayer(1);
		window.onresize = Runtime.onWindowResize;
		Runtime.fps = new FPSMeter(null, {
			decimals: 0,
			graph: 1,
			left: "5px"
		});
		MouseHandler.init();
	}

	public static onWindowResize(): void {
		Runtime.screen.onResize();
		Runtime.ctx.resize();
	}

	public static get screen(): Screen {
		return Runtime._screen;
	}

	public static set screen(screen: Screen) {
		Runtime._screen = screen;
		screen.onActivate();
	}

	public static start(startscreen: Screen): void {
		Runtime.screen = startscreen;
		Runtime.last = window.performance.now();
		requestAnimationFrame(Runtime.frame);
	}

	public static update(step: number): void {
		Runtime.screen.update(step);
	}

	public static render(): void {
		Runtime.screen.render();
	}

	private static frame(now: number): void {
		Runtime.fps.tickStart();
		//	Runtime.dt += Math.min(1, (now - Runtime.last) / 1000);
		Runtime.update(Math.min(1, (now - Runtime.last) / 1000));
		/* while (Runtime.dt > Runtime.step) {
			Runtime.dt = Runtime.dt - Runtime.step;
			Runtime.update(Runtime.step);
		} */
		Runtime.render();
		Runtime.last = now;
		Runtime.fps.tick();
		requestAnimationFrame(Runtime.frame);
	}

}