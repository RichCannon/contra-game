import { IBulletContext } from "../../types/bullets.types";
import { ENTITIE_TYPES, ENTITY_STATES } from "../../types/entities.types";
import { CONTROL_KEYBOARD_KEYS } from "../../utils/settings";
import type HeroView from "./HeroView";

export default class HeroWeaponUnit {
  #bulletAngle = 0;

  #bulletContext: IBulletContext = {
    x: 0,
    y: 0,
    angle: 0,
    type: ENTITIE_TYPES.BULLET,
  };
  #heroView: HeroView;

  constructor(heroView: HeroView) {
    this.#heroView = heroView;
  }

  get bulletContext() {
    this.#bulletContext.x =
      this.#heroView.x + this.#heroView.bulletPointShift.x;
    this.#bulletContext.y =
      this.#heroView.y + this.#heroView.bulletPointShift.y;
    this.#bulletContext.angle = this.#bulletAngle;
    return this.#bulletContext;
  }

  setBulletAngle(
    buttonContext: Map<string, boolean>,
    heroState: Map<ENTITY_STATES, boolean>
  ) {
    if (
      buttonContext.get(CONTROL_KEYBOARD_KEYS.RUN_LEFT) ||
      buttonContext.get(CONTROL_KEYBOARD_KEYS.RUN_RIGHT)
    ) {
      if (buttonContext.get(CONTROL_KEYBOARD_KEYS.LOOK_UP)) {
        this.#bulletAngle = -45;
      } else if (buttonContext.get(CONTROL_KEYBOARD_KEYS.LAY)) {
        this.#bulletAngle = 45;
      } else {
        this.#bulletAngle = 0;
      }
    } else {
      if (buttonContext.get(CONTROL_KEYBOARD_KEYS.LOOK_UP)) {
        this.#bulletAngle = -90;
      } else if (buttonContext.get(CONTROL_KEYBOARD_KEYS.LAY)) {
        if (heroState.get(ENTITY_STATES.IN_AIR)) {
          this.#bulletAngle = 90;
        } else {
          this.#bulletAngle = 0;
        }
      } else {
        this.#bulletAngle = 0;
      }
    }

    // Flip bullet angle if hero is flipped
    if (this.#heroView.isFlipped) {
      this.#bulletAngle = 180 - this.#bulletAngle;
    }
  }
}
