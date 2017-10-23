import { Screen } from "UI/Screen";
import { Rectangle } from "../../Shape/Rectangle";
import { Viewport } from "../../Core/Viewport";
import { Runtime } from "Core/Runtime";
import { Logger } from "Util/Logger";
import { Position } from "../../Shape/Polygon";
import { Point } from "../../Shape/Point";
import { Element } from "../../Core/Element";

export class LoadingScreen extends Screen {

	constructor() {
		super();
		var origin: Point = new Point(0, 0, null);
		this.elements.push(new Element(new Rectangle(origin, new Point(100, 50, origin))));
	}

}