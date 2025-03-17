import { Graphics } from "pixi.js";
import EntityView from "../../EntityView";
import { ICollisionBox } from "../../../types/entities.types";

const RADIUS = 60;
const GUN_W = 100;
const GUN_H = 20;

export default class TurretView extends EntityView {
  #gunView: Graphics;

  get gunRotation() {
    return this.#gunView.rotation;
  }

  set gunRotation(rotation: number) {
    this.#gunView.rotation = rotation;
  }

  get collisionBox(): ICollisionBox {
    return {
      x: this.x - RADIUS,
      y: this.y - RADIUS,
      width: RADIUS * 2,
      height: RADIUS * 2,
    };
  }

  constructor() {
    super();

    const view = new Graphics();

    view.circle(0, 0, RADIUS);
    view.setStrokeStyle({
      color: 0xff0000,
      width: 2,
    });
    view.stroke();

    this.#gunView = new Graphics();
    this.#gunView.setStrokeStyle({
      color: 0xff0000,
      width: 2,
    });
    this.#gunView.rect(0, 0, GUN_W, GUN_H);
    this.#gunView.pivot.x = GUN_H * 0.5;
    this.#gunView.pivot.y = GUN_H * 0.5;
    this.#gunView.stroke();

    this._rootNode.addChild(this.#gunView);
    this._rootNode.addChild(view);
  }
}
