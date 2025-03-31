import { Container, Graphics } from "pixi.js";
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

  createDefault({ x, y, angle, type }: IBulletContext) {
    const skin = new Graphics();
    skin.rect(0, 0, 5, 5);
    skin.fill(0xfff);
    // skin.setStrokeStyle({
    //   color: 0xff9900,
    //   width: 2,
    // });
    skin.stroke();

    const bulletView = new BulletView();
    bulletView.addChild(skin);

    this.#worldContainer.addChild(bulletView);
    const bullet = new Bullet(bulletView, angle);
    bullet.x = x;
    bullet.y = y;
    bullet.type = type;
    bullet.speed = 10;
    this.#entities.push(bullet);
    return bullet;
  }

  createSpread({ x, y, angle, type }: IBulletContext) {
    const skin = new Graphics();
    skin.circle(0, 0, 6);
    skin.fill(0xff2222);
    skin.circle(-3, -3, 3);
    skin.fill(0xdddddd);
    // skin.setStrokeStyle({
    //   color: 0xff9900,
    //   width: 2,
    // });
    skin.stroke();

    const bulletView = new BulletView();
    bulletView.addChild(skin);

    this.#worldContainer.addChild(bulletView);
    const bullet = new Bullet(bulletView, angle);
    bullet.x = x;
    bullet.y = y;
    bullet.type = type;
    bullet.speed = 6;
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
