import { Mouse } from "./Mouse";
import { Runtime } from "../Core/Runtime";

export class MouseHandler {

	public static x: number = 0;
	public static y: number = 0;
	public static locked: boolean = false;

	public static init(): void {
		document.addEventListener("mousemove", MouseHandler.onMouseMove);
		document.addEventListener("touchstart", MouseHandler.onTouch);
		document.addEventListener("touchmove", MouseHandler.onTouch);
		document.addEventListener("pointerlockchange", MouseHandler.lockChanged);
		document.body.onclick = document.body.requestPointerLock;
	}

	public static onTouch(e: TouchEvent): void {
		e.preventDefault();
		Runtime.screen.mouse.move(e.touches[0].screenX, e.touches[0].screenY);
	}

	public static onMouseMove(e: MouseEvent): void {
		e.preventDefault();
		if (MouseHandler.locked) {
			Runtime.screen.mouse.inc(e.movementX, e.movementY);
		}
	}

	public static lockChanged(): void {
		MouseHandler.locked = document.pointerLockElement != null;
	}

}