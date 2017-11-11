import { Screen } from "../Core/Screen";
import { Rectangle } from "../Shape/Rectangle";
import { Camera } from "../Core/Camera";
import { Runtime } from "Core/Runtime";
import { Logger } from "Util/Logger";
import { Position } from "../Shape/Polygon";
import { Point, MidPoint } from "../Shape/Point";
import { Thing, StaticThing } from "../UI/Thing";
import { ContextLayer } from "../Core/ContextLayer";
import { Mouse } from "../IO/Mouse";
import { Color } from "../Util/Color";
import { ElementContainer } from "../Core/ElementContainer";
import { Vector } from "../Core/Vector";
import { Circle } from "../Shape/Circle";
import { MouseHandler, CursorState, Cursor } from "../IO/MouseHandler";
import { BasicMouse } from "../IO/BasicMouse";
import { Element } from "../Core/Element";
import { ElementType } from "../Core/ElementType";
import { Viewport } from "../Core/Viewport";
import { Sprite } from "../UI/Sprite";
import { BackgroundImage } from "../UI/BackgroundImage";
import { Action } from "../Util/Action";
import { Duration } from "../Util/Duration";

export class LoadingScreen extends Screen {

	private assets: Element[] = new Array<Element>();

	public constructor(private screen: Screen) {
		super(256, new Rectangle(new Point(0, 0, null), new Point(0, 0, null)));
	}

	public activate(): void {
		super.activate();
		this.assets.push(
			new BackgroundImage(
				new Sprite("logo.png", 1024, 1024),
				this.container,
				this.viewport
			)
		);
	}

	public preUpdate(): void {
		super.preUpdate();
		if (this.viewport.area.changed()) {
			this.container.resize(this.viewport.area);
		}
		for (var i = 0; i < this.assets.length; i++) {
			if (this.assets[i].ready()) {
				this.container.register(this.assets[i]);
				this.assets.splice(i--, 1);
				if (this.assets.length === 0) {
					this.actions.push(new Action(new Duration(2), this.loadScreen.bind(this)))
				}
			}
		}
	}

	private loadScreen(): void {
		Runtime.nextScreen = this.screen;
	}

}