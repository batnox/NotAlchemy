/**
 * Represents the rectangular boundaries of sprites for collision detection
 */
class RectangleBounds extends BoundsComponent {
  /**
   * Basic constructor of a rectangular boundary
   */
  constructor() {
    super();
    /**
     * The x-coordinate of the boundary's center
     * @type {number}
     */
    this.x = 0;
    /**
     * The y-coordinate of the boundary's center
     * @type {number}
     */
    this.y = 0;
    /**
     * The width of the rectangular boundary
     * @type {number}
     */
    this.width = 0;
    /**
     * The height of the rectangular boundary
     * @type {number}
     */
    this.height = 0;
  }
  /**
   * Sets the center point of the boundary to a specific point's x and y coordinates
   * @param x (number)
   * @param y (number)
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
  /**
   * Sets the dimensions of the rectangular boundary based on a width and height
   * @param width (number)
   * @param height (number)
   */
  setSize(width, height) {
    this.width = width;
    this.height = height;
  }
  /**
   * Returns whether or not a point is inside the rectangular boundary
   * @param x the x-coordinate of the point to check
   * @param y the y-coordinate of the point to check
   * @returns {boolean} whether or not a point is inside the boundary
   */
  contains(x, y) {
    return this.x <= x && x < this.x + this.width
      && this.y <= y && y < this.y + this.height;
  }
  /**
   * Returns whether or not two sprites are colliding based on rectangular boundaries
   * @param sprite the sprite to compare
   * @returns {boolean} whether or not two sprites are colliding
   */
  isCollision(sprite) {
    return this.x < sprite.bounds.x + sprite.bounds.width
      && this.x + this.width > sprite.bounds.x
      && this.y < sprite.bounds.y + sprite.bounds.height
      && this.y + this.height > sprite.bounds.y;
  }
}