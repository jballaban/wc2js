import { Mouse } from "./Mouse";
import { Runtime } from "../Core/Runtime";

export class MouseHandler {

	public static x: number = 0;
	public static y: number = 0;
	public static locked: boolean = false;

	public static init(): void {
		document.addEventListener('mousemove', MouseHandler.mouseMove);
		document.addEventListener('pointerlockchange', MouseHandler.lockChanged);
		document.body.onclick = function () {
			document.body.requestPointerLock();
		}
	}

	public static mouseMove(e): void {
		if (MouseHandler.locked) {
			MouseHandler.x = Math.min(window.innerWidth, Math.max(0, MouseHandler.x + e.movementX));
			MouseHandler.y = Math.min(window.innerHeight, Math.max(0, MouseHandler.y + e.movementY));
			Runtime.screen.mouse.move(MouseHandler.x, MouseHandler.y);
		}
	}

	public static lockChanged(): void {
		MouseHandler.locked = document.pointerLockElement != null;
	}

}