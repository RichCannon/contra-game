import BulletFactory from "./entities/Bullet/BulletFactory";
import { IBulletContext } from "./types/bullets.types";

export const enum WEAPON_TYPES {
  DEFAULT = 1,
  SPREAD,
}

type CurrentGunStrategyType = (bulletContext: IBulletContext) => void;

export default class Weapon {
  #currentGunStrategy: CurrentGunStrategyType;
  #bulletFactory: BulletFactory;
  #cooldown = 0;
  #lastFired = 0;

  constructor(bulletFactory: BulletFactory) {
    this.#bulletFactory = bulletFactory;
    this.#currentGunStrategy = this.#defaultGunStrategy;
  }

  setWeapon(type: WEAPON_TYPES) {
    switch (type) {
      case WEAPON_TYPES.DEFAULT:
        this.#currentGunStrategy = this.#defaultGunStrategy;
        break;
      case WEAPON_TYPES.SPREAD:
        this.#currentGunStrategy = this.#spredGunStrategy;
        break;

      default:
        this.#currentGunStrategy = this.#defaultGunStrategy;
        break;
    }
  }

  fire(bulletContext: IBulletContext) {
    const now = +new Date();
    if (now - this.#lastFired >= this.#cooldown) {
      this.#lastFired = now;
      this.#currentGunStrategy(bulletContext);
    }
  }

  #defaultGunStrategy(bulletContext: IBulletContext) {
    this.#cooldown = 100;
    this.#bulletFactory.createDefault(bulletContext);
  }
  #spredGunStrategy(bulletContext: IBulletContext) {
    this.#cooldown = 300;
    let angleShift = -20;
    const NUMBER_OF_BULLETS = 5;

    for (let i = 0; i < NUMBER_OF_BULLETS; i++) {
      const localBulletContext: IBulletContext = {
        x: bulletContext.x,
        y: bulletContext.y,
        type: bulletContext.type,
        angle: bulletContext.angle + angleShift,
      };
      this.#bulletFactory.createSpread(localBulletContext);
      angleShift += 10;
    }
  }
}
