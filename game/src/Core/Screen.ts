import { Rectangle } from "../Shape/Rectangle";
import { Camera } from "../Core/Camera";
import { Logger } from "../Util/Logger";
import { RegionContainer } from "../Core/Region";
import { Element } from "../Core/Element";
import { Mouse } from "../IO/Mouse";
import { Array as ArrayUtil } from "../Util/Array";
import { Collision } from "../Util/Collision";
import { ContextLayer } from "../Core/ContextLayer";
import { Runtime } from "../Core/Runtime";
import { Color } from "../Util/Color";
import { ElementContainer } from "../Core/ElementContainer";
import { EventHandler } from "../Core/EventHandler";
import { Viewport } from "../Core/Viewport";
import { MouseHandler } from "../IO/MouseHandler";

export abstract class Screen {

	public container: ElementContainer;
	public camera: Camera;
	private viewport: Viewport;
	private static _current: Screen;
	public static debug_showRedraws = false;

	constructor() {
		this.viewport = new Viewport();
		this.camera = new Camera(this.viewport);
	}

	public static get current(): Screen {
		return Screen._current;
	}

	public static set current(screen: Screen) {
		Screen._current = screen;
		Viewport.current = screen.viewport;
		screen.onActivate();
	}

	public init(regionsize: number, area: Rectangle): void {
		this.container = new ElementContainer(regionsize, area);
	}

	public onActivate(): void {
		// to implement
	}

	public update(dt: number): void {
		// this.moveCamera(this.camera.area.topLeft().x() + 1, null);
		this.viewport.update();
		this.camera.update();
		this.doUpdates(dt);
		MouseHandler.postUpdate();
		this.viewport.onPreRender();
		this.preRender();
		this.checkCollisions();
	}

	public doUpdates(dt: number): void {
		// do updates
		for (var i: number = 0; i < this.container.elementsCache.length; i++) {
			this.container.elementsCache[i].update(dt);
		}
	}

	public preRender(): void {
		for (var i: number = 0; i < this.container.elementsCache.length; i++) {
			this.container.elementsCache[i].onPreRender();
		}
	}

	public checkCollisions(): void {
		// look for new collisions
		for (var i: number = 0; i < this.container.regionsCache.length; i++) {
			var elements: Element[] = this.container.regionsCache[i].elements;
			for (var j: number = 0; j < elements.length - 1; j++) {
				// verify existing collisions still valid
				this.checkExistingCollisions(elements[j]);
				this.checkForNewCollisions(elements[j], elements, j);
			}
		}
	}

	private checkForNewCollisions(element: Element, elements: Element[], startindex: number): void {
		// tslint:disable-next-line:no-duplicate-variable
		for (var k: number = startindex + 1; k < elements.length; k++) {
			if (!element.area.changed && !elements[k].area.changed) {
				continue; // if neither object moved they are still NOT colliding
			}
			if (ArrayUtil.exists<Element>(elements[k], element.collisions)) {
				continue; // skip if we've already collided
			}
			if (
				element.canCollide(elements[k])
				&& elements[k].canCollide(element)
				&& Collision.intersects(element.area, elements[k].area)
			) {
				element.collisions.push(elements[k]);
				elements[k].collisions.push(element);
				element.onCollide(elements[k], true);
				elements[k].onCollide(element, true);
			}
		}
	}

	private checkExistingCollisions(element: Element): void {
		for (var k: number = 0; k < element.collisions.length; k++) {
			if (!element.area.changed && !element.collisions[k].area.changed) {
				continue; // if neither object moved they are still colliding!
			}
			if (
				!element.canCollide(element.collisions[k])
				|| !element.collisions[k].canCollide(element)
				|| !Collision.intersects(element.area, element.collisions[k].area)
			) {
				var other: Element = element.collisions[k];
				other.collisions.splice(ArrayUtil.indexOf<Element>(element, other.collisions), 1);
				other.onCollide(element, false);
				element.collisions.splice(k--, 1);
				element.onCollide(other, false);
			}
		}
	}

	public render(): void {
		var max: number = 0;
		for (var region of this.container.visibleRegionCache) {
			if (!region.requiresRedraw) { continue; }
			max = Math.max(max, region.elements.length);
			Runtime.ctx.ctx.clearRect(region.area.x(), region.area.y(), region.area.width(), region.area.height());
			Runtime.ctx.ctx.save();
			// clip a rectangular area
			Runtime.ctx.ctx.beginPath();
			Runtime.ctx.ctx.rect(region.area.x(), region.area.y(), region.area.width(), region.area.height());
			Runtime.ctx.ctx.clip();
			if (Screen.debug_showRedraws) {
				Runtime.ctx.ctx.fillStyle = Color.getRandomColor();
				Runtime.ctx.ctx.fillRect(region.area.x(), region.area.y(), region.area.width(), region.area.height());
			}
			for (var i: number = 0; i < region.elements.length; i++) {
				region.elements[i].render(Runtime.ctx.ctx);
			}
			Runtime.ctx.ctx.restore();
			region.requiresRedraw = false;
		}
	}

}