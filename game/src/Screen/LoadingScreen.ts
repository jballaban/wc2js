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
import { MouseHandler, CursorState, Cursor } from "../IO/MouseHandler";
import { BasicMouse } from "../IO/BasicMouse";
import { Element } from "../Core/Element";

export class LoadingScreen extends Screen {

	public constructor() {
		super(256, new Rectangle(new Point(0, 0, null), new Point(0, 0, null)));
	}

	public preUpdate(): void {
		super.preUpdate();
		if (this.camera.area.changed()) {
			this.container.resize(this.camera.area);
		}
	}

}