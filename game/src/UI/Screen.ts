import { Rectangle } from "../Shape/Rectangle";
import { Viewport } from "../Core/Viewport";
import { Logger } from "../Util/Logger";
import { RegionContainer } from "../Core/Region";
import { Element, ElementRegion, ElementContainer } from "../Core/Element";
import { Mouse } from "../IO/Mouse";
import { Array as ArrayUtil } from "../Util/Array";
import { Collision } from "../Util/Collision";

export abstract class Screen {
	protected elements: ElementContainer;
	public mouse: Mouse;

	public update(step: number): void {
		// do updates
		for (var i = 0; i < this.elements.elementsCache.length; i++) {
			this.elements.elementsCache[i].update(step);
		}
		// verify existing collisions are accurate
		for (var i = 0; i < this.elements.regionsCache.length; i++) {
			var elements = this.elements.regionsCache[i].elements;
			for (var j = 0; j < elements.length; j++) {
				var collisions = elements[j].collisions;
				for (var k = 0; k < collisions.length; k++) {
					if (
						!elements[j].canCollide(collisions[k])
						|| !collisions[k].canCollide(elements[j])
						|| !Collision.intersects(elements[j].area, collisions[k].area)
					) {
						collisions[k].collisions.splice(ArrayUtil.indexOf<Element>(elements[j], collisions[k].collisions), 1);
						collisions.splice(k--, 1);
					}
				}
			}
		}
		// look for new collisions
		for (var i = 0; i < this.elements.regionsCache.length; i++) {
			var elements = this.elements.regionsCache[i].elements;
			for (var j = 0; j < elements.length - 1; j++) {
				for (var k = j + 1; k < elements.length; k++) {
					if (ArrayUtil.exists<Element>(elements[k], elements[j].collisions)) {
						continue; // skip if we've already collided
					}
					if (
						elements[j].canCollide(elements[k])
						&& elements[k].canCollide(elements[j])
						&& Collision.intersects(elements[j].area, elements[k].area)
					) {
						elements[j].collisions.push(elements[k]);
						elements[k].collisions.push(elements[j]);
					}
				}
			}
		}
	}

	public render(): void {
		for (var layer of Viewport.layers.values()) {
			layer.renderStart();
		}
		for (var region of this.elements.regionsCache) {
			for (var el of region.elements) {
				el.render();
			}
		}
		for (var layer of Viewport.layers.values()) {
			layer.renderComplete();
		}
	}

}