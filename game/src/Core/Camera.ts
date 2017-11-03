import { Point } from "../Shape/Point";
import { Logger } from "../Util/Logger";
import { Runtime } from "../Core/Runtime";
import { Rectangle } from "../Shape/Rectangle";
import { ContextLayer } from "../Core/ContextLayer";
import { ElementRegion } from "./ElementContainer";
import { EventHandler } from "./EventHandler";

export class Camera {
	public area: Rectangle;

	public constructor() {
		var origin: Point = new Point(0, 0, null);
		this.area = new Rectangle(origin, new Point(0, 0, origin));
	}

	public move(offsetX: number, offsetY: number): void {
		this.area.topLeft().move(offsetX, offsetY);
	}

	public resize(): void {
		this.area.bottomRight().move(window.innerWidth, window.innerHeight);
	}

	public render(): void {

	}

}