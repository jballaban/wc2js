import { Duration } from "./Duration";
import { Logger } from "./Logger";

export class Action {
	constructor(private when: Duration, public what: Function) { }

	public update(dt: number) {
		this.when.update(dt);
	}

	public completed(): boolean {
		return this.when.passed;
	}
}