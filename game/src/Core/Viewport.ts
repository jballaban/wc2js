import { Point } from "../Shape/Point";
import { Logger } from "../Util/Logger";
import { Runtime } from "../Core/Runtime";
import { Rectangle } from "../Shape/Rectangle";
import { QuarteredContextLayer, ContextLayer } from "../Core/ContextLayer";

export class Viewport {
	public static area: Rectangle;
	private static layers: Map<string, ContextLayer> = new Map<string, ContextLayer>();

	public static init(): void {
		Viewport.area = new Rectangle(new Point(0, 0, null), new Point(0, 0, null));
		Viewport.resize();
		window.onresize = Viewport.resize;
	}

	public static layer(name: string) {
		var ctx = Viewport.layers.get(name);
		if (ctx == null) {
			ctx = new QuarteredContextLayer();
			Viewport.layers.set(name, ctx);
		}
		return ctx;
	}

	public static resize(): void {
		for (var layer of Viewport.layers.values()) {
			layer.resize();
		}
		Viewport.area.bottomRight().move(window.innerWidth, window.innerHeight);
	}

}