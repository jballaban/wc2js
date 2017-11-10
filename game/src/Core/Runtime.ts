import { Logger, Level } from "../Util/Logger";
import { Game } from "../Game";
import { Screen } from "../Core/Screen";
import { Camera } from "./Camera";
import { ContextLayer } from "./ContextLayer";
import { MouseHandler } from "../IO/MouseHandler";
import { Mouse } from "../IO/Mouse";

export class Runtime {

	public static nextScreen: Screen;
	private static last: number;
	private static fps: FPSMeter;
	private static ctx: ContextLayer;

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

	private static frame(now: number): void {
		try {
			if (Runtime.nextScreen != null) {
				Screen.current = Runtime.nextScreen;
				Runtime.nextScreen = null;
			}
			Runtime.fps.tickStart();
			if (Screen.current != null) {
				MouseHandler.preUpdate();
				Screen.current.preUpdate();
				Screen.current.update(Math.min(1, (now - Runtime.last) / 1000));
				Runtime.last = now;
				MouseHandler.preRender();
				Screen.current.preRender();
				Screen.current.render(Runtime.ctx.ctx);
			}
			Runtime.fps.tick();
			requestAnimationFrame(Runtime.frame);
		} catch (e) {
			alert(e.message + "\n" + e.stack);
		}
	}

}