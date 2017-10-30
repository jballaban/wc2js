import { Vector } from "../Core/Vector";
import { Rectangle } from "../Shape/Rectangle";
import { Light } from "../UI/Light";
import { Circle } from "../Shape/Circle";

export class Distance {
	private start: boolean = true;
	private shortest: number = 0;
	public rLen: number;

	constructor(private source: Circle, length: number) {
		this.rLen = length;
	}




	public calcDistance(area: Rectangle, angle: number): void {
		var y: number = (area.y() + area.height() / 2) - this.source.y(),
			x: number = (area.x() + area.width() / 2) - this.source.x(),
			dist: number = Math.sqrt((y * y) + (x * x));

		if (this.source.r >= dist) {
			var rads: number = angle * (Math.PI / 180),
				pointPos: Vector = new Vector(this.source.x(), this.source.y());

			pointPos.x += Math.cos(rads) * dist;
			pointPos.y += Math.sin(rads) * dist;

			if (pointPos.x > area.x() && pointPos.x < area.x() + area.width() && pointPos.y > area.y() && pointPos.y < area.y() + area.height()) {
				if (this.start || dist < this.shortest) {
					this.start = false;
					this.shortest = dist;
					this.rLen = dist;
				}
			}
		}
	}
}

