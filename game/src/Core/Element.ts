import { Rectangle } from "../Shape/Rectangle";

export class Element {

	public area: Rectangle;

	constructor(area: Rectangle) {
		this.area = area;
	}

	public render(ctx): void {
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(this.area.x(), this.area.y(), this.area.width(), this.area.height());
	}

}