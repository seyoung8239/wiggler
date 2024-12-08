import { Point } from "../../common/Point";
import { Worm } from "../worm/Worm";
import { BLOCK_START_POSITION, MAP_SIZE } from "./gameMap.config";
import { MAP_TYPE, type MapType } from "./gameMap.constant";
import { puzzle, PUZZLE_SIZE } from "../../puzzles/1";

export class GameMap {
	worm;
	gameMap: MapType[][] = new Array(MAP_SIZE.WIDTH)
		.fill(0)
		.map(() => new Array(MAP_SIZE.HEIGHT).fill(MAP_TYPE.EMPTY));

	constructor() {
		this.worm = new Worm(new Point(10, 10), this.gameMap);
		this.setGround();
		this.setPuzzle();
	}

	setGround() {
		for (let x = 0; x < MAP_SIZE.WIDTH; x++) {
			for (let y = MAP_SIZE.HEIGHT - 1; y > MAP_SIZE.HEIGHT - 4; y--) {
				this.gameMap[x][y] = MAP_TYPE.GROUND;
			}
		}
	}

	setPuzzle() {
		for (let y = 0; y < PUZZLE_SIZE.HEIGHT; y++) {
			for (let x = 0; x < PUZZLE_SIZE.WIDTH; x++) {
				if (puzzle[y][x] === 1) {
					this.gameMap[BLOCK_START_POSITION.x + x][BLOCK_START_POSITION.y + y] =
						MAP_TYPE.BLOCK;
				}
			}
		}
	}

	render(ctx: CanvasRenderingContext2D) {
		this.clearMap(ctx);

		this.renderBaseMap(ctx);
		this.worm.animate(ctx);
	}

	renderBaseMap(ctx: CanvasRenderingContext2D) {
		for (let x = 0; x < MAP_SIZE.WIDTH; x++) {
			for (let y = 0; y < MAP_SIZE.HEIGHT; y++) {
				switch (this.gameMap[x][y]) {
					case MAP_TYPE.EMPTY:
						ctx.fillStyle = "chocolate";
						break;
					case MAP_TYPE.GROUND:
						ctx.fillStyle = "saddlebrown";
						break;
					case MAP_TYPE.BLOCK:
						ctx.fillStyle = "gold";
						break;
				}
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

	clearMap(ctx: CanvasRenderingContext2D) {
		ctx.clearRect(
			0,
			0,
			MAP_SIZE.WIDTH * MAP_SIZE.UNIT,
			MAP_SIZE.HEIGHT * MAP_SIZE.UNIT,
		);
	}
}
