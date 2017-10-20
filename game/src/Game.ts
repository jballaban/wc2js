import { Runtime } from "./Core/Runtime";
import { Logger, Level } from "./Util/logger";
import { Screen } from "./UI/Screen";
import { LoadingScreen } from "./Play/Loading/LoadingScreen";

export class Game {
	public static init(ver: string): void {
		Logger.level = Level.Debug;
		Logger.log("Game: Version " + ver);
		Logger.log("Game: Log " + Level[Logger.level]);
		Runtime.init();
		var startscreen: LoadingScreen = new LoadingScreen();
		Runtime.start(startscreen);
	}
}