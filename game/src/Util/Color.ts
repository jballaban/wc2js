export class Color {
	public static getRandomColor(): string {
		var letters: string = "0123456789ABCDEF";
		var color: string = "#";
		for (var i: number = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
}