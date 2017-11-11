import { Sprite } from "./Sprite";
import { ElementContainer } from "../Core/ElementContainer";
import { Viewport } from "../Core/Viewport";
import { Element } from "../Core/Element";
import { ElementType } from "../Core/ElementType";

export class BackgroundImage extends Element {

	constructor(private image: Sprite, container: ElementContainer, private viewport: Viewport) {
		super(container, ElementType.backgroundImage, viewport.area, 1, null);
	}

	public ready(): boolean {
		return super.ready() && this.image.loaded;
	}

	public render(ctx: CanvasRenderingContext2D): void {
		this.image.render(ctx, 0, 0, this.viewport.area.width(), this.viewport.area.height());
	}

}