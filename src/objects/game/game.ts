import { Point } from "../../common/Point";
import { Worm } from "../worm/Worm";
import {
	BLOCK_START_POSITION,
	MAP_SIZE,
	WORM_START_POSITION,
} from "./game.config";
import { MAP_TYPE, type MapType } from "./game.constant";
import { BLOCK_SIZE } from "../../puzzles/1";
import { Block } from "../block/Block";
import { GameRenderer } from "./gameRenderer";

export class Game {
	gameRenderer: GameRenderer;
	worm;
	blocks: Block[] = [];
	map: MapType[][] = new Array(MAP_SIZE.WIDTH)
		.fill(0)
		.map(() => new Array(MAP_SIZE.HEIGHT).fill(MAP_TYPE.EMPTY));
	private _nextBlockId = 0;

	constructor() {
		this.gameRenderer = new GameRenderer();
		this.worm = new Worm(
			new Point(WORM_START_POSITION.x, WORM_START_POSITION.y),
			this,
		);
		this.initBlock();
	}

	public get nextBlockId() {
		return this._nextBlockId++;
	}

	initBlock() {
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
		this.gameRenderer.render({
			ctx,
			map: this.map,
			blocks: this.blocks,
			worm: this.worm,
		});
	}
}
