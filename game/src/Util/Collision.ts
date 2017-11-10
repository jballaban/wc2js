import { IShape, ShapeType } from "../Shape/IShape";
import { Rectangle } from "../Shape/Rectangle";
import { Circle } from "../Shape/Circle";
import { Point } from "../Shape/Point";
import { Line } from "../Shape/Line";
import { Logger } from "./Logger";

export class Collision {

	public static intersects(shape1: IShape, shape2: IShape): boolean {
		switch (shape1.type) {
			case ShapeType.Rectangle:
				switch (shape2.type) {
					case ShapeType.Rectangle:
						return Collision.rectRectIntersect(shape1 as Rectangle, shape2 as Rectangle);
					case ShapeType.Circle:
						return Collision.rectCircleIntersect(shape1 as Rectangle, shape2 as Circle);
				}
				break;
			case ShapeType.Circle:
				switch (shape2.type) {
					case ShapeType.Rectangle:
						return Collision.rectCircleIntersect(shape2 as Rectangle, shape1 as Circle);
					case ShapeType.Circle:
						return Collision.circleCircleIntersect(shape1 as Circle, shape2 as Circle);
				}
				break;
		}
	}

	public static getIntersectionLineAtX(line: Line, x: number): Point {
		throw "Untested";
		/* 	// y = mx + b
			return new Point(x,
				(
					(line.p2.y() - line.p1.y())
					/
					(line.p2.x() - line.p1.x())
				)
				* (x - line.p1.x())
				+ line.p1.y()
				, null);
				*/
	}

	public static getIntersectionLineAtY(line: Line, y: number): Point {
		throw "Untested";
		/* 	// x = (y-b)/m
			return new Point(
				(
					y - line.p1.y()
				)
				/
				(
					(line.p2.y() - line.p1.y())
					/
					(line.p2.x() - line.p1.x())
				)
				+ line.p1.x()
				, y, null); */
	}

	public static getIntersectionLineLine(line1: Line, line2: Line): Point {
		throw "Untested";
		/* if (
			((line1.p1.x() - line1.p2.x()) * (line2.p1.y() - line2.p2.y()))
			-
			((line1.p1.y() - line1.p2.y()) * (line2.p1.x() - line2.p2.x()))
			=== 0) {
			return null;
		}
		return new Point(
			(
				(
					(line1.p1.x() * line1.p2.y() - line1.p1.y() * line1.p2.x()) * (line2.p1.x() - line2.p2.x())
				)
				- (
					(line1.p1.x() - line1.p2.x()) * (line2.p1.x() * line2.p2.y() - line2.p1.y() * line2.p2.x())
				)
			)
			/ (
				(
					(line1.p1.x() - line1.p2.x()) * (line2.p1.y() - line2.p2.y()))
				- (
					(line1.p1.y() - line1.p2.y()) * (line2.p1.x() - line2.p2.x())
				)
			),
			(
				(
					(line1.p1.x() * line1.p2.y() - line1.p1.y() * line1.p2.x()) * (line2.p1.y() - line2.p2.y())
				)
				- (
					(line1.p1.y() - line1.p2.y()) * (line2.p1.x() * line2.p2.y() - line2.p1.y() * line2.p2.x())
				)
			)
			/ (
				(
					(line1.p1.x() - line1.p2.x()) * (line2.p1.y() - line2.p2.y()))
				- (
					(line1.p1.y() - line1.p2.y()) * (line2.p1.x() - line2.p2.x())
				)
			), null); */
	}

	public static getDistance(p1: Point, p2: Point): number {
		return Math.sqrt(Math.pow(p2.x() - p1.x(), 2) + Math.pow(p2.y() - p1.y(), 2));
	}

	public static getIntersectionLineCircle(line: Line, circle: Circle): Point {
		// https://stackoverflow.com/questions/1073336/circle-line-segment-collision-detection-algorithm
		var len: number = this.getDistance(line.p1, line.p2);
		var d: Point = new Point(
			(line.p2.x() - line.p1.x()) / len,
			(line.p2.y() - line.p1.y()) / len,
			null
		);
		var t: number = d.x() * (circle.origin.x() - line.p1.x()) + d.y() * (circle.origin.y() - line.p1.y());
		var e: Point = new Point(
			t * d.x() + line.p1.x(),
			t * d.y() + line.p1.y(),
			null
		);
		var dist: number = Math.sqrt(Math.pow(e.x() - circle.x(), 2) + Math.pow(e.y() - circle.y(), 2));
		if (dist < circle.r) {
			var dt: number = Math.sqrt(Math.pow(circle.r, 2) - Math.pow(dist, 2));
			if (t - dt >= 0 && t - dt <= len) {
				return new Point(
					(t - dt) * d.x() + line.p1.x(),
					(t - dt) * d.y() + line.p1.y(),
					null
				);
			} else if (t + dt >= 0 && t - dt <= len) {
				return new Point(
					(t + dt) * d.x() + line.p1.x(),
					(t + dt) * d.y() + line.p1.y(),
					null
				);
			}
		} else if (dist === circle.r) {
			return e;
		}
		return null;
	}

	private static circleCircleIntersect(circle1: Circle, circle2: Circle): boolean {
		if (circle1.x() + circle1.r + circle2.r > circle2.x()
			&& circle1.x() < circle2.x() + circle1.r + circle2.r
			&& circle1.y() + circle1.r + circle2.r > circle2.y()
			&& circle1.y() < circle2.y() + circle1.r + circle2.r) {
			var distance: number = Math.sqrt(
				(circle1.x() - circle2.x()) * (circle1.x() - circle2.x())
				+ (circle1.y() - circle2.y()) * (circle1.y() - circle2.y())
			);
			if (distance < circle1.r + circle2.r) {
				return true;
			}
		}
		return false;
	}

	private static rectCircleIntersect(rect: Rectangle, circle: Circle): boolean {
		var distX: number = Math.abs(circle.x() - rect.x() - rect.width() / 2);
		var distY: number = Math.abs(circle.y() - rect.y() - rect.height() / 2);

		if (distX > (rect.width() / 2 + circle.r)) { return false; }
		if (distY > (rect.height() / 2 + circle.r)) { return false; }

		if (distX <= (rect.width() / 2)) { return true; }
		if (distY <= (rect.height() / 2)) { return true; }

		var dx: number = distX - rect.width() / 2;
		var dy: number = distY - rect.height() / 2;
		return (dx * dx + dy * dy <= (circle.r * circle.r));
	}

	private static rectRectIntersect(rect1: Rectangle, rect2: Rectangle): boolean {
		// if one rectangle is on left side of other
		if (rect2.x() > rect1.x2() || rect2.x2() < rect1.x()) {
			return false;
		}

		// if one rectangle is above other
		if (rect2.y() > rect1.y2() || rect2.y2() < rect1.y()) {
			return false;
		}

		return true;
	}
}