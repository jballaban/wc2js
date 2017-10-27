import { IShape, ShapeType } from "../Shape/IShape";
import { Rectangle } from "../Shape/Rectangle";
import { Circle } from "../Shape/Circle";

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