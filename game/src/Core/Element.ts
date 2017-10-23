import { Rectangle } from "../Shape/Rectangle";
import { Point } from "../Shape/Point";
import { ContextLayer } from "./ContextLayer";
import { Viewport } from "./Viewport";
import { IShape } from "../Shape/IShape";
import { Circle } from "../Shape/Circle";

export abstract class Element {

	public origin: Point;
	public area: IShape;
	public layer: ContextLayer;

	constructor(origin: Point, area: IShape, layer: ContextLayer) {
		this.origin = origin;
		this.area = area;
		this.layer = layer;
	}

	public inc(offsetx: number, offsety: number) {
		this.move(this.origin.offsetX + offsetx, this.origin.offsetY + offsety);
	}

	public move(offsetX: number, offsetY: number) {
		this.layer.markForRedraw(this.area);
		this.origin.move(offsetX, offsetY);
		this.layer.markForRedraw(this.area);
	}

	public update(): void { }

	public render(): boolean {
		if (!this.layer.shouldRedraw(this.area)) {
			return false;
		}
		this.area.render(this.layer.ctx);
		return true;
	}
}

export class Thing extends Element {
	public update(): void {
		super.update();
		this.inc(Math.floor(Math.random() * 2), Math.floor(Math.random() * 2));
		if (this.origin.x > Viewport.area.x2())
			this.origin.move(0, null);
		if (this.origin.y > Viewport.area.y2())
			this.origin.move(null, 0);
	}
}