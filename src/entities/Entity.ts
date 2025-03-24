import EntityView from "./EntityView";
import { IEntityOptions, IPrevEntityPoint } from "../types/entities.types";

const DEFAULT_OPTIONS: IEntityOptions = {
  isDead: false,
  isActive: false,
};

export default class Entity<T extends EntityView = EntityView> {
  _view: T;
  #prevPoint: IPrevEntityPoint = {
    x: 0,
    y: 0,
  };
  #isDead: boolean;
  #isActive: boolean;
  #health = 1;
  #gravitable = false;

  constructor(view: T, { isActive = false, isDead = false } = DEFAULT_OPTIONS) {
    this._view = view;
    this.#isDead = isDead;
    this.#isActive = isActive;
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
  get hitBox() {
    return this._view.hitBox;
  }

  get prevPoint() {
    return this.#prevPoint;
  }

  get isDead() {
    return this.#isDead;
  }
  get isActive() {
    return this.#isActive;
  }

  set isActive(value: boolean) {
    this.#isActive = value;
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
