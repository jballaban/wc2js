import { Element } from "../Core/Element";
import { Logger } from "../Util/Logger";
import { Camera } from "../Core/Camera";
import { ElementContainer } from "../Core/ElementContainer";
import { IShape } from "../Shape/IShape";
import { ElementType } from "../Core/ElementType";
import { Cursor } from "./MouseHandler";

export abstract class Mouse extends Element {
	constructor(container: ElementContainer, area: IShape, zindex: number) {
		super(container, ElementType.Mouse, area, zindex, null);
	}

}