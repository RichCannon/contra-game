import { Graphics } from "pixi.js";
import EntityView from "../EntityView";

export default class BulletView extends EntityView {
  constructor() {
    super();
    const view = new Graphics();
    this._collisionBox.width = 5;
    this._collisionBox.height = 5;
    this._hitBox.width = this._collisionBox.width;
    this._hitBox.height = this._collisionBox.height;

    this.addChild(view);
  }
}
