import { Rectangle } from "../Shape/Rectangle";
import { Viewport } from "../Core/Viewport";
import { Logger } from "../Util/Logger";
import { Element } from "../Core/Element";
import { Mouse } from "../IO/Mouse";


export abstract class Screen {

	protected elements: Element[] = new Array<Element>();
	public mouse: Mouse = new Mouse();

	public update(step: number): void {
		for (var element of this.elements) {
			Viewport.layer("foreground").markForRedraw(element.area);
			element.area.topLeft().inc(Math.floor(Math.random() * 2), Math.floor(Math.random() * 2));
			if (element.area.x() > Viewport.area.x2())
				element.area.topLeft().move(0, null);
			if (element.area.y() > Viewport.area.y2())
				element.area.topLeft().move(null, 0);
			Viewport.layer("foreground").markForRedraw(element.area);
		}
	}

	public render(): void {
		var layer = Viewport.layer("foreground");
		layer.renderStart();
		for (var element of this.elements) {
			if (!layer.shouldRedraw(element.area)) {
				continue;
			}
			element.render(layer.ctx);
		}
		layer.renderComplete();
		layer = Viewport.layer("mouse");
		layer.renderStart();
		this.mouse.render(layer.ctx);
		layer.renderComplete();
	}

}