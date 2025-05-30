import { AnimatedSprite, Container, Graphics, Sprite } from "pixi.js";
import EntityView from "../EntityView";
import AssetsFactory from "../../AssetsFactory";

export type HeroViewStates =
  | "stay"
  | "stayUp"
  | "run"
  | "runUp"
  | "runDown"
  | "lay"
  | "jump"
  | "fall"
  | "runShoot";

export default class HeroView extends EntityView {
  #bounds = {
    width: 0,
    height: 0,
  };

  // State machine
  #stm = {
    currentState: "stay" as HeroViewStates,
    states: {} as Record<HeroViewStates, Container>,
  };

  #bulletPointShift = {
    x: 0,
    y: 0,
  };

  get bulletPointShift() {
    return this.#bulletPointShift;
  }

  get heroSpriteState() {
    return this.#stm.currentState;
  }

  // Return scale of the hero not the container where here is placed
  get isFlipped() {
    return this._rootNode.scale.x === -1;
  }

  #setBulletPointShift(x: number, y: number) {
    this.#bulletPointShift.x =
      (x + this._rootNode.pivot.x * this._rootNode.scale.x) *
      this._rootNode.scale.x;
    this.#bulletPointShift.y = y;
  }

  constructor(assets: AssetsFactory) {
    super(assets);

    this.#bounds.width = 20;
    this.#bounds.height = 90;
    this._collisionBox.width = this.#bounds.width;
    this._collisionBox.height = this.#bounds.height;
    this._hitBox.width = this.#bounds.width;
    this._hitBox.height = this.#bounds.height;
    this._rootNode.pivot.x = this._collisionBox.width * 0.5;
    this._rootNode.x = this._collisionBox.width * 0.5;

    this.#stm.states.stay = this.#getStayImage();
    this.#stm.states.stayUp = this.#getStayUpImage();
    this.#stm.states.run = this.#getRunImage();
    this.#stm.states.runUp = this.#getRunUpImage();
    this.#stm.states.runDown = this.#getRunDownImage();
    this.#stm.states.lay = this.#getLayImage();
    this.#stm.states.jump = this.#getJumpImage();
    this.#stm.states.fall = this.#getFallImage();
    this.#stm.states.runShoot = this.#getRunShootImage();

    for (const key in this.#stm.states) {
      this._rootNode.addChild(this.#stm.states[key as HeroViewStates]);
    }

    this.addChild(this._rootNode);

    this.#toState("stay");

    // this._rootNode.scale.x *= -1;
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
    this.#setBulletPointShift(65, 30);
    this._hitBox.width = 20;
    this._hitBox.height = 90;
    this._hitBox.shiftX = 0;
    this._hitBox.shiftY = 0;
  }
  showStayUp() {
    this.#toState("stayUp");
    this.#setBulletPointShift(-2, -40);
    this._hitBox.width = 20;
    this._hitBox.height = 90;
    this._hitBox.shiftX = 0;
    this._hitBox.shiftY = 0;
  }
  showRun() {
    this.#toState("run");
    this.#setBulletPointShift(65, 30);
    this._hitBox.width = 20;
    this._hitBox.height = 90;
    this._hitBox.shiftX = 0;
    this._hitBox.shiftY = 0;
  }
  showRunShoot() {
    this.#toState("runShoot");
    this.#setBulletPointShift(50, 29);
    this._hitBox.width = 20;
    this._hitBox.height = 90;
    this._hitBox.shiftX = 0;
    this._hitBox.shiftY = 0;
  }
  showRunUp() {
    this.#toState("runUp");
    this.#setBulletPointShift(40, -20);
    this._hitBox.width = 20;
    this._hitBox.height = 90;
    this._hitBox.shiftX = 0;
    this._hitBox.shiftY = 0;
  }
  showRunDown() {
    this.#toState("runDown");
    this.#setBulletPointShift(20, 55);
    this._hitBox.width = 20;
    this._hitBox.height = 90;
    this._hitBox.shiftX = 0;
    this._hitBox.shiftY = 0;
  }
  showLay() {
    this.#toState("lay");
    this.#setBulletPointShift(65, 70);
    this._hitBox.width = 90;
    this._hitBox.height = 20;
    this._hitBox.shiftX = -45;
    this._hitBox.shiftY = 70;
  }
  showJump() {
    this.#toState("jump");
    this.#setBulletPointShift(0, 30);
    this._hitBox.width = 40;
    this._hitBox.height = 40;
    this._hitBox.shiftX = -10;
    this._hitBox.shiftY = 25;
  }
  showFall() {
    this.#toState("fall");
    this.#setBulletPointShift(-2, 40);
    this._hitBox.width = 20;
    this._hitBox.height = 90;
    this._hitBox.shiftX = 0;
    this._hitBox.shiftY = 0;
  }

  flip(direction: -1 | 1) {
    this._rootNode.scale.x = direction;
  }

  #getStayImage() {
    // const view = new Graphics();
    // view.rect(0, 0, this.#bounds.width, this.#bounds.height);
    // view.rect(0, 30, 60, 10);
    // view.setStrokeStyle({
    //   color: 0xff9900,
    //   width: 2,
    // });
    // view.stroke();

    const view = new Sprite(this.assets.getTexture("stay0000"));
    return view;
  }

  #getStayUpImage() {
    // const view = new Graphics();
    // view.rect(0, 0, this.#bounds.width, this.#bounds.height);
    // view.rect(8, -40, 5, 40);
    // view.setStrokeStyle({
    //   color: 0xff9900,
    //   width: 2,
    // });
    // view.stroke();

    const view = new Sprite(this.assets.getTexture("stayup0000"));
    view.x += 2;
    view.y -= 31;
    return view;
  }
  #getRunImage() {
    // const view = new Graphics();

    // view.rect(0, 0, this.#bounds.width, this.#bounds.height);
    // view.rect(0, 30, 70, 5);
    // view.skew.set(-0.1, 0);
    // view.setStrokeStyle({
    //   color: 0xff9900,
    //   width: 2,
    // });
    // view.stroke();

    const view = new AnimatedSprite(this.assets.getAnimationTextures("run"));
    view.animationSpeed = 0.1;
    view.play();
    view.y -= 3;
    return view;
  }
  #getRunShootImage() {
    // const view = new Graphics();

    // view.rect(0, 0, this.#bounds.width, this.#bounds.height);
    // view.rect(0, 30, 70, 5);
    // view.skew.set(-0.1, 0);
    // view.setStrokeStyle({
    //   color: 0xff9900,
    //   width: 2,
    // });
    // view.stroke();

    const container = new Container();

    const upperPart = new Sprite(this.assets.getTexture("stay0000"));
    upperPart.x = 8;
    upperPart.y = 2;

    const upperPartMask = new Graphics();

    upperPartMask.rect(0, 0, 100, 45);
    upperPartMask.fill(0xffffff);
    upperPart.mask = upperPartMask;

    const bottomPart = new AnimatedSprite(
      this.assets.getAnimationTextures("run")
    );
    bottomPart.animationSpeed = 0.1;
    bottomPart.play();
    bottomPart.y -= 3;

    const bottomPartMask = new Graphics();

    bottomPartMask.rect(0, 45, 100, 45);
    bottomPartMask.fill(0xffffff);
    bottomPart.mask = bottomPartMask;

    container.addChild(upperPart);
    container.addChild(bottomPart);
    container.addChild(upperPartMask);
    container.addChild(bottomPartMask);

    return container;
  }
  #getRunUpImage() {
    // const view = new Graphics();

    // view.rect(0, 0, this.#bounds.width, this.#bounds.height);
    // view.lineTo(0, 30);
    // view.lineTo(40, -20);
    // view.lineTo(45, -15);
    // view.lineTo(0, 40);
    // view.skew.set(-0.1, 0);
    // view.setStrokeStyle({
    //   color: 0xff9900,
    //   width: 2,
    // });
    // view.stroke();

    const view = new AnimatedSprite(this.assets.getAnimationTextures("runup"));
    view.animationSpeed = 0.1;
    view.play();
    view.y -= 3;
    return view;
  }
  #getRunDownImage() {
    // const view = new Graphics();

    // view.rect(0, 0, this.#bounds.width, this.#bounds.height);
    // view.lineTo(0, 20);
    // view.lineTo(40, 60);
    // view.lineTo(35, 65);
    // view.lineTo(0, 30);
    // view.skew.set(-0.1, 0);
    // view.setStrokeStyle({
    //   color: 0xff9900,
    //   width: 2,
    // });
    // view.stroke();
    const view = new AnimatedSprite(
      this.assets.getAnimationTextures("rundown")
    );
    view.animationSpeed = 0.1;
    view.play();
    view.y -= 3;
    return view;
  }
  #getLayImage() {
    // const view = new Graphics();

    // view.rect(0, 0, this.#bounds.height, this.#bounds.width);
    // view.rect(90, 0, 40, 5);
    // view.x -= 45;
    // view.y += 70;
    // view.setStrokeStyle({
    //   color: 0xff9900,
    //   width: 2,
    // });
    // view.stroke();
    const view = new Sprite(this.assets.getTexture("lay0000"));
    view.x -= 25;
    view.y += 50;
    return view;
  }

  #getJumpImage() {
    // const view = new Graphics();

    // view.rect(0, 0, 40, 40);
    // view.x -= 10;
    // view.y += 25;
    // view.setStrokeStyle({
    //   color: 0xff9900,
    //   width: 2,
    // });
    // view.stroke();
    const view = new AnimatedSprite(this.assets.getAnimationTextures("jump"));
    view.animationSpeed = 0.1;
    view.play();
    view.y -= 3;
    view.x -= 10;
    return view;
  }

  #getFallImage() {
    // const view = new Graphics();

    // view.rect(0, 0, this.#bounds.width, this.#bounds.height);
    // view.rect(10, 20, 5, 60);
    // view.skew.set(-0.1, 0);
    // view.setStrokeStyle({
    //   color: 0xff9900,
    //   width: 2,
    // });
    // view.stroke();
    const view = new Sprite(this.assets.getTexture("run0003"));
    view.x += 25;
    view.y -= 50;
    return view;
  }
}
