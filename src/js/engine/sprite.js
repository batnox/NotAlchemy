class Sprite {
  /**
   * Creates a sprite.
   * @constructor
   */
  constructor() {
    this.image = new Image();
    this.x = 0;
    this.y = 0;
    this.originX = 0;
    this.originY = 0;
    this.width = 0;
    this.height = 0;
    this.rotation = 0;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setOrigin(originX, originY) {
    this.originX = originX;
    this.originY = originY;
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.image.width = width;
    this.image.height = height;
  }

  setRotation(rotation) {
    this.rotation = rotation;
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
   * @param context {CanvasRenderingContext2D}
   */
  draw(context) {
    if (this.image.src) {
      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.rotation * Math.PI / 180);
      context.translate(-this.originX, -this.originY);
      context.drawImage(this.image, 0, 0, this.width, this.height);
      context.restore();
    }
  }
}