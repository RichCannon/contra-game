import { Container, Graphics } from "pixi.js";

export const enum PlatformType {
  PLATFORM,
  BOX,
}
export default class Platform extends Container {
  private platform: Graphics;
  #type: PlatformType;
  #isClimable = false;

  get type() {
    return this.#type;
  }

  get isClimable() {
    return this.#isClimable;
  }
  set setIsClimable(isClimable: boolean) {
    this.#isClimable = isClimable;
  }

  constructor(
    platformType: PlatformType = PlatformType.PLATFORM,
    isClimable = false
  ) {
    super();
    this.#isClimable = isClimable;
    this.#type = platformType;
    this.platform = new Graphics();
    this.platform.rect(0, 0, 200, 30);
    // view.fill(0xffff55);
    this.platform.setStrokeStyle({
      color: 0xff99ff,
      width: 1,
    });
    if (this.#type === PlatformType.BOX) {
      this.platform.lineTo(200, 30);
    }
    this.platform.stroke();
    this.addChild(this.platform);
  }
}
