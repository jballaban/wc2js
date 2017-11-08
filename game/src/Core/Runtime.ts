import { Logger, Level } from "../Util/Logger";
import { Game } from "../Game";
import { Screen } from "../UI/Screen";
import { Camera } from "./Camera";
import { ContextLayer } from "./ContextLayer";
import { MouseHandler } from "../IO/MouseHandler";
import { Mouse } from "../IO/Mouse";


export class Runtime {

	public static nextScreen: Screen;

	public static init(): void {
		Runtime.ctx = new ContextLayer(1);
		Runtime.fps = new FPSMeter(null, {
			decimals: 0,
			graph: 1,
			left: "5px"
		});
		MouseHandler.init();
		Runtime.last = window.performance.now();
		requestAnimationFrame(Runtime.frame);
	}


	public static onWindowResize(): void {
		Runtime.ctx.resize();
	}




	private static last: number;

	private static fps: FPSMeter;
	public static ctx: ContextLayer;



	private static frame(now: number): void {
		if (Runtime.nextScreen != null) {
			Screen.current = Runtime.nextScreen;
			Runtime.nextScreen = null;
		}
		Runtime.fps.tickStart();
		if (Screen.current != null) {
			// runtime.dt += Math.min(1, (now - Runtime.last) / 1000);
			Screen.current.update(Math.min(1, (now - Runtime.last) / 1000));
			/* while (Runtime.dt > Runtime.step) {
				Runtime.dt = Runtime.dt - Runtime.step;
				Runtime.update(Runtime.step);
			} */
			Screen.current.render();
		}
		Runtime.last = now;
		Runtime.fps.tick();
		requestAnimationFrame(Runtime.frame);
	}

}