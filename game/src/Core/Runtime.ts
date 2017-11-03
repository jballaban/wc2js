import { Logger, Level } from "../Util/Logger";
import { Game } from "../Game";
import { Screen } from "../UI/Screen";
import { Camera } from "./Camera";
import { ContextLayer } from "./ContextLayer";
import { MouseHandler } from "../IO/MouseHandler";

export class Runtime {

	private static last: number;
	public static screen: Screen;
	private static fps: FPSMeter;
	public static ctx: ContextLayer;
	public static play: boolean;

	public static init(): void {
		Runtime.ctx = new ContextLayer(1);
		window.onresize = Runtime.onWindowResize;
		Runtime.fps = new FPSMeter(null, {
			decimals: 0,
			graph: 1,
			left: "5px"
		});
		MouseHandler.init();
		Runtime.play = false;
	}

	public static onWindowResize(): void {
		Runtime.screen.onResize();
		Runtime.ctx.resize();
	}

	public static start(startscreen: Screen): void {
		while (Runtime.screen != null) { // wait for previous screen to finish up their frame
			Runtime.play = false;
		}
		Runtime.screen = startscreen;
		Runtime.screen.onActivate();
		Runtime.last = window.performance.now();
		Runtime.play = true;
		requestAnimationFrame(Runtime.frame);
	}

	public static update(step: number): void {
		Runtime.screen.update(step);
	}

	public static render(): void {
		Runtime.screen.render();
	}

	private static frame(now: number): void {
		if (!Runtime.play) {
			Runtime.screen = null;
			return;
		}
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