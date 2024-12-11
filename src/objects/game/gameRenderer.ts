import type { Block } from "../block/Block";
import type { Worm } from "../worm/Worm";
import { MAP_SIZE } from "./game.config";
import { MAP_TYPE, type MapType } from "./game.constant";

interface RenderArgs {
	ctx: CanvasRenderingContext2D;
	map: MapType[][];
	blocks: Block[];
	worm: Worm;
}

export class GameRenderer {
	render({ ctx, map, blocks, worm }: RenderArgs) {
		this.clearMap(ctx);

		this.renderBaseMap(ctx, map);

		blocks.forEach((block) => block.animate(ctx));
		worm.animate(ctx);
	}

	renderBaseMap(ctx: CanvasRenderingContext2D, map: MapType[][]) {
		for (let x = 0; x < MAP_SIZE.WIDTH; x++) {
			for (let y = 0; y < MAP_SIZE.HEIGHT; y++) {
				switch (map[x][y]) {
					case MAP_TYPE.EMPTY:
						ctx.fillStyle = "chocolate";
						break;
					case MAP_TYPE.GROUND:
						ctx.fillStyle = "#2b1212";
						break;
					case MAP_TYPE.PUZZLE:
						ctx.fillStyle = "gold";
						break;
				}

				ctx.fillRect(
					x * MAP_SIZE.UNIT,
					y * MAP_SIZE.UNIT,
					MAP_SIZE.UNIT,
					MAP_SIZE.UNIT,
				);

				// ctx.strokeStyle = "darkred";
				// ctx.strokeRect(
				// 	x * MAP_SIZE.UNIT,
				// 	y * MAP_SIZE.UNIT,
				// 	MAP_SIZE.UNIT,
				// 	MAP_SIZE.UNIT,
				// );
			}
		}
	}

	clearMap(ctx: CanvasRenderingContext2D) {
		ctx.clearRect(
			0,
			0,
			MAP_SIZE.WIDTH * MAP_SIZE.UNIT,
			MAP_SIZE.HEIGHT * MAP_SIZE.UNIT,
		);
	}
}
