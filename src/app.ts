import { keyboardManager } from "./common/keyboardManager/keyboardManager";
import { MAP_SIZE } from "./objects/game/@model/game.config";
import { Game } from "./objects/game/game";

class App {
  canvas;
  ctx;

  stageWidth = 0;
  stageHeight = 0;
  pixelRatio = 1;

  game;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;

    this.game = new Game();

    window.addEventListener("resize", this.resize.bind(this), false);
    this.resize();

    this.bindEvent();

    requestAnimationFrame(this.animate.bind(this));
  }

  bindEvent() {
    keyboardManager.bindKey("x", () => location.reload());
  }

  resize() {
    this.canvas.width = MAP_SIZE.WIDTH * MAP_SIZE.UNIT;
    this.canvas.height = MAP_SIZE.HEIGHT * MAP_SIZE.UNIT;
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    this.game.render(this.ctx!);
  }
}

window.onload = () => {
  new App();
  console.log("hi");
};
