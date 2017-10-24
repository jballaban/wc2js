import { Point } from "../Shape/Point";
import { ContextLayer } from "./ContextLayer";
import { IShape } from "../Shape/IShape";
import { Runtime } from "./Runtime";

export enum Events {
	drawDirty,
	registerCollision,
	deregisterCollision
}

export abstract class Element {

	public origin: Point;
	public area: IShape;
	public layer: ContextLayer;
	public collisions: Element[] = new Array<Element>();
	protected requiresRedraw: boolean = true;

	constructor(origin: Point, area: IShape, layer: ContextLayer) {
		this.origin = origin;
		this.area = area;
		this.layer = layer;
	}

	public collides(element: Element): boolean {
		return this.area.intersects(element.area);
	}

	public inc(offsetx: number, offsety: number): void {
		this.move(this.origin.offsetX + offsetx, this.origin.offsetY + offsety);
	}

	public move(offsetX: number, offsetY: number): void {
		this.layer.markForRedraw(this.area);
		this.origin.move(offsetX, offsetY);
		this.layer.markForRedraw(this.area);
		this.requiresRedraw = true;
	}

	public update(step: number): void {
		return;
	}

	public render(): boolean {
		var result: boolean = this.requiresRedraw || this.layer.shouldRedraw(this.area);
		this.requiresRedraw = false;
		return result;
	}
}