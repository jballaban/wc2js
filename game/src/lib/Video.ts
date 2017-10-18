import { Element } from "./ELement";
import { Dimension } from "./Dimension";

export class Video {
	protected ready: boolean = false;

	constructor(src: string, dimension: Dimension) {
		var video: HTMLVideoElement = document.createElement("video");
		video.src = src;
		video.addEventListener("loadeddata", (() => {
			this.ready = true;
			console.log("ready");
			// video.play();
			// setTimeout(videoLoop, 1000 / 30);
		}).bind(this));
	}

	public resize(): void {
		// empty
	}
}