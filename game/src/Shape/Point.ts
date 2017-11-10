import { Vector } from "../Core/Vector";
import { Logger } from "../Util/Logger";


export class Point {
	public vector: Vector;
	public children: Point[] = new Array<Point>();
	protected dirty: boolean = true;
	public changed: boolean = true;

	constructor(public offsetX: number, public offsetY: number, public parent?: Point) {
		this.vector = new Vector(0, 0);
		this.parent = parent;
		if (this.parent != null) {
			this.parent.children.push(this); // self register
		}
	}

	public x(): number {
		this.recalculate();
		return this.vector.x;
	}

	public y(): number {
		this.recalculate();
		return this.vector.y;
	}

	public recalculate(): void {
		if (!this.dirty) { return; }
		this.dirty = false;
		var x: number = this.calculate("x");
		var y: number = this.calculate("y");
		if (x === this.vector.x && y === this.vector.y) { return; } // if nothing changed then we don't need to invalide dependent points
		this.vector.x = x;
		this.vector.y = y;
		this.changed = true;
		for (var child of this.children) { // tell children they may need to reposition themselves since we changed something
			child.dirty = true;
		}
	}

	public move(offsetX: number, offsetY: number): void {
		if (offsetX != null) {
			this.offsetX = offsetX;
		}
		if (offsetY != null) {
			this.offsetY = offsetY;
		}
		if (!this.changed) {
			for (var child of this.children) { // tell children they may need to reposition themselves since we changed something
				child.dirty = true;
			}
			this.changed = true;
		}
		this.dirty = true;
	}

	protected calculate(field: string): number {
		var result: number = 0;
		if (this.parent != null) {
			result = this.parent[field]();
		}
		result += this["offset" + field.toUpperCase()];
		return result;
	}
}

export enum DynamicDimension {
	x,
	y
}

/* export class DynamicPoint extends Point {
	public p2: Point;
	public dimension: DynamicDimension;

	constructor(parent: Point, p2: Point, dimension: DynamicDimension) {
		super(null, null, parent);
		this.p2 = p2;
		this.dimension = dimension;
		this.p2.children.push(this); // register with both parents
		this.recalculate();
	}

	public recalculate(): void {
		if (!this.dirty) { return; }
		switch (this.dimension) {
			case DynamicDimension.x:
				this.offsetX = this.p2.x() - this.parent.x();
				break;
			case DynamicDimension.y:
				this.offsetY = this.p2.y() - this.parent.y();
				break;
		}
		super.recalculate();
	}
} */

export class RatioPoint extends Point {

	constructor(private ratio: number, public p1: Point, public p2: Point) {
		super(null, null);
		this.p1.children.push(this);
		this.p2.children.push(this);
	}

	protected calculate(field: string): number {
		return (this.p2[field]() - this.p1[field]()) * this.ratio;
	}
}

export class MidPoint extends RatioPoint {

	constructor(p1: Point, p2: Point) {
		super(1 / 2, p1, p2);
	}

}