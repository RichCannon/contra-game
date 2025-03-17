import { Container, Rectangle } from "pixi.js";
import Hero from "./entities/Hero/Hero";

export interface ICameraSettings {
  target: Hero;
  world: Container;
  screenSize: Rectangle;
  maxWorldWidth: number;
  isBackScrollX: boolean;
}

export default class Camera {
  #target: Hero;
  #world: Container;
  #isBackScrollX: boolean;
  #centerScreenPoint: {
    x: number;
    y: number;
  };
  #rightBorderWorldPointX: number;

  constructor(cameraSettings: ICameraSettings) {
    this.#target = cameraSettings.target;
    this.#world = cameraSettings.world;
    this.#isBackScrollX = cameraSettings.isBackScrollX;

    const maxWorldWidth = cameraSettings.maxWorldWidth;
    const screenSize = cameraSettings.screenSize;

    this.#centerScreenPoint = {
      x: screenSize.width * 0.5,
      y: screenSize.height * 0.5,
    };

    this.#rightBorderWorldPointX =
      this.#world.width - this.#centerScreenPoint.x;
  }

  update() {
    if (
      this.#target.x > this.#centerScreenPoint.x &&
      this.#target.x < this.#rightBorderWorldPointX
    ) {
      const newWorldX = this.#centerScreenPoint.x - this.#target.x;

      // Check if new world.x is greater than current world.x which means that the camera is moving to the left
      if (newWorldX > this.#world.x && !this.#isBackScrollX) {
        return;
      }
      this.#world.x = newWorldX;
    }
  }
}
