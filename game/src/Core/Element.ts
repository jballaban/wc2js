import { Point } from "../Shape/Point";
import { ContextLayer } from "./ContextLayer";
import { IShape } from "../Shape/IShape";
import { Runtime } from "./Runtime";
import { Region, RegionContainer } from "./Region";
import { Rectangle } from "../Shape/Rectangle";
import { Array as ArrayUtil } from "../Util/Array";

export abstract class Element {

	public origin: Point;
	public area: IShape;
	public container: ElementContainer;
	public collisions: Element[] = new Array<Element>();

	constructor(origin: Point, area: IShape) {
		this.origin = origin;
		this.area = area;
	}

	public abstract canCollide(element: Element): boolean;

	public onCollide(element: Element, on: boolean): void { }

	public inc(offsetx: number, offsety: number): void {
		this.move(this.origin.offsetX + offsetx, this.origin.offsetY + offsety);
	}

	public move(offsetX: number, offsetY: number): void {
		if (offsetX == this.origin.offsetX && offsetY == this.origin.offsetY) { return; }
		this.origin.move(offsetX, offsetY);
		this.container.update(this, true);
	}

	public update(step: number): void {
		return;
	}

	public abstract render(ctx: CanvasRenderingContext2D): void;
}

export class ElementRegion extends Region {
	public elements: Element[] = new Array<Element>();
	public requiresRedraw: boolean = false;
}

export class ElementContainer {

	private regions: RegionContainer<ElementRegion>;
	public elements: Map<Element, ElementRegion[]> = new Map<Element, ElementRegion[]>();
	public regionsCache: ElementRegion[];
	public areasCache: Rectangle[];
	public elementsCache: Element[];

	public constructor(regionsize: number, area: Rectangle) {
		this.regions = new RegionContainer(regionsize, area, ElementRegion);
		this.regionsCache = Array.from(this.regions.regions.values());
		this.areasCache = Array.from(this.regions.regions.keys());
		this.elementsCache = new Array<Element>();
	}

	public register(element: Element): void {
		this.elements.set(element, new Array<ElementRegion>());
		element.container = this;
		this.update(element, true);
		this.elementsCache.push(element);
	}

	public deregister(element: Element): void {
		for (var region of this.elements.get(element)) {
			this.remove(element, region);
		}
		this.elementsCache.splice(this.elementsCache.indexOf(element), 1);
		this.elements.delete(element);
	}

	public add(element: Element, region: ElementRegion): void {
		region.elements.push(element);
		this.elements.get(element).push(region);
		region.requiresRedraw = true;
	}

	public remove(element: Element, region: ElementRegion): void {
		region.elements.splice(region.elements.indexOf(element), 1);
		this.elements.get(element).splice(this.elements.get(element).indexOf(region), 1);
		region.requiresRedraw = true;
	}

	public update(element: Element, position: boolean) {
		var currentregions = this.regions.getRegions(element.area);
		if (position) {
			var oldregions = this.elements.get(element);
			for (var oldregion of oldregions) {
				if (currentregions.indexOf(oldregion) === -1) {
					this.remove(element, oldregion);
				}
			}
			for (var currentregion of currentregions) {
				if (oldregions.indexOf(currentregion) === -1) {
					this.add(element, currentregion);
				} else {
					currentregion.requiresRedraw = true;
				}
			}
		} else {
			for (var i = 0; i < currentregions.length; i++) {
				currentregions[i].requiresRedraw = true;
			}
		}
	}

	public getRegions(area: IShape): ElementRegion[] {
		var result = [];
		for (var i = 0; i < this.areasCache.length; i++) {
			if (area.intersects(this.areasCache[i])) {
				result.push(this.regions.regions.get(this.areasCache[i]));
			}
		}
		return result;
	}

}