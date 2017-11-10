import { Polygon, Position } from "./Polygon";
import { Point, MidPoint, DynamicPoint, DynamicDimension } from "./Point";
import { IShape, ShapeType } from "./IShape";
import { Collision } from "../Util/Collision";
import { Logger } from "../Util/Logger";

export class Rectangle extends Polygon implements IShape {
	public origin: Point;
	public type: ShapeType = ShapeType.Rectangle;

	public constructor(public topLeft: Point, public bottomRight: Point) {
		super();
		this.origin = topLeft;
	}

	public changed(): boolean {
		return this.topLeft.changed || this.bottomRight.changed;
	}

	public clearChanged(): void {
		this.topLeft.changed = this.bottomRight.changed = false;
	}

	public x(): number {
		return this.topLeft.x();
	}

	public y(): number {
		return this.topLeft.y();
	}

	public x2(): number {
		return this.bottomRight.x();
	}

	public y2(): number {
		return this.bottomRight.y();
	}

	public width(): number {
		return this.x2() - this.x();
	}

	public height(): number {
		return this.y2() - this.y();
	}

	public toString(): string {
		return "[" + this.x() + "," + this.y() + "] - [" + this.x2() + "," + this.y2() + "]";
	}

	public intersects(shape: IShape): boolean {
		return Collision.intersects(this, shape);
	}

	public render(ctx: CanvasRenderingContext2D, colour: string): void {
		ctx.fillStyle = colour;
		ctx.fillRect(this.x(), this.y(), this.width(), this.height());
	}
}

export class PointRectangle extends Rectangle {
	constructor(point: Point) {
		super(point, new Point(1, 1, point));
	}
}