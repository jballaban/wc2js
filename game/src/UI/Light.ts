import { Point } from "../Shape/Point";
import { Distance } from "../Util/Distance";
import { Circle } from "../Shape/Circle";
import { Runtime } from "../Core/Runtime";
import { Rectangle } from "../Shape/Rectangle";
import { Vector } from "../Core/Vector";
import { ShapeType } from "../Shape/IShape";
import { Logger } from "../Util/Logger";

export class Light {
	private angle: number;
	private paths: Vector[];
	private addTo: number;

	constructor(private area: Circle, private spread: number, private color: string) {
		this.angle = Math.random() * 180;
		this.addTo = 1 / this.area.r;
	}

	public update() {
		this.paths = new Array<Vector>();
		for (var curAngle = this.angle - (this.spread / 2); curAngle < this.angle + (this.spread / 2); curAngle += (this.addTo * (180 / Math.PI)) * 2) {
			var ray: Distance = new Distance(this.area, this.area.r);
			for (var i = 0; i < Runtime.screen.mouse.collisions.length; i++) {
				if (Runtime.screen.mouse.collisions[i].area.type === ShapeType.Rectangle) {
					ray.calcDistance(Runtime.screen.mouse.collisions[i].area as Rectangle, curAngle);
				}
			}

			var rads = curAngle * (Math.PI / 180),
				end = new Vector(this.area.x(), this.area.y());

			end.x += Math.cos(rads) * ray.rLen;
			end.y += Math.sin(rads) * ray.rLen;
			this.paths.push(this.area.center.vector);
			this.paths.push(end);
		}
	}

	public draw(ctx) {
		ctx.strokeStyle = this.color;
		for (var i = 0; i < this.paths.length; i += 2) {
			ctx.beginPath();
			ctx.moveTo(this.paths[i].x, this.paths[i].y);
			ctx.lineTo(this.paths[i + 1].x, this.paths[i + 1].y);
			ctx.closePath();
			// ctx.clip();
			ctx.stroke();
		}
	}
}