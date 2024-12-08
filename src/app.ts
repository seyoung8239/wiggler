import { GameMap } from "./objects/map/Map";

class App {
	canvas;
	ctx;
	map;

	constructor() {
		this.canvas = document.createElement("canvas");
		document.body.appendChild(this.canvas);
		this.ctx = this.canvas.getContext("2d");

		this.map = new GameMap();

		requestAnimationFrame(this.animate.bind(this));
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
