import { Dimension, IDimensioned } from "./Dimension";

export class Element implements IDimensioned {
	public dimension: Dimension;
	public children: Element[] = [];
	public dimensionDirty: boolean = false;
	public parent: Element;

	constructor(dimension: Dimension, parent?: Element) {
		this.dimension = dimension;
		this.parent = parent;
	}



}