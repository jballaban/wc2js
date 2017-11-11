
export class Duration {
	public elapsed: number = 0;
	public passed: boolean = false;
	constructor(private ms: number) { }

	public update(sec: number): void {
		this.elapsed += sec;
		if (!this.passed && this.elapsed >= this.ms) {
			this.passed = true;
		}
	}

}
