import {
	type Direction,
	DIRECTION,
} from "../../common/direction/direction.constant";
import { isOppositeDirection } from "../../common/direction/direction.util";
import { keyboardManager } from "../../common/keyboardManager/keyboardManager";
import { Point } from "../../common/Point";
import { MAP_SIZE } from "../gameMap/gameMap.config";

export class Worm {
	currentDirection: Direction;
	bodyParts: Point[] = [];

	constructor(point: Point) {
		this.currentDirection = DIRECTION.RIGHT;

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

	canMove(direction: Direction) {
		if (isOppositeDirection(direction, this.currentDirection)) return false;

		const nextPoint = Point.getMovedPoint(this.bodyParts[0], direction);
	}

	move(direction: Direction) {
		this.currentDirection = direction;

		this.bodyParts[2] = this.bodyParts[1];
		this.bodyParts[1] = this.bodyParts[0];
		this.bodyParts[0] = Point.getMovedPoint(this.bodyParts[0], direction);
	}

	shouldFall() {}
	handleFall() {}

	animate(ctx: CanvasRenderingContext2D) {
		// if (this.shouldFall) {
		// 	this.handleFall();
		// 	return;
		// }

		this.handleKeyboardEvent();
		// this.move(this.currentDirection);

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
