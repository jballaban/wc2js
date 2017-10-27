import { Point } from "../Shape/Point";
import { Logger } from "../Util/Logger";
import { Runtime } from "../Core/Runtime";
import { Rectangle } from "../Shape/Rectangle";
import { ContextLayer } from "../Core/ContextLayer";
import { ElementRegion } from "./ElementContainer";

export class Viewport {
	public static area: Rectangle;
	public static visibleElementRegions: ElementRegion[];

	public static init(): void {
		var origin: Point = new Point(0, 0, null);
		Viewport.area = new Rectangle(origin, new Point(0, 0, origin));
	}

	public static move(offsetX: number, offsetY: number): void {
		Viewport.area.topLeft().move(offsetX, offsetY);
		Viewport.resize();
	}

	public static resize(): void {
		Viewport.area.bottomRight().move(window.innerWidth, window.innerHeight);
		Viewport.visibleElementRegions = Runtime.screen.container.getRegions(Viewport.area);
		for (var i: number = 0; i < Viewport.visibleElementRegions.length; i++) {
			Viewport.visibleElementRegions[i].requiresRedraw = true;
		}
	}

}