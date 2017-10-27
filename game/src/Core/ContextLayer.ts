import { Rectangle } from "../Shape/Rectangle";
import { Viewport } from "../Core/Viewport";
import { MidPoint, Point } from "../Shape/Point";
import { Position } from "../Shape/Polygon";
import { Logger } from "../Util/Logger";
import { IShape } from "../Shape/IShape";
import { Color } from "../Util/Color";
import { RegionContainer } from "./Region";

export class ContextLayer {

	public ctx: CanvasRenderingContext2D;

	constructor(zindex: number) {
		var canv: HTMLCanvasElement = document.createElement("canvas");
		canv.style.setProperty("z-index", zindex.toString());
		document.body.appendChild(canv);
		this.ctx = canv.getContext("2d");
		this.resize();
	}

	public destroy(): void {
		document.body.removeChild(this.ctx.canvas);
	}

	public resize(): void {
		this.ctx.canvas.width = window.innerWidth;
		this.ctx.canvas.height = window.innerHeight;
	}
}