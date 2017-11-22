/**
 * Represents a sprite to be displayed on the game screen
 */
class Sprite {
  /**
   * Creates a sprite.
   * @constructor
   */
  constructor() {
    /**
     * The image of the sprite to display
     * @type {image-component}
     */
    this.image = null;
    /**
     * The x-coordinate of the center of the Sprite
     * @type {number}
     */
    this.x = 0;
    /**
     * The y=coordinate of the center of the sprite
     * @type {number}
     */
    this.y = 0;
    /**
     * The width of the sprite's image
     * @type {number}
     */
    this.width = 0;
    /**
     * The height of the sprite's image
     * @type {number}
     */
    this.height = 0;
    /**
     * The angle of the Sprite's rotation
     * @type {number}
     */
    this.rotation = 0;
  }
  /**
   * Sets a sprite's center based on a point's x and y coordinates
   * @param x (number)
   * @param y (number)
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
  /**
   * Sets a Sprite's size based on its image's width and height
   * @param width (number)
   * @param height (number)
   */
  setSize(width, height) {
    this.width = width;
    this.height = height;
  }
  /**
   * Sets the angle of rotation for a sprite
   * @param rotation (number)
   */
  setRotation(rotation) {
    this.rotation = rotation;
  }
  /**
   * Sets the sprite's image based on its source filepath
   * @param src
   */
  setImage(src) {
    this.image = src;
  }

    /**
     * Returns whether a point is inside the sprite based on its x and y coordinates
     * @param x (number)
     * @param y (number)
     * @returns {boolean}
     */
  contains(x, y) {
    return this.x <= x && x < this.x + this.width
      && this.y <= y && y < this.y + this.height;
  }

  /**
   * Returns whether or not this sprite is colliding with another
   * @param sprite (sprite)
   */
  isCollision(sprite) {
    return this.x < sprite.x + sprite.width
      && this.x + this.width > sprite.x
      && this.y < sprite.y + sprite.height
      && this.y + this.height > sprite.y;
  }

  /**
   * Draws the Sprite's image onto the game screen
   * @param context {CanvasRenderingContext2D}
   */
  draw(context) {
    if (this.image) {
      context.save();
      context.translate(this.x + this.width / 2, this.y + this.height / 2);
      context.rotate(this.rotation * Math.PI / 180);
      let image = imageManager.getImage(this.image).image;
      let imageOffset = Math.floor(imageManager.getImage(this.image).offset);//adjust animation speed
      if (!image) {
        throw Error(`No image \'${this.image}\'.`)
      }

      context.drawImage(image, imageOffset*image.height, 0, image.height, image.height, -this.width / 2, -this.height / 2, this.width, this.height);
      //context.drawImage(image, -this.width / 2, -this.height / 2, this.width, this.height); //original
      context.restore();
    }
  }
}