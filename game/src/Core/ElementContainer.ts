import { IShape } from "../Shape/IShape";
import { Rectangle } from "../Shape/Rectangle";
import { RegionContainer, Region } from "./Region";
import { Element } from "./Element";

export class ElementRegion extends Region {
	public elements: Element[] = new Array<Element>();
	public requiresRedraw: boolean = false;
}

export class ElementContainer {

	private regions: RegionContainer<ElementRegion>;
	public elements: Map<Element, ElementRegion[]> = new Map<Element, ElementRegion[]>();
	public regionsCache: ElementRegion[];
	public areasCache: Rectangle[];
	public elementsCache: Element[] = new Array<Element>();

	public constructor(regionsize: number, area: Rectangle) {
		this.regions = new RegionContainer(regionsize, area, ElementRegion);
		this.regionsCache = Array.from(this.regions.regions.values());
		this.areasCache = Array.from(this.regions.regions.keys());
	}

	public resize(area: Rectangle): void {
		var elements: Element[] = new Array<Element>();
		for (var i = 0; i < this.elementsCache.length; i++) {
			elements.push(this.elementsCache[i]);
			this.deregister(this.elementsCache[i]);
		}
		this.regions = new RegionContainer(this.regions.len, area, ElementRegion);
		this.regionsCache = Array.from(this.regions.regions.values());
		this.areasCache = Array.from(this.regions.regions.keys());
		this.elementsCache = new Array<Element>();
		for (var i = 0; i < elements.length; i++) {
			this.register(elements[i]);
		}
	}

	public get area(): Rectangle {
		return this.regions.area;
	}

	public register(element: Element): void {
		if (this.elementsCache.indexOf(element) > -1) {
			throw "Dup registration";
		}
		this.elements.set(element, new Array<ElementRegion>());
		this.update(element, true);
		this.insertSorted(element, this.elementsCache);
	}

	public deregister(element: Element): void {
		var regions: ElementRegion[] = this.elements.get(element);
		for (var i: number = 0; i < regions.length; i++) {
			this.remove(element, regions[i--]);
		}
		this.elementsCache.splice(this.elementsCache.indexOf(element), 1);
		this.elements.delete(element);
	}

	public add(element: Element, region: ElementRegion): void {
		this.insertSorted(element, region.elements);
		this.elements.get(element).push(region);
		region.requiresRedraw = true;
	}

	public remove(element: Element, region: ElementRegion): void {
		region.elements.splice(region.elements.indexOf(element), 1);
		this.elements.get(element).splice(this.elements.get(element).indexOf(region), 1);
		region.requiresRedraw = true;
	}

	public update(element: Element, position: boolean): void {
		var currentregions: ElementRegion[] = this.regions.getRegions(element.area);
		if (position) {
			var oldregions: ElementRegion[] = this.elements.get(element);
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
			for (var i: number = 0; i < currentregions.length; i++) {
				currentregions[i].requiresRedraw = true;
			}
		}
	}

	public getRegions(area: IShape): ElementRegion[] {
		var result: ElementRegion[] = new Array<ElementRegion>();
		for (var i: number = 0; i < this.areasCache.length; i++) {
			if (area.intersects(this.areasCache[i])) {
				result.push(this.regions.regions.get(this.areasCache[i]));
			}
		}
		return result;
	}

	private insertSorted(element: Element, array: Element[]): void {
		array.splice(this.locationOfIndex(element.zIndex, array), 0, element);
	}

	private locationOfIndex(index: number, array: Element[]): number {
		for (var i: number = 0; i < array.length; i++) {
			if (array[i].zIndex >= index) {
				return i;
			}
		}
		return array.length;
	}

}