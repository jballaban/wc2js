import { Point } from "../Shape/Point";
import { Logger } from "../Util/Logger";
import { Runtime } from "../Core/Runtime";
import { Rectangle } from "../Shape/Rectangle";
import { ContextLayer } from "../Core/ContextLayer";
import { ElementRegion } from "./ElementContainer";

export class Camera {
	public static area: Rectangle;
	public static visibleElementRegions: ElementRegion[];

	public static init(): void {
		var origin: Point = new Point(0, 0, null);
		Camera.area = new Rectangle(origin, new Point(0, 0, origin));
	}

	public static move(offsetX: number, offsetY: number): void {
		Camera.area.topLeft().move(offsetX, offsetY);
		Camera.resize();
	}

	public static resize(): void {
		Camera.area.bottomRight().move(window.innerWidth, window.innerHeight);
		Camera.visibleElementRegions = Runtime.screen.container.getRegions(Camera.area);
		for (var i: number = 0; i < Camera.visibleElementRegions.length; i++) {
			Camera.visibleElementRegions[i].requiresRedraw = true;
		}
	}

}