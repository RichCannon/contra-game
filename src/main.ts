import * as PIXI from "pixi.js";
import Game from "./Game";

const init = async () => {
  const pixiApp = new PIXI.Application();
  await pixiApp.init({ width: 800, height: 600 });

  const appEl = document.getElementById("app");

  const game = new Game(pixiApp);

  pixiApp.ticker.add(game.update, game);
  appEl?.appendChild(pixiApp.canvas);

  // const view = new PIXI.Graphics();
  // view.rect(0, 0, 100, 100);
  // view.fill(0xff0000);

  // _pixiApp.stage.addChild(view);
};

init();
