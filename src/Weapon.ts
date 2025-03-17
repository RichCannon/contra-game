import BulletFactory from "./entities/Bullet/BulletFactory";
import { IBulletContext } from "./types/bullets.types";

export const enum WEAPON_TYPES {
  DEFAULT = 1,
  SPREAD,
}

export default class Weapon {
  #currentType: WEAPON_TYPES;
  #bulletFactory: BulletFactory;
  constructor(bulletFactory: BulletFactory) {
    this.#bulletFactory = bulletFactory;
  }

  setWeapon(type: WEAPON_TYPES) {
    this.#currentType = type;
  }

  fire() {}

  #defaultGun(bulletContext: IBulletContext) {
    this.#bulletFactory.create(bulletContext);
  }
  #spredGun(bulletContext: IBulletContext) {
    let angleShift = -20;
    const NUMBER_OF_BULLETS = 5;
    const localBulletContext: IBulletContext = {
      x: bulletContext.x,
      y: bulletContext.y,
      type: bulletContext.type,
      angle: bulletContext.angle,
    };

    for (let i = 0; i < NUMBER_OF_BULLETS; i++) {
      localBulletContext.angle += angleShift;
      this.#bulletFactory.create(localBulletContext);
      angleShift += 10;
    }
  }
}
