import { Container } from "pixi.js";
import Hero from "./Hero";
import HeroView from "./HeroView";
import { IEntity } from "../../types/entities.types";

export default class HeroFactory {
  #worldContainer: Container;
  #entities: IEntity[];

  constructor(worldContainer: Container, entities: IEntity[]) {
    this.#worldContainer = worldContainer;
    this.#entities = entities;
  }

  create(x: number, y: number) {
    const heroView = new HeroView();
    this.#worldContainer.addChild(heroView);
    const hero = new Hero(heroView);
    hero.x = x;
    hero.y = y;
    this.#entities.push(hero);
    return hero;
  }
}
