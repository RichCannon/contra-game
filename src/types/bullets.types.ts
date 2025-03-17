import { ENTITIE_TYPES } from "./entities.types";

export type BulletTypes = ENTITIE_TYPES.BULLET | ENTITIE_TYPES.ENEMY_BULLET;

export interface IBulletContext {
  x: number;
  y: number;
  angle: number;
  type: BulletTypes;
}
