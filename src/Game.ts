import { Application, Container, Renderer } from "pixi.js";
import Hero from "./entities/Hero";
import { Keyboard } from "./engine/Keyboard";
import PlatformFactory from "./entities/Platforms/PlatformFactory";

export default class Game {
  #pixiApp: Application<Renderer>;
  #hero: Hero;
  #platformFactory: PlatformFactory;

  constructor(pixiApp: Application<Renderer>) {
    Keyboard.init();

    Keyboard.addKeyDownListener("move", (e, state) => {
      if (state.get("ArrowLeft")) {
        this.#hero.startLeftMove();
      }
      if (state.get("ArrowRight")) {
        this.#hero.startRightMove();
      }

      if (state.get("ArrowUp")) {
        this.#hero.jump();
      }
    });

    Keyboard.addKeyUpListener("stopMove", (_, state) => {
      if (!state.get("ArrowRight")) {
        this.#hero.stopMoveRight();
      }
      if (!state.get("ArrowLeft")) {
        this.#hero.stopMoveLeft();
      }
    });

    this.#pixiApp = pixiApp;

    this.#platformFactory = new PlatformFactory(pixiApp);

    this.#hero = new Hero();
    this.#hero.x = 100;
    this.#hero.y = 100;
    this.#pixiApp.stage.addChild(this.#hero);

    this.#platformFactory.createPlatform(50, 400);
    this.#platformFactory.createPlatform(200, 450);
    this.#platformFactory.createPlatform(400, 400);
  }

  private checkCollision(entity: Container, area: Container) {
    const isVertCollision =
      entity.y < area.y + area.height && entity.y + entity.height > area.y;
    const isHorCollision =
      entity.x < area.x + area.width && entity.x + entity.width > area.x;
    return isVertCollision && isHorCollision;
  }

  getPlatformCollision(
    character: Container,
    platform: Container,
    prevPoint: { x: number; y: number }
  ) {
    const collision = {
      horizontal: false,
      vertical: false,
    };

    const isCollide = this.checkCollision(this.#hero, platform);

    if (!isCollide) {
      return false;
    }

    const currentY = character.y;
    character.y = prevPoint.y;
    const isYCollide = this.checkCollision(character, platform);

    if (!isYCollide) {
      collision.vertical = true;
      return collision;
    }

    character.y = currentY;
    character.x = prevPoint.x;
    collision.horizontal = true;
    return collision;
  }

  update() {
    const prevPoint = {
      y: this.#hero.y,
      x: this.#hero.x,
    };
    this.#hero.update();

    for (let i = 0; i < this.#platformFactory.platforms.length; i++) {
      const platform = this.#platformFactory.platforms[i];
      const collision = this.getPlatformCollision(
        this.#hero,
        platform,
        prevPoint
      );
      if (collision && collision.vertical) {
        this.#hero.stay();
      }
    }
  }
}
