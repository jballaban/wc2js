import { Screen } from "UI/Screen";
import { Rectangle } from "../../Shape/Rectangle";
import { Viewport } from "../../Core/Viewport";
import { Runtime } from "Core/Runtime";
import { Logger } from "Util/Logger";
import { Position } from "../../Shape/Polygon";
import { Point } from "../../Shape/Point";
import { Thing } from "../../Core/Element";
import { QuarteredContextLayer } from "../../Core/ContextLayer";
import { Mouse } from "../../IO/Mouse";

export class LoadingScreen extends Screen {

	constructor() {
		super();
		Viewport.reset();
		var origin: Point = new Point(0, 0, null);
		Viewport.layers.set("items", new QuarteredContextLayer(1));
		this.elements.push(new Thing(origin, new Rectangle(origin, new Point(100, 50, origin)), Viewport.layers.get("items")));
		Viewport.layers.set("mouse", new QuarteredContextLayer(10));
		this.mouse = new Mouse(Viewport.layers.get("mouse"));
		this.elements.push(this.mouse);
	}

}