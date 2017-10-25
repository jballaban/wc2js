import { Point } from "../Shape/Point";
import { Logger } from "../Util/Logger";
import { Runtime } from "../Core/Runtime";
import { Rectangle } from "../Shape/Rectangle";
import { ContextLayer } from "../Core/ContextLayer";

export class Viewport {
	public static area: Rectangle;
	public static layers: Map<string, ContextLayer> = new Map<string, ContextLayer>();

	public static init(): void {
		var origin = new Point(0, 0, null);
		Viewport.area = new Rectangle(origin, new Point(0, 0, origin));
		Viewport.resize();
		window.onresize = Viewport.resize;
	}

	public static reset(): void {
		for (var layer of Viewport.layers.values()) {
			layer.destroy();
		}
		Viewport.layers = new Map<string, ContextLayer>();
	}

	public static resize(): void {
		for (var layer of Viewport.layers.values()) {
			layer.resize();
		}
		Viewport.area.bottomRight().move(window.innerWidth, window.innerHeight);
	}

}