import { Rectangle } from "../Shape/Rectangle";
import { Viewport } from "../Core/Viewport";
import { Logger } from "../Util/Logger";
import { RegionContainer } from "../Core/Region";
import { Element, ElementRegion, ElementContainer } from "../Core/Element";
import { Mouse } from "../IO/Mouse";

export abstract class Screen {
	protected elements: ElementContainer;
	public mouse: Mouse;

	public update(step: number): void {
		for (var element of this.elements.getElements(null)) {
			element.update(step);
		}
		for (var region of this.elements.getRegions()) {
			for (var el of region.elements) {
				for (var i: number = 0; i < el.collisions.length; i++) {
					if (this.elements.elements.get(el.collisions[i]).indexOf(region) == -1
						|| !el.collides(el.collisions[i])
					) {
						el.collisions[i].collisions.splice(el.collisions[i].collisions.indexOf(el), 1);
						el.collisions.splice(i--, 1);
					}
				}
			}
		}
		// look for new collisions
		for (var element of this.elements.getElements(null)) {
			for (var sibling of this.elements.getElements(element.area)) {
				if (sibling == element || element.collisions.indexOf(sibling) > -1) continue;
				if (element.collides(sibling)) {
					element.collisions.push(sibling);
					sibling.collisions.push(element);
				}
			}
		}
	}

	public render(): void {
		for (var layer of Viewport.layers.values()) {
			layer.renderStart();
		}
		for (var el of this.elements.getElements(null)) {
			el.render();
		}
		for (var layer of Viewport.layers.values()) {
			layer.renderComplete();
		}
	}

}