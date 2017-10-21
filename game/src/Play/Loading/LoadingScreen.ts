import { Screen } from "UI/Screen";
import { Rectangle } from "UI/Rectangle";
import { Viewport } from "UI/Viewport";
import { Runtime } from "Core/Runtime";
import { Logger } from "Util/Logger";
import { Position } from "UI/Polygon";
import { Point } from "../../UI/Point";

export class LoadingScreen extends Screen {

	constructor() {
		super();
		var origin: Point = new Point(0, 0, null);
		this.elements.push(new Rectangle(origin, new Point(100, 50, origin)));
	}

}