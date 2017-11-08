import { Point } from "../Shape/Point";
import { Logger } from "../Util/Logger";
import { Runtime } from "../Core/Runtime";
import { Rectangle } from "../Shape/Rectangle";
import { ContextLayer } from "../Core/ContextLayer";
import { ElementRegion } from "./ElementContainer";
import { EventHandler } from "./EventHandler";
import { Viewport } from "./Viewport";

export class Camera {
	public area: Rectangle;
	private viewportWatcher: Point;

	public constructor(viewport: Viewport) {
		this.viewportWatcher = new Point(0, 0, viewport.area.bottomRight());
		var origin: Point = new Point(0, 0);
		this.area = new Rectangle(origin, new Point(viewport.area.bottomRight().x(), viewport.area.bottomRight().y(), origin));
	}

	public update(): void {
		if (this.viewportWatcher.changed) {
			this.area.bottomRight().move(this.viewportWatcher.x(), this.viewportWatcher.y());
		}
	}

}