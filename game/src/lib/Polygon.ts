import { Point } from "./Point";

export enum Position {
	TopLeft,
	TopCenter,
	TopRight,
	RightCenter,
	BottomRight,
	BottomCenter,
	BottomLeft,
	LeftCenter,
	Center,
	Origin
}

export class Polygon {
	public points: Map<Position, Point> = new Map<Position, Point>();

	public constructor(origin: Point) {
		this.points.set(Position.Origin, origin);
	}

	public getPoint(position: Position): Point {
		return this.points.get(position);
	}
}