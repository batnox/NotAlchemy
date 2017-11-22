/**
 * Represents an image to be displayed on the game screen
 */
class ImageComponent {
  /**
   * The constructor of an image
   */
  constructor() {
    /**
     * The collision boundaries of the image
     * @type {bounds-component)
     */
    this.bounds = null;
    /**
     * The name of the image
     * @type {string}
     */
    this.name = null;
    /**
     * Whether or not an image is visible on screen
     * @type {boolean}
     */
    this.visible = true;
  }

  /**
   * Sets the image's name based on its filepath name
   * @param name (string)
   */
  setImage(name) {
    this.name = name;
  }
  /**
   * Sets whether or not an umage is visible
   * @param visible (boolean)
   */
  setVisible(visible) {
    this.visible = visible;
  }

  update() {
    // Nothing to update
  }

  /**
   * Draws the image to the screen
   * @param context {CanvasRenderingContext2D}
   */
  draw(context) {
    if (this.visible && this.name) {
      let i = imageManager.getImage(this.name);
      if (!i) {
        throw Error('No image: ' + this.name);
      }
      let image = imageManager.getImage(this.name).image;
      let imageOffset = imageManager.getImage(this.name).offset;
      context.save();
      context.translate(
        this.bounds.x + this.bounds.width / 2,
        this.bounds.y + this.bounds.height / 2
      );
      context.rotate(this.bounds.rotation * Math.PI / 180);
      if (!image) {
        throw Error(`No image \'${this.name}\'.`);
      }
      context.drawImage(
        image,
        imageOffset, 0,
        image.height, image.height,
        -this.bounds.width / 2, -this.bounds.height / 2,
        this.bounds.width, this.bounds.height
      );
      context.restore();
    }
  }
}