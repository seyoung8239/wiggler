import type { Worm } from "../worm/Worm";
import { MAP_SIZE } from "./@model/game.config";
import { MAP_TYPE, type MapType } from "./@model/game.constant";
import type { Block } from "../block/Block";
import { GameRenderer } from "./gameRenderer";
import { getInitialGameState } from "./@util/getInitialGameState";

export class Game {
	gameRenderer: GameRenderer;
	worm: Worm;
	blocks: Block[] = [];
	map: MapType[][] = new Array(MAP_SIZE.WIDTH)
		.fill(0)
		.map(() => new Array(MAP_SIZE.HEIGHT).fill(MAP_TYPE.EMPTY));
	private _nextBlockId = 0;

	constructor() {
		this.gameRenderer = new GameRenderer();

		const { initialMap, initialWorm, initialBlock } = getInitialGameState(this);
		this.map = initialMap;
		this.worm = initialWorm;
		this.blocks.push(initialBlock);
	}

	public get nextBlockId() {
		return this._nextBlockId++;
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
