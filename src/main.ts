import * as PIXI from "pixi.js";
import Game from "./Game";

const init = async () => {
  const pixiApp = new PIXI.Application();
  await pixiApp.init({ width: 1024, height: 768 });

  const appEl = document.getElementById("app");

  const game = new Game(pixiApp);

  pixiApp.ticker.add(game.update, game);
  appEl?.appendChild(pixiApp.canvas);
};

init();
