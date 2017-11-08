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
import { NoMouse } from "../IO/NoMouse";
import { MouseHandler, CursorState, Cursor } from "../IO/MouseHandler";
import { BasicMouse } from "../IO/BasicMouse";
import { Element } from "../Core/Element";

export class LoadingScreen extends Screen {

	public constructor() {
		super();
		this.init(256, new Rectangle(new Point(0, 0, null), new Point(1024, 768, null)));
	}

	public doUpdates(dt: number): void {
		var cursors: Cursor[] = Array.from(MouseHandler.cursors.values());
		for (var i: number = 0; i < cursors.length; i++) {
			switch (cursors[i].state) {
				case CursorState.added:
					cursors[i].data = new BasicMouse(cursors[i].x, cursors[i].y);
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
		super.doUpdates(dt);
	}

}