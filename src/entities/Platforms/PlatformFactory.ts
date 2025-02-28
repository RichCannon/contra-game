import { Application, Renderer } from "pixi.js";
import Platform from "./Platform";

export default class PlatformFactory {
  #pixiApp: Application<Renderer>;

  private platformsArr: Platform[] = [];

  get platforms() {
    return this.platformsArr;
  }

  private addPlatform(newPlatforms: Platform[] | Platform) {
    if (Array.isArray(newPlatforms)) {
      this.platformsArr = [...this.platformsArr, ...newPlatforms];
      return;
    }
    this.platformsArr = [...this.platformsArr, newPlatforms];
  }

  constructor(pixiApp: Application<Renderer>) {
    this.#pixiApp = pixiApp;
  }

  public createPlatform(x: number, y: number) {
    const platform = new Platform();
    platform.x = x;
    platform.y = y;

    this.#pixiApp.stage.addChild(platform);
    this.addPlatform(platform);
  }
}
