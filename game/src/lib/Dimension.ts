/*



export abstract class Shape {

	public points: Map<Position, Point> = new Map<Position, Point>();
	public origin: Point;
	public dirty: boolean = true;

	constructor(origin: Point, originPosition: Position) {
		this.origin = origin;
		// this.points.set(Position.Origin | originPosition, this.origin);
	}

	public getPoint(position: Position): Point {
		return this.points.get(position);
	}

}



export class Screen2 {
	public viewPort: Viewport;
	public constructor() {
		this.viewPort = new Viewport();
	}


}



export class Rectangle extends Shape {
	public width: number = 0;
	public height: number = 0;

	public constructor(center: Point, width: number, height: number) {
		super(center, Position.Center);
		this.resize(width, height);
	}

	public getPoint(position: Position): Point {
		var result: Point = super.getPoint(position);
		if (result == null) {
			result = new Point(0, 0, this.origin);
			this.calculateOffset(position, result);
			this.points.set(position, result);
		}
		return result;
	}

	public resize(width: number, height: number): void {
		if (this.width === width && this.height === height) { return; }
		this.dirty = true;
		this.width = width;
		this.height = height;
		for (var position of this.points.keys()) {
			this.calculateOffset(position, this.points.get(position));
		}
	}

	private calculateOffset(position: Position, point: Point): void {
		var midX: number = Math.floor(this.width / 2);
		var midY: number = Math.floor(this.height / 2);
		var offsetX: number = point.offsetX;
		var offsetY: number = point.offsetY;
		if (position & Position.Left) {
			offsetX = -midX;
		}
		if (position & Position.Right) {
			offsetX = this.width - midX;
		}
		if (position & Position.Top) {
			offsetY = -midY;
		}
		if (position & Position.Bottom) {
			offsetY = this.height - midY;
		}
		point.move(offsetX, offsetY);
	}
}

export class Viewport extends Rectangle {

	public constructor() {
		super(new Point(window.innerWidth / 2, window.innerHeight / 2, null), window.innerWidth, window.innerHeight);
	}

	public resize(): void {
		this.origin.move(Math.floor(window.innerWidth / 2), Math.floor(window.innerHeight / 2));
		super.resize(window.innerWidth, window.innerHeight);
	}
}
 */







export enum Relative {
	ToParent, // moves with parent
	ToWindow // doesn't move
}

export enum Direction {
	Left = 1,
	Top = 2,
	Bottom = 4,
	Right = 8,
	Centered = 16
}

export enum Size {
	Fixed, // fixed number
	Percent // relative to another object
}

export interface IDimensioned {
	dimension: Dimension;
}

export class Dimension {
	constructor(x: number, y: number, w: number, h: number, r: Relative, s: Size, d: Direction) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.relative = r;
		this.size = s;
		this.direction = d;
	}
	public x: number;
	public y: number;
	public relative;
	public w: number;
	public h: number;
	public size: Size;
	public direction: Direction;

	public getLeft(parent?: IDimensioned): number {
		return this.getPoint("x", parent, this.relative);
	}

	public getTop(parent?: IDimensioned): number {
		return this.getPoint("y", parent, this.relative);
	}

	public getRight(parent?: IDimensioned): number {
		return this.getPoint("w", parent, Relative.ToParent);
	}

	public getBottom(parent?: IDimensioned): number {
		return this.getPoint("h", parent, Relative.ToParent);
	}

	private getPoint(point: string, parent: IDimensioned, relative: Relative): number {
		var r: number = this[point];
		switch (relative) {
			case Relative.ToParent:
				if (parent == null) {
					throw "Relative to parent cannot have null parent";
				}
				break;
			case Relative.ToWindow:
				break;
			default:
				throw "Not implemented";
		}
		return r;
	}
}