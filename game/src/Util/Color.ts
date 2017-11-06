export class Color {
	public static getRandomColor(): string {
		var letters: string = "0123456789ABCDEF";
		var color: string = "#";
		for (var i: number = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	public static getRandomRGB(): string {
		return "rgb("
			+ (Math.floor(Math.random() * 256)) + ","
			+ (Math.floor(Math.random() * 256)) + ","
			+ (Math.floor(Math.random() * 256))
			+ ")";
	}

	public static makeRGBA(rgb: string, a: number): string {
		return rgb.replace("rgb", "rgba").replace(/\)$/, "," + a + ")");
	}
}