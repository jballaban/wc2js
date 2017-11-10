import { Point } from "../Shape/Point";
import { Rectangle } from "../Shape/Rectangle";
import { Logger } from "../Util/Logger";

export class Viewport {
	public area: Rectangle;
	private static _current: Viewport;
	private resizeX: number = null;
	private resizeY: number = null;

	public constructor() {
		this.area = new Rectangle(new Point(0, 0), new Point(0, 0));
	}

	public activate(): void {
		window.onresize = this.resize.bind(this);
		this.resize();
	}

	public resize(): void {
		this.resizeX = window.innerWidth;
		this.resizeY = window.innerHeight;
	}

	public preRender(): void {
		this.area.clearChanged();
	}

	public preUpdate(): void {
		if (this.resizeX != null || this.resizeY != null) {
			this.area.bottomRight.move(this.resizeX, this.resizeY);
			this.resizeX = this.resizeY = null;
		}
	}

}