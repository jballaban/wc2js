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
import { Vector } from "../../Core/Vector";

export class LoadingScreen extends Screen {

	constructor() {
		super();
		this.elements = new ElementContainer(256, Viewport.area);
		Viewport.reset();
		Viewport.layers.set("items", new ContextLayer(1, 2));
		for (var i: number = 0; i < 400; i++) {
			var thing = new Thing(Viewport.layers.get("items"), Color.getRandomColor());
			thing.direction = new Vector(Math.random() * 40 - 20, Math.random() * 40 - 20);
			this.elements.register(thing);
			thing.move(Math.random() * Viewport.area.width(), Math.random() * Viewport.area.height());
		}
		Viewport.layers.set("background", new ContextLayer(1, 1));
		this.elements.register(new StaticThing(Viewport.layers.get("background"), "darkblue",
			new Rectangle(
				new MidPoint(Viewport.area.topLeft(), Viewport.area.getPoint(Position.Center)),
				new MidPoint(Viewport.area.getPoint(Position.Center), Viewport.area.bottomRight())
			)
		));
		Viewport.layers.set("mouse", new ContextLayer(1, 10));
		this.mouse = new Mouse(Viewport.layers.get("mouse"));
		this.elements.register(this.mouse);
	}

}