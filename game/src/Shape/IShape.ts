import { Point } from "./Point";

export interface IShape {
	intersects(shape: IShape): boolean;
	render(ctx: CanvasRenderingContext2D, color: string): void;
	changed(): boolean;
	clearChanged(): void;
}