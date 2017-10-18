import { Polygon, Position } from "./Polygon";
import { Point, MidPoint, DynamicPoint, DynamicDimension } from "./Point";

export class Rectangle extends Polygon {
	public constructor(origin: Point, topleft: Point, bottomright: Point) {
		super(origin);
		this.points.set(Position.TopLeft, topleft);
		this.points.set(Position.BottomRight, bottomright);
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
			}
			if (result != null) {
				this.points.set(position, result);
			}
		}
		return result;
	}
}