import { Point } from "./Point";

export class Viewport {
	public bottomRight: Point;

	constructor() {
		this.bottomRight = new Point(0, 0, null);
		this.resize();
	}

	public resize(): void {
		this.bottomRight.move(window.innerWidth, window.innerHeight);
	}
}