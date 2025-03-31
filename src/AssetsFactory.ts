import { Spritesheet, Assets } from "pixi.js";

export default class AssetsFactory {
  #spritesheet: Spritesheet | null = null;

  constructor() {}

  async loadAssets() {
    this.#spritesheet = await Assets.load("/assets/atlas.json");
  }

  getTexture(textureName: string) {
    return this.#spritesheet!.textures[textureName];
  }
  getAnimationTextures(animationName: string) {
    return this.#spritesheet!.animations[animationName];
  }
}
