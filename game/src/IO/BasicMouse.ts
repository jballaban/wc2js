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
import { Mouse } from "./Mouse";
import { ElementContainer } from "../Core/ElementContainer";

export class BasicMouse extends Mouse {
	private _color: string;
	private color: string;

	public constructor(container: ElementContainer, x: number, y: number) {
		super(container, new Circle(new Point(x, y), 50), 10);
		this.color = this._color = "rgba(255,255,255,1)";
	}

	public render(ctx: CanvasRenderingContext2D): void {
		this.area.render(ctx, this.color);
	}

}