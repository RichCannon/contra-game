import { ENTITIE_TYPES, IEntity } from "../../types/entities.types";
import Entity from "../Entity";
import BulletView from "./BulletView";

export default class Bullet extends Entity<BulletView> implements IEntity {
  speed = 8;
  #cosRadX: number;
  #sinRadY: number;

  type: ENTITIE_TYPES = ENTITIE_TYPES.BULLET;

  // get speed() {
  //   return this.speed;
  // }

  constructor(view: BulletView, angle: number) {
    super(view);
    const angleInRad = this.#getRad(angle);
    this.#cosRadX = Math.cos(angleInRad);
    this.#sinRadY = Math.sin(angleInRad);
  }

  #getRad(deg: number) {
    return (Math.PI / 180) * deg;
  }

  update() {
    this.x += this.speed * this.#cosRadX;
    this.y += this.speed * this.#sinRadY;
  }
}
