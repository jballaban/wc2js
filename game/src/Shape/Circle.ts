import { IShape } from "./IShape";
import { Rectangle } from "./Rectangle";
import { Point } from "./Point";
import { Collision } from "../Util/Collision";

export class Circle extends Point implements IShape {
	public r: number;

	constructor(point: Point, radius: number) {
		super(0, 0, point);
		this.r = radius;
	}

	public intersects(shape: IShape): boolean {
		return Collision.intersects(this, shape);
	}

	public render(ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = "#FF0000";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
	}

}