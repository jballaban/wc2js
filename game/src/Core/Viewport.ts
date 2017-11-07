import { Point } from "../Shape/Point";
import { Rectangle } from "../Shape/Rectangle";
import { Logger } from "../Util/Logger";

export class Viewport {
	public area: Rectangle;
	private static _current: Viewport;
	private resizeX: number = null;
	private resizeY: number = null;

	public constructor() {
		var origin: Point = new Point(0, 0);
		this.area = new Rectangle(origin, new Point(0, 0, origin));
	}

	public static get current(): Viewport {
		return Viewport._current;
	}

	public static set current(viewport: Viewport) {
		Viewport._current = viewport;
		window.onresize = viewport.resize;
		viewport.resize();
	}

	public resize(): void {
		this.resizeX = window.innerWidth;
		this.resizeY = window.innerHeight;
	}

	public update(): void {
		if (this.resizeX != null || this.resizeY != null) {
			this.area.bottomRight().move(this.resizeX, this.resizeY);
			this.resizeX = this.resizeY = null;
		}
	}

}