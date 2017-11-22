/**
 * Component of the boundaries of a sprite for collision
 */
class BoundsComponent {
  /**
   * Basic constructor of the component
   */
  constructor() {
    /**
     * The rotation of the Sprite Boundary
     * @type {number}
     */
    this.rotation = 0;
  }
  /**
   * Sets the rotation of a sprite's boundary
   * @param rotation (number)
   */
  setRotation(rotation) {
    this.rotation = rotation;
  }
}