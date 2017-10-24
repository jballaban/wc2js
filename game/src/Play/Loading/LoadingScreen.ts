import { Screen } from "UI/Screen";
import { Rectangle } from "../../Shape/Rectangle";
import { Viewport } from "../../Core/Viewport";
import { Runtime } from "Core/Runtime";
import { Logger } from "Util/Logger";
import { Position } from "../../Shape/Polygon";
import { Point, MidPoint } from "../../Shape/Point";
import { Thing, StaticThing } from "../../UI/Thing";
import { QuarteredContextLayer } from "../../Core/ContextLayer";
import { Mouse } from "../../IO/Mouse";
import { Color } from "../../Util/Color";

export class LoadingScreen extends Screen {

	constructor() {
		super();
		Viewport.reset();
		Viewport.layers.set("items", new QuarteredContextLayer(2));
		for (var i: number = 0; i < 1; i++) {
			this.elements.push(new Thing(Viewport.layers.get("items"), Color.getRandomColor()));
		}

		Viewport.layers.set("background", new QuarteredContextLayer(1));
		this.elements.push(new StaticThing(Viewport.layers.get("background"), "darkblue",
			new Rectangle(
				new MidPoint(Viewport.area.topLeft(), Viewport.area.getPoint(Position.Center)),
				new MidPoint(Viewport.area.getPoint(Position.Center), Viewport.area.bottomRight())
			)
		));
		Viewport.layers.set("mouse", new QuarteredContextLayer(10));
		this.mouse = new Mouse(Viewport.layers.get("mouse"));
		this.elements.push(this.mouse);
	}

}