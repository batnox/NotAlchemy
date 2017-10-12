class Sprite {
  /**
   * Creates a sprite.
   * @constructor
   */
  constructor() {
    /**
     * The bounds of the sprite.
     * @type {BoundsComponent}
     */
    this.bounds = null;
    /**
     * The image of the sprite.
     * @type {ImageComponent}
     */
    this.image = null;
  }

  update() {
    if (this.image) {
      this.image.update();
    }
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  draw(context) {
    if (this.image) {
      this.image.draw(context);
    }
  }
}