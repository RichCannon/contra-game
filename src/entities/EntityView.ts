import { Container } from "pixi.js";
import { ICollisionBox, IHitBox } from "../types/entities.types";
import AssetsFactory from "../AssetsFactory";

export default class EntityView extends Container {
  _rootNode: Container;
  _collisionBox: ICollisionBox = {
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  };

  #assets: AssetsFactory;

  _hitBox: IHitBox = {
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    shiftX: 0,
    shiftY: 0,
  };

  constructor(assets: AssetsFactory) {
    super();
    this.#assets = assets;
    this._rootNode = this.#createNodeStructure();
  }

  #createNodeStructure() {
    const rootNode = new Container();
    this.addChild(rootNode);
    return rootNode;
  }

  get assets() {
    return this.#assets;
  }
  get collisionBox() {
    this._collisionBox.x = this.x;
    this._collisionBox.y = this.y;
    return this._collisionBox;
  }
  get hitBox() {
    this._hitBox.x = this.x + this._hitBox.shiftX;
    this._hitBox.y = this.y + this._hitBox.shiftY;
    return this._hitBox;
  }
}
