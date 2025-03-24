import { Graphics } from "pixi.js";
import Entity from "../Entity";
import PlatformView from "./PlatformView";
import { ENTITIE_TYPES, IEntity } from "../../types/entities.types";

export const enum PlatformType {
  PLATFORM,
  BOX,
}
export default class Platform extends Entity implements IEntity {
  #isClimable = false;
  type: ENTITIE_TYPES;

  get isClimable() {
    return this.#isClimable;
  }
  set isClimable(isClimable: boolean) {
    this.#isClimable = isClimable;
  }

  constructor(view: PlatformView, type = ENTITIE_TYPES.PLATFORM) {
    super(view);
    this.type = type;
  }
}
