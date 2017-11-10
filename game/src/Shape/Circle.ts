import { IShape, ShapeType } from "./IShape";
import { Rectangle } from "./Rectangle";
import { Point } from "./Point";
import { Collision } from "../Util/Collision";

export class Circle implements IShape {
	public r: number;
	public type: ShapeType = ShapeType.Circle;

	constructor(public origin: Point, radius: number) {
		this.r = radius;
	}

	public changed(): boolean {
		this.origin.recalculate();
		return this.origin.changed;
	}

	public clearChanged(): void {
		this.origin.changed = false;
	}

	public x(): number {
		return this.origin.x();
	}

	public y(): number {
		return this.origin.y();
	}

	public intersects(shape: IShape): boolean {
		return Collision.intersects(this, shape);
	}

	public render(ctx: CanvasRenderingContext2D, colour: string): void {
		ctx.fillStyle = colour;
		ctx.beginPath();
		ctx.arc(this.origin.x(), this.origin.y(), this.r, 0, 2 * Math.PI);
		ctx.fill();
	}

}