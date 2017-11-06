import { Runtime } from "./Core/Runtime";
import { Logger, Level } from "./Util/logger";
import { Screen } from "./UI/Screen";
import { PlayScreen } from "./Screen/PlayScreen";

export class Game {
	public static init(ver: string): void {
		Logger.level = Level.Debug;
		Logger.log("Game: Version " + ver);
		Logger.log("Game: Log " + Level[Logger.level]);
		Runtime.init();
		var startscreen: PlayScreen = new PlayScreen();
		Runtime.start(startscreen);
	}
}