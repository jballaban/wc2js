import { Screen } from "../Core/Screen";
import { Rectangle } from "../Shape/Rectangle";
import { Camera } from "../Core/Camera";
import { Runtime } from "Core/Runtime";
import { Logger } from "Util/Logger";
import { Position } from "../Shape/Polygon";
import { Point, MidPoint } from "../Shape/Point";
import { Thing, StaticThing } from "../UI/Thing";
import { ContextLayer } from "../Core/ContextLayer";
import { Mouse } from "../IO/Mouse";
import { Color } from "../Util/Color";
import { ElementContainer } from "../Core/ElementContainer";
import { Vector } from "../Core/Vector";
import { Circle } from "../Shape/Circle";
import { BasicMouse } from "../IO/BasicMouse";

export class PlayScreen extends Screen {

	public constructor() {
		super();
	}

	public init(): void {
		super.init(256, new Rectangle(new Point(0, 0, null), new Point(1024, 768, null)));
	}

	public onActivate(): void {
		this.init();
		super.onActivate();
		for (var i: number = 0; i < 1800; i++) {
			var thing: Thing = new Thing(Color.makeRGBA(Color.getRandomRGB(), 0.8));
			this.container.register(thing);
		}
		this.container.register(new StaticThing(
			"darkblue",
			Screen.current.camera.area.getPoint(Position.Center),
			new Circle(
				Screen.current.camera.area.getPoint(Position.Center), 300
			)
		));
	}

}