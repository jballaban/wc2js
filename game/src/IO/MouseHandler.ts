import { Mouse } from "./Mouse";
import { Screen } from "../Core/Screen";

export enum CursorState {
	added,
	moved,
	remove,
	unchanged
}

export class Cursor {

	public data: any;

	public constructor(
		public x: number,
		public y: number,
		public state: CursorState) { }

	public static fromTouch(e: Touch): Cursor {
		return new Cursor(e.clientX, e.clientY, CursorState.added);
	}
}

export class MouseHandler {
	private static locked: boolean = false;
	private static _cursors: Map<number, Cursor> = new Map<number, Cursor>();
	private static mouseX: number = 0;
	private static mouseY: number = 0;
	public static cursors: Map<number, Cursor> = new Map<number, Cursor>();

	public static init(): void {
		document.addEventListener("mousedown", MouseHandler.onMouseDown);
		document.addEventListener("mousemove", MouseHandler.onMouseMove);
		document.addEventListener("touchstart", MouseHandler.onTouchStart);
		document.addEventListener("touchend", MouseHandler.onTouchEnd);
		document.addEventListener("touchcancel", MouseHandler.onTouchEnd);
		document.addEventListener("touchmove", MouseHandler.onTouchMove);
		document.addEventListener("pointerlockchange", MouseHandler.lockChanged);
	}

	public static preUpdate(): void {
		// sync _cursors to cursors
		var keys: number[] = Array.from(MouseHandler._cursors.keys());
		for (var i: number = 0; i < keys.length; i++) {
			var cursor: Cursor = MouseHandler._cursors.get(keys[i]);
			switch (cursor.state) {
				case CursorState.added:
					MouseHandler.cursors.set(keys[i],
						new Cursor(
							cursor.x,
							cursor.y,
							CursorState.added
						)
					);
					break;
				case CursorState.moved:
					MouseHandler.cursors.get(keys[i]).x = cursor.x;
					MouseHandler.cursors.get(keys[i]).y = cursor.y;
					MouseHandler.cursors.get(keys[i]).state = CursorState.moved;
					break;
				case CursorState.remove:
					MouseHandler.cursors.get(keys[i]).state = CursorState.remove;
					break;
			}
			cursor.state = CursorState.unchanged;
		}
	}

	public static preRender(): void {
		var keys: number[] = Array.from(MouseHandler.cursors.keys());
		for (var i: number = 0; i < keys.length; i++) {
			var cursor: Cursor = MouseHandler.cursors.get(keys[i]);
			if (cursor.state === CursorState.remove) {
				MouseHandler._cursors.delete(keys[i]);
				MouseHandler.cursors.delete(keys[i]);
			} else {
				cursor.state = CursorState.unchanged;
			}
		}
	}

	public static onTouchStart(e: TouchEvent): void {
		e.preventDefault();
		for (var i: number = 0; i < e.changedTouches.length; i++) {
			if (MouseHandler._cursors.get(e.changedTouches[i].identifier) != null) {
				alert(e.changedTouches[i].identifier + " already exists");
			}
			MouseHandler._cursors.set(e.changedTouches[i].identifier, Cursor.fromTouch(e.changedTouches[i]));
		}
	}

	public static onTouchEnd(e: TouchEvent): void {
		e.preventDefault();
		for (var i: number = 0; i < e.changedTouches.length; i++) {
			// check if we've acked this event, if not we can just kill it before anyone notices
			if (MouseHandler.cursors.get(e.changedTouches[i].identifier) == null) {
				MouseHandler._cursors.delete(e.changedTouches[i].identifier);
			} else {
				MouseHandler._cursors.get(e.changedTouches[i].identifier).state = CursorState.remove;
			}
		}
	}

	public static onTouchMove(e: TouchEvent): void {
		e.preventDefault();
		for (var i: number = 0; i < e.changedTouches.length; i++) {
			var cursor: Cursor = MouseHandler._cursors.get(e.changedTouches[i].identifier);
			if (cursor.state === CursorState.unchanged) {
				cursor.state = CursorState.moved;
			}
			cursor.x = e.changedTouches[i].clientX;
			cursor.y = e.changedTouches[i].clientY;
		}
	}

	public static onMouseMove(e: MouseEvent): void {
		e.preventDefault();
		if (MouseHandler.locked) {
			var mouse: Cursor = MouseHandler._cursors.get(0);
			if (mouse.state === CursorState.unchanged) {
				mouse.state = CursorState.moved;
			}
			mouse.x += e.movementX;
			mouse.y += e.movementY;
		} else {
			MouseHandler.mouseX = e.clientX;
			MouseHandler.mouseY = e.clientY;
		}
	}

	public static onMouseDown(e: MouseEvent): void {
		e.preventDefault();
		if (!MouseHandler.locked) {
			document.body.requestPointerLock();
		}
	}

	public static lockChanged(): void {
		if (document.pointerLockElement != null) {
			MouseHandler._cursors.set(0, new Cursor(MouseHandler.mouseX, MouseHandler.mouseY, CursorState.added));
			MouseHandler.locked = true;
		} else {
			MouseHandler.locked = false;
			MouseHandler._cursors.get(0).state = CursorState.remove;
		}
	}

}