import {
	type Direction,
	DIRECTION,
} from "../../common/direction/direction.constant";
import { isOppositeDirection } from "../../common/direction/direction.util";
import { keyboardManager } from "../../common/keyboardManager/keyboardManager";
import { Point } from "../../common/Point";
import { MAP_SIZE } from "../gameMap/gameMap.config";
import { MAP_TYPE, type MapType } from "../gameMap/gameMap.constant";

export class Worm {
	currentDirection: Direction;
	bodyParts: Point[] = [];
	gameMap: MapType[][];

	constructor(point: Point, gameMap: MapType[][]) {
		this.currentDirection = DIRECTION.RIGHT;

		this.gameMap = gameMap;

		const { x, y } = point;
		this.bodyParts[0] = new Point(x, y);
		this.bodyParts[1] = new Point(x - 1, y);
		this.bodyParts[2] = new Point(x - 2, y);

		this.handleKeyboardEvent();
	}

	private lastMoveTime = 0;
	private moveThrottle = 100;

	handleKeyboardEvent() {
		const currentTime = Date.now();
		if (currentTime - this.lastMoveTime < this.moveThrottle) return;
		this.lastMoveTime = currentTime;

		if (keyboardManager.isKeyPressed("KeyW")) this.move(DIRECTION.UP);
		if (keyboardManager.isKeyPressed("KeyS")) this.move(DIRECTION.DOWN);
		if (keyboardManager.isKeyPressed("KeyA")) this.move(DIRECTION.LEFT);
		if (keyboardManager.isKeyPressed("KeyD")) this.move(DIRECTION.RIGHT);
	}

	canMove(direction: Direction) {
		if (isOppositeDirection(direction, this.currentDirection)) return false;
		const nextPoint = Point.getMovedPoint(this.bodyParts[0], direction);
		if (
			this.gameMap[nextPoint.x][nextPoint.y] === MAP_TYPE.GROUND ||
			this.gameMap[nextPoint.x][nextPoint.y] === MAP_TYPE.BLOCK
		)
			return false;

		return true;
	}

	move(direction: Direction) {
		if (!this.canMove(direction)) return;

		const nextPoint = Point.getMovedPoint(this.bodyParts[0], direction);
		this.currentDirection = direction;

		this.bodyParts[2] = this.bodyParts[1];
		this.bodyParts[1] = this.bodyParts[0];
		this.bodyParts[0] = nextPoint;
	}

	shouldFall() {
		const isBlockNear = (bodyPart: Point) =>
			[DIRECTION.UP, DIRECTION.DOWN, DIRECTION.LEFT, DIRECTION.RIGHT].some(
				(direction) => {
					const nextPoint = Point.getMovedPoint(bodyPart, direction);
					return this.gameMap[nextPoint.x][nextPoint.y] === MAP_TYPE.BLOCK;
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

		ctx.fillStyle = "saddlebrown";
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
