import { Point } from "../Shape/Point";
import { Circle } from "../Shape/Circle";
import { Runtime } from "../Core/Runtime";
import { Rectangle } from "../Shape/Rectangle";
import { Vector } from "../Core/Vector";
import { ShapeType } from "../Shape/IShape";
import { Logger } from "../Util/Logger";
import { Collision } from "../Util/Collision";
import { Line } from "../Shape/Line";

export class Light {
	private paths: Point[];

	constructor(private area: Circle, private spread: number, private color: string) {
	}

	public update(): void {
		this.paths = new Array<Point>();
		var ray: Line = new Line(this.area.center, new Point(0, 0, this.area.center));
		for (var angle: number = 0; angle < 360; angle += 5) {
			var p: Point = new Point(this.spread * Math.cos(Math.PI * angle / 180.0), this.spread * Math.sin(Math.PI * angle / 180.0), ray.p1);
			for (var i: number = 0; i < Runtime.screen.mouse.collisions.length; i++) {
				if (Runtime.screen.mouse.collisions[i].area.type === ShapeType.Circle) {
					var point: Point = Collision.getIntersectionLineCircle(
						new Line(ray.p1, p),
						Runtime.screen.mouse.collisions[i].area as Circle
					);
					if (point != null) {
						p = point;
					}
				}
			}
			this.paths.push(p);
		}
		Runtime.screen.container.update(Runtime.screen.mouse, false);
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		var gr = ctx.createRadialGradient(this.area.center.x(), this.area.center.y(), 5, this.area.center.x(), this.area.center.y(), this.area.r);

		// Add the color stops.
		gr.addColorStop(0, 'rgba(255,255,255,0.5)');
		gr.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = gr;
		ctx.beginPath();
		ctx.moveTo(this.paths[0].x(), this.paths[0].y());
		for (var i: number = 1; i < this.paths.length; i++) {
			ctx.lineTo(this.paths[i].x(), this.paths[i].y());
			//ctx.closePath();
			// ctx.clip();
		}
		ctx.fill();
	}
}