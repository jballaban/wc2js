import { Element } from "../Core/Element";
import { Rectangle, PointRectangle } from "../Shape/Rectangle";
import { Point } from "../Shape/Point";
import { ContextLayer } from "../Core/ContextLayer";
import { Circle } from "../Shape/Circle";

export class Mouse extends Element {

	public constructor(layer: ContextLayer) {
		var origin: Point = new Point(0, 0, null);
		super(origin, new Circle(origin, 10), layer);
	}

	public canCollide(element: Element): boolean {
		return true;
	}

	public render(): boolean {
		if (!super.render()) {
			return false;
		}
		var color: string = this.collisions.length === 0 ? "#000000" : "#FF0000";
		this.area.render(this.layer.ctx, color);
		return true;
	}

}