import { Point } from "../src/UI/Point";
import { Rectangle } from "../src/UI/Rectangle";
import { Position } from "../src/UI/Polygon";
import { Viewport } from "../src/UI/Viewport";
import { Runtime } from "../src/Core/Runtime";
import { expect } from "chai";
import "mocha";

describe("Dimension test", () => {

	it("dependentrectangle", () => {
		Runtime.init();
		Viewport.init();
		var origin: Point = new Point(0, 0, null);
		var background: Rectangle = new Rectangle(origin, origin, Viewport.bottomRight);
		expect(background.getPoint(Position.TopLeft).x).equal(0);
		expect(background.getPoint(Position.TopCenter).x).equal(1024 / 2);
		expect(background.getPoint(Position.TopRight).x).equal(1024);
		expect(background.getPoint(Position.RightCenter).y).equal(768 / 2);
		expect(background.getPoint(Position.BottomRight).y).equal(768);
		expect(background.getPoint(Position.BottomCenter).x).equal(1024 / 2);
		expect(background.getPoint(Position.BottomLeft).x).equal(0);
		expect(background.getPoint(Position.LeftCenter).y).equal(768 / 2);
		expect(background.getPoint(Position.Center).x).equal(1024 / 2);
		expect(background.getPoint(Position.Center).y).equal(768 / 2);
		expect(background.getPoint(Position.Origin)).equal(background.getPoint(Position.TopLeft));
		origin = new Point(0, 0, background.getPoint(Position.TopCenter));
		var menu: Rectangle = new Rectangle(origin, new Point(-50, 10, origin), new Point(50, 30, origin));
		expect(menu.getPoint(Position.TopLeft).x).equal(1024 / 2 - 50);
		expect(menu.getPoint(Position.TopLeft).y).equal(0 + 10);
		expect(menu.getPoint(Position.TopRight).x).equal(1024 / 2 + 50);
		expect(menu.getPoint(Position.TopRight).y).equal(0 + 10);
		expect(menu.getPoint(Position.BottomCenter).x).equal(1024 / 2);
		expect(menu.getPoint(Position.BottomCenter).y).equal(0 + 30);
		expect(menu.getPoint(Position.BottomLeft).x).equal(1024 / 2 - 50);
		origin.move(0, 20);
		expect(menu.getPoint(Position.TopLeft).x).equal(1024 / 2 - 50);
		expect(menu.getPoint(Position.TopLeft).y).equal(0 + 10 + 20);
		expect(menu.getPoint(Position.TopRight).x).equal(1024 / 2 + 50);
		expect(menu.getPoint(Position.TopRight).y).equal(0 + 10 + 20);
		expect(menu.getPoint(Position.BottomCenter).x).equal(1024 / 2);
		expect(menu.getPoint(Position.BottomCenter).y).equal(0 + 30 + 20);
		expect(menu.getPoint(Position.BottomLeft).x).equal(1024 / 2 - 50);
	});

	it("viewport", () => {
		Viewport.init();
		expect(Viewport.bottomRight.x).equal(1024);
		expect(Viewport.bottomRight.y).equal(768);
	});

});