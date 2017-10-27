import { Element } from "../Core/Element";
import { Rectangle, PointRectangle } from "../Shape/Rectangle";
import { Point } from "../Shape/Point";
import { ContextLayer } from "../Core/ContextLayer";
import { Circle } from "../Shape/Circle";

export class Mouse extends Element {
	private _color: string;
	private color: string;
	private moveX: number;
	private moveY: number;

	public constructor() {
		var origin: Point = new Point(0, 0, null);
		super(origin, new Circle(origin, 10));
		this.color = this._color = "black";
		this.moveX = null;
		this.moveY = null;
	}

	public canCollide(element: Element): boolean {
		return true;
	}

	public onCollide(element: Element, on: boolean) {
		if (on && this._color === this.color) {
			this.color = "red";
			this.container.update(this, false);
		} else if (!on && this._color != this.color && this.collisions.length == 0) {
			this.color = this._color;
			this.container.update(this, false);
		}
	}

	public onMove(offsetX: number, offsetY: number): void {
		this.moveX = offsetX;
		this.moveY = offsetY;
	}

	public update(step: number): void {
		super.update(step);
		if (this.moveX != null) {
			this.move(this.moveX, this.moveY);
			this.moveX = null;
			this.moveY = null;
		}
	}

	public render(ctx: CanvasRenderingContext2D): void {
		this.area.render(ctx, this.color);
	}

}