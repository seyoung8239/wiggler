import { DIRECTION } from "../../common/direction/direction.constant";
import { Point } from "../../common/Point";
import { MAP_SIZE } from "../game/game.config";
import { MAP_TYPE, type MapType } from "../game/game.constant";

export class Block {
	id: number;
	blockParts: Point[] = [];
	gameMap: MapType[][];

	constructor(id: number, blockParts: Point[], gameMap: MapType[][]) {
		this.id = id;
		this.blockParts = blockParts;
		this.gameMap = gameMap;
	}

	shouldFall() {
		return this.blockParts.every(
			(point) => this.gameMap[point.x][point.y + 1] === MAP_TYPE.EMPTY,
		);
	}

	handleFall() {
		while (true) {
			if (!this.shouldFall()) return;

			this.blockParts = this.blockParts.map((point) =>
				Point.getMovedPoint(point, DIRECTION.DOWN),
			);
		}
	}

	destroyBlockPart(blockPart: Point) {
		this.blockParts = this.blockParts.filter(
			(point) => !point.isSamePoint(blockPart),
		);
	}

	animate(ctx: CanvasRenderingContext2D) {
		if (this.shouldFall()) {
			console.log("fall");
			this.handleFall();
		}

		this.blockParts.forEach((point) => {
			this.gameMap[point.x][point.y] = MAP_TYPE.BLOCK;
		});

		ctx.fillStyle = "saddlebrown";
		this.blockParts.forEach(({ x, y }) => {
			ctx.fillRect(
				x * MAP_SIZE.UNIT,
				y * MAP_SIZE.UNIT,
				MAP_SIZE.UNIT,
				MAP_SIZE.UNIT,
			);
		});
	}
}
