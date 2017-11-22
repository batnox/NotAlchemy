/**
 * Represents an individual tile on a grid layout
 */
class Tile {
  /**
   * Contructor of a tile
   * @param x (number)
   * @param y (number)
   */
  constructor(x, y) {
  /**
   * The x-coordinate of the tile on the grid
   */
    this.x = x;
    /**
     * The y-coordinate of the tile on the grid
     */
    this.y = y;
    /**
     * The array of sptites inside the tile
     * @type {Array}
     */
    this.sprites = [];
  }
  /**
   * Adds a sprite to the list of sprites inside this particular tile
   * @param sprite (sprite) the sptite to add into the tile
   */
  addSprite(sprite) {
    this.sprites.push(sprite);
  }
  /**
   * Sets a sprite inside the list of sprites inside a tile
   * @param index (number) the index in the sprite list to set
   * @param sprite (sprite) the sptite to set in the list
   */
  setSprite(index, sprite) {
    this.sprites[index] = sprite;
  }
  /**
   * Returns the list of sprites inside this tile
   * @returns {Array} the list of sprites inside this tile
   */
  getSprites() {
    return this.sprites;
  }
  /**
   * Clears out all sprites inside this tile
   */
  clear() {
    this.sprites = [];
  }
  /**
   * Returns whether or not this tile is empty
   * @returns {boolean} whether or not this tile is empty
   */
  isEmpty() {
    return this.sprites.length === 0;
  }
  /**
   * Draws out all the sprites indide the tile onto the grid
   * @param context (CanvasRenderingContext2D}
   */
  draw(context) {
    this.sprites.forEach(sprite => {
      if (sprite) {
        sprite.draw(context);
      }
    });
  }
  /**
   * Updates the sprites inside the tile
   */
  update() {
    this.sprites.forEach(sprite => {
      if (sprite) {
        sprite.update();
      }
    });
  }

}