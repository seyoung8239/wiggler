import { DIRECTION, type Direction } from "./direction.constant";

export const isOppositeDirection = (d1: Direction, d2: Direction) => {
	const directionSet = new Set([d1, d2]);

	if (directionSet.has(DIRECTION.UP) && directionSet.has(DIRECTION.DOWN))
		return true;
	if (directionSet.has(DIRECTION.RIGHT) && directionSet.has(DIRECTION.LEFT))
		return true;

	return false;
};
