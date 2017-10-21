import { Polygon, Position } from "./Polygon";
import { Point, MidPoint, DynamicPoint, DynamicDimension } from "./Point";

export class Rectangle extends Polygon {
	public constructor(topleft: Point, bottomright: Point) {
		super();
		this.points.set(Position.TopLeft, topleft);
		this.points.set(Position.BottomRight, bottomright);
	}

	public x(): number {
		return this.getPoint(Position.TopLeft).x;
	}

	public y(): number {
		return this.getPoint(Position.TopLeft).y;
	}

	public x2(): number {
		return this.getPoint(Position.BottomRight).x
	}

	public y2(): number {
		return this.getPoint(Position.BottomRight).y
	}

	public width(): number {
		return this.x2() - this.x();
	}

	public height(): number {
		return this.y2() - this.y();
	}

	public topLeft(): Point {
		return this.points.get(Position.TopLeft);
	}

	public bottomRight(): Point {
		return this.points.get(Position.BottomRight);
	}

	public getPoint(position: Position): Point {
		var result: Point = super.getPoint(position);
		if (result == null) {
			switch (position) {
				case Position.TopCenter:
					result = new MidPoint(this.getPoint(Position.TopLeft), this.getPoint(Position.TopRight));
					break;
				case Position.TopRight:
					result = new DynamicPoint(this.getPoint(Position.TopLeft), this.getPoint(Position.BottomRight), DynamicDimension.x);
					break;
				case Position.RightCenter:
					result = new MidPoint(this.getPoint(Position.TopRight), this.getPoint(Position.BottomRight));
					break;
				case Position.BottomCenter:
					result = new MidPoint(this.getPoint(Position.BottomLeft), this.getPoint(Position.BottomRight));
					break;
				case Position.BottomLeft:
					result = new DynamicPoint(this.getPoint(Position.TopLeft), this.getPoint(Position.BottomRight), DynamicDimension.y);
					break;
				case Position.LeftCenter:
					result = new MidPoint(this.getPoint(Position.TopLeft), this.getPoint(Position.BottomLeft));
					break;
				case Position.Center:
					result = new MidPoint(this.getPoint(Position.TopLeft), this.getPoint(Position.BottomRight));
					break;
				default:
					throw "Rectangle: Unknown position " + position;
			}
			this.points.set(position, result);
		}
		return result;
	}

	public intersects(rect: Rectangle): boolean {
		// If one rectangle is on left side of other
		if (rect.x() > this.x2() || rect.x2() < this.x())
			return false;

		// If one rectangle is above other
		if (rect.y() > this.y2() || rect.y2() < this.y())
			return false;

		return true;
	}
}