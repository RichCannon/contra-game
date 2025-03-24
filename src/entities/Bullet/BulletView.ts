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

    view.rect(0, 0, this.collisionBox.width, this.collisionBox.height);
    view.setStrokeStyle({
      color: 0xff9900,
      width: 2,
    });
    view.stroke();
    this.addChild(view);
  }
}
