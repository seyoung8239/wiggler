import {
	type Direction,
	DIRECTION,
} from "../../common/direction/direction.constant";
import { isOppositeDirection } from "../../common/direction/direction.util";
import { Point } from "../../common/Point";

export class Worm {
	currentDirection: Direction;
	bodyParts: Point[] = [];

	constructor(point: Point) {
		this.currentDirection = DIRECTION.RIGHT;

		const { x, y } = point;
		this.bodyParts[0] = new Point(x, y);
		this.bodyParts[1] = new Point(x - 1, y);
		this.bodyParts[2] = new Point(x - 2, y);
	}

	canMove(direction: Direction) {
		if (isOppositeDirection(direction, this.currentDirection)) return false;

		const nextPoint = Point.getMovedPoint(this.bodyParts[0], direction);
	}

	move(direction: Direction) {
		this.bodyParts[2] = this.bodyParts[1];
		this.bodyParts[1] = this.bodyParts[0];
		this.bodyParts[0] = Point.getMovedPoint(this.bodyParts[0], direction);
	}
}
