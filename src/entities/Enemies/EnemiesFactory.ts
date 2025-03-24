import type World from "../../WorldContainer";
import { IEntity } from "../../types/entities.types";
import Hero from "../Hero/Hero";
import BulletFactory from "../Bullet/BulletFactory";
import TurretView from "./Turret/TurretView";
import Turret from "./Turret/Turret";
import RunnerView from "./Runner/RunnerView";
import Runner from "./Runner/Runner";

export class EnemiesFactory {
  #worldContainer: World;
  #entities: IEntity[];
  #target: Hero;
  #bulletFactory: BulletFactory;

  constructor(
    worldContainer: World,
    entities: IEntity[],
    target: Hero,
    bulletFactory: BulletFactory
  ) {
    this.#worldContainer = worldContainer;
    this.#entities = entities;
    this.#target = target;
    this.#bulletFactory = bulletFactory;
  }

  createTurret(x: number, y: number) {
    const turretView = new TurretView();
    const turret = new Turret(turretView, this.#target, this.#bulletFactory);
    this.#worldContainer.game.addChild(turretView);
    turret.x = x;
    turret.y = y;
    this.#entities.push(turret);
    return turret;
  }

  removeTurret(index: number) {
    if (index >= 0) {
      const turret = this.#entities[index];
      turret.removeFromParent();
      this.#entities.splice(index, 1);
    }
  }

  createRunner(x: number, y: number, jumpBehaviourKoef?: number) {
    const runnerView = new RunnerView();
    const runner = new Runner(runnerView, this.#target);
    this.#worldContainer.game.addChild(runnerView);
    runner.x = x;
    runner.y = y;
    if (jumpBehaviourKoef) {
      runner.jumpBehaviourKoef = jumpBehaviourKoef;
    }
    this.#entities.push(runner);
    return runner;
  }

  removeRunner(index: number) {
    if (index >= 0) {
      const runner = this.#entities[index];
      runner.removeFromParent();
      this.#entities.splice(index, 1);
    }
  }
}
