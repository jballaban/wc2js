import { Point } from "../Shape/Point";
import { ContextLayer } from "./ContextLayer";
import { IShape } from "../Shape/IShape";
import { Runtime } from "./Runtime";
import { Region, RegionContainer } from "./Region";
import { Rectangle } from "../Shape/Rectangle";

export abstract class Element {

	public origin: Point;
	public area: IShape;
	public layer: ContextLayer;
	public container: ElementContainer;
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
		this.container.update(this);
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
	public requiresRedraw: boolean = false;
}

export class ElementContainer {

	private regions: RegionContainer<ElementRegion>;
	public elements: Map<Element, ElementRegion[]> = new Map<Element, ElementRegion[]>();

	public constructor(regionsize: number, area: Rectangle) {
		this.regions = new RegionContainer(regionsize, area, ElementRegion);
	}

	public register(element: Element): void {
		this.elements.set(element, new Array<ElementRegion>());
		element.container = this;
		this.update(element);
	}

	public deregister(element: Element): void {
		for (var region of this.elements.get(element)) {
			this.remove(element, region);
		}
		this.elements.delete(element);
	}

	public add(element: Element, region: ElementRegion): void {
		region.elements.push(element);
		this.elements.get(element).push(region);
		region.requiresRedraw = true;
	}

	public remove(element: Element, region: ElementRegion): void {
		this.elements.get(element).splice(this.elements.get(element).indexOf(region), 1);
		region.requiresRedraw = true;
	}

	public update(element: Element) {
		var oldregions = this.elements.get(element);
		var currentregions = this.regions.getRegions(element.area);
		for (var oldregion of oldregions) {
			if (currentregions.indexOf(oldregion) === -1) {
				this.remove(element, oldregion);
			}
		}
		for (var currentregion of currentregions) {
			if (oldregions.indexOf(currentregion) === -1) {
				this.add(element, currentregion);
			}
		}
	}

	public renderComplete(): void {
		for (var region of this.regions.getRegions(null)) {
			region.requiresRedraw = false;
		}
	}

	public getRegions(): ElementRegion[] {
		return Array.from(this.regions.regions.values());
	}

	public getElements(area: IShape): Element[] {
		if (area == null) {
			return Array.from(this.elements.keys());
		}
		var result = [];
		for (var region of this.regions.getRegions(area)) {
			result.push.apply(result, region.elements);
		}
		return Array.from(new Set(result));
	}
}