import { Rectangle } from "../UI/Rectangle";
import { Viewport } from "../UI/Viewport";
import { MidPoint, Point } from "../UI/Point";
import { Position } from "../UI/Polygon";
import { Logger } from "../Util/Logger";

export abstract class ContextLayer {
	protected redrawAreas: Map<Rectangle, boolean> = new Map<Rectangle, boolean>();
	public ctx: CanvasRenderingContext2D;

	constructor() {
		var canv: HTMLCanvasElement = document.createElement("canvas");
		document.body.appendChild(canv);
		this.ctx = canv.getContext("2d");
		this.resize();
	}

	public renderStart(): void {
		for (var region of this.redrawAreas.keys()) {
			if (this.redrawAreas.get(region)) {
				this.ctx.clearRect(region.x(), region.y(), region.width(), region.height());
			}
		}
	}

	public renderComplete(): void {
		for (var region of this.redrawAreas.keys()) {
			if (this.redrawAreas.get(region)) {
				this.redrawAreas.set(region, false);
			}
		}
	}

	public markForRedraw(area: Rectangle): void {
		for (var region of this.redrawAreas.keys()) {
			if (!this.redrawAreas.get(region) && area.intersects(region)) {
				this.redrawAreas.set(region, true);
			}
		}
	}

	public shouldRedraw(area: Rectangle): boolean {
		for (var region of this.redrawAreas.keys()) {
			if (this.redrawAreas.get(region) && area.intersects(region)) {
				return true;
			}
		}
		return false;
	}

	public resize(): void {
		this.ctx.canvas.width = window.innerWidth;
		this.ctx.canvas.height = window.innerHeight;
		this.redrawAreas.clear();
	}
}

export class QuarteredContextLayer extends ContextLayer {
	public resize(): void {
		super.resize();
		// split layer into quadrants
		this.redrawAreas.set(new Rectangle(Viewport.area.topLeft(), Viewport.area.getPoint(Position.Center)), true);
		this.redrawAreas.set(new Rectangle(
			Viewport.area.getPoint(Position.TopCenter),
			Viewport.area.getPoint(Position.RightCenter)),
			true
		);
		this.redrawAreas.set(new Rectangle(
			Viewport.area.getPoint(Position.LeftCenter),
			Viewport.area.getPoint(Position.BottomCenter)),
			true
		);
		this.redrawAreas.set(new Rectangle(
			Viewport.area.getPoint(Position.Center),
			Viewport.area.bottomRight()),
			true
		);
	}
}