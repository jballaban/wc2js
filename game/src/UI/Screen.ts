import { Rectangle } from "../Shape/Rectangle";
import { Viewport } from "../Core/Viewport";
import { Logger } from "../Util/Logger";
import { RegionContainer } from "../Core/Region";
import { Element, ElementRegion, ElementContainer } from "../Core/Element";
import { Mouse } from "../IO/Mouse";
import { Array as ArrayUtil } from "../Util/Array";
import { Collision } from "../Util/Collision";
import { ContextLayer } from "../Core/ContextLayer";
import { Runtime } from "../Core/Runtime";
import { Color } from "../Util/Color";

export abstract class Screen {
	public elements: ElementContainer;
	public mouse: Mouse;

	public onActivate(): void { }

	public update(step: number): void {
		// do updates
		for (var i = 0; i < this.elements.elementsCache.length; i++) {
			this.elements.elementsCache[i].update(step);
		}
		// look for new collisions
		for (var i = 0; i < this.elements.regionsCache.length; i++) {
			var elements = this.elements.regionsCache[i].elements;
			for (var j = 0; j < elements.length - 1; j++) {
				// verify existing collisions still valid
				var collisions = elements[j].collisions;
				for (var k = 0; k < collisions.length; k++) {
					if (
						!elements[j].canCollide(collisions[k])
						|| !collisions[k].canCollide(elements[j])
						|| !Collision.intersects(elements[j].area, collisions[k].area)
					) {
						var other = collisions[k];
						other.collisions.splice(ArrayUtil.indexOf<Element>(elements[j], other.collisions), 1);
						other.onCollide(elements[j], false);
						collisions.splice(k--, 1);
						elements[j].onCollide(other, false);
					}
				}
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
						elements[j].onCollide(elements[k], true);
						elements[k].onCollide(elements[j], true);
					}
				}
			}
		}
	}

	public render(): void {
		for (var region of Viewport.visibleElementRegions) {
			if (!region.requiresRedraw) { continue; }
			Runtime.ctx.ctx.clearRect(region.area.x(), region.area.y(), region.area.width(), region.area.height());
			Runtime.ctx.ctx.save();
			// Clip a rectangular area
			Runtime.ctx.ctx.rect(region.area.x(), region.area.y(), region.area.width(), region.area.height());
			Runtime.ctx.ctx.clip();
			for (var el of region.elements) {
				el.render(Runtime.ctx.ctx);
			}
			Runtime.ctx.ctx.restore();
			region.requiresRedraw = false;
		}
	}

}