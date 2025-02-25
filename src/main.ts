import * as PIXI from "pixi.js";

const _pixiApp = new PIXI.Application();
await _pixiApp.init({ width: 800, height: 600 });

const appEl = document.getElementById("app");

appEl?.appendChild(_pixiApp.canvas);
