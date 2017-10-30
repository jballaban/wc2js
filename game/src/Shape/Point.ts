import { Vector } from "../Core/Vector";


export class Point {
	public vector: Vector;
	public offsetX: number = null;
	public offsetY: number = null;
	public children: Point[] = new Array<Point>();
	public parent: Point = null;
	protected dirty: boolean = true;
	public changed: boolean = true;

	constructor(offsetX: number, offsetY: number, parent: Point) {
		this.vector = new Vector(0, 0);
		this.parent = parent;
		if (this.parent != null) {
			this.parent.children.push(this); // self register
		}
		this.move(offsetX, offsetY);
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
		this.dirty = true;
	}

	private calculate(field: string): number {
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

export class DynamicPoint extends Point {
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
}

export class RatioPoint extends Point {
	public p2: Point;
	private ratio: number;

	constructor(ratio: number, parent: Point, p2: Point) {
		super(null, null, parent);
		this.p2 = p2;
		this.ratio = ratio;
		this.p2.children.push(this);
		this.recalculate();
	}

	public recalculate(): void {
		if (!this.dirty) { return; }
		this.offsetX = Math.floor((this.p2.x() - this.parent.x()) * this.ratio);
		this.offsetY = Math.floor((this.p2.y() - this.parent.y()) * this.ratio);
		super.recalculate();
	}
}

export class MidPoint extends RatioPoint {

	constructor(parent: Point, p2: Point) {
		super(1 / 2, parent, p2);
	}
}