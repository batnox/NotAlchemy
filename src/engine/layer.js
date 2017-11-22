/**
 * A layer consists of things to draw. Everything on the layer is drawn together, but in
 * no guaranteed order.
 */
class Layer {
  /**
   * Creates an empty layer.
   */
  constructor() {
    /**
     * The objects that can be drawn.
     * @type {Array}
     */
    this.drawables = [];
    /**
     * Whether or not this layer is one to draw on
     * @type {boolean}
     */
    this.drawLayer = true;
  }

  /**
   * Adds another drawable object to the layer.
   * @param drawable
   */
  addDrawable(drawable) {
    this.drawables.push(drawable);
  }

  /**
   * Removes the drawable object at the given index.
   * @param index {number} The index to remove
   * @returns {*} The removed drawable object
   */
  removeDrawable(index) {
    return this.drawables.splice(index, 1)[0];
  }

  /**
   * Removes all drawables from the layer.
   */
  clear() {
    this.drawables = [];
  }

  /**
   * Draws everything on the layer, in no guaranteed order.
   * @param context {CanvasRenderingContext2D}
   */
  draw(context) {
    if (this.drawLayer) {
      for (let drawable of this.drawables) {
        drawable.draw(context);
      }
    }
  }
}