import { Point } from "./Point";
import { Logger } from "Util/Logger";
import { Runtime } from "Core/Runtime";

export class Viewport {
	public static topLeft: Point;
	public static bottomRight: Point;

	public static init(): void {
		Viewport.topLeft = new Point(0, 0, null);
		Viewport.bottomRight = new Point(0, 0, null);
		Viewport.resize();
		window.onresize = Viewport.resize;
	}

	public static resize(): void {
		Runtime.ctx.canvas.width = window.innerWidth;
		Runtime.ctx.canvas.height = window.innerHeight;
		Viewport.bottomRight.move(window.innerWidth, window.innerHeight);
		Logger.debug("Viewport: resized to [" + Viewport.bottomRight.x + ", " + Viewport.bottomRight.y + "]");
	}
}