import type { Worm } from "../worm/Worm";
import type { MapType } from "./@model/game.constant";
import type { Block } from "../block/Block";
import { GameRenderer } from "./gameRenderer";
import { getInitialGameState } from "./@util/getInitialGameState";
import { Point } from "../../common/Point";
import {
	ANSWER_START_POSITION,
	MAP_SIZE,
	puzzle,
	PUZZLE_SIZE,
	puzzleChecksum,
} from "./@model/game.config";

export class Game {
	gameRenderer: GameRenderer;
	worm: Worm;
	blocks: Block[];
	map: MapType[][];
	isClear = false;

	private _nextBlockId = 0;

	constructor() {
		this.gameRenderer = new GameRenderer();

		const { initialMap, initialWorm, initialBlock } = getInitialGameState(this);
		this.map = initialMap;
		this.worm = initialWorm;
		this.blocks = [initialBlock];
	}

	public get nextBlockId() {
		return this._nextBlockId++;
	}

	checkClear = () => {
		const blockChecksum = this.blocks.reduce(
			(acc, block) => acc + block.blockParts.length,
			0,
		);

		if (puzzleChecksum !== blockChecksum) return;

		for (let y = 0; y < PUZZLE_SIZE.HEIGHT; y++) {
			for (let x = 0; x < PUZZLE_SIZE.WIDTH; x++) {
				if (puzzle[y][x] === 0) continue;

				const point = new Point(
					x + ANSWER_START_POSITION.x,
					y + ANSWER_START_POSITION.y,
				);
				if (!this.blocks.some((block) => block.hasBlockPart(point))) return;
			}
		}

		this.isClear = true;
	};

	handleClear = (ctx: CanvasRenderingContext2D) => {
		ctx.font = "48px serif";
		ctx.textAlign = "center";
		ctx.fillText(
			"CLEAR",
			(MAP_SIZE.WIDTH * MAP_SIZE.UNIT) / 2,
			(MAP_SIZE.HEIGHT * MAP_SIZE.UNIT) / 2 - 48,
		);
	};

	render(ctx: CanvasRenderingContext2D) {
		if (this.isClear) {
			this.handleClear(ctx);
			return;
		}

		this.checkClear();

		this.gameRenderer.render({
			ctx,
			map: this.map,
			blocks: this.blocks,
			worm: this.worm,
		});
	}
}
