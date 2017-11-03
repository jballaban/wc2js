import { Mouse } from "../IO/Mouse";
import { Element } from "../Core/Element";
import { Camera } from "../Core/Camera";
import { Rectangle } from "../Shape/Rectangle";
import { ContextLayer } from "../Core/ContextLayer";
import { Point } from "../Shape/Point";
import { Vector } from "../Core/Vector";
import { IShape } from "../Shape/IShape";
import { Circle } from "../Shape/Circle";
import { Logger } from "../Util/Logger";
import { Color } from "../Util/Color";
import { Runtime } from "../Core/Runtime";
import { ElementType } from "../Core/ElementType";

export class StaticThing extends Element {
	private _color: string;
	private color: string;
	constructor(color: string, rect: Rectangle) {
		super(ElementType.StaticThing, rect.topLeft(), rect, 4);
		this.color = this._color = color;
	}

	public canCollide(element: Element): boolean {
		return element.type === ElementType.Mouse;
	}

	public onCollide(element: Element, on: boolean): void {
		if (on && this.color === this._color) {
			this.color = "gray";
			Runtime.screen.container.update(this, false);
		} else if (!on && this.color !== this._color && this.collisions.length === 0) {
			this.color = this._color;
			Runtime.screen.container.update(this, false);
		}
	}

	public render(ctx: CanvasRenderingContext2D): void {
		this.area.render(ctx, this.color);
	}
}

export class Thing extends Element {
	private _color: string;
	private color: string;
	public direction: Vector;

	constructor(color: string) {
		var origin: Point = new Point(Math.random() * 1024, Math.random() * 768, null);
		var shape: IShape = Math.floor(Math.random() * 2) == 1 ?
			new Rectangle(origin, new Point(Math.floor(Math.random() * 20), Math.floor(Math.random() * 20), origin))
			: new Circle(origin, Math.floor(Math.random() * 20));
		super(ElementType.Thing, origin, shape, 5);
		this._color = color;
		this.color = color;
		this.direction = new Vector(0, 0);
	}

	public canCollide(element: Element): boolean {
		return element.type === ElementType.Thing || element.type === ElementType.Mouse;
	}

	public update(step: number): void {
		if (Math.random() * 2 === 1) { return; }
		var move: Vector = this.direction.clone().multiply(step);
		this.inc(move.x, move.y);
		if (this.origin.x() <= 0 || this.origin.x() >= Runtime.screen.container.area.width()
			|| this.origin.y() <= 0 || this.origin.y() >= Runtime.screen.container.area.height()) {
			this.direction.multiply(-1);
		}
		super.update(step);
	}

	public onCollide(element: Element, on: boolean): void {
		if (this.color === this._color && this.collisions.length > 0) {
			this.color = "red";
			Runtime.screen.container.update(this, false);
		} else if (this.color !== this._color && this.collisions.length === 0) {
			this.color = this._color;
			Runtime.screen.container.update(this, false);
		}
		if (on && element.type === ElementType.Thing) {
			(element as Thing).direction = new Vector(
				(element as Thing).origin.x() - this.origin.x(),
				(element as Thing).origin.y() - this.origin.y()
			);
		}
	}

	public render(ctx: CanvasRenderingContext2D): void {
		this.area.render(ctx, this.color);
	}
}