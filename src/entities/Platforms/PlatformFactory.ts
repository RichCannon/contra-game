import { Application, Renderer } from "pixi.js";
import Platform, { PlatformType } from "./Platform";

export default class PlatformFactory {
  #pixiApp: Application<Renderer>;

  #platformsArr: Platform[] = [];

  get platforms() {
    return this.#platformsArr;
  }

  private addPlatform(newPlatforms: Platform[] | Platform) {
    if (Array.isArray(newPlatforms)) {
      this.#platformsArr = [...this.#platformsArr, ...newPlatforms];
      return;
    }
    this.#platformsArr = [...this.#platformsArr, newPlatforms];
  }

  constructor(pixiApp: Application<Renderer>) {
    this.#pixiApp = pixiApp;
  }

  public createPlatform(x: number, y: number, isClimable?: boolean) {
    const platform = new Platform(PlatformType.PLATFORM, isClimable);
    platform.x = x;
    platform.y = y;

    this.#pixiApp.stage.addChild(platform);
    this.addPlatform(platform);
  }
  public createBox(x: number, y: number) {
    const box = new Platform(PlatformType.BOX);
    box.x = x;
    box.y = y;

    this.#pixiApp.stage.addChild(box);
    this.addPlatform(box);
  }
}
