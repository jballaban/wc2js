import { Point } from "./Point";

export enum ShapeType {
	Circle,
	Rectangle
}

export interface IShape {
	type: ShapeType;
	intersects(shape: IShape): boolean;
	render(ctx: CanvasRenderingContext2D, color: string): void;
	changed(): boolean;
	clearChanged(): void;
}