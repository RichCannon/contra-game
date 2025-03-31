import { Container, Graphics, Sprite } from "pixi.js";
import type World from "../../WorldContainer";
import Platform from "./Platform";
import PlatformView from "./PlatformView";
import { ENTITIE_TYPES } from "../../types/entities.types";
import BridgePlatform from "./BridgePlatform";
import AssetsFactory from "../../AssetsFactory";

export default class PlatformFactory {
  #worldContainer: World;
  #assets: AssetsFactory;

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

  constructor(worldContainer: World, assets: AssetsFactory) {
    this.#worldContainer = worldContainer;
    this.#assets = assets;
  }

  public createPlatform(x: number, y: number) {
    const skin = this.#getGroundPlatform();
    const view = new PlatformView(this.#platformWidth, this.#platformHeight);
    view.addChild(skin);

    const platform = new Platform(view);
    platform.x = x;
    platform.y = y;

    this.#worldContainer.background.addChild(view);
    this.addPlatform(platform);
  }
  public createBox(x: number, y: number, isClimable = false) {
    const skin = this.#getGroundPlatform();

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
    const skin = new Sprite(this.#assets.getTexture("water0000"));
    skin.y -= skin.height - 1;
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
    const skin = new Sprite(this.#assets.getTexture("boss0000"));
    skin.scale.x = 1.5;
    skin.scale.y = 1.5;

    const view = new PlatformView(width, heigth);
    view.addChild(skin);

    const platform = new Platform(view, ENTITIE_TYPES.BOX);
    platform.x = x - 64;
    platform.y = y - 45;

    this.#worldContainer.background.addChild(view);
    this.addPlatform(platform);
  }
  public createBridge(x: number, y: number) {
    const skin = new Sprite(this.#assets.getTexture("bridge0000"));

    const view = new PlatformView(
      this.#platformWidth,
      this.#platformHeight * 3
    );
    view.addChild(skin);

    const platform = new BridgePlatform(view);
    platform.x = x;
    platform.y = y;

    this.#worldContainer.background.addChild(view);
    this.addPlatform(platform);
    return platform;
  }

  #getGroundPlatform() {
    const container = new Container();
    const grass = new Sprite(this.#assets.getTexture("platform0000"));
    const ground = new Sprite(this.#assets.getTexture("ground0000"));
    ground.y = grass.height - 1;
    const ground2 = new Sprite(this.#assets.getTexture("ground0000"));
    ground2.y = grass.height * 2 - 2;
    const ground3 = new Sprite(this.#assets.getTexture("ground0000"));
    ground3.y = grass.height * 3 - 4;

    container.addChild(grass);
    container.addChild(ground);
    container.addChild(ground2);
    container.addChild(ground3);

    return container;
  }
}
