import { Container, Graphics } from "pixi.js";

export default class Platform extends Container {
  constructor() {
    super();
    const view = new Graphics();
    view.rect(0, 0, 200, 30);
    // view.fill(0xffff55);
    view.setStrokeStyle({
      color: 0xff99ff,
      width: 5,
    });
    view.stroke();
    this.addChild(view);
  }
}
