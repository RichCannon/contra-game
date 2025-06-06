import { Ticker } from "pixi.js";

export interface IEntityPosition {
  x: number;
  y: number;
}

export interface ICollisionBox extends IEntityPosition {
  width: number;
  height: number;
}

export interface IHitBox extends IEntityPosition {
  width: number;
  height: number;
  shiftX: number;
  shiftY: number;
}

export const enum ENTITY_STATES {
  STAY,
  JUMP,
  JUMP_DOWN,
  IN_AIR,
}

export interface IPrevEntityPoint extends IEntityPosition {}

export interface IEntity {
  x: number;
  y: number;
  type: ENTITIE_TYPES;
  state: Map<ENTITY_STATES, boolean>;
  gravitable: boolean;
  readonly collisionBox: ICollisionBox;
  readonly hitBox: IHitBox;
  readonly isDead: boolean;
  readonly prevPoint: IPrevEntityPoint;
  kill(): void;
  dealDamage(): void;
  update?(ticker: Ticker): void;
  stay?(y: number): void;
  removeFromParent(): void;
}

export const enum ENTITIE_TYPES {
  HERO = 1,
  ENEMY,
  ENEMY_TURRET,
  BULLET,
  ENEMY_BULLET,
  PLATFORM,
  BOX,
  WATER,
  BOSS_WALL,
}

export interface IEntityOptions {
  isDead?: boolean;
  isActive?: boolean;
}
