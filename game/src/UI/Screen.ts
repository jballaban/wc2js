import { Rectangle } from "../Shape/Rectangle";
import { Viewport } from "../Core/Viewport";
import { Logger } from "../Util/Logger";
import { Element, Events } from "../Core/Element";
import { Mouse } from "../IO/Mouse";
import { QuarteredContextLayer } from "../Core/ContextLayer";

export abstract class Screen {

	protected elements: Element[] = new Array<Element>();
	public mouse: Mouse;

	public update(step: number): void {
		for (var element of this.elements) {
			element.update(step);
		}
		for (var el of this.elements) {
			for (var collision of el.collisions) {
				if (!el.collides(collision)) {
					el.collisions.splice(el.collisions.indexOf(collision, 0), 1);
					collision.collisions.splice(collision.collisions.indexOf(el, 0), 1);
					// el.event(Events.deregisterCollision, collision);
					// collision.event(Events.deregisterCollision, el);
				}
			}
		}
		for (var i: number = 0; i < this.elements.length - 1; i++) {
			for (var j: number = i + 1; j < this.elements.length; j++) {
				if (this.elements[i].collisions.indexOf(this.elements[j]) > -1) {
					continue; // we've already established a collision so lets skip
				}
				if (this.elements[i].collides(this.elements[j])) {
					this.elements[i].collisions.push(this.elements[j]);
					this.elements[j].collisions.push(this.elements[i]);
					// this.elements[i].event(Events.registerCollision, this.elements[j]);
					// this.elements[j].event(Events.registerCollision, this.elements[i]);
				}
			}
		}
	}

	public render(): void {
		for (var layer of Viewport.layers.values()) {
			layer.renderStart();
		}
		for (var el of this.elements) {
			el.render();
		}
		for (var layer of Viewport.layers.values()) {
			layer.renderComplete();
		}
	}

}