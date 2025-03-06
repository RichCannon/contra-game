import { Container, ContainerChild, Graphics } from "pixi.js";
import HeroView from "./HeroView";

export const enum HERO_STATES {
  STAY,
  JUMP,
  JUMP_DOWN,
  IN_AIR,
}

let showLog = true;

// export interface IHeroBounds {
//   width: number;
//   height: number;
// }

export default class Hero {
  #G = 0.2; // Constant acceleration
  #Vx = 0; // Velocity OX
  #Vy = 0; // Velocity OY
  #MAX_V = 3;
  #JUMP_FORCE = 9;
  #view: HeroView;

  #movement = {
    xL: 0,
    xR: 0,
    y: 0,
  };

  #state = new Map<HERO_STATES, boolean>();

  #isLay = false;
  #isUp = false;

  get heroState() {
    return this.#state;
  }

  constructor(stage: Container<ContainerChild>) {
    this.#view = new HeroView();
    stage.addChild(this.#view);

    this.#state.set(HERO_STATES.JUMP, true);
    this.#view.showJump();
  }

  get collisionBox() {
    return this.#view.collisionBox;
  }

  get x() {
    return this.#view.x;
  }
  set x(value: number) {
    this.#view.x = value;
  }
  get y() {
    return this.#view.y;
  }
  set y(value: number) {
    this.#view.y = value;
  }

  update() {
    if (this.#Vy > 0) {
      if (this.#state.get(HERO_STATES.JUMP)) {
        this.#state.set(HERO_STATES.JUMP, false);
      }
      if (
        !this.#state.get(HERO_STATES.JUMP) &&
        this.#state.get(HERO_STATES.IN_AIR) &&
        this.#view.heroSpriteState !== "jump"
      ) {
        this.#view.showFall();
      }
    }

    // FIXME: Might be a problem if we are goinf to introduce moving vertically platforms
    if (this.#Vy !== 0) {
      this.#state.set(HERO_STATES.IN_AIR, true);
    }

    this.#Vx = (this.#movement.xL + this.#movement.xR) * this.#MAX_V;
    this.x += this.#Vx;

    this.#Vy += this.#G;
    this.y += this.#Vy;
  }

  stay(platformY: number) {
    this.#Vy = 0;
    this.y = platformY - this.collisionBox.height;
    // console.log("stay");

    // this.#state.set(HERO_STATES.JUMP, false);
    if (
      this.#state.get(HERO_STATES.IN_AIR) ||
      this.#state.get(HERO_STATES.JUMP)
    ) {
      const buttonState = new Map<string, boolean>();
      buttonState.set("ArrowLeft", this.#movement.xL === -1);
      buttonState.set("ArrowRight", this.#movement.xR === 1);
      buttonState.set("ArrowDown", this.#isLay);
      buttonState.set("ArrowUp", this.#isUp);
      this.#state.set(HERO_STATES.IN_AIR, false);
      this.setView(buttonState);
    }

    this.#state.set(HERO_STATES.STAY, true);
    this.#state.set(HERO_STATES.IN_AIR, false);
    this.#state.set(HERO_STATES.JUMP_DOWN, false);
  }

  jump() {
    if (this.#state.get(HERO_STATES.IN_AIR)) return;
    this.#state.set(HERO_STATES.STAY, false);
    this.#state.set(HERO_STATES.IN_AIR, true);
    this.#state.set(HERO_STATES.JUMP, true);
    this.#Vy -= this.#JUMP_FORCE;
    this.#view.showJump();
  }

  jumpDown() {
    this.#state.set(HERO_STATES.JUMP, true);
    this.#state.set(HERO_STATES.JUMP_DOWN, true);
    this.#state.set(HERO_STATES.IN_AIR, true);
    this.#view.showFall();
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
    this.#isLay = state.get("ArrowDown") || false;
    this.#isUp = state.get("ArrowUp") || false;

    if (!!movementDirection) {
      this.#view.flip(movementDirection as -1 | 1);
    }

    if (
      this.#state.get(HERO_STATES.IN_AIR) ||
      this.#state.get(HERO_STATES.JUMP)
    ) {
      return;
    }

    if (state.get("ArrowLeft") || state.get("ArrowRight")) {
      if (state.get("ArrowUp")) {
        this.#view.showRunUp();
      } else if (state.get("ArrowDown")) {
        this.#view.showRunDown();
      } else {
        this.#view.showRun();
      }
    } else {
      if (state.get("ArrowUp")) {
        this.#view.showStayUp();
      } else if (state.get("ArrowDown")) {
        this.#view.showLay();
      } else {
        this.#view.showStay();
      }
    }

    if (state.get("ArrowDown")) {
    }
    if (state.get("ArrowUp")) {
    }

    if (state.get("KeyX")) {
    }
  }
}
