class RectangleBounds extends BoundsComponent {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
  }

  contains(x, y) {
    return this.x <= x && x < this.x + this.width
      && this.y <= y && y < this.y + this.height;
  }

  isCollision(sprite) {
    return this.x < sprite.bounds.x + sprite.bounds.width
      && this.x + this.width > sprite.bounds.x
      && this.y < sprite.bounds.y + sprite.bounds.height
      && this.y + this.height > sprite.bounds.y;
  }
}