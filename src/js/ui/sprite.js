class Sprite {
  /**
   * Creates a sprite.
   * @constructor
   */
  constructor() {
    this.image = new Image();
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.image.width = width;
    this.image.height = height;
  }

  setImage(src) {
    this.image.src = src;
  }

  contains(x, y) {
    return this.x <= x && x < this.x + this.width
      && this.y <= y && y < this.y + this.height;
  }

  isCollision(sprite) {
    return this.x < sprite.x + sprite.width
      && this.x + this.width > sprite.x
      && this.y < sprite.y + sprite.height
      && this.y + this.height > sprite.y;
  }

  /**
   *
   * @param context {CanvasRenderingContext2D}
   */
  draw(context) {
    if (this.image.src) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      console.log('No source.');
    }
  }
}