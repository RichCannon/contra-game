import { Container, Graphics } from "pixi.js";

const enum HERO_STATES {
  STAY,
  JUMP,
  IN_AIR,
}

export default class Hero extends Container {
  #G = 0.1; // Constant acceleration
  #Vx = 0; // Velocity OX
  #Vy = 0; // Velocity OY
  #MAX_V = 2;
  #JUMP_FORCE = 4;

  #movement = {
    xL: 0,
    xR: 0,
    y: 0,
  };

  #state = new Map<HERO_STATES, boolean>();

  constructor() {
    super();
    const view = new Graphics();
    view.rect(0, 0, 50, 50);
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
  }

  stay() {
    this.#Vy = 0;
    this.#state.set(HERO_STATES.STAY, true);
    this.#state.set(HERO_STATES.IN_AIR, false);
    // this.#state.set(HERO_STATES.JUMP, false);
  }

  jump() {
    if (this.#state.get(HERO_STATES.IN_AIR)) return;
    this.#state.set(HERO_STATES.STAY, false);
    this.#state.set(HERO_STATES.IN_AIR, true);
    this.#Vy -= this.#JUMP_FORCE;
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
