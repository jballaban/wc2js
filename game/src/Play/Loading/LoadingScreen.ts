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

	public onActivate(): void {
		this.elements = new ElementContainer(256, new Rectangle(new Point(0, 0, null), new Point(1024, 768, null)));
		for (var i: number = 0; i < 600; i++) {
			var thing = new Thing(Color.getRandomColor());
			thing.direction = new Vector(Math.random() * 40 - 20, Math.random() * 40 - 20);
			this.elements.register(thing);
			thing.move(Math.random() * Viewport.area.width(), Math.random() * Viewport.area.height());
		}
		this.elements.register(new StaticThing(
			"darkblue",
			new Rectangle(
				Viewport.area.topLeft(),
				Viewport.area.getPoint(Position.Center)
			)
		));
		this.mouse = new Mouse();
		this.elements.register(this.mouse);
	}

}