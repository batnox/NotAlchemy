class Sprite {
  /**
   * Creates a sprite.
   * @constructor
   */
  constructor() {
    this.image = new Image();
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.rotation = 0;
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
      context.translate(this.x + this.width / 2, this.y + this.height / 2);
      context.rotate(this.rotation * Math.PI / 180);
      context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
      context.restore();
    }
    context.strokeRect(this.x, this.y, this.width, this.height);
  }
}