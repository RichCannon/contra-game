import { Graphics } from "pixi.js";
import EntityView from "../../EntityView";
import { ICollisionBox } from "../../../types/entities.types";

export type RunnerViewStates =
  | "stay"
  | "stayUp"
  | "run"
  | "runUp"
  | "runDown"
  | "lay"
  | "jump"
  | "fall";

export default class RunnerView extends EntityView {
  #bounds = {
    width: 0,
    height: 0,
  };

  // State machine
  #stm = {
    currentState: "run" as RunnerViewStates,
    states: {} as Record<RunnerViewStates, Graphics>,
  };

  get heroSpriteState() {
    return this.#stm.currentState;
  }

  constructor() {
    super();

    this.#bounds.width = 20;
    this.#bounds.height = 90;
    this._collisionBox.width = this.#bounds.width;
    this._collisionBox.height = this.#bounds.height;
    this._hitBox.width = this.#bounds.width;
    this._hitBox.height = this.#bounds.height;
    this._rootNode.pivot.x = this.collisionBox.width * 0.5;
    this._rootNode.x = this.collisionBox.width * 0.5;

    this.#stm.states.run = this.#getRunImage();
    this.#stm.states.jump = this.#getJumpImage();
    this.#stm.states.fall = this.#getFallImage();

    for (const key in this.#stm.states) {
      this._rootNode.addChild(this.#stm.states[key as RunnerViewStates]);
    }

    this.addChild(this._rootNode);

    this.#toState("run");

    // this._rootNode.scale.x *= -1;
  }

  get isFlipped() {
    return this._rootNode.scale.x === -1;
  }

  #toState(state: RunnerViewStates) {
    if (this.#stm.currentState === state) {
      return;
    }
    for (const key in this.#stm.states) {
      if (state === key) {
        this.#stm.states[key as RunnerViewStates].visible = true;
        this.#stm.currentState = key;
        continue;
      }
      this.#stm.states[key as RunnerViewStates].visible = false;
    }
  }

  showRun() {
    this.#toState("run");
  }
  showJump() {
    this.#toState("jump");
  }
  showFall() {
    this.#toState("fall");
  }

  flip(direction: -1 | 1) {
    this._rootNode.scale.x = direction;
  }

  #getRunImage() {
    const view = new Graphics();

    view.rect(0, 0, this.#bounds.width, this.#bounds.height);
    view.skew.set(-0.1, 0);
    view.setStrokeStyle({
      color: 0xff0000,
      width: 2,
    });
    view.stroke();
    return view;
  }

  #getJumpImage() {
    const view = new Graphics();

    view.rect(0, 0, 40, 40);
    view.x -= 10;
    view.y += 25;
    view.setStrokeStyle({
      color: 0xff0000,
      width: 2,
    });
    view.stroke();
    return view;
  }

  #getFallImage() {
    const view = new Graphics();

    view.rect(0, 0, this.#bounds.width, this.#bounds.height);
    view.rect(10, 20, 5, 60);
    view.skew.set(-0.1, 0);
    view.setStrokeStyle({
      color: 0xff0000,
      width: 2,
    });
    view.stroke();
    return view;
  }
}
