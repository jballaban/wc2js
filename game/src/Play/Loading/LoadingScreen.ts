import { Screen } from "UI/Screen";
import { Rectangle } from "../../Shape/Rectangle";
import { Camera } from "../../Core/Camera";
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
import { Circle } from "../../Shape/Circle";

export class LoadingScreen extends Screen {

	public constructor() {
		super(256, new Rectangle(new Point(0, 0, null), new Point(1024, 768, null)));

	}

	public onActivate() {
		super.onActivate();
		for (var i: number = 0; i < 1800; i++) {
			var thing: Thing = new Thing(Color.getRandomColor());
			thing.direction = new Vector(0, 0);
			this.container.register(thing);
		}
		this.container.register(new StaticThing(
			"darkblue",
			Runtime.screen.camera.area.getPoint(Position.Center),
			new Circle(
				Runtime.screen.camera.area.getPoint(Position.Center), 300
			)
		));
	}

}