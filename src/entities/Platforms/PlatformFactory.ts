import { Graphics } from "pixi.js";
import type World from "../../WorldContainer";
import Platform from "./Platform";
import PlatformView from "./PlatformView";
import { ENTITIE_TYPES } from "../../types/entities.types";

export default class PlatformFactory {
  #worldContainer: World;

  #platformsArr: Platform[] = [];
  #platformWidth = 128;
  #platformHeight = 24;

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

  constructor(worldContainer: World) {
    this.#worldContainer = worldContainer;
  }

  public createPlatform(x: number, y: number) {
    const skin = new Graphics();
    skin.rect(0, 0, this.#platformWidth, this.#platformHeight);
    skin.fill(0x00ff00);

    skin.rect(
      0,
      this.#platformHeight,
      this.#platformWidth,
      this.#platformHeight * 20
    );
    skin.fill(0x694216);

    skin.setStrokeStyle({
      color: 0x004220,
      width: 1,
    });
    skin.stroke();

    const view = new PlatformView(this.#platformWidth, this.#platformHeight);
    view.addChild(skin);

    const platform = new Platform(view);
    platform.x = x;
    platform.y = y;

    this.#worldContainer.background.addChild(view);
    this.addPlatform(platform);
  }
  public createBox(x: number, y: number, isClimable = false) {
    const skin = new Graphics();
    skin.rect(0, 0, this.#platformWidth, this.#platformHeight);
    skin.fill(0x00ff00);

    skin.rect(
      0,
      this.#platformHeight,
      this.#platformWidth,
      this.#platformHeight * 20
    );
    skin.fill(0x694216);

    skin.lineTo(this.#platformWidth, this.#platformHeight);
    skin.setStrokeStyle({
      color: 0x004220,
      width: 1,
    });
    skin.stroke();

    const view = new PlatformView(this.#platformWidth, this.#platformHeight);
    view.addChild(skin);

    const platform = new Platform(view, ENTITIE_TYPES.BOX);
    platform.isClimable = isClimable;
    platform.x = x;
    platform.y = y;

    this.#worldContainer.background.addChild(view);
    this.addPlatform(platform);
  }

  public createStepBox(x: number, y: number) {
    this.createBox(x, y, true);
  }
  public createWater(x: number, y: number) {
    const skin = new Graphics();
    //  -this.#platformHeight - This is water so it should cover hero/enemy model a little
    skin.rect(
      0,
      -this.#platformHeight,
      this.#platformWidth,
      this.#platformHeight
    );
    skin.fill(0x00ffff);

    const view = new PlatformView(this.#platformWidth, this.#platformHeight);
    view.addChild(skin);

    const platform = new Platform(view, ENTITIE_TYPES.BOX);
    platform.x = x;
    platform.y = y;

    this.#worldContainer.foreground.addChild(view);
    this.addPlatform(platform);
  }
  public createBossWall(x: number, y: number) {
    const width = this.#platformWidth * 3;
    const heigth = 768;
    const skin = new Graphics();
    skin.rect(0, 0, width, heigth - 168);
    skin.fill(0x0b1e0f2);
    skin.setStrokeStyle({
      color: 0x0000ff,
      width: 1,
    });
    skin.stroke();

    const view = new PlatformView(width, heigth);
    view.addChild(skin);

    const platform = new Platform(view, ENTITIE_TYPES.BOX);
    platform.x = x;
    platform.y = y;

    this.#worldContainer.background.addChild(view);
    this.addPlatform(platform);
  }
  public createBridge(x: number, y: number) {
    const skin = new Graphics();
    skin.rect(0, 0, this.#platformWidth, this.#platformHeight * 3);
    skin.fill(0xffffff);
    skin.setStrokeStyle({
      color: 0x111111,
      width: 1,
    });
    skin.stroke();

    const view = new PlatformView(
      this.#platformWidth,
      this.#platformHeight * 3
    );
    view.addChild(skin);

    const platform = new Platform(view);
    platform.x = x;
    platform.y = y;

    this.#worldContainer.background.addChild(view);
    this.addPlatform(platform);
  }
}
