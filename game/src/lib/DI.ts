export enum Lifespan {
	Transient,
	Singleton
}

class Item {
	Type: any;
	Lifespan: Lifespan;
	Args: any[];
	Instance: any = null;

	constructor(type: any, lifespan: Lifespan, args: any[]) {
		this.Type = type;
		this.Lifespan = lifespan;
		this.Args = args;
	}

	public resolve() {
		switch (this.Lifespan) {
			case Lifespan.Transient:
				return new this.Type(this.Args);
			case Lifespan.Singleton:
				if (this.Instance == null)
					this.Instance = new this.Type(this.Args);
				return this.Instance;
			default:
				throw "Unknown Lifespan " + this.Lifespan;
		}
	}
}

export class DI {

	private static _map = {};

	public static register(interfacetype, instancetype, args, lifespan: Lifespan) {
		if (DI._map[interfacetype] == null)
			DI._map[interfacetype] = [];
		DI._map[interfacetype].push(new Item(instancetype, lifespan, args));
	}

	public static first(interfacetype) {
		return DI.all(interfacetype)[0];
	}

	public static all(interfacetype) {
		if (DI._map[interfacetype] == null)
			throw "Could not found " + interfacetype + " in DI";
		return DI.resolve(DI._map[interfacetype]);
	}

	private static resolve(items: Item[]) {
		var result = [];
		for (var item of items)
			result.push(item.resolve());
		return result;
	}
}