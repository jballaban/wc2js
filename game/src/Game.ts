import { Runtime } from "./Core/Runtime";
import { Logger, Level } from "./Util/logger";
import { Screen } from "./Core/Screen";
import { PlayScreen } from "./Screen/PlayScreen";
import { LoadingScreen } from "./Screen/LoadingScreen";

export class Game {
	public static init(ver: string): void {
		Logger.level = Level.Debug;
		Logger.log("Game: Version " + ver);
		Logger.log("Game: Log " + Level[Logger.level]);
		Runtime.init();
		var playscreen: PlayScreen = new PlayScreen();
		var loadscreen: LoadingScreen = new LoadingScreen();
		Screen.debug_showRedraws = true;
		Runtime.nextScreen = loadscreen;
	}
}