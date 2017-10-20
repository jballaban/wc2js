import { Screen } from "UI/Screen";
import { Rectangle } from "UI/Rectangle";
import { Viewport } from "UI/Viewport";
import { Runtime } from "Core/Runtime";
import { Logger } from "Util/Logger";

export class LoadingScreen extends Screen {

	public render(): void {
		Runtime.ctx.fillStyle = "#FF0000";
		Runtime.ctx.fillRect(0, 0, Viewport.bottomRight.x, Viewport.bottomRight.y);
	}

}