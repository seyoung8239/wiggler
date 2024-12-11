import { Point } from "../../../common/Point";
import { BLOCK_SIZE, PUZZLE_SIZE, puzzle } from "../../../puzzles/1";
import { Block } from "../../block/Block";
import { Worm } from "../../worm/Worm";
import type { Game } from "../game";
import {
	MAP_SIZE,
	WORM_START_POSITION,
	PUZZLE_START_POSITION,
	BLOCK_START_POSITION,
} from "../@model/game.config";
import { MAP_TYPE, type MapType } from "../@model/game.constant";

export const getInitialGameState = (game: Game) => ({
	initialMap: getInitialMap(),
	initialWorm: getInitialWorm(game),
	initialBlock: getInitialBlock(game),
});

const getInitialMap = () => {
	let initialMap = new Array(MAP_SIZE.WIDTH)
		.fill(0)
		.map(() => new Array(MAP_SIZE.HEIGHT).fill(MAP_TYPE.EMPTY));
	initialMap = initGround(initialMap);
	initialMap = initPuzzle(initialMap);

	return initialMap;
};
const initGround = (map: MapType[][]) => {
	for (let x = 0; x < MAP_SIZE.WIDTH; x++) {
		for (let y = MAP_SIZE.HEIGHT - 1; y > MAP_SIZE.HEIGHT - 4; y--) {
			map[x][y] = MAP_TYPE.GROUND;
		}
	}
	return map;
};
const initPuzzle = (map: MapType[][]) => {
	for (let y = 0; y < PUZZLE_SIZE.HEIGHT; y++) {
		for (let x = 0; x < PUZZLE_SIZE.WIDTH; x++) {
			if (puzzle[y][x] === 1) {
				map[PUZZLE_START_POSITION.x + x][PUZZLE_START_POSITION.y + y] =
					MAP_TYPE.PUZZLE;
			}
		}
	}
	return map;
};

const getInitialWorm = (game: Game) => {
	return new Worm(
		new Point(WORM_START_POSITION.x, WORM_START_POSITION.y),
		game,
	);
};

const getInitialBlock = (game: Game) => {
	const initialBlockParts = [];
	for (let y = 0; y < BLOCK_SIZE.HEIGHT; y++) {
		for (let x = 0; x < BLOCK_SIZE.WIDTH; x++) {
			initialBlockParts.push(
				new Point(BLOCK_START_POSITION.x + x, BLOCK_START_POSITION.y + y),
			);
		}
	}

	return new Block(game.nextBlockId, initialBlockParts, game);
};
