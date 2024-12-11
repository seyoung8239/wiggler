import {
	ALL_DIRECTION,
	DIRECTION,
} from "../../common/direction/direction.constant";
import { Point } from "../../common/Point";
import type { Game } from "../game/game";
import { MAP_SIZE } from "../game/@model/game.config";
import { MAP_TYPE } from "../game/@model/game.constant";

export class Block {
	id: number;
	blockParts: Point[] = [];
	game: Game;

	constructor(id: number, blockParts: Point[], game: Game) {
		this.id = id;
		this.blockParts = blockParts;
		this.game = game;
	}

	hasBlockPart(point: Point) {
		return this.blockParts.some((blockPart) => blockPart.isSamePoint(point));
	}

	isColiidedWithObject(parts: Point[]) {
		return (
			this.isCollidedWithOtherBlock(parts) ||
			this.isCollidedWithGround(parts) ||
			this.isCollidedWithWorm(parts)
		);
	}
	isCollidedWithOtherBlock(parts: Point[]) {
		return this.game.blocks.some((block) => {
			if (block.id === this.id) return false;
			return Point.isCollided(block.blockParts, parts);
		});
	}
	isCollidedWithGround(parts: Point[]) {
		return parts.some(
			(part) => this.game.map[part.x][part.y] === MAP_TYPE.GROUND,
		);
	}
	isCollidedWithWorm(parts: Point[]) {
		return this.game.worm.bodyParts.some((part) =>
			Point.isCollided(parts, [part]),
		);
	}

	public destroyBlockPart(blockPart: Point) {
		this.removeBlockPart(blockPart);
		if (this.blockParts.length === 0) {
			this.game.blocks = this.game.blocks.filter(
				(block) => block.id !== this.id,
			);
			return;
		}

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
	private removeBlockPart(blockPart: Point) {
		if (!this.hasBlockPart(blockPart)) return;

		this.blockParts = this.blockParts.filter(
			(point) => !point.isSamePoint(blockPart),
		);
		this.game.map[blockPart.x][blockPart.y] = MAP_TYPE.EMPTY;
	}
	private getSeperatedBlockParts() {
		const visited = new Array(MAP_SIZE.WIDTH)
			.fill(0)
			.map(() => new Array(MAP_SIZE.HEIGHT).fill(false));

		const queue = [this.blockParts[0]];
		visited[this.blockParts[0].x][this.blockParts[0].y] = true;

		while (queue.length) {
			const current = queue.shift()!;

			ALL_DIRECTION.forEach((direction) => {
				const next = Point.getMovedPoint(current, direction);
				if (next.isOutOfMap) return;
				if (visited[next.x][next.y]) return;
				if (!this.hasBlockPart(next)) return;

				visited[next.x][next.y] = true;
				queue.push(next);
			});
		}

		return this.blockParts.filter((point) => !visited[point.x][point.y]);
	}

	handleFall() {
		while (true) {
			if (!this.shouldFall()) return;

			this.blockParts = this.blockParts.map((point) =>
				Point.getMovedPoint(point, DIRECTION.DOWN),
			);
		}
	}
	shouldFall() {
		const nextBlockParts = this.blockParts.map((point) =>
			Point.getMovedPoint(point, DIRECTION.DOWN),
		);
		if (this.isColiidedWithObject(nextBlockParts)) return false;

		return true;
	}

	animate(ctx: CanvasRenderingContext2D) {
		this.handleFall();

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
