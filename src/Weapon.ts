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
    this.#currentGunStrategy(bulletContext);
  }

  #defaultGunStrategy(bulletContext: IBulletContext) {
    this.#bulletFactory.create(bulletContext);
  }
  #spredGunStrategy(bulletContext: IBulletContext) {
    let angleShift = -20;
    const NUMBER_OF_BULLETS = 5;

    for (let i = 0; i < NUMBER_OF_BULLETS; i++) {
      const localBulletContext: IBulletContext = {
        x: bulletContext.x,
        y: bulletContext.y,
        type: bulletContext.type,
        angle: bulletContext.angle + angleShift,
      };
      this.#bulletFactory.create(localBulletContext);
      angleShift += 10;
    }
  }
}
