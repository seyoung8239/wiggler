import { MAP_SIZE } from "../objects/game/@model/game.config";
import { DIRECTION, type Direction } from "./direction/direction.constant";

export class Point {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	isSamePoint(point: Point) {
		return this.x === point.x && this.y === point.y;
	}

	static getMovedPoint(point: Point, direction: Direction) {
		const { x, y } = point;
		switch (direction) {
			case DIRECTION.UP:
				return new Point(x, y - 1);

			case DIRECTION.DOWN:
				return new Point(x, y + 1);

			case DIRECTION.RIGHT:
				return new Point(x + 1, y);

			case DIRECTION.LEFT:
				return new Point(x - 1, y);
		}
	}

	static isCollided(pointList1: Point[], pointList2: Point[]) {
		return pointList1.some((point1) =>
			pointList2.some((point2) => point1.isSamePoint(point2)),
		);
	}

	get isOutOfMap() {
		return (
			this.x < 0 ||
			this.x >= MAP_SIZE.WIDTH ||
			this.y < 0 ||
			this.y >= MAP_SIZE.HEIGHT
		);
	}
}
