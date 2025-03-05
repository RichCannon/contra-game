import { Container, Graphics } from "pixi.js";

export const enum HERO_STATES {
  STAY,
  JUMP,
  IN_AIR,
}

// let showLog = true;

export interface IHeroRect {
  width: number;
  height: number;
  x: number;
  y: number;
}

export default class Hero extends Container {
  #G = 0.2; // Constant acceleration
  #Vx = 0; // Velocity OX
  #Vy = 0; // Velocity OY
  #MAX_V = 3;
  #JUMP_FORCE = 9;

  #movement = {
    xL: 0,
    xR: 0,
    y: 0,
  };

  #state = new Map<HERO_STATES, boolean>();

  #rect: IHeroRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  get heroRect() {
    this.#rect.x = this.x;
    this.#rect.y = this.y;
    this.#rect.width = this.width;
    this.#rect.height = this.height;
    return this.#rect;
  }

  get heroState() {
    return this.#state;
  }

  constructor() {
    super();
    const view = new Graphics();
    view.rect(0, 0, 20, 90);
    // view.fill(0xff0055);
    view.setStrokeStyle({
      color: 0xff9900,
      width: 5,
    });
    view.stroke();
    this.addChild(view);
  }

  update() {
    this.#Vx = (this.#movement.xL + this.#movement.xR) * this.#MAX_V;
    this.x += this.#Vx;

    this.#Vy += this.#G;
    this.y += this.#Vy;

    //FIXME: #Vy shouldn't be >0.1. It should be 0
    // Value 0.1 here because of jumpDown() method
    if (this.#Vy > 0.3 && this.#state.get(HERO_STATES.JUMP)) {
      console.log("NO JUMP");
      this.#state.set(HERO_STATES.JUMP, false);
    }

    // FIXME: Might be a problem if we are goinf to introduce moving vertically platforms
    if (this.#Vy >= 0.3 || this.#Vy <= 0.3) {
      this.#state.set(HERO_STATES.IN_AIR, true);
    }

    // if (showLog) {
    //   showLog = false;
    //   setTimeout(() => (showLog = true), 500);
    // }
  }

  stay(platformY: number) {
    this.#Vy = 0;
    this.y = platformY - this.height;
    // console.log("stay");
    this.#state.set(HERO_STATES.STAY, true);
    this.#state.set(HERO_STATES.IN_AIR, false);
    // this.#state.set(HERO_STATES.JUMP, false);
  }

  jump() {
    if (this.#state.get(HERO_STATES.IN_AIR)) return;
    this.#state.set(HERO_STATES.STAY, false);
    this.#state.set(HERO_STATES.IN_AIR, true);
    this.#state.set(HERO_STATES.JUMP, true);
    this.#Vy -= this.#JUMP_FORCE;
  }

  jumpDown() {
    this.#state.set(HERO_STATES.JUMP, true);
    this.#state.set(HERO_STATES.IN_AIR, true);
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
}
