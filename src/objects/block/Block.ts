import {
	ALL_DIRECTION,
	DIRECTION,
} from "../../common/direction/direction.constant";
import { Point } from "../../common/Point";
import type { Game } from "../game/game";
import { MAP_SIZE } from "../game/game.config";
import { MAP_TYPE, type MapType } from "../game/game.constant";

export class Block {
	id: number;
	blockParts: Point[] = [];
	game: Game;

	constructor(id: number, blockParts: Point[], game: Game) {
		this.id = id;
		this.blockParts = blockParts;
		this.game = game;
	}

	get gameMap(): MapType[][] {
		return this.game.map;
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

	private removeBlockPart(blockPart: Point) {
		this.blockParts = this.blockParts.filter(
			(point) => !point.isSamePoint(blockPart),
		);
	}

	hasBlockPart(point: Point) {
		return this.blockParts.some((blockPart) => blockPart.isSamePoint(point));
	}

	getSeperatedBlockParts() {
		const visited = new Array(MAP_SIZE.WIDTH)
			.fill(0)
			.map(() => new Array(MAP_SIZE.HEIGHT).fill(false));

		const queue = [this.blockParts[0]];
		visited[this.blockParts[0].x][this.blockParts[0].y] = true;

		while (queue.length) {
			const current = queue.shift()!;

			ALL_DIRECTION.forEach((direction) => {
				const next = Point.getMovedPoint(current, direction);
				if (visited[next.x][next.y]) return;
				if (!this.hasBlockPart(next)) return;

				visited[next.x][next.y] = true;
				queue.push(next);
			});
		}

		return this.blockParts.filter((point) => !visited[point.x][point.y]);
	}

	destroyBlockPart(blockPart: Point) {
		this.removeBlockPart(blockPart);

		const seperatedBlockParts = this.getSeperatedBlockParts();
		if (seperatedBlockParts.length === 0) return;

		seperatedBlockParts.forEach((point) => {
			this.removeBlockPart(point);
		});

		const seperatedBlock = new Block(
			this.game.nextBlockId,
			seperatedBlockParts,
			this.game,
		);
		this.game.blocks.push(seperatedBlock);
	}

	animate(ctx: CanvasRenderingContext2D) {
		if (this.shouldFall()) {
			console.log("fall");
			this.handleFall();
		}

		this.blockParts.forEach((point) => {
			this.gameMap[point.x][point.y] = MAP_TYPE.BLOCK;
		});

		ctx.fillStyle = `rgb(${50 * this.id}, ${50 * this.id}, ${50 * this.id})`;
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
