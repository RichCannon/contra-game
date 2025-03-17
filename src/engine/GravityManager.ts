export default class GravityManager {
  static GRAVITY = 0.2;

  static applyGravity(velocityY: number): number {
    return velocityY + GravityManager.GRAVITY;
  }
}
