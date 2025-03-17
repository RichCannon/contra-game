import { Container } from "pixi.js";
import Runner from "./Runner";
import RunnerView from "./RunnerView";
import { IEntity } from "../../../types/entities.types";

export default class RunnerFactory {
  #worldContainer: Container;
  #entities: IEntity[];

  constructor(worldContainer: Container, entities: IEntity[]) {
    this.#worldContainer = worldContainer;
    this.#entities = entities;
  }

  create(x: number, y: number) {
    const runnerView = new RunnerView();
    const runner = new Runner(runnerView);
    this.#worldContainer.addChild(runnerView);
    runner.x = x;
    runner.y = y;
    this.#entities.push(runner);
    return runner;
  }

  remove(index: number) {
    if (index >= 0) {
      const runner = this.#entities[index];
      runner.removeFromParent();
      this.#entities.splice(index, 1);
    }
  }
}
