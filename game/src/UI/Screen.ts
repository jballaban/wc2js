import { Rectangle } from "../Shape/Rectangle";
import { Viewport } from "../Core/Viewport";
import { Logger } from "../Util/Logger";
import { RegionContainer } from "../Core/Region";
import { Element } from "../Core/Element";
import { Mouse } from "../IO/Mouse";
import { Array as ArrayUtil } from "../Util/Array";
import { Collision } from "../Util/Collision";
import { ContextLayer } from "../Core/ContextLayer";
import { Runtime } from "../Core/Runtime";
import { Color } from "../Util/Color";
import { ElementContainer } from "../Core/ElementContainer";

export abstract class Screen {
	public container: ElementContainer;
	public mouse: Mouse;

	public onActivate(): void {
		// to implement
	}

	public update(step: number): void {
		// do updates
		for (var i: number = 0; i < this.container.elementsCache.length; i++) {
			this.container.elementsCache[i].update(step);
		}
		this.checkCollisions();
	}

	public checkCollisions(): void {
		// look for new collisions
		for (var i: number = 0; i < this.container.regionsCache.length; i++) {
			var elements: Element[] = this.container.regionsCache[i].elements;
			for (var j: number = 0; j < elements.length - 1; j++) {
				// verify existing collisions still valid
				var collisions: Element[] = elements[j].collisions;
				for (var k: number = 0; k < collisions.length; k++) {
					if (
						!elements[j].canCollide(collisions[k])
						|| !collisions[k].canCollide(elements[j])
						|| !Collision.intersects(elements[j].area, collisions[k].area)
					) {
						var other: Element = collisions[k];
						other.collisions.splice(ArrayUtil.indexOf<Element>(elements[j], other.collisions), 1);
						other.onCollide(elements[j], false);
						collisions.splice(k--, 1);
						elements[j].onCollide(other, false);
					}
				}
				// tslint:disable-next-line:no-duplicate-variable
				for (var k: number = j + 1; k < elements.length; k++) {
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
			// clip a rectangular area
			Runtime.ctx.ctx.beginPath();
			Runtime.ctx.ctx.rect(region.area.x(), region.area.y(), region.area.width(), region.area.height());
			Runtime.ctx.ctx.clip();
			// aRuntime.ctx.ctx.fillStyle = Color.getRandomColor();
			// aRuntime.ctx.ctx.fillRect(region.area.x(), region.area.y(), region.area.width(), region.area.height());
			for (var i: number = 0; i < region.elements.length; i++) {
				region.elements[i].render(Runtime.ctx.ctx);
			}
			Runtime.ctx.ctx.restore();
			region.requiresRedraw = false;
		}
	}

}