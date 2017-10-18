import { Runtime } from "./Runtime";
import { Element } from "./Element";
import { Logger } from "./Logger";
// import { Dimension, Position, Size } from "./Dimension";

export class Screen {

	public resized: boolean = false;

	constructor() {
		// super(new Dimension(0, 0, 100, 100, Relation.Fixed, Size.Percent), null);
	}

	public update(): void {
		if (this.resized) {
			/* this.resize();
			for (var child of this.children) {
				child.resized = true;
			} */
		}
	}

	public render(): void {
		// empty
	}

}