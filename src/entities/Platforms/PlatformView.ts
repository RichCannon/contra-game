import EntityView from "../EntityView";

export default class PlatformView extends EntityView {
  constructor(w: number, h: number) {
    super();
    this.collisionBox.width = w;
    this.collisionBox.height = h;
  }
}
