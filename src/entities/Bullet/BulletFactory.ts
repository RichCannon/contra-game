import { Container } from "pixi.js";
import Bullet from "./Bullet";
import BulletView from "./BulletView";
import { ENTITIE_TYPES, IEntity } from "../../types/entities.types";
import { IBulletContext } from "../../types/bullets.types";

export default class BulletFactory {
  #worldContainer: Container;
  #entities: IEntity[];

  constructor(worldContainer: Container, entities: IEntity[]) {
    this.#worldContainer = worldContainer;
    this.#entities = entities;
  }

  create({ x, y, angle, type }: IBulletContext) {
    const bulletView = new BulletView();
    this.#worldContainer.addChild(bulletView);
    const bullet = new Bullet(bulletView, angle);
    bullet.x = x;
    bullet.y = y;
    bullet.type = type;
    this.#entities.push(bullet);
    return bullet;
  }

  remove(index: number) {
    if (index >= 0) {
      const bullet = this.#entities[index];
      bullet.removeFromParent();
      this.#entities.splice(index, 1);
    }
  }
}
