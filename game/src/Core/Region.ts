import { Rectangle } from "../Shape/Rectangle";
import { Point } from "../Shape/Point";
import { IShape } from "../Shape/IShape";

export abstract class Region {
	public area: Rectangle;
}

export class RegionContainer<T extends Region> {
	public regions: Map<Rectangle, T> = new Map<Rectangle, T>();

	public constructor(public len: number, public area: Rectangle, private regionType: new () => T) {
		this.area = area;
		var nx: number = Math.ceil(this.area.width() / len);
		var ny: number = Math.ceil(this.area.height() / len);
		for (var x: number = 0; x < nx; x++) {
			var width: number = Math.min(this.area.width(), (x + 1) * len);
			for (var y: number = 0; y < ny; y++) {
				var height: number = Math.min(this.area.height(), (y + 1) * len);
				var rect: Rectangle = new Rectangle(new Point(x * len, y * len, null), new Point(width, height, null));
				var region: T = new this.regionType();
				region.area = rect;
				this.regions.set(rect, region);
			}
		}
	}

	public getRegions(area: IShape): Array<T> {
		var result: T[] = new Array<T>();
		for (var rect of this.regions.keys()) {
			if (area.intersects(rect)) {
				result.push(this.regions.get(rect));
			}
		}
		return result;
	}
}