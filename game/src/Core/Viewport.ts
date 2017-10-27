import { Point } from "../Shape/Point";
import { Logger } from "../Util/Logger";
import { Runtime } from "../Core/Runtime";
import { Rectangle } from "../Shape/Rectangle";
import { ContextLayer } from "../Core/ContextLayer";
import { ElementRegion } from "./Element";

export class Viewport {
	public static area: Rectangle;
	public static visibleElementRegions: ElementRegion[];

	public static init(): void {
		var origin = new Point(0, 0, null);
		Viewport.area = new Rectangle(origin, new Point(0, 0, origin));
		Viewport.resize();
	}

	public static move(offsetX: number, offsetY: number) {
		Viewport.area.topLeft().move(offsetX, offsetY);
		Viewport.visibleElementRegions = Runtime.screen.elements.getRegions(Viewport.area);
	}

	public static resize(): void {
		Viewport.area.bottomRight().move(window.innerWidth, window.innerHeight);
	}

}