export class Point {
	// todo: points shouldn't recalculate children.  Only when position is accessed should it recalculate tree positioning
	public x: number = 0;
	public y: number = 0;
	public offsetX: number = null;
	public offsetY: number = null;
	public children: Point[] = new Array<Point>();
	public parent: Point = null;

	constructor(offsetX: number, offsetY: number, parent: Point) {
		this.parent = parent;
		if (this.parent != null) {
			this.parent.children.push(this); // self register
		}
		this.move(offsetX, offsetY);
	}

	public recalculate(): void {
		var x: number = this.calculate("x");
		var y: number = this.calculate("y");
		if (x === this.x && y === this.y) { return; } // if nothing changed then we don't need to invalide dependent points
		this.x = x;
		this.y = y;
		for (var child of this.children) { // tell children they may need to reposition themselves since we changed something
			child.recalculate();
		}
	}

	public move(offsetX: number, offsetY: number): void {
		if (offsetX === this.offsetX && offsetY === this.offsetY) { return; }
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		this.recalculate();
	}

	private calculate(field: string): number {
		var result: number = 0;
		if (this.parent != null) {
			result = this.parent[field];
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
		switch (this.dimension) {
			case DynamicDimension.x:
				this.offsetX = this.p2.x - this.parent.x;
				break;
			case DynamicDimension.y:
				this.offsetY = this.p2.y - this.parent.y;
				break;
		}
		super.recalculate();
	}
}

export class MidPoint extends Point {
	public p2: Point;

	constructor(parent: Point, p2: Point) {
		super(null, null, parent);
		this.p2 = p2;
		this.p2.children.push(this);
		this.recalculate();
	}

	public recalculate(): void {
		this.offsetX = (this.p2.x - this.parent.x) / 2;
		this.offsetY = (this.p2.y - this.parent.y) / 2;
		super.recalculate();
	}
}