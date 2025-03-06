import { Application, Container, Renderer } from "pixi.js";
import Hero, { HERO_STATES } from "./entities/Hero/Hero";
import { Keyboard } from "./engine/Keyboard";
import PlatformFactory from "./entities/Platforms/PlatformFactory";
import Platform, { PlatformType } from "./entities/Platforms/Platform";
import { IHeroCollisionBox } from "./entities/Hero/HeroView";

export default class Game {
  #pixiApp: Application<Renderer>;
  #hero: Hero;
  #platformFactory: PlatformFactory;

  private setKeys() {
    Keyboard.init();

    Keyboard.addKeyDownListener("move", (e, state) => {
      if (state.get("ArrowLeft")) {
        this.#hero.startLeftMove();
      }
      if (state.get("ArrowRight")) {
        this.#hero.startRightMove();
      }
      if (state.get("ArrowDown")) {
      }
      if (state.get("ArrowUp")) {
      }

      if (state.get("KeyX")) {
        if (
          state.get("ArrowDown") &&
          !(state.get("ArrowLeft") || state.get("ArrowRight"))
        ) {
          this.#hero.jumpDown();
          return;
        }
        this.#hero.jump();
      }
      if (
        e.code === "ArrowDown" ||
        e.code === "ArrowUp" ||
        e.code === "ArrowLeft" ||
        e.code === "ArrowRight"
      ) {
        this.#hero.setView(state);
      }
    });

    Keyboard.addKeyUpListener("stopMove", (e, state) => {
      if (!state.get("ArrowRight")) {
        this.#hero.stopMoveRight();
      }
      if (!state.get("ArrowLeft")) {
        this.#hero.stopMoveLeft();
      }
      if (
        e.code === "ArrowDown" ||
        e.code === "ArrowUp" ||
        e.code === "ArrowLeft" ||
        e.code === "ArrowRight"
      ) {
        this.#hero.setView(state);
      }
    });
  }

  constructor(pixiApp: Application<Renderer>) {
    this.#pixiApp = pixiApp;

    this.#platformFactory = new PlatformFactory(pixiApp);

    this.#hero = new Hero(this.#pixiApp.stage);
    this.#hero.x = 100;
    this.#hero.y = 100;
    // this.#pixiApp.stage.addChild(this.#hero);

    this.#platformFactory.createPlatform(100, 400);
    this.#platformFactory.createPlatform(300, 400);
    this.#platformFactory.createPlatform(500, 400);
    this.#platformFactory.createPlatform(700, 400);
    this.#platformFactory.createPlatform(900, 400);

    this.#platformFactory.createPlatform(300, 550);

    this.#platformFactory.createBox(0, 738);
    this.#platformFactory.createBox(200, 738);

    this.#platformFactory.createPlatform(400, 708, true);

    this.setKeys();
  }

  private checkCollision(entity: IHeroCollisionBox, area: Container) {
    const isVertCollision =
      entity.y < area.y + area.height && entity.y + entity.height > area.y;
    const isHorCollision =
      entity.x < area.x + area.width && entity.x + entity.width > area.x;
    return isVertCollision && isHorCollision;
  }

  getPlatformCollision(
    character: Hero,
    platform: Platform,
    prevPoint: { x: number; y: number }
  ) {
    const collision = this.getOrientCollision(
      character.collisionBox,
      platform,
      prevPoint
    );

    // Vertical collision
    // if (collision && collision.vertical) {
    //   character.y = prevPoint.y;
    // }

    // Horiznotall collision in case of BOX type of platform
    if (
      collision &&
      collision.horizontal &&
      platform.type === PlatformType.BOX
    ) {
      character.x = prevPoint.x;
    }

    return collision;
  }
  getOrientCollision(
    aaRect: IHeroCollisionBox,
    bbRect: Container,
    aaPrevPoint: { x: number; y: number }
  ) {
    const collision = {
      horizontal: false,
      vertical: false,
    };

    const isCollide = this.checkCollision(this.#hero.collisionBox, bbRect);

    if (!isCollide) {
      return false;
    }

    aaRect.y = aaPrevPoint.y;
    const isYCollide = this.checkCollision(aaRect, bbRect);

    if (!isYCollide) {
      collision.vertical = true;
      return collision;
    }

    collision.horizontal = true;
    return collision;
  }

  update() {
    const prevPoint = {
      y: this.#hero.collisionBox.y,
      x: this.#hero.collisionBox.x,
    };

    this.#hero.update();

    for (let i = 0; i < this.#platformFactory.platforms.length; i++) {
      const platform = this.#platformFactory.platforms[i];
      if (
        this.#hero.heroState.get(HERO_STATES.JUMP) &&
        platform.type !== PlatformType.BOX
      ) {
        continue;
      }
      const collision = this.getPlatformCollision(
        this.#hero,
        platform,
        prevPoint
      );
      if (collision && collision.horizontal && platform.isClimable) {
        this.#hero.stay(platform.y);
        continue;
      }
      if (collision && collision.vertical) {
        this.#hero.stay(platform.y);
      }
    }
  }
}
