import { Mouse } from "../IO/Mouse";
import { Element } from "../Core/Element";
import { Viewport } from "../Core/Viewport";
import { Rectangle } from "../Shape/Rectangle";
import { ContextLayer } from "../Core/ContextLayer";
import { Point } from "../Shape/Point";
import { Vector } from "../Core/Vector";
import { IShape } from "../Shape/IShape";
import { Circle } from "../Shape/Circle";
import { Logger } from "../Util/Logger";

export class StaticThing extends Element {
	private _color: string;
	private color: string;
	constructor(layer: ContextLayer, color: string, rect: Rectangle) {
		super(null, rect, layer);
		this._color = color;
	}

	public update(step: number): void {
		super.update(step);
		if (this.color === this._color && this.collisions.length > 0) {
			this.color = "red";
			this.requiresRedraw = true;
		} else if (this.color !== this._color && this.collisions.length === 0) {
			this.color = this._color;
			this.requiresRedraw = true;
		}
	}

	public render(): boolean {
		if (!super.render()) {
			return false;
		}
		console.log("reder");
		this.area.render(this.layer.ctx, this.color);
		return true;
	}
}

export class Thing extends Element {
	private _color: string;
	private color: string;
	private direction: Vector;

	constructor(layer: ContextLayer, color: string) {
		var origin: Point = new Point(0, 0, null);
		var shape: IShape = Math.floor(Math.random() * 2) === 0 ?
			new Rectangle(origin, new Point(Math.floor(Math.random() * 50), Math.floor(Math.random() * 25), origin))
			: new Circle(origin, Math.floor(Math.random() * 25));
		super(origin, shape, layer);
		this._color = color;
		this.color = color;
		this.direction = new Vector(Math.random() * 40 - 20, Math.random() * 40 - 20);
	}

	public collides(element: Element): boolean {
		if (element instanceof Thing || element instanceof Mouse) {
			return super.collides(element);
		}
		return false;
	}

	public update(step: number): void {
		super.update(step);
		var move: Vector = this.direction.clone().multiply(step);
		this.inc(move.x, move.y);
		if (this.origin.x > Viewport.area.x2()) {
			this.move(0, null);
		}
		if (this.origin.x < 0) {
			this.move(Viewport.area.x2(), null);
		}
		if (this.origin.y > Viewport.area.y2()) {
			this.move(null, 0);
		}
		if (this.origin.y < 0) {
			this.move(null, Viewport.area.y2());
		}
		if (this.color === this._color && this.collisions.length > 0) {
			this.color = "red";
			this.requiresRedraw = true;
		} else if (this.color !== this._color && this.collisions.length === 0) {
			this.color = this._color;
			this.requiresRedraw = true;
		}
	}

	public render(): boolean {
		if (!super.render()) {
			return false;
		}
		this.area.render(this.layer.ctx, this.color);
		return true;
	}
}