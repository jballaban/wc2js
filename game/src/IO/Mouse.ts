import { Thing } from "../UI/Thing";
import { Element } from "../Core/Element";
import { Rectangle, PointRectangle } from "../Shape/Rectangle";
import { Point } from "../Shape/Point";
import { ContextLayer } from "../Core/ContextLayer";
import { Circle } from "../Shape/Circle";
import { Logger } from "../Util/Logger";
import { Runtime } from "../Core/Runtime";
import { Viewport } from "../Core/Viewport";
import { ElementType } from "../Core/ElementType";
import { Vector } from "../Core/Vector";
import { Light } from "../UI/Light";

export class Mouse extends Element {
	private _color: string;
	private color: string;
	private moveX: number;
	private moveY: number;
	private light: Light;

	public constructor() {
		var origin: Point = new Point(0, 0, null);
		super(ElementType.Mouse, origin, new Circle(origin, 200), 10);
		this.color = this._color = "white";
		this.moveX = null;
		this.moveY = null;
		this.light = new Light(new Circle(origin, 200), 200, "rgba(255,255,255,1)");
	}

	public canCollide(element: Element): boolean {
		return true;
	}

	public onCollide(element: Element, on: boolean): void {
		if (on && this._color === this.color) {
			this.color = "red";
			Runtime.screen.container.update(this, false);
		} else if (!on && this._color !== this.color && this.collisions.length === 0) {
			this.color = this._color;
			Runtime.screen.container.update(this, false);
		}
	}

	public onMove(offsetX: number, offsetY: number): void {
		this.moveX += offsetX;
		this.moveY += offsetY;
	}

	public update(step: number): void {
		super.update(step);
		if (this.moveX !== 0 || this.moveY !== 0) {
			this.move(this.origin.x() + this.moveX, this.origin.y() + this.moveY);
			if (this.origin.x() > Viewport.area.width()) {
				this.move(Viewport.area.width(), null);
			}
			if (this.origin.y() > Viewport.area.height()) {
				this.move(null, Viewport.area.height());
			}
			this.moveX = 0;
			this.moveY = 0;
		}
		this.light.update();
	}

	public render(ctx: CanvasRenderingContext2D): void {
		//	this.area.render(ctx, this.color);
		this.light.draw(ctx);
	}

}