import { GameMap } from "./objects/map/Map";

class App {
	canvas;
	ctx;

	stageWidth = 0;
	stageHeight = 0;
	pixelRatio = 1;

	map;

	constructor() {
		this.canvas = document.createElement("canvas");
		document.body.appendChild(this.canvas);
		this.ctx = this.canvas.getContext("2d")!;

		this.map = new GameMap();

		window.addEventListener("resize", this.resize.bind(this), false);
		this.resize();

		requestAnimationFrame(this.animate.bind(this));
	}

	resize() {
		this.stageWidth = document.body.clientWidth;
		this.stageHeight = document.body.clientHeight;

		this.canvas.width = this.stageWidth * this.pixelRatio;
		this.canvas.height = this.stageHeight * this.pixelRatio;
		this.ctx!.scale(this.pixelRatio, this.pixelRatio);

		console.log("resize", this.canvas.width, this.canvas.height);
	}

	animate() {
		window.requestAnimationFrame(this.animate.bind(this));

		this.map.render(this.ctx!);
	}
}

window.onload = () => {
	new App();
	console.log("hi");
};
