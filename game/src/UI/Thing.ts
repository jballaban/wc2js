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
import { Screen } from "../Core/Screen";
import { ElementContainer } from "../Core/ElementContainer";

export class StaticThing extends Element {
	private _color: string;
	constructor(container: ElementContainer, private color: string, area: Circle) {
		super(container, ElementType.StaticThing, area, 4, ElementType.Thing);
		this.color = this._color = color;
	}

	public onCollide(element: Element, on: boolean): void {
		if (on && this.color === this._color) {
			this.color = "gray";
			this.container.update(this, false);
		} else if (!on && this.color !== this._color && this.collisions.length === 0) {
			this.color = this._color;
			this.container.update(this, false);
		}
	}

	public render(ctx: CanvasRenderingContext2D): void {
		this.area.render(ctx, this.color);
	}
}

export class Thing extends Element {
	private _color: string;
	public direction: Vector;
	public speed: number;
	public minSpeed: number;
	public maxSpeed: number;

	constructor(container: ElementContainer, private color: string, area: IShape) {
		// tslint:disable-next-line:no-bitwise
		super(container, ElementType.Thing, area, 5, ElementType.StaticThing | ElementType.Mouse);
		this._color = color;
		this.direction = new Vector(0, 0);
		this.minSpeed = this.speed = 0;
		this.maxSpeed = 20;
	}

	public update(step: number): void {
		this.speed -= .5;
		this.speed = Math.max(this.minSpeed, this.speed);
		var move: Vector = this.direction.clone().multiply(step * this.speed);
		this.inc(move.x, move.y);
		if (this.area.origin.x() <= 0 || this.area.origin.x() >= this.container.area.width()
			|| this.area.origin.y() <= 0 || this.area.origin.y() >= this.container.area.height()) {
			this.direction.multiply(-1);
		}
		super.update(step);
	}

	public onCollide(element: Element, on: boolean): void {
		if (this.color === this._color && this.collisions.length > 0) {
			this.color = "rgba(255,0,0,0.8)";
			this.container.update(this, false);
		} else if (this.color !== this._color && this.collisions.length === 0) {
			this.color = this._color;
			this.container.update(this, false);
		}
		if (on && (
			element.type === ElementType.Mouse
		)) {
			this.direction = new Vector(
				this.area.origin.x() - element.area.origin.x(),
				this.area.origin.y() - element.area.origin.y()
			);
			this.speed = Math.ceil(Math.random() * this.maxSpeed / 2) + this.maxSpeed / 2;
		}
	}

	public render(ctx: CanvasRenderingContext2D): void {
		this.area.render(ctx, this.color);
	}
}