/**
 * Represents a sprite to be displayed on screen
 */
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
  /**
   * Updates the image of a sprite
   */
  update() {
    if (this.image) {
      this.image.update();
    }
  }

  /**
   * Draws the sprite's image onto the screen
   * @param context {CanvasRenderingContext2D}
   */
  draw(context) {
    if (this.image) {
      this.image.draw(context);
    }
  }
}