import { Point } from "../../common/Point";
import { Worm } from "../worm/Worm";
import { MAP_SIZE } from "./map.config";

export class GameMap {
	worm;

	constructor() {
		this.worm = new Worm(new Point(0, 0));
	}

	renderBaseMap(ctx: CanvasRenderingContext2D) {
		for (let x = 0; x < MAP_SIZE.WIDTH; x++) {
			for (let y = 0; y < MAP_SIZE.HEIGHT; y++) {
				console.log(x, y);
				ctx.fillStyle = "chocolate";
				ctx.fillRect(
					x * MAP_SIZE.UNIT,
					y * MAP_SIZE.UNIT,
					MAP_SIZE.UNIT,
					MAP_SIZE.UNIT,
				);

				ctx.strokeStyle = "darkred";
				ctx.strokeRect(
					x * MAP_SIZE.UNIT,
					y * MAP_SIZE.UNIT,
					MAP_SIZE.UNIT,
					MAP_SIZE.UNIT,
				);
			}
		}
	}

	render(ctx: CanvasRenderingContext2D) {
		this.clearMap(ctx);

		this.renderBaseMap(ctx);
	}

	clearMap(ctx: CanvasRenderingContext2D) {
		ctx.clearRect(
			0,
			0,
			MAP_SIZE.WIDTH * MAP_SIZE.UNIT,
			MAP_SIZE.HEIGHT * MAP_SIZE.UNIT,
		);
	}
}
