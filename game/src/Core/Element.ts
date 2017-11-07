import { Point } from "../Shape/Point";
import { ContextLayer } from "./ContextLayer";
import { IShape } from "../Shape/IShape";
import { Runtime } from "./Runtime";
import { Region, RegionContainer } from "./Region";
import { Rectangle } from "../Shape/Rectangle";
import { Array as ArrayUtil } from "../Util/Array";
import { ElementContainer } from "./ElementContainer";
import { ElementType } from "./ElementType";
import { Screen } from "../UI/Screen";

export abstract class Element {

	public origin: Point;
	public area: IShape;
	public collisions: Element[] = new Array<Element>();
	public zIndex: number;
	public type: ElementType;

	constructor(type: ElementType, origin: Point, area: IShape, zIndex: number) {
		this.type = type;
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
		} else if (this.origin.x() > Screen.current.container.area.x2()) {
			this.origin.move(Screen.current.container.area.x2(), null);
		}
		if (this.origin.y() < 0) {
			this.origin.move(null, 0);
		} else if (this.origin.y() > Screen.current.container.area.y2()) {
			this.origin.move(null, Screen.current.container.area.y2());
		}
	}

	public update(step: number): void {
		// update overrides
	}

	public onPreRender(): void {
		if (this.area.changed()) {
			Screen.current.container.update(this, true);
			this.area.clearChanged();
		}
	}

	public abstract render(ctx: CanvasRenderingContext2D): void;
}