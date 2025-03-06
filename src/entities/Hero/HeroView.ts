import { Container, Graphics } from "pixi.js";

export interface IHeroCollisionBox {
  width: number;
  height: number;
  x: number;
  y: number;
}

export type HeroViewStates =
  | "stay"
  | "stayUp"
  | "run"
  | "runUp"
  | "runDown"
  | "lay"
  | "jump"
  | "fall";

export default class HeroView extends Container {
  #bounds = {
    width: 0,
    height: 0,
  };

  #collisionBox: IHeroCollisionBox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  get collisionBox() {
    this.#collisionBox.x = this.x;
    this.#collisionBox.y = this.y;
    return this.#collisionBox;
  }

  // State machine
  #stm = {
    currentState: "stay" as HeroViewStates,
    states: {} as Record<HeroViewStates, Graphics>,
  };

  get heroSpriteState() {
    return this.#stm.currentState;
  }

  #rootNode: Container;

  constructor() {
    super();
    this.#rootNode = this.#createNodeStructure();

    this.#bounds.width = 20;
    this.#bounds.height = 90;
    this.#collisionBox.width = this.#bounds.width;
    this.#collisionBox.height = this.#bounds.height;
    this.#rootNode.pivot.x = this.#collisionBox.width * 0.5;
    this.#rootNode.x = this.#collisionBox.width * 0.5;

    // const view = new Graphics();
    // view.rect(0, 0, this.#bounds.width, this.#bounds.height);
    // view.rect(0, 30, 60, 10);
    // // view.fill(0xff0055);
    // view.setStrokeStyle({
    //   color: 0xff9900,
    //   width: 2,
    // });
    // view.stroke();
    // this.addChild(view);

    // view.pivot.x = this.#bounds.width * 0.5;
    // view.x = this.#bounds.width * 0.5;

    this.#stm.states.stay = this.#getStayImage();
    this.#stm.states.stayUp = this.#getStayUpImage();
    this.#stm.states.run = this.#getRunImage();
    this.#stm.states.runUp = this.#getRunUpImage();
    this.#stm.states.runDown = this.#getRunDownImage();
    this.#stm.states.lay = this.#getLayImage();
    this.#stm.states.jump = this.#getJumpImage();
    this.#stm.states.fall = this.#getFallImage();

    for (const key in this.#stm.states) {
      this.#rootNode.addChild(this.#stm.states[key as HeroViewStates]);
    }

    this.addChild(this.#rootNode);

    this.#toState("stay");

    // this.#rootNode.scale.x *= -1;
  }

  #createNodeStructure() {
    const rootNode = new Container();
    this.addChild(rootNode);
    return rootNode;
  }

  #toState(state: HeroViewStates) {
    if (this.#stm.currentState === state) {
      return;
    }
    for (const key in this.#stm.states) {
      if (state === key) {
        this.#stm.states[key as HeroViewStates].visible = true;
        this.#stm.currentState = key;
        continue;
      }
      this.#stm.states[key as HeroViewStates].visible = false;
    }
  }

  showStay() {
    this.#toState("stay");
  }
  showStayUp() {
    this.#toState("stayUp");
  }
  showRun() {
    this.#toState("run");
  }
  showRunUp() {
    this.#toState("runUp");
  }
  showRunDown() {
    this.#toState("runDown");
  }
  showLay() {
    this.#toState("lay");
  }
  showJump() {
    this.#toState("jump");
  }
  showFall() {
    this.#toState("fall");
  }

  flip(direction: -1 | 1) {
    this.#rootNode.scale.x = direction;
  }

  #getStayImage() {
    const view = new Graphics();
    view.rect(0, 0, this.#bounds.width, this.#bounds.height);
    view.rect(0, 30, 60, 10);
    view.setStrokeStyle({
      color: 0xff9900,
      width: 2,
    });
    view.stroke();
    return view;
  }

  #getStayUpImage() {
    const view = new Graphics();
    view.rect(0, 0, this.#bounds.width, this.#bounds.height);
    view.rect(8, -40, 5, 40);
    view.setStrokeStyle({
      color: 0xff9900,
      width: 2,
    });
    view.stroke();
    return view;
  }
  #getRunImage() {
    const view = new Graphics();

    view.rect(0, 0, this.#bounds.width, this.#bounds.height);
    view.rect(0, 30, 70, 5);
    view.skew.set(-0.1, 0);
    view.setStrokeStyle({
      color: 0xff9900,
      width: 2,
    });
    view.stroke();
    return view;
  }
  #getRunUpImage() {
    const view = new Graphics();

    view.rect(0, 0, this.#bounds.width, this.#bounds.height);
    view.lineTo(0, 30);
    view.lineTo(40, -20);
    view.lineTo(45, -15);
    view.lineTo(0, 40);
    view.skew.set(-0.1, 0);
    view.setStrokeStyle({
      color: 0xff9900,
      width: 2,
    });
    view.stroke();
    return view;
  }
  #getRunDownImage() {
    const view = new Graphics();

    view.rect(0, 0, this.#bounds.width, this.#bounds.height);
    view.lineTo(0, 20);
    view.lineTo(40, 60);
    view.lineTo(35, 65);
    view.lineTo(0, 30);
    view.skew.set(-0.1, 0);
    view.setStrokeStyle({
      color: 0xff9900,
      width: 2,
    });
    view.stroke();
    return view;
  }
  #getLayImage() {
    const view = new Graphics();

    view.rect(0, 0, this.#bounds.height, this.#bounds.width);
    view.rect(90, 0, 40, 5);
    view.x += 45;
    view.y += 70;
    view.setStrokeStyle({
      color: 0xff9900,
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
      color: 0xff9900,
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
      color: 0xff9900,
      width: 2,
    });
    view.stroke();
    return view;
  }
}
