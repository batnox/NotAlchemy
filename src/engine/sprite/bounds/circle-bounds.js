/**
 * Represents the circular boundaries of a sprite for collision
 */
class CircleBounds extends BoundsComponent {
  /**
   * Constructor for the circular boundary
   */
  constructor() {
    super();
    /**
     * The x-coordinate of the center of the boundary
     * @type {number}
     */
    this.x = 0;
    /**
     * The y-coordinate of the center of the boundary
     * @type {number}
     */
    this.y = 0;
    /**
     * The radius of the boundary
     * @type {number}
     */
    this.radius = 0;
  }
  /**
   * Sets the position of the circular boundary
   * @param x (number) the x-coordinate of the boundary
   * @param y (number) the y-coordinate of the boundary
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
  /**
   * Returns whether or not a set of coordinates are inside the boundary
   * @param x (number) the x-coordinate to check
   * @param y (number) the y-coordinate to check
   * @returns {boolean} whether or not a set of coordinates are inside a boundary
   */
  contains(x, y) {
    return Math.hypot(this.x - x, this.y - y) <= this.radius;
  }
  /**
   * Returns whether or not two sprites are colliding based on circular boundaries
   * @param sprite the sprite to compare
   * @returns {boolean} whether or not two sprites are colliding
   */
  isCollision(sprite) {
    let dist = Math.hypot(this.x - sprite.bounds.x, this.y - sprite.bounds.y);
    return dist <= this.radius + sprite.bounds.radius;
  }
}