import { Point } from "../../common/Point";
import { Worm } from "../worm/Worm";
import {
	BLOCK_START_POSITION,
	MAP_SIZE,
	PUZZLE_START_POSITION,
	WORM_START_POSITION,
} from "./game.config";
import { MAP_TYPE, type MapType } from "./game.constant";
import { BLOCK_SIZE, puzzle, PUZZLE_SIZE } from "../../puzzles/1";
import { Block } from "../block/Block";

export class Game {
	worm;
	blocks: Block[] = [];
	map: MapType[][] = new Array(MAP_SIZE.WIDTH)
		.fill(0)
		.map(() => new Array(MAP_SIZE.HEIGHT).fill(MAP_TYPE.EMPTY));
	private _nextBlockId = 0;

	constructor() {
		this.worm = new Worm(
			new Point(WORM_START_POSITION.x, WORM_START_POSITION.y),
			this,
		);
		this.setGround();
		this.setPuzzleAndBlock();
	}

	public get nextBlockId() {
		return this._nextBlockId++;
	}

	setGround() {
		for (let x = 0; x < MAP_SIZE.WIDTH; x++) {
			for (let y = MAP_SIZE.HEIGHT - 1; y > MAP_SIZE.HEIGHT - 4; y--) {
				this.map[x][y] = MAP_TYPE.GROUND;
			}
		}
	}

	setPuzzleAndBlock() {
		for (let y = 0; y < PUZZLE_SIZE.HEIGHT; y++) {
			for (let x = 0; x < PUZZLE_SIZE.WIDTH; x++) {
				if (puzzle[y][x] === 1) {
					this.map[PUZZLE_START_POSITION.x + x][PUZZLE_START_POSITION.y + y] =
						MAP_TYPE.PUZZLE;
				}
			}
		}

		const initialBlockParts = [];
		for (let y = 0; y < BLOCK_SIZE.HEIGHT; y++) {
			for (let x = 0; x < BLOCK_SIZE.WIDTH; x++) {
				initialBlockParts.push(
					new Point(BLOCK_START_POSITION.x + x, BLOCK_START_POSITION.y + y),
				);
			}
		}

		this.blocks.push(new Block(this.nextBlockId, initialBlockParts, this));
	}

	render(ctx: CanvasRenderingContext2D) {
		this.clearMap(ctx);

		this.renderBaseMap(ctx);
		this.worm.animate(ctx);
		this.blocks.forEach((block) => block.animate(ctx));
	}

	renderBaseMap(ctx: CanvasRenderingContext2D) {
		for (let x = 0; x < MAP_SIZE.WIDTH; x++) {
			for (let y = 0; y < MAP_SIZE.HEIGHT; y++) {
				switch (this.map[x][y]) {
					case MAP_TYPE.EMPTY:
						ctx.fillStyle = "chocolate";
						break;
					case MAP_TYPE.GROUND:
						ctx.fillStyle = "#2b1212";
						break;
					case MAP_TYPE.PUZZLE:
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
