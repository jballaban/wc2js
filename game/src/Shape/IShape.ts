export interface IShape {
	intersects(shape: IShape);
	render(ctx: CanvasRenderingContext2D);
}