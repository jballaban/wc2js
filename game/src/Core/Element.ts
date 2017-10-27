import { Point } from "../Shape/Point";
import { ContextLayer } from "./ContextLayer";
import { IShape } from "../Shape/IShape";
import { Runtime } from "./Runtime";
import { Region, RegionContainer } from "./Region";
import { Rectangle } from "../Shape/Rectangle";
import { Array as ArrayUtil } from "../Util/Array";
import { ElementContainer } from "./ElementContainer";

export abstract class Element {

	public origin: Point;
	public area: IShape;
	public collisions: Element[] = new Array<Element>();
	public zIndex: number;

	constructor(origin: Point, area: IShape, zIndex: number) {
		this.origin = origin;
		this.area = area;
		this.zIndex = zIndex;
	}

	public abstract canCollide(element: Element): boolean;

	public onCollide(element: Element, on: boolean): void {
		// to implement
	}

	public inc(offsetx: number, offsety: number): void {
		this.move(this.origin.offsetX + offsetx, this.origin.offsetY + offsety);
	}

	public move(offsetX: number, offsetY: number): void {
		if (offsetX === this.origin.offsetX && offsetY === this.origin.offsetY) { return; }
		this.origin.move(offsetX, offsetY);
		if (this.origin.x() < 0) {
			this.origin.move(0, null);
		} else if (this.origin.x() > Runtime.screen.container.area.x2()) {
			this.origin.move(Runtime.screen.container.area.x2(), null);
		}
		if (this.origin.y() < 0) {
			this.origin.move(null, 0);
		} else if (this.origin.y() > Runtime.screen.container.area.y2()) {
			this.origin.move(null, Runtime.screen.container.area.y2());
		}
		Runtime.screen.container.update(this, true);
	}

	public update(step: number): void {
		if (this.area.changed) {
			Runtime.screen.container.update(this, true);
		}
		return;
	}

	public abstract render(ctx: CanvasRenderingContext2D): void;
}