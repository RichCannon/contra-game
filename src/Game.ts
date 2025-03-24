import { Application, Renderer } from "pixi.js";
import Hero from "./entities/Hero/Hero";
import { Keyboard } from "./engine/Keyboard";
import PlatformFactory from "./entities/Platforms/PlatformFactory";
import Platform from "./entities/Platforms/Platform";
import Camera, { ICameraSettings } from "./Camera";
import BulletFactory from "./entities/Bullet/BulletFactory";
import { ENTITIE_TYPES, ENTITY_STATES, IEntity } from "./types/entities.types";
import HeroFactory from "./entities/Hero/HeroFactory";
import { Physics } from "./engine/Physics";
import Weapon, { WEAPON_TYPES } from "./Weapon";
import World from "./WorldContainer";
import SceneFactory from "./SceneFactory";
import { EnemiesFactory } from "./entities/Enemies/EnemiesFactory";

export default class Game {
  #pixiApp: Application<Renderer>;
  #hero: Hero;
  #worldContainer: World;

  #platformFactory: PlatformFactory;
  #sceneFactory: SceneFactory;
  #bulletFactory: BulletFactory;
  #enemiesFactory: EnemiesFactory;
  #entities: IEntity[] = [];

  #camera: Camera;
  #weapon: Weapon;

  constructor(pixiApp: Application<Renderer>) {
    //TODO: Refactor constructor. Split code into methods. (Camera, Hero, PlatformFactory, BulletFactory)
    this.#worldContainer = new World();
    pixiApp.stage.addChild(this.#worldContainer);

    window.worldContainer = this.#worldContainer;

    this.#pixiApp = pixiApp;

    const heroFactory = new HeroFactory(
      this.#worldContainer.game,
      this.#entities
    );

    this.#hero = heroFactory.create(160, 100);

    this.#platformFactory = new PlatformFactory(this.#worldContainer);

    this.#bulletFactory = new BulletFactory(
      this.#worldContainer.game,
      this.#entities
    );

    this.#enemiesFactory = new EnemiesFactory(
      this.#worldContainer,
      this.#entities,
      this.#hero,
      this.#bulletFactory
    );

    this.#sceneFactory = new SceneFactory(
      this.#platformFactory,
      this.#enemiesFactory,
      this.#hero,
      this.#entities
    );

    this.#sceneFactory.createScene();

    this.#weapon = new Weapon(this.#bulletFactory);
    this.#weapon.setWeapon(WEAPON_TYPES.SPREAD);

    this.#setKeys();

    const cameraSettings: ICameraSettings = {
      target: this.#hero,
      world: this.#worldContainer,
      screenSize: this.#pixiApp.screen,
      maxWorldWidth: this.#worldContainer.width,
      isBackScrollX: true,
    };

    this.#camera = new Camera(cameraSettings);
  }

  #setKeys() {
    Keyboard.init();

    Keyboard.addKeyDownListener("move", (e, state) => {
      if (state.get("KeyZ")) {
        if (this.#hero.isDead) return;
        this.#weapon.fire(this.#hero.bulletContext);
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
        state.get("ArrowDown") ||
        state.get("ArrowUp") ||
        state.get("ArrowLeft") ||
        state.get("ArrowRight")
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
      platform.collisionBox,
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
      if (platform.isClimable && character.stay) {
        character.stay(platform.y);
      } else if (platform.type === ENTITIE_TYPES.BOX) {
        character.x = prevPoint.x;
      }
    }
  }

  update() {
    for (let i = 0; i < this.#entities.length; i++) {
      const entity = this.#entities[i];
      if (entity.update) entity.update();

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

      const isCollide = Physics.checkCollision(entity.hitBox, damager.hitBox);
      if (isCollide) {
        entity.dealDamage();

        if (
          ENTITIE_TYPES.ENEMY ||
          ENTITIE_TYPES.BULLET ||
          ENTITIE_TYPES.ENEMY_BULLET
        ) {
          damager.kill();
        }

        break;
      }
    }
  }
  #checkPlatforms(entity: IEntity) {
    if (entity.isDead || !entity.gravitable) return;

    for (let i = 0; i < this.#sceneFactory.platforms.length; i++) {
      const platform = this.#sceneFactory.platforms[i];
      if (
        (entity.state.get(ENTITY_STATES.JUMP) &&
          platform.type !== ENTITIE_TYPES.BOX) ||
        platform.isDead
      ) {
        continue;
      }
      this.#checkPlatformCollision(entity, platform);
    }

    if (
      entity.type === ENTITIE_TYPES.HERO &&
      this.#hero.x < this.#worldContainer.x
    ) {
      this.#hero.x = this.#hero.prevPoint.x;
    }
  }

  #checkIsOutOfScreen(entity: IEntity) {
    const outByXLeft = entity.x < -this.#worldContainer.x;
    const outByYBottom =
      entity.y > this.#pixiApp.screen.height - this.#worldContainer.y;
    if (
      entity.type === ENTITIE_TYPES.BULLET ||
      entity.type === ENTITIE_TYPES.ENEMY_BULLET
      // entity.type === ENTITIE_TYPES.HERO
    ) {
      const outByXRight =
        entity.x > this.#pixiApp.screen.width - this.#worldContainer.x;
      const outByYTop = entity.y < -this.#worldContainer.y;

      return outByXRight || outByYTop || outByYBottom || outByXLeft;
    }

    return outByXLeft || outByYBottom;
  }

  #checkEntityStatus(entity: IEntity, idx: number) {
    const outOfScreen = this.#checkIsOutOfScreen(entity);
    if (entity.isDead || outOfScreen) {
      entity.removeFromParent();
      if (outOfScreen) {
        entity.kill();
      }
      this.#entities.splice(idx, 1);
    }
  }
}
