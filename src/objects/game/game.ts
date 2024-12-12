import { Worm } from "../worm/Worm";
import type { MapType } from "./@model/game.constant";
import type { Block } from "../block/Block";
import { GameRenderer } from "./gameRenderer";
import { getInitialGameState } from "./@util/getInitialGameState";
import { Point } from "../../common/Point";
import { keyboardManager } from "../../common/keyboardManager/keyboardManager";
import { MAP_SIZE, MAX_STAGE } from "./@model/game.config";

export class Game {
  gameRenderer: GameRenderer;
  worm: Worm = new Worm(new Point(0, 0), this);
  blocks: Block[] = [];
  map: MapType[][] = [[]];
  isClear = false;
  isReady = false;

  stageNumber: number = 1;

  puzzle: number[][] = [[]];
  puzzleChecksum: number = 0;
  PUZZLE_SIZE: { WIDTH: number; HEIGHT: number } = { WIDTH: 0, HEIGHT: 0 };
  BLOCK_SIZE: { WIDTH: number; HEIGHT: number } = { WIDTH: 0, HEIGHT: 0 };
  PUZZLE_START_POSITION: { x: number; y: number } = { x: 0, y: 0 };
  WORM_START_POSITION: { x: number; y: number } = { x: 0, y: 0 };
  BLOCK_START_POSITION: { x: number; y: number } = { x: 0, y: 0 };
  ANSWER_START_POSITION: { x: number; y: number } = { x: 0, y: 0 };

  private _nextBlockId = 0;

  constructor() {
    this.gameRenderer = new GameRenderer();

    const urlParams = new URLSearchParams(window.location.search);
    const stageNumber = urlParams.get("stage") ?? "1";

    import(`../../puzzles/${stageNumber}`).then(async (config) => {
      await this.initConfig(config);
      this.initStage(stageNumber);

      const { initialMap, initialWorm, initialBlock } =
        getInitialGameState(this);
      this.map = initialMap;
      this.worm = initialWorm;
      this.blocks = [initialBlock];

      this.bindEvent();
      this.isReady = true;
    });
  }

  async initConfig(config: any) {
    const {
      puzzle,
      puzzleChecksum,
      PUZZLE_SIZE,
      BLOCK_SIZE,
      PUZZLE_START_POSITION,
      WORM_START_POSITION,
      BLOCK_START_POSITION,
      ANSWER_START_POSITION,
    } = config;

    this.puzzle = puzzle;
    this.puzzleChecksum = puzzleChecksum;
    this.PUZZLE_SIZE = PUZZLE_SIZE;
    this.BLOCK_SIZE = BLOCK_SIZE;
    this.PUZZLE_START_POSITION = PUZZLE_START_POSITION;
    this.WORM_START_POSITION = WORM_START_POSITION;
    this.BLOCK_START_POSITION = BLOCK_START_POSITION;
    this.ANSWER_START_POSITION = ANSWER_START_POSITION;
  }

  initStage(stageNumber: string) {
    this.stageNumber = Number(stageNumber);
    const $stageNumber = document.getElementById(
      "stage-number"
    ) as HTMLSpanElement;
    $stageNumber.innerText = this.stageNumber.toString();
  }

  public get nextBlockId() {
    return this._nextBlockId++;
  }

  bindEvent() {
    keyboardManager.bindKey("x", () => location.reload());

    const $btnPrev = document.getElementById("btn-prev") as HTMLButtonElement;
    const $btnNext = document.getElementById("btn-next") as HTMLButtonElement;
    $btnPrev.addEventListener("click", this.goToPrevStage.bind(this));
    $btnNext.addEventListener("click", this.goToNextStage.bind(this));
  }

  goToNextStage() {
    if (this.stageNumber === MAX_STAGE) return;
    this.stageNumber += 1;
    this.goToStageNumber();
  }
  goToPrevStage() {
    if (this.stageNumber === 1) return;
    this.stageNumber -= 1;
    this.goToStageNumber();
  }
  goToStageNumber() {
    window.location.href = `?stage=${this.stageNumber}`;
  }

  checkClear = () => {
    const blockChecksum = this.blocks.reduce(
      (acc, block) => acc + block.blockParts.length,
      0
    );

    if (this.puzzleChecksum !== blockChecksum) return;

    for (let y = 0; y < this.PUZZLE_SIZE.HEIGHT; y++) {
      for (let x = 0; x < this.PUZZLE_SIZE.WIDTH; x++) {
        if (this.puzzle[y][x] === 0) continue;

        const point = new Point(
          x + this.ANSWER_START_POSITION.x,
          y + this.ANSWER_START_POSITION.y
        );
        if (!this.blocks.some((block) => block.hasBlockPart(point))) return;
      }
    }

    this.isClear = true;
  };

  handleClear = (ctx: CanvasRenderingContext2D) => {
    ctx.font = "48px serif";
    ctx.textAlign = "center";
    ctx.fillText(
      "CLEAR",
      (MAP_SIZE.WIDTH * MAP_SIZE.UNIT) / 2,
      (MAP_SIZE.HEIGHT * MAP_SIZE.UNIT) / 2 - 48
    );
  };

  render(ctx: CanvasRenderingContext2D) {
    if (!this.isReady) return;
    if (this.isClear) {
      this.handleClear(ctx);
      return;
    }

    this.checkClear();

    this.gameRenderer.render({
      ctx,
      map: this.map,
      blocks: this.blocks,
      worm: this.worm,
    });
  }
}
