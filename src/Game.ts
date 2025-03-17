import { Application, Container, Renderer } from "pixi.js";
import Hero from "./entities/Hero/Hero";
import { Keyboard } from "./engine/Keyboard";
import PlatformFactory from "./entities/Platforms/PlatformFactory";
import Platform, { PlatformType } from "./entities/Platforms/Platform";
import Camera, { ICameraSettings } from "./Camera";
import BulletFactory from "./entities/Bullet/BulletFactory";
import RunnerFactory from "./entities/Enemies/Runner/RunnerFactory";
import { ENTITIE_TYPES, ENTITY_STATES, IEntity } from "./types/entities.types";
import HeroFactory from "./entities/Hero/HeroFactory";
import { Physics } from "./engine/Physics";
import TurretFactory from "./entities/Enemies/Turret/TurretFactory";

export default class Game {
  #pixiApp: Application<Renderer>;
  #hero: Hero;
  #worldContainer = new Container();

  #platformFactory: PlatformFactory;
  #bulletFactory: BulletFactory;
  #runnerFactory: RunnerFactory;
  #turretFactory: TurretFactory;
  #entities: IEntity[] = [];

  #camera: Camera;

  constructor(pixiApp: Application<Renderer>) {
    //TODO: Refactor constructor. Split code into methods. (Camera, Hero, PlatformFactory, BulletFactory)
    this.#worldContainer = new Container();
    pixiApp.stage.addChild(this.#worldContainer);

    // window.worldContainer = this.#worldContainer;

    this.#pixiApp = pixiApp;

    const heroFactory = new HeroFactory(this.#worldContainer, this.#entities);

    this.#hero = heroFactory.create(100, 100);

    this.#platformFactory = new PlatformFactory(this.#worldContainer);
    this.#bulletFactory = new BulletFactory(
      this.#worldContainer,
      this.#entities
    );
    this.#runnerFactory = new RunnerFactory(
      this.#worldContainer,
      this.#entities
    );
    this.#turretFactory = new TurretFactory(
      this.#worldContainer,
      this.#entities,
      this.#hero,
      this.#bulletFactory
    );

    for (let i = 0; i < 12; i++) {
      if (i === 2) {
        this.#platformFactory.createPlatform(100 + 200 * i, 500);
      } else {
        this.#platformFactory.createPlatform(100 + 200 * i, 400);
      }
    }

    this.#platformFactory.createPlatform(300, 550);

    this.#platformFactory.createBox(0, 738);
    this.#platformFactory.createBox(200, 738);
    this.#platformFactory.createPlatform(400, 708, true);

    this.#setKeys();

    const cameraSettings: ICameraSettings = {
      target: this.#hero,
      world: this.#worldContainer,
      screenSize: this.#pixiApp.screen,
      maxWorldWidth: this.#worldContainer.width,
      isBackScrollX: true,
    };

    this.#camera = new Camera(cameraSettings);

    this.#runnerFactory.create(1000, 150);
    this.#turretFactory.create(700, 200);
  }

  #setKeys() {
    Keyboard.init();

    Keyboard.addKeyDownListener("move", (e, state) => {
      if (state.get("KeyZ")) {
        this.#bulletFactory.create(this.#hero.bulletContext);
      }

      if (state.get("ArrowLeft")) {
        this.#hero.startLeftMove();
      }
      if (state.get("ArrowRight")) {
        this.#hero.startRightMove();
      }
      // if (state.get("ArrowDown")) {
      // }
      // if (state.get("ArrowUp")) {
      // }

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

  #checkPlatformCollision(character: IEntity, platform: Platform) {
    const prevPoint = character.prevPoint;

    const collision = Physics.getOrientCollision(
      character.collisionBox,
      platform,
      prevPoint
    );

    // Vertical collision
    // if (collision && collision.vertical) {
    //   character.y = prevPoint.y;
    // }

    // Horiznotall collision in case of BOX type of platform
    // if (
    //   collision &&
    //   collision.horizontal &&
    //   platform.type === PlatformType.BOX
    // ) {
    //   character.x = prevPoint.x;
    // }

    if (collision && collision.vertical) {
      character.y = prevPoint.y;
      character.stay!(platform.y);
    }

    if (collision && collision.horizontal) {
      if (platform.isClimable) {
        character.stay!(platform.y);
      } else if (platform.type === PlatformType.BOX) {
        character.x = prevPoint.x;
      }
    }
  }

  update() {
    for (let i = 0; i < this.#entities.length; i++) {
      const entity = this.#entities[i];
      entity.update();

      if (
        entity.type === ENTITIE_TYPES.HERO ||
        entity.type === ENTITIE_TYPES.ENEMY ||
        entity.type === ENTITIE_TYPES.ENEMY_TURRET
      ) {
        this.#checkDamage(entity);
        this.#checkPlatforms(entity);
      }

      this.#checkEntityStatus(entity, i);
    }

    this.#camera.update();
  }

  #checkDamage(entity: IEntity) {
    // Filter everyone who can damage HERO or ENEMY
    const damagers = this.#entities.filter((damager) => {
      const canDmgEnemy =
        (entity.type === ENTITIE_TYPES.ENEMY ||
          entity.type === ENTITIE_TYPES.ENEMY_TURRET) &&
        damager.type === ENTITIE_TYPES.BULLET;
      const canDmgHero =
        entity.type === ENTITIE_TYPES.HERO &&
        (damager.type === ENTITIE_TYPES.ENEMY ||
          damager.type === ENTITIE_TYPES.ENEMY_BULLET);
      return canDmgEnemy || canDmgHero;
    });
    // console.log("🚀 ~ Game ~ damagers ~ damagers:", damagers);

    for (let i = 0; i < damagers.length; i++) {
      const damager = damagers[i];

      const isCollide = Physics.checkCollision(
        entity.collisionBox,
        damager.collisionBox
      );
      if (isCollide) {
        entity.dealDamage();

        if (damager.type !== ENTITIE_TYPES.ENEMY) {
          damager.dealDamage();
        }

        break;
      }
    }
  }
  #checkPlatforms(entity: IEntity) {
    if (entity.isDead || !entity.gravitable) return;

    for (let i = 0; i < this.#platformFactory.platforms.length; i++) {
      const platform = this.#platformFactory.platforms[i];
      if (
        !(
          entity.state.get(ENTITY_STATES.JUMP) &&
          platform.type !== PlatformType.BOX
        )
      ) {
        this.#checkPlatformCollision(entity, platform);
      }
    }
  }

  #checkIsOutOfScreen(entity: IEntity) {
    const outByX =
      entity.x < -this.#worldContainer.x ||
      entity.x > this.#pixiApp.screen.width - this.#worldContainer.x;
    const outByY =
      entity.y < -this.#worldContainer.y ||
      entity.y > this.#pixiApp.screen.height - this.#worldContainer.y;
    return outByX || outByY;
  }

  #checkEntityStatus(entity: IEntity, idx: number) {
    if (entity.isDead || this.#checkIsOutOfScreen(entity)) {
      entity.removeFromParent();
      this.#entities.splice(idx, 1);
    }
  }
}
