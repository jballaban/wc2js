import { IShape } from "../Shape/IShape";
import { Rectangle } from "../Shape/Rectangle";
import { Circle } from "../Shape/Circle";

export class Collision {
	public static intersects(shape1: IShape, shape2: IShape): boolean {
		if (shape1 instanceof Rectangle && shape2 instanceof Rectangle) {
			return Collision.rectRectIntersect(shape1, shape2);
		} else if (shape1 instanceof Circle && shape2 instanceof Rectangle) {
			return Collision.rectCircleIntersect(shape2, shape1);
		} else if (shape1 instanceof Rectangle && shape2 instanceof Circle) {
			return Collision.rectCircleIntersect(shape1, shape2);
		} else if (shape1 instanceof Circle && shape2 instanceof Circle) {
			return Collision.circleCircleIntersect(shape1, shape2);
		}
		throw "Unknown";
	}

	private static circleCircleIntersect(circle1: Circle, circle2: Circle): boolean {
		var distance: number = Math.sqrt(
			(circle1.x - circle2.x) * (circle1.x - circle2.x)
			+ ((circle1.y - circle2.y) * (circle1.y - circle2.y))
		);
		if (distance < circle1.r + circle2.r) {
			//balls have collided
			return true; // this isn't a true collission, just that the rectangle representations of each circle hvae collided
		}
		return false;
	}

	private static rectCircleIntersect(rect: Rectangle, circle: Circle): boolean {
		var distX = Math.abs(circle.x - rect.x() - rect.width() / 2);
		var distY = Math.abs(circle.y - rect.y() - rect.height() / 2);

		if (distX > (rect.width() / 2 + circle.r)) { return false; }
		if (distY > (rect.height() / 2 + circle.r)) { return false; }

		if (distX <= (rect.width() / 2)) { return true; }
		if (distY <= (rect.height() / 2)) { return true; }

		var dx = distX - rect.width() / 2;
		var dy = distY - rect.height() / 2;
		console.log(dy);
		return (dx * dx + dy * dy <= (circle.r * circle.r));
	}

	private static rectRectIntersect(rect1: Rectangle, rect2: Rectangle): boolean {
		// If one rectangle is on left side of other
		if (rect2.x() > rect1.x2() || rect2.x2() < rect1.x())
			return false;

		// If one rectangle is above other
		if (rect2.y() > rect1.y2() || rect2.y2() < rect1.y())
			return false;

		return true;
	}
}