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
import { Cursor, MouseHandler, CursorState } from "../IO/MouseHandler";

export class PlayScreen extends Screen {

	public constructor() {
		super(256, new Rectangle(new Point(0, 0), new Point(1024, 768)));
	}

	public activate(): void {
		super.activate();
		for (var i: number = 0; i < 1800; i++) {
			var position: Point = new Point(Math.random() * this.container.area.width(), Math.random() * this.container.area.height());
			var thing: Thing = new Thing(
				this.container,
				Color.makeRGBA(Color.getRandomRGB(), 0.8),
				Math.floor(Math.random() * 2) === 1 ?
					new Rectangle(position, new Point(Math.floor(Math.random() * 10) + 5, Math.floor(Math.random() * 10) + 5, position))
					: new Circle(position, Math.floor(Math.random() * 10) + 5));
			this.container.register(thing);
		}
		this.container.register(new StaticThing(
			this.container,
			"darkblue",
			new Circle(new MidPoint(
				this.viewport.area.topLeft,
				this.viewport.area.bottomRight
			), 300)
		));
	}

	public update(dt: number): void {
		var cursors: Cursor[] = Array.from(MouseHandler.cursors.values());
		for (var i: number = 0; i < cursors.length; i++) {
			switch (cursors[i].state) {
				case CursorState.added:
					cursors[i].data = new BasicMouse(this.container, cursors[i].x, cursors[i].y);
					this.container.register(cursors[i].data);
					break;
				case CursorState.moved:
					cursors[i].data.move(cursors[i].x, cursors[i].y);
					break;
				case CursorState.remove:
					this.container.deregister(cursors[i].data);
					break;
			}
		}
		super.update(dt);
	}

}