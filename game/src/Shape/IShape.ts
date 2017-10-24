export interface IShape {
	intersects(shape: IShape): boolean;
	render(ctx: CanvasRenderingContext2D, color: string): void;
}