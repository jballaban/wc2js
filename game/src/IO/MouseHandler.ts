import { Mouse } from "./Mouse";
import { Runtime } from "../Core/Runtime";

export class MouseHandler {

	public static x: number = 0;
	public static y: number = 0;
	public static locked: boolean = false;

	public static init(): void {
		document.addEventListener("mousemove", MouseHandler.mouseMove);
		document.addEventListener("pointerlockchange", MouseHandler.lockChanged);
		document.body.onclick = document.body.requestPointerLock;
	}

	public static mouseMove(e: any): void {
		if (MouseHandler.locked) {
			Runtime.screen.mouse.onMove(e.movementX, e.movementY);
		}
	}

	public static lockChanged(): void {
		MouseHandler.locked = document.pointerLockElement != null;
	}

}