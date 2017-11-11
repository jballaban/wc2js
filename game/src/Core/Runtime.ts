import { Logger, Level } from "../Util/Logger";
import { Game } from "../Game";
import { Screen } from "../Core/Screen";
import { Camera } from "./Camera";
import { ContextLayer } from "./ContextLayer";
import { MouseHandler } from "../IO/MouseHandler";
import { Mouse } from "../IO/Mouse";

export class Runtime {

	public static nextScreen: Screen;
	private static currentScreen: Screen;
	private static last: number;
	private static fps: FPSMeter;

	public static init(): void {
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
				if (Runtime.currentScreen != null) {
					Runtime.currentScreen.deactivate();
				}
				Runtime.currentScreen = Runtime.nextScreen;
				MouseHandler.reset();
				Runtime.currentScreen.activate();
				Runtime.nextScreen = null;
			}
			Runtime.fps.tickStart();
			if (Runtime.currentScreen != null) {
				MouseHandler.preUpdate();
				Runtime.currentScreen.preUpdate();
				Runtime.currentScreen.update(Math.min(1, (now - Runtime.last) / 1000));
				Runtime.currentScreen.postUpdate();
				Runtime.last = now;
				MouseHandler.preRender();
				Runtime.currentScreen.preRender();
				Runtime.currentScreen.render();
				Runtime.currentScreen.postRender();
			}
			Runtime.fps.tick();
			requestAnimationFrame(Runtime.frame);
		} catch (e) {
			alert(e.message + "\n" + e.stack);
			throw e;
		}
	}

}