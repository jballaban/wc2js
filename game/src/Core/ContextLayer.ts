import { Rectangle } from "../Shape/Rectangle";
import { Viewport } from "../Core/Viewport";
import { MidPoint, Point } from "../Shape/Point";
import { Position } from "../Shape/Polygon";
import { Logger } from "../Util/Logger";
import { IShape } from "../Shape/IShape";
import { Color } from "../Util/Color";
import { RegionContainer, BooleanRegion } from "./Region";

export class ContextLayer {

	public ctx: CanvasRenderingContext2D;
	private regions: RegionContainer<BooleanRegion>;

	constructor(private ratio: number, zindex: number) {
		var canv: HTMLCanvasElement = document.createElement("canvas");
		canv.style.setProperty("z-index", zindex.toString());
		document.body.appendChild(canv);
		this.ctx = canv.getContext("2d");
		this.resize();
	}

	public destroy(): void {
		document.body.removeChild(this.ctx.canvas);
	}

	public renderStart(): void {
		for (var rect of this.regions.regions.keys()) {
			if (this.regions.regions.get(rect).value) {
				this.ctx.clearRect(rect.x(), rect.y(), rect.width(), rect.height());
			}
		}
	}

	public renderComplete(): void {
		for (var region of this.regions.regions.values()) {
			region.value = false;
		}
	}

	public markForRedraw(area: IShape): void {
		for (var region of this.regions.getRegions(area)) {
			region.value = true;
		}
	}

	public shouldRedraw(shape: IShape): boolean {
		for (var region of this.regions.getRegions(shape)) {
			if (region.value) {
				return true;
			}
		}
		return false;
	}

	public resize(): void {
		this.ctx.canvas.width = window.innerWidth;
		this.ctx.canvas.height = window.innerHeight;
		this.regions = new RegionContainer<BooleanRegion>(
			Math.ceil(Viewport.area.width() * this.ratio),
			Viewport.area,
			BooleanRegion);
	}
}