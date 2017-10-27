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
import { ElementContainer } from "../../Core/ElementContainer";
import { Vector } from "../../Core/Vector";

export class LoadingScreen extends Screen {

	public onActivate(): void {
		this.container = new ElementContainer(256 * 2, new Rectangle(new Point(0, 0, null), new Point(1024 * 2, 768 * 2, null)));

		for (var i: number = 0; i < 800; i++) {
			var thing: Thing = new Thing(Color.getRandomColor());
			thing.direction = new Vector(Math.random() * 40 - 20, Math.random() * 40 - 20);
			this.container.register(thing);
			thing.move(Math.random() * this.container.area.width(), Math.random() * this.container.area.height());
		}
		this.container.register(new StaticThing(
			"darkblue",
			new Rectangle(
				this.container.area.topLeft(),
				Viewport.area.getPoint(Position.Center)
			)
		));
		this.mouse = new Mouse();
		this.container.register(this.mouse);
	}

}