class CircleBounds extends BoundsComponent {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.radius = 0;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  contains(x, y) {
    return Math.hypot(this.x - x, this.y - y) <= this.radius;
  }

  isCollision(sprite) {
    let dist = Math.hypot(this.x - sprite.bounds.x, this.y - sprite.bounds.y);
    return dist <= this.radius + sprite.bounds.radius;
  }
}