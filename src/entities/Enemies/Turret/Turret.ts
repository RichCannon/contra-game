import { Graphics } from "pixi.js";
import {
  ENTITIE_TYPES,
  ENTITY_STATES,
  IEntity,
} from "../../../types/entities.types";
import Entity from "../../Entity";
import Hero from "../../Hero/Hero";
import TurretView from "./TurretView";
import BulletFactory from "../../Bullet/BulletFactory";
import { IBulletContext } from "../../../types/bullets.types";

export default class Turret extends Entity<TurretView> implements IEntity {
  type: ENTITIE_TYPES = ENTITIE_TYPES.ENEMY_TURRET;

  #state: Map<ENTITY_STATES, boolean> = new Map();
  #target: Hero;
  #bulletFactory: BulletFactory;
  #cooldown = 1000;
  #lastFired = 0;

  #box = new Graphics();

  get state() {
    return this.#state;
  }

  constructor(view: TurretView, target: Hero, bulletFactory: BulletFactory) {
    super(view);
    this.#target = target;
    this.#bulletFactory = bulletFactory;
    this.health = 5;

    // this.#box = new Graphics();
    // this.#box.rect(0, 0, this.collisionBox.width, this.collisionBox.height);
    // this.#box.setStrokeStyle({
    //   width: 1,
    //   color: "cyan",
    // });
    // this.#box.stroke();

    // window.worldContainer.addChild(this.#box);
  }

  update(): void {
    // this.superUpdate();

    if (this.#target.isDead) return;

    if (!this.isActive) {
      if (this.x - this.#target.x < 512 + this.collisionBox.width * 2) {
        this.isActive = true;
      }
      return;
    }
    const yDist = this.#target.y - this.y;
    const xDist = this.#target.x - this.x;

    const gunRotationInRad = Math.atan2(yDist, xDist);

    this._view.gunRotation = gunRotationInRad;

    // console.log(this.collisionBox);

    this.#box.x = this.collisionBox.x;
    this.#box.y = this.collisionBox.y;

    this.#fire(gunRotationInRad);
  }

  #fire(rotationInRad: number) {
    const now = +new Date();
    if (now - this.#lastFired < this.#cooldown) {
      return;
    }
    this.#lastFired = now;
    const bulletContext: IBulletContext = {
      type: ENTITIE_TYPES.ENEMY_BULLET,
      x: this.x,
      y: this.y,
      angle: (rotationInRad * 180) / Math.PI,
    };

    this.#bulletFactory.createDefault(bulletContext);
  }
}
