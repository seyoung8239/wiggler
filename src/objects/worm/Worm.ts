import {
	ALL_DIRECTION,
	type Direction,
	DIRECTION,
} from "../../common/direction/direction.constant";
import { isOppositeDirection } from "../../common/direction/direction.util";
import { keyboardManager } from "../../common/keyboardManager/keyboardManager";
import { Point } from "../../common/Point";
import type { Game } from "../game/game";
import { MAP_SIZE } from "../game/@model/game.config";
import { MAP_TYPE } from "../game/@model/game.constant";

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
	handleKeyboardEvent() {
		const currentTime = Date.now();
		if (currentTime - this.lastMoveTime < this.moveThrottle) return;
		this.lastMoveTime = currentTime;

		if (keyboardManager.isKeyPressed("KeyW")) this.move(DIRECTION.UP);
		if (keyboardManager.isKeyPressed("KeyS")) this.move(DIRECTION.DOWN);
		if (keyboardManager.isKeyPressed("KeyA")) this.move(DIRECTION.LEFT);
		if (keyboardManager.isKeyPressed("KeyD")) this.move(DIRECTION.RIGHT);
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

	isStraightUp() {
		if (this.currentDirection !== DIRECTION.UP) return false;

		const [head, body, tail] = this.bodyParts;
		if (head.y !== body.y - 1) return false;
		if (body.y !== tail.y - 1) return false;

		return true;
	}
	isNearObject(bodyPart: Point) {
		return ALL_DIRECTION.some((direction) => {
			const nearPoint = Point.getMovedPoint(bodyPart, direction);
			if (nearPoint.isOutOfMap) return false;

			const isPuzzleNear =
				this.game.map[nearPoint.x][nearPoint.y] === MAP_TYPE.PUZZLE;
			const isBlockNear = this.game.blocks.some((block) =>
				block.hasBlockPart(nearPoint),
			);

			if (isPuzzleNear) return true;
			if (isBlockNear) return true;

			return false;
		});
	}

	move(direction: Direction) {
		if (!this.canMove(direction)) return;

		const nextHeadPoint = Point.getMovedPoint(this.bodyParts[0], direction);
		this.currentDirection = direction;

		const moveBodyParts = () => {
			this.bodyParts[2] = this.bodyParts[1];
			this.bodyParts[1] = this.bodyParts[0];
			this.bodyParts[0] = nextHeadPoint;
		};
		moveBodyParts();

		const destroyBlockIfCollision = () => {
			for (let i = 0; i < this.game.blocks.length; i++) {
				if (!this.game.blocks[i].hasBlockPart(nextHeadPoint)) continue;
				this.game.blocks[i].destroyBlockPart(nextHeadPoint);
				break;
			}
		};
		destroyBlockIfCollision();
	}
	canMove(direction: Direction) {
		if (isOppositeDirection(direction, this.currentDirection)) return false;

		const nextHeadPoint = Point.getMovedPoint(this.bodyParts[0], direction);
		if (nextHeadPoint.isOutOfMap) return false;
		if (this.isCollidedWithGround([nextHeadPoint])) return false;
		if (this.isCollidedWithPuzzle([nextHeadPoint])) return false;

		const [head, body] = this.bodyParts;
		if (this.isStraightUp() && direction === DIRECTION.UP) {
			if (!this.isNearObject(head) && !this.isNearObject(body)) return false;
		}

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
	shouldFall() {
		const isStickToObject = this.bodyParts
			.slice(0, 2)
			.some(this.isNearObject.bind(this));
		if (isStickToObject) return false;

		const nextBodyParts = this.bodyParts.map((point) =>
			Point.getMovedPoint(point, DIRECTION.DOWN),
		);
		if (this.isColiidedWithObject(nextBodyParts)) return false;

		return true;
	}

	animate(ctx: CanvasRenderingContext2D) {
		this.handleKeyboardEvent();

		this.handleFall();

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
