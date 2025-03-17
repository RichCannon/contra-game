import { Container } from "pixi.js";
import { ICollisionBox } from "../types/entities.types";

export default class EntityView extends Container {
  _rootNode: Container;
  _collisionBox: ICollisionBox = {
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  };

  constructor() {
    super();
    this._rootNode = this.#createNodeStructure();
  }

  #createNodeStructure() {
    const rootNode = new Container();
    this.addChild(rootNode);
    return rootNode;
  }

  get collisionBox() {
    this._collisionBox.x = this.x;
    this._collisionBox.y = this.y;
    return this._collisionBox;
  }
}
