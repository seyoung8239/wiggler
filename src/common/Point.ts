import { DIRECTION, type Direction } from "./direction/direction.constant";

export class Point {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	static getMovedPoint(point: Point, direction: Direction) {
		const { x, y } = point;
		switch (direction) {
			case DIRECTION.UP:
				return new Point(x, y + 1);

			case DIRECTION.DOWN:
				return new Point(x, y - 1);

			case DIRECTION.RIGHT:
				return new Point(x - 1, y);

			case DIRECTION.LEFT:
				return new Point(x + 1, y);
		}
	}
}
