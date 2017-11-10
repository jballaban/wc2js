import { Rectangle } from "../Shape/Rectangle";
import { Camera } from "../Core/Camera";
import { MidPoint, Point } from "../Shape/Point";
import { Position } from "../Shape/Polygon";
import { Logger } from "../Util/Logger";
import { IShape } from "../Shape/IShape";
import { Color } from "../Util/Color";
import { RegionContainer } from "./Region";
import { Viewport } from "./Viewport";

export class ContextLayer {

	public ctx: CanvasRenderingContext2D;

	constructor(private viewport: Viewport, private zindex: number) { }

	public activate(): void {
		var canv: HTMLCanvasElement = document.createElement("canvas");
		canv.style.setProperty("z-index", this.zindex.toString());
		document.body.appendChild(canv);
		this.ctx = canv.getContext("2d");
	}

	public deactivate(): void {
		document.body.removeChild(this.ctx.canvas);
	}

	public preUpdate(): void {
		if (this.viewport.area.changed()) {
			this.ctx.canvas.width = this.viewport.area.width();
			this.ctx.canvas.height = this.viewport.area.height();
		}
	}

}