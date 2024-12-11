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

		const nextPoint = Point.getMovedPoint(this.bodyParts[0], direction);

		if (this.gameMap[nextPoint.x][nextPoint.y] === MAP_TYPE.BLOCK) {
			for (let i = 0; i < this.game.blocks.length; i++) {
				if (!this.game.blocks[i].hasBlockPart(nextPoint)) continue;

				this.game.blocks[i].destroyBlockPart(nextPoint);
				break;
			}
		}

		this.currentDirection = direction;

		this.game.map[this.bodyParts[2].x][this.bodyParts[2].y] = MAP_TYPE.EMPTY;
		this.bodyParts[2] = this.bodyParts[1];
		this.bodyParts[1] = this.bodyParts[0];
		this.bodyParts[0] = nextPoint;
	}
	canMove(direction: Direction) {
		if (isOppositeDirection(direction, this.currentDirection)) return false;
		const nextPoint = Point.getMovedPoint(this.bodyParts[0], direction);
		if (
			this.gameMap[nextPoint.x][nextPoint.y] === MAP_TYPE.GROUND ||
			this.gameMap[nextPoint.x][nextPoint.y] === MAP_TYPE.PUZZLE
		)
			return false;

		return true;
	}

	shouldFall() {
		const isBlockNear = (bodyPart: Point) =>
			[DIRECTION.UP, DIRECTION.DOWN, DIRECTION.LEFT, DIRECTION.RIGHT].some(
				(direction) => {
					const nextPoint = Point.getMovedPoint(bodyPart, direction);
					return (
						this.gameMap[nextPoint.x][nextPoint.y] === MAP_TYPE.BLOCK ||
						this.gameMap[nextPoint.x][nextPoint.y] === MAP_TYPE.PUZZLE
					);
				},
			);

		const isStickToBlock = this.bodyParts.slice(0, 2).some(isBlockNear);
		if (isStickToBlock) return false;

		return this.bodyParts.every(
			(point) => this.gameMap[point.x][point.y + 1] === MAP_TYPE.EMPTY,
		);
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

		if (this.shouldFall()) {
			console.log("fall");
			this.handleFall();
		}

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
