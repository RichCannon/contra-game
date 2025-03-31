import HeroView from "./HeroView";
import HeroWeaponUnit from "./HeroWeaponUnit";
import {
  ENTITIE_TYPES,
  ENTITY_STATES,
  IEntity,
} from "../../types/entities.types";
import GravityManager from "../../engine/GravityManager";
import Entity from "../Entity";
import { CONTROL_KEYBOARD_KEYS } from "../../utils/settings";

export default class Hero extends Entity<HeroView> implements IEntity {
  #Vx = 0; // Velocity OX
  #Vy = 0; // Velocity OY
  #MAX_V = 3;
  #JUMP_FORCE = 9;
  #heroWeaponUnit: HeroWeaponUnit;

  #movement = {
    xL: 0,
    xR: 0,
    y: 0,
  };

  #state = new Map<ENTITY_STATES, boolean>();

  #isLay = false;
  #isUp = false;

  readonly type: ENTITIE_TYPES = ENTITIE_TYPES.HERO;

  get state() {
    return this.#state;
  }

  get bulletContext() {
    return this.#heroWeaponUnit.bulletContext;
  }
  constructor(view: HeroView) {
    super(view);
    this.gravitable = true;
    this.isActive = true;

    // TEST: Should be 1 health. Value below only for testing purposes
    this.health = 9999;

    this.#heroWeaponUnit = new HeroWeaponUnit(this._view);

    this.#state.set(ENTITY_STATES.JUMP, true);
    this._view.showJump();
  }

  update() {
    this.superUpdate();

    if (this.#Vy > 0) {
      if (this.#state.get(ENTITY_STATES.JUMP)) {
        this.#state.set(ENTITY_STATES.JUMP, false);
      }
      if (
        !this.#state.get(ENTITY_STATES.JUMP) &&
        this.#state.get(ENTITY_STATES.IN_AIR) &&
        this._view.heroSpriteState !== "jump"
      ) {
        this._view.showFall();
      }
    }

    // FIXME: Might be a problem if we are goinf to introduce moving vertically platforms
    if (this.#Vy !== 0) {
      this.#state.set(ENTITY_STATES.IN_AIR, true);
    }

    this.#Vx = (this.#movement.xL + this.#movement.xR) * this.#MAX_V;
    this.x += this.#Vx;

    this.#Vy = GravityManager.applyGravity(this.#Vy);
    this.y += this.#Vy;
  }

  stay(platformY: number) {
    this.#Vy = 0;
    this.y = platformY - this.collisionBox.height;
    if (
      this.#state.get(ENTITY_STATES.IN_AIR) ||
      this.#state.get(ENTITY_STATES.JUMP)
    ) {
      const buttonState = new Map<string, boolean>();
      buttonState.set(CONTROL_KEYBOARD_KEYS.RUN_LEFT, this.#movement.xL === -1);
      buttonState.set(CONTROL_KEYBOARD_KEYS.RUN_RIGHT, this.#movement.xR === 1);
      buttonState.set(CONTROL_KEYBOARD_KEYS.LAY, this.#isLay);
      buttonState.set(CONTROL_KEYBOARD_KEYS.LOOK_UP, this.#isUp);
      this.#state.set(ENTITY_STATES.IN_AIR, false);
      this.setView(buttonState);
    }

    this.#state.set(ENTITY_STATES.STAY, true);
    this.#state.set(ENTITY_STATES.IN_AIR, false);
    this.#state.set(ENTITY_STATES.JUMP_DOWN, false);
  }

  jump() {
    if (this.#state.get(ENTITY_STATES.IN_AIR)) return;
    this.#state.set(ENTITY_STATES.STAY, false);
    this.#state.set(ENTITY_STATES.IN_AIR, true);
    this.#state.set(ENTITY_STATES.JUMP, true);
    this.#Vy -= this.#JUMP_FORCE;
    this._view.showJump();
  }

  jumpDown() {
    if (!this.#state.get(ENTITY_STATES.IN_AIR)) {
      this._view.showFall();
    }
    this.#state.set(ENTITY_STATES.JUMP, true);
    this.#state.set(ENTITY_STATES.JUMP_DOWN, true);
    this.#state.set(ENTITY_STATES.IN_AIR, true);
  }

  startLeftMove() {
    this.#movement.xL = -1;
  }
  startRightMove() {
    this.#movement.xR = 1;
  }

  stopMoveLeft() {
    this.#movement.xL = 0;
  }
  stopMoveRight() {
    this.#movement.xR = 0;
  }

  setView(state: Map<string, boolean>) {
    const movementDirection = this.#movement.xL + this.#movement.xR;
    this.#isLay = state.get(CONTROL_KEYBOARD_KEYS.LAY) || false;
    this.#isUp = state.get(CONTROL_KEYBOARD_KEYS.LOOK_UP) || false;

    if (!!movementDirection) {
      this._view.flip(movementDirection as -1 | 1);
    }

    this.#heroWeaponUnit.setBulletAngle(state, this.#state);

    if (
      this.#state.get(ENTITY_STATES.IN_AIR) ||
      this.#state.get(ENTITY_STATES.JUMP)
    ) {
      return;
    }

    if (
      state.get(CONTROL_KEYBOARD_KEYS.RUN_LEFT) ||
      state.get(CONTROL_KEYBOARD_KEYS.RUN_RIGHT)
    ) {
      if (state.get(CONTROL_KEYBOARD_KEYS.LOOK_UP)) {
        this._view.showRunUp();
      } else if (state.get(CONTROL_KEYBOARD_KEYS.LAY)) {
        this._view.showRunDown();
      } else {
        if (state.get(CONTROL_KEYBOARD_KEYS.FIRE)) {
          this._view.showRunShoot();
        } else {
          this._view.showRun();
        }
      }
    } else {
      if (state.get(CONTROL_KEYBOARD_KEYS.LOOK_UP)) {
        this._view.showStayUp();
      } else if (state.get(CONTROL_KEYBOARD_KEYS.LAY)) {
        this._view.showLay();
      } else {
        this._view.showStay();
      }
    }

    // if (state.get(CONTROL_KEYBOARD_KEYS.LAY)) {
    // }
    // if (state.get(CONTROL_KEYBOARD_KEYS.LOOK_UP)) {
    // }

    // if (state.get("KeyX")) {
    // }
  }
}
