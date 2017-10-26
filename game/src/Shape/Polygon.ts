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
	protected points: Map<Position, Point> = new Map<Position, Point>();

	public getPoint(position: Position): Point {
		return this.points.get(position);
	}

}