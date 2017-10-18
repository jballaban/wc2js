
/// <reference path="../node_modules/@types/fpsmeter/index.d.ts"/>
import { Runtime } from "./lib/Runtime";
import { Logger, Level } from "./lib/logger";
import { Screen } from "./lib/Screen";

export class Game {
	public static FPS: FPSMeter;
	public static init(ver: string): void {
		Logger.level = Level.Debug;
		Logger.log("Game: Version: " + ver);
		Logger.log("Log: " + Level[Logger.level]);
		var startscreen: Screen = new Screen();
		Runtime.init();
		Runtime.start(startscreen);
		this.FPS = new FPSMeter(null, {
			decimals: 0,
			graph: 1,
			left: "5px"
		});
	}
}