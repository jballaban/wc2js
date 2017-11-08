import { Thing } from "../UI/Thing";
import { Element } from "../Core/Element";
import { Rectangle, PointRectangle } from "../Shape/Rectangle";
import { Point } from "../Shape/Point";
import { ContextLayer } from "../Core/ContextLayer";
import { Circle } from "../Shape/Circle";
import { Logger } from "../Util/Logger";
import { Runtime } from "../Core/Runtime";
import { Camera } from "../Core/Camera";
import { ElementType } from "../Core/ElementType";
import { Vector } from "../Core/Vector";
import { Light } from "../UI/Light";
import { Mouse } from "./Mouse";

export class BasicMouse extends Mouse {
	private _color: string;
	private color: string;

	public constructor() {
		var origin: Point = new Point(0, 0, null);
		super(ElementType.Mouse, origin, new Circle(origin, 50), 10);
		this.color = this._color = "rgba(255,255,255,1)";
	}

	public canCollide(element: Element): boolean {
		return true;
	}

	public render(ctx: CanvasRenderingContext2D): void {
		this.area.render(ctx, this.color);
	}

}