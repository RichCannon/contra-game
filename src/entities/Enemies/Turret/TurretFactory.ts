import { Container } from "pixi.js";
import Turret from "./Turret";
import TurretView from "./TurretView";
import { IEntity } from "../../../types/entities.types";
import Hero from "../../Hero/Hero";
import BulletFactory from "../../Bullet/BulletFactory";

export default class TurretFactory {
  #worldContainer: Container;
  #entities: IEntity[];
  #target: Hero;
  #bulletFactory: BulletFactory;

  constructor(
    worldContainer: Container,
    entities: IEntity[],
    target: Hero,
    bulletFactory: BulletFactory
  ) {
    this.#worldContainer = worldContainer;
    this.#entities = entities;
    this.#target = target;
    this.#bulletFactory = bulletFactory;
  }

  create(x: number, y: number) {
    const turretView = new TurretView();
    const turret = new Turret(turretView, this.#target, this.#bulletFactory);
    this.#worldContainer.addChild(turretView);
    turret.x = x;
    turret.y = y;
    this.#entities.push(turret);
    return turret;
  }

  remove(index: number) {
    if (index >= 0) {
      const turret = this.#entities[index];
      turret.removeFromParent();
      this.#entities.splice(index, 1);
    }
  }
}
