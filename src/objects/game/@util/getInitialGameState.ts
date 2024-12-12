import { Point } from "../../../common/Point";
import { Block } from "../../block/Block";
import { Worm } from "../../worm/Worm";
import type { Game } from "../game";
import { MAP_SIZE } from "../@model/game.config";
import { MAP_TYPE, type MapType } from "../@model/game.constant";

export const getInitialGameState = (game: Game) => ({
  initialMap: getInitialMap(game),
  initialWorm: getInitialWorm(game),
  initialBlock: getInitialBlock(game),
});

const getInitialMap = (game: Game) => {
  let initialMap = new Array(MAP_SIZE.WIDTH)
    .fill(0)
    .map(() => new Array(MAP_SIZE.HEIGHT).fill(MAP_TYPE.EMPTY));
  initialMap = initGround(initialMap);
  initialMap = initPuzzle(game, initialMap);

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
const initPuzzle = (game: Game, map: MapType[][]) => {
  for (let y = 0; y < game.PUZZLE_SIZE.HEIGHT; y++) {
    for (let x = 0; x < game.PUZZLE_SIZE.WIDTH; x++) {
      if (game.puzzle[y][x] === 1) {
        map[game.PUZZLE_START_POSITION.x + x][
          game.PUZZLE_START_POSITION.y + y
        ] = MAP_TYPE.PUZZLE;
      }
    }
  }
  return map;
};

const getInitialWorm = (game: Game) => {
  return new Worm(
    new Point(game.WORM_START_POSITION.x, game.WORM_START_POSITION.y),
    game
  );
};

const getInitialBlock = (game: Game) => {
  const initialBlockParts = [];
  for (let y = 0; y < game.BLOCK_SIZE.HEIGHT; y++) {
    for (let x = 0; x < game.BLOCK_SIZE.WIDTH; x++) {
      initialBlockParts.push(
        new Point(
          game.BLOCK_START_POSITION.x + x,
          game.BLOCK_START_POSITION.y + y
        )
      );
    }
  }

  return new Block(game.nextBlockId, initialBlockParts, game);
};
