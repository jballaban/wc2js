import { Point } from "../Shape/Point";
import { Logger } from "../Util/Logger";
import { Runtime } from "../Core/Runtime";
import { Rectangle } from "../Shape/Rectangle";
import { ContextLayer } from "../Core/ContextLayer";
import { ElementRegion } from "./ElementContainer";
import { EventHandler } from "./EventHandler";
import { Viewport } from "./Viewport";
import { Screen } from "../Core/Screen";

export class Camera {
	public area: Rectangle;

	public constructor(private viewport: Viewport) {
		var origin: Point = new Point(0, 0);
		this.area = new Rectangle(origin, new Point(viewport.area.width(), viewport.area.height(), origin));
	}

	public preUpdate(): void {
		if (this.viewport.area.changed()) {
			this.area.bottomRight().move(this.viewport.area.width(), this.viewport.area.height());
		}
	}

	public preRender(): void {
		this.area.clearChanged();
	}

}