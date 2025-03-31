import { Graphics, Sprite } from "pixi.js";
import EntityView from "../../EntityView";
import { ICollisionBox, IHitBox } from "../../../types/entities.types";
import AssetsFactory from "../../../AssetsFactory";

const RADIUS = 60;
const GUN_W = 100;
const GUN_H = 20;

export default class TurretView extends EntityView {
  #gunView: Sprite;

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

  get hitBox(): IHitBox {
    return {
      x: this.x - RADIUS,
      y: this.y - RADIUS,
      width: RADIUS * 2,
      height: RADIUS * 2,
      shiftX: 0,
      shiftY: 0,
    };
  }

  constructor(assets: AssetsFactory) {
    super(assets);

    const view = new Sprite(this.assets.getTexture("tourelle0000"));
    view.scale._x = 1.4;
    view.scale._y = 1.4;
    view.x -= view.width * 0.5;
    view.y -= view.height * 0.5;

    this.addChild(view);
    this.#gunView = new Sprite(this.assets.getTexture("tourellegun0000"));
    // this.#gunView.x = view.width * 0.5;
    // this.#gunView.y = view.height * 0.5;
    this.#gunView.pivot.x = GUN_H;
    this.#gunView.pivot.y = GUN_H;

    this.addChild(this.#gunView);
  }
}
