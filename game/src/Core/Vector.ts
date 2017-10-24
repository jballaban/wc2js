export class Vector {
	public x: number;
	public y: number;
	public constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public clone(): Vector {
		return new Vector(this.x, this.y);
	}

	public multiply(n: number): Vector {
		this.x = this.x * n;
		this.y = this.y * n;
		return this;
	}

}