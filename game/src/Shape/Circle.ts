import { IShape, ShapeType } from "./IShape";
import { Rectangle } from "./Rectangle";
import { Point } from "./Point";
import { Collision } from "../Util/Collision";

export class Circle implements IShape {
	public r: number;
	public origin: Point;
	public type: ShapeType = ShapeType.Circle;

	constructor(public center: Point, radius: number) {
		this.origin = center;
		this.r = radius;
	}

	public changed(): boolean {
		return this.center.changed;
	}

	public clearChanged(): void {
		this.center.changed = false;
	}

	public x(): number {
		return this.center.x();
	}

	public y(): number {
		return this.center.y();
	}

	public intersects(shape: IShape): boolean {
		return Collision.intersects(this, shape);
	}

	public render(ctx: CanvasRenderingContext2D, colour: string): void {
		ctx.fillStyle = colour;
		ctx.beginPath();
		ctx.arc(this.center.x(), this.center.y(), this.r, 0, 2 * Math.PI);
		ctx.fill();
	}

}