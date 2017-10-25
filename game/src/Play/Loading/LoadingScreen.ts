import { Screen } from "UI/Screen";
import { Rectangle } from "../../Shape/Rectangle";
import { Viewport } from "../../Core/Viewport";
import { Runtime } from "Core/Runtime";
import { Logger } from "Util/Logger";
import { Position } from "../../Shape/Polygon";
import { Point, MidPoint } from "../../Shape/Point";
import { Thing, StaticThing } from "../../UI/Thing";
import { ContextLayer } from "../../Core/ContextLayer";
import { Mouse } from "../../IO/Mouse";
import { Color } from "../../Util/Color";
import { ElementContainer } from "../../Core/Element";

export class LoadingScreen extends Screen {

	constructor() {
		super();
		this.elements = new ElementContainer(256, Viewport.area);
		Viewport.reset();
		Viewport.layers.set("items", new ContextLayer(1 / 8, 2));
		for (var i: number = 0; i < 200; i++) {
			this.elements.register(new Thing(Viewport.layers.get("items"), Color.getRandomColor()));
		}
		Viewport.layers.set("background", new ContextLayer(1 / 2, 1));
		this.elements.register(new StaticThing(Viewport.layers.get("background"), "darkblue",
			new Rectangle(
				new MidPoint(Viewport.area.topLeft(), Viewport.area.getPoint(Position.Center)),
				new MidPoint(Viewport.area.getPoint(Position.Center), Viewport.area.bottomRight())
			)
		));
		Viewport.layers.set("mouse", new ContextLayer(1 / 8, 10));
		this.mouse = new Mouse(Viewport.layers.get("mouse"));
		this.elements.register(this.mouse);
	}

}