export const puzzle = [
	[1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1],
];
export const puzzleChecksum = puzzle.flat().reduce((acc, cur) => acc + cur, 0);
// export const puzzle = [
// 	[1, 0, 0, 0, 1, 0],
// 	[1, 0, 0, 1, 1, 1],
// 	[1, 1, 1, 1, 1, 1],
// 	[1, 1, 1, 1, 0, 0],
// 	[1, 1, 1, 1, 0, 0],
// 	[1, 0, 0, 1, 0, 0],
// ];

export const PUZZLE_SIZE = {
	WIDTH: 6,
	HEIGHT: 6,
};

export const BLOCK_SIZE = {
	WIDTH: 6,
	HEIGHT: 7,
};

export const PUZZLE_START_POSITION = { x: 3, y: 9 };
export const WORM_START_POSITION = { x: 13, y: 9 };
export const BLOCK_START_POSITION = { x: 16, y: 8 };
export const ANSWER_START_POSITION = { x: 16, y: 9 };
