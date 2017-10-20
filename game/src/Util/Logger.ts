export interface ILogger {
	debug(str: string): void;
	log(str: string): void;
	error(str: string): void;
}

export class BrowserConsole implements ILogger {
	debug(str: string): void {
		console.log("[DEBUG] " + str); // browers don't write debug by default
	}

	log(str: string): void {
		console.log(str);
	}

	error(str: string): void {
		console.error(str);
	}
}

export enum Level {
	Debug = 0,
	Log = 1,
	Error = 2
}

export class Logger {
	public static output: ILogger = new BrowserConsole();
	public static filter: string = "";
	public static level: Level = Level.Log;
	public static messagesPerSecond: number = 5;
	private static _messagesStart: Date = new Date();
	private static _messagesSent: number = 0;
	private static _messagesSkipped: number = 0;

	public static debug(str: string): void {
		this.write(this.output.debug, str, Level.Debug);
	}

	public static log(str: string): void {
		this.write(this.output.log, str, Level.Log);
	}

	public static error(str: string): void {
		this.write(this.output.error, str, Level.Error);
	}

	private static write(fn: any, str: string, lvl: Level): void {
		if (this.shouldWrite(str, lvl)) {
			if (this.elapsed() >= 1) {
				if (this._messagesSkipped > 0) {
					this.output.debug("Skipped " + this._messagesSkipped + " messages");
				}
				this._messagesSent = 1;
				this._messagesSkipped = 0;
				this._messagesStart = new Date();
			} else {
				this._messagesSent++;
			}
			fn(str);
		}
	}

	private static elapsed(): number {
		return (new Date().getTime() - this._messagesStart.getTime()) / 1000;
	}

	private static shouldWrite(str: string, lvl: Level): boolean {
		var result: boolean = (this.output != null
			&& (this.filter === "" || str.indexOf(this.filter) > -1)
			&& lvl >= this.level);

		if (result && this.elapsed() <= 1) {
			// errors bypass the message throttle
			result = lvl === Level.Error || this._messagesSent < this.messagesPerSecond;
			if (!result) {
				this._messagesSkipped++;
			}
		}

		return result;
	}
}