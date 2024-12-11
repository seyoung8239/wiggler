import {
	type Direction,
	DIRECTION,
} from "../../common/direction/direction.constant";
import { isOppositeDirection } from "../../common/direction/direction.util";
import { keyboardManager } from "../../common/keyboardManager/keyboardManager";
import { Point } from "../../common/Point";
import type { Game } from "../game/game";
import { MAP_SIZE } from "../game/@model/game.config";
import { MAP_TYPE, type MapType } from "../game/@model/game.constant";

export class Worm {
	currentDirection: Direction;
	bodyParts: Point[] = [];
	game: Game;

	constructor(point: Point, game: Game) {
		this.currentDirection = DIRECTION.RIGHT;

		this.game = game;

		const { x, y } = point;
		this.bodyParts[0] = new Point(x, y);
		this.bodyParts[1] = new Point(x - 1, y);
		this.bodyParts[2] = new Point(x - 2, y);

		this.handleKeyboardEvent();
	}

	private lastMoveTime = 0;
	private moveThrottle = 300;

	get gameMap(): MapType[][] {
		return this.game.map;
	}

	handleKeyboardEvent() {
		const currentTime = Date.now();
		if (currentTime - this.lastMoveTime < this.moveThrottle) return;
		this.lastMoveTime = currentTime;

		if (keyboardManager.isKeyPressed("KeyW")) this.move(DIRECTION.UP);
		if (keyboardManager.isKeyPressed("KeyS")) this.move(DIRECTION.DOWN);
		if (keyboardManager.isKeyPressed("KeyA")) this.move(DIRECTION.LEFT);
		if (keyboardManager.isKeyPressed("KeyD")) this.move(DIRECTION.RIGHT);
	}

	move(direction: Direction) {
		if (!this.canMove(direction)) return;

		const nextHeadPoint = Point.getMovedPoint(this.bodyParts[0], direction);
		this.currentDirection = direction;

		const destroyBlockIfCollision = () => {
			for (let i = 0; i < this.game.blocks.length; i++) {
				if (!this.game.blocks[i].hasBlockPart(nextHeadPoint)) continue;
				this.game.blocks[i].destroyBlockPart(nextHeadPoint);
				break;
			}
		};
		destroyBlockIfCollision();

		const moveBodyParts = () => {
			this.bodyParts[2] = this.bodyParts[1];
			this.bodyParts[1] = this.bodyParts[0];
			this.bodyParts[0] = nextHeadPoint;
		};
		moveBodyParts();
	}
	canMove(direction: Direction) {
		if (isOppositeDirection(direction, this.currentDirection)) return false;
		const nextHeadPoint = Point.getMovedPoint(this.bodyParts[0], direction);

		if (
			this.gameMap[nextHeadPoint.x][nextHeadPoint.y] === MAP_TYPE.GROUND ||
			this.gameMap[nextHeadPoint.x][nextHeadPoint.y] === MAP_TYPE.PUZZLE
		)
			return false;

		return true;
	}

	isColiidedWithObject(parts: Point[]) {
		return (
			this.isCollidedWithBlock(parts) ||
			this.isCollidedWithPuzzle(parts) ||
			this.isCollidedWithGround(parts)
		);
	}
	isCollidedWithBlock(parts: Point[]) {
		return this.game.blocks.some((block) =>
			Point.isCollided(block.blockParts, parts),
		);
	}
	isCollidedWithPuzzle(parts: Point[]) {
		return parts.some(
			(part) => this.game.map[part.x][part.y] === MAP_TYPE.PUZZLE,
		);
	}
	isCollidedWithGround(parts: Point[]) {
		return parts.some(
			(part) => this.game.map[part.x][part.y] === MAP_TYPE.GROUND,
		);
	}

	shouldFall() {
		const isNearObject = (bodyPart: Point) =>
			[DIRECTION.UP, DIRECTION.DOWN, DIRECTION.LEFT, DIRECTION.RIGHT].some(
				(direction) => {
					const nearPoint = Point.getMovedPoint(bodyPart, direction);

					const isPuzzleNear =
						this.gameMap[nearPoint.x][nearPoint.y] === MAP_TYPE.PUZZLE;
					const isBlockNear = this.game.blocks.some((block) =>
						block.hasBlockPart(nearPoint),
					);

					if (isPuzzleNear) return true;
					if (isBlockNear) return true;

					return false;
				},
			);

		const isStickToObject = this.bodyParts.slice(0, 2).some(isNearObject);
		if (isStickToObject) return false;

		const nextBodyParts = this.bodyParts.map((point) =>
			Point.getMovedPoint(point, DIRECTION.DOWN),
		);
		if (this.isColiidedWithObject(nextBodyParts)) return false;

		return true;
	}

	handleFall() {
		while (true) {
			if (!this.shouldFall()) return;

			this.bodyParts = this.bodyParts.map((point) =>
				Point.getMovedPoint(point, DIRECTION.DOWN),
			);
		}
	}

	animate(ctx: CanvasRenderingContext2D) {
		this.handleKeyboardEvent();

		this.handleFall();

		this.bodyParts.forEach((point) => {
			this.gameMap[point.x][point.y] = MAP_TYPE.WORM;
		});

		ctx.fillStyle = "sandybrown";
		this.bodyParts.forEach(({ x, y }) => {
			ctx.fillRect(
				x * MAP_SIZE.UNIT,
				y * MAP_SIZE.UNIT,
				MAP_SIZE.UNIT,
				MAP_SIZE.UNIT,
			);
		});
	}
}
