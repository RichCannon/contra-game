import { Container } from "pixi.js";
import Hero from "./Hero";
import HeroView from "./HeroView";
import { IEntity } from "../../types/entities.types";
import AssetsFactory from "../../AssetsFactory";

export default class HeroFactory {
  #worldContainer: Container;
  #entities: IEntity[];
  #assets: AssetsFactory;

  constructor(
    worldContainer: Container,
    entities: IEntity[],
    assets: AssetsFactory
  ) {
    this.#worldContainer = worldContainer;
    this.#entities = entities;
    this.#assets = assets;
  }

  create(x: number, y: number) {
    const heroView = new HeroView(this.#assets);
    this.#worldContainer.addChild(heroView);
    const hero = new Hero(heroView);
    hero.x = x;
    hero.y = y;
    this.#entities.push(hero);
    return hero;
  }
}
