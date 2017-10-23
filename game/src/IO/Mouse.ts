import { Element } from "../Core/Element";
import { PointRectangle } from "../Shape/Rectangle";
import { Point } from "../Shape/Point";

export class Mouse extends Element {

	public constructor() {
		super(new PointRectangle(new Point(0, 0, null)));
	}

}