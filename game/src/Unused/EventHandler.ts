export class EventHandler {
	private _mappings: Map<string, any[]> = new Map<string, any[]>();
	public fire(name: string): void {
		var values = this._mappings.get(name);
		if (values == null) { return; }
		for (var i = 0; i < values.length; i++) {
			values[i]();
		}
	}
}