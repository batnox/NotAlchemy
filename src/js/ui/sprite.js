/**
 *
 * @param x
 * @param y
 * @param width
 * @param height
 * @param src
 * @param data
 * @constructor
 */
function Sprite(x, y, width, height, src, data) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.image = new Image();
  this.image.width = width;
  this.image.height = height;
  this.image.src = src;
  this.data = data;

  this.contains = function(x, y) {
    return this.x <= x && x < this.x + this.width
      && this.y <= y && y < this.y + this.height;
  };

  this.overlaps = function(sprite) {
    return this.x < sprite.x + sprite.width
      && this.x + this.width > sprite.x
      && this.y < sprite.y + sprite.height
      && this.y + this.height > sprite.y;
  };
}