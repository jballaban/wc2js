import { Rectangle } from "../Shape/Rectangle";
import { Viewport } from "../Core/Viewport";
import { Logger } from "../Util/Logger";
import { Element } from "../Core/Element";
import { Mouse } from "../IO/Mouse";
import { QuarteredContextLayer } from "../Core/ContextLayer";

export abstract class Screen {

	protected elements: Element[] = new Array<Element>();
	public mouse: Mouse;

	public update(step: number): void {
		for (var element of this.elements) {
			element.update();
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