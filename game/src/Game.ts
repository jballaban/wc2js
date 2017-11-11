import { Runtime } from "./Core/Runtime";
import { Logger, Level } from "./Util/logger";
import { Screen } from "./Core/Screen";
import { CircleScreen } from "./Screen/CircleScreen";
import { LoadingScreen } from "./Screen/LoadingScreen";

export class Game {
	public static init(ver: string): void {
		Logger.level = Level.Debug;
		Logger.log("Game: Version " + ver);
		Logger.log("Game: Log " + Level[Logger.level]);
		Runtime.init();
		var circlescreen: CircleScreen = new CircleScreen();
		var loadscreen: LoadingScreen = new LoadingScreen(circlescreen);
		// Screen.debug_showRedraws = true;
		Runtime.nextScreen = loadscreen;
	}
}