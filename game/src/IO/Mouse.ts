import { Element } from "../Core/Element";

export abstract class Mouse extends Element {
	private moveX: number = null;
	private moveY: number = null;

	public abstract canCollide(element: Element): boolean;

	public inc(x: number, y: number): void {
		this.move(
			(this.moveX == null ? this.origin.x() : this.moveX) + x,
			(this.moveY == null ? this.origin.y() : this.moveY) + y
		);
	}

	public move(x: number, y: number): void {
		this.moveX = x;
		this.moveY = y;
	}

	public update(step: number): void {
		super.update(step);
		if (this.moveX != null || this.moveY != null) {
			super.move(this.moveX, this.moveY);
			this.moveX = this.moveY = null;
		}
	}

	public abstract render(ctx: CanvasRenderingContext2D): void;

}