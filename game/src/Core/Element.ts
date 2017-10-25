import { Point } from "../Shape/Point";
import { ContextLayer } from "./ContextLayer";
import { IShape } from "../Shape/IShape";
import { Runtime } from "./Runtime";
import { Region, RegionContainer } from "./Region";
import { Rectangle } from "../Shape/Rectangle";

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

export class ElementRegion extends Region {
	public elements: Element[] = new Array<Element>();
}

export class ElementContainer {
	private regions: RegionContainer<ElementRegion>;
	private elements: Element[] = new Array<Element>();
	public constructor(regionsize: number, area: Rectangle) {
		this.regions = new RegionContainer(regionsize, area, ElementRegion);
	}

	public add(element: Element): Element {
		this.elements.push(element);
		for (var region of this.regions.getRegions(element.area)) {
			region.elements.push(element);
		}
		return element;
	}

	public getElements(area: IShape): Element[] {
		if (area == null) {
			return this.elements;
		}
		var result = [];
		for (var region of this.regions.getRegions(area)) {
			result.concat(region.elements);
		}
		return Array.from(new Set(result));
	}
}