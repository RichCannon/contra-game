import { ICollisionBox } from "../types/entities.types";

export class Physics {
  static checkCollision(entity: ICollisionBox, area: ICollisionBox) {
    const isVertCollision =
      entity.y < area.y + area.height && entity.y + entity.height > area.y;
    const isHorCollision =
      entity.x < area.x + area.width && entity.x + entity.width > area.x;
    return isVertCollision && isHorCollision;
  }

  static getOrientCollision(
    aaRect: ICollisionBox,
    bbRect: ICollisionBox,
    aaPrevPoint: { x: number; y: number }
  ) {
    const collision = {
      horizontal: false,
      vertical: false,
    };

    const isCollide = this.checkCollision(aaRect, bbRect);

    if (!isCollide) {
      return false;
    }

    aaRect.y = aaPrevPoint.y;
    const isYCollide = this.checkCollision(aaRect, bbRect);

    if (!isYCollide) {
      collision.vertical = true;
      return collision;
    }

    collision.horizontal = true;
    return collision;
  }
}
