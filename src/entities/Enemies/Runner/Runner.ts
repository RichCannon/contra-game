import RunnerView from "./RunnerView";
import {
  ENTITIE_TYPES,
  ENTITY_STATES,
  IEntity,
} from "../../../types/entities.types";
import GravityManager from "../../../engine/GravityManager";
import Entity from "../../Entity";
import Hero from "../../Hero/Hero";
import { CONTROL_KEYBOARD_KEYS } from "../../../utils/settings";

let showLog = true;

// export interface IHeroBounds {
//   width: number;
//   height: number;
// }

export default class Runner extends Entity<RunnerView> implements IEntity {
  #Vx = 0; // Velocity OX
  #Vy = 0; // Velocity OY
  #MAX_V = 3;
  #JUMP_FORCE = 9;
  #target: Hero;

  #movement = {
    xL: 0,
    xR: 0,
    y: 0,
  };

  #state = new Map<ENTITY_STATES, boolean>();

  #prevPoint = {
    x: 0,
    y: 0,
  };

  readonly type: ENTITIE_TYPES = ENTITIE_TYPES.ENEMY;

  jumpBehaviourKoef = 0.4;

  get prevPoint() {
    return this.#prevPoint;
  }

  get state() {
    return this.#state;
  }

  constructor(view: RunnerView, target: Hero) {
    super(view);

    this.#target = target;
    this.gravitable = true;

    this.#state.set(ENTITY_STATES.JUMP, true);
    this._view.showJump();
    this.#movement.xL = -1;
  }

  get collisionBox() {
    return this._view.collisionBox;
  }

  get x() {
    return this._view.x;
  }
  set x(value: number) {
    this._view.x = value;
  }
  get y() {
    return this._view.y;
  }
  set y(value: number) {
    this._view.y = value;
  }

  update() {
    this.superUpdate();

    if (!this.isActive) {
      if (this.x - this.#target.x < 512 + this.collisionBox.width * 2) {
        this.isActive = true;
      }
      return;
    }

    if (this.#Vy > 0) {
      if (this.#state.get(ENTITY_STATES.JUMP)) {
        this.#state.set(ENTITY_STATES.JUMP, false);
      }
      if (
        !this.#state.get(ENTITY_STATES.JUMP) &&
        // this.#state.get(ENTITY_STATES.IN_AIR) &&
        this._view.heroSpriteState !== "jump"
      ) {
        // Random runner action near the edge
        if (Math.random() > this.jumpBehaviourKoef) {
          this._view.showFall();
        } else {
          this.jump();
        }
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
      this.#state.set(ENTITY_STATES.IN_AIR, false);
      this.setView(buttonState);
    }

    this.#state.set(ENTITY_STATES.IN_AIR, false);
  }

  jump() {
    // console.log("runner jump in air", this.#state.get(ENTITY_STATES.IN_AIR));

    if (this.#state.get(ENTITY_STATES.IN_AIR)) return;
    this.#state.set(ENTITY_STATES.IN_AIR, true);
    this.#state.set(ENTITY_STATES.JUMP, true);
    this.#Vy -= this.#JUMP_FORCE;
    this._view.showJump();
  }

  setView(state: Map<string, boolean>) {
    const movementDirection = this.#movement.xL + this.#movement.xR;

    if (!!movementDirection) {
      this._view.flip(movementDirection as -1 | 1);
    }

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
      this._view.showRun();
    }
  }

  // if (state.get("ArrowDown")) {
  // }
  // if (state.get("ArrowUp")) {
  // }

  // if (state.get("KeyX")) {
  // }
}
