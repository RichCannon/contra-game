import Platform from "./Platform";
import PlatformView from "./PlatformView";
import Hero from "../Hero/Hero";

export default class BridgePlatform extends Platform {
  #target: Hero | null = null;

  constructor(view: PlatformView) {
    super(view);
  }

  setTarget(target: Hero) {
    this.#target = target;
  }

  update() {
    if (!this.isDead && !!this.#target) {
      if (this.x - this.#target.x < -50) {
        this.removeFromParent();
        this.kill();
      }
      return;
    }
  }
}
