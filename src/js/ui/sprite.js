class Sprite {
  /**
   * Creates a sprite.
   * @param x {number} The top-left coordinate.
   * @param y {number} The top-right coordinate.
   * @param width {number} The pixel width.
   * @param height {number} The pixel height.
   * @param src {string} The source for the image.
   * @param data {*} Any additional data to be stored.
   * @constructor
   */
  constructor(x, y, width, height, src, data) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.width = width;
    this.image.height = height;
    this.image.src = src;
    this.data = data;
  }

  contains(x, y) {
    return this.x <= x && x < this.x + this.width
      && this.y <= y && y < this.y + this.height;
  }

  overlaps(sprite) {
    return this.x < sprite.x + sprite.width
      && this.x + this.width > sprite.x
      && this.y < sprite.y + sprite.height
      && this.y + this.height > sprite.y;
  }
}