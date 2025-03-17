import EntityView from "./EntityView";
import { ENTITIE_TYPES, IPrevEntityPoint } from "../types/entities.types";

export default class Entity<T extends EntityView = EntityView> {
  _view: T;
  #prevPoint: IPrevEntityPoint = {
    x: 0,
    y: 0,
  };
  #isDead: boolean;
  #health = 1;
  #gravitable = false;

  constructor(view: T, isDead = false) {
    this._view = view;
    this.#isDead = isDead;
  }

  get gravitable() {
    return this.#gravitable;
  }
  set gravitable(value: boolean) {
    this.#gravitable = value;
  }

  get health() {
    return this.#health;
  }

  set health(value: number) {
    this.#health = value;
  }

  get x() {
    return this._view.x;
  }

  set x(value: number) {
    this._view.x = value;
  }

  get y() {
    return this._view.y;
  }

  set y(value: number) {
    this._view.y = value;
  }

  get collisionBox() {
    return this._view.collisionBox;
  }

  get prevPoint() {
    return this.#prevPoint;
  }

  get isDead() {
    return this.#isDead;
  }

  kill() {
    this.#isDead = true;
  }

  dealDamage() {
    this.#health--;
    if (this.#health < 1) {
      this.kill();
    }
  }

  superUpdate() {
    this.#prevPoint.x = this.x;
    this.#prevPoint.y = this.y;
  }

  removeFromParent() {
    if (this._view.parent !== null) {
      this._view.removeFromParent();
    }
  }
}
