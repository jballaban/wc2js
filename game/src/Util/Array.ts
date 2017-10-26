export class Array {

	public static exists<T>(el: T, arr: T[]): boolean {
		return Array.indexOf(el, arr) > -1;
	}

	public static indexOf<T>(el: T, arr: T[]): number {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] === el) {
				return i;
			}
		}
		return -1;
	}

}