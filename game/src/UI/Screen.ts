import { Rectangle } from "./Rectangle";
import { Viewport } from "./Viewport";
import { Logger } from "../Util/Logger";


export abstract class Screen {

	protected elements: Rectangle[] = new Array<Rectangle>();

	public update(step: number): void {
		for (var element of this.elements) {
			Viewport.layer("foreground").markForRedraw(element);
			element.topLeft().inc(Math.floor(Math.random() * 2), Math.floor(Math.random() * 2));
			if (element.x() > Viewport.area.x2())
				element.topLeft().move(0, null);
			if (element.y() > Viewport.area.y2())
				element.topLeft().move(null, 0);
			Viewport.layer("foreground").markForRedraw(element);
		}
	}

	public render(): void {
		var foreground = Viewport.layer("foreground");
		foreground.renderStart();
		for (var element of this.elements) {
			if (!foreground.shouldRedraw(element)) {
				continue;
			}
			foreground.ctx.fillStyle = "#FF0000";
			foreground.ctx.fillRect(element.x(), element.y(), element.width(), element.height());
		}
		foreground.renderComplete();
	}

}