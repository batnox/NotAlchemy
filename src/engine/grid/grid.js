/**
 * This class is responsible for handling
 * the grid mapping of the game layout
 */
class Grid {
  /**
   * Basic constructor of the grid
   * @param width the width of the space that the grid must fill
   * @param height the height of the space that the grid must fill
   */
  constructor(width, height) {
    /**
     * The width of the grid space
     */
    this.width = width;
    /**
     * The height of the grid
     */
    this.height = height;
    /**
     * The array of tiles within the grid
     * @type {Array}
     */
    this.tiles = [];
    for (let x = 0; x < width; x++) {
      this.tiles[x] = [];
      for (let y = 0; y < height; y++) {
        this.tiles[x][y] = new Tile(x, y);
      }
    }
  }
  /**
   * Returns the tile at a specific (x, y) coordinate
   * @param x (number) the x-parameter of the coordinate
   * @param y (number) the y-parameter of the coordinate
   * @returns (tile) the tile at a specific (x, y) coordinate
   */
  getTile(x, y) {
    if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
      throw Error(`Invalid tile coordinate (${x}, ${y}).`);
    }
    return this.tiles[x][y];
  }
  /**
   * Returns whether or not the grid is empty
   * @returns (boolean) whether or not the grid is empty
   */
  isEmpty() {
    for (let row of this.tiles) {
      for (let tile of row) {
        if (!tile.isEmpty()) {
          return false;
        }
      }
    }
    return true;
  }
  /**
   * Clears the grid's tiles of any and all objects
   */
  clear() {
    this.tiles.forEach(row => row.forEach(tile => tile.clear()));
  }
  /**
   * Draws the objects in each tile onto the grid layout
   * @param context(CanvasRenderingContext2D}
   */
  draw(context) {
    // for (let x = 0; x < 40; x++) {
    //   if (x % 10 === 0) {
    //     context.strokeStyle = '#f0f';
    //   } else {
    //     context.strokeStyle = '#808';
    //   }
    //   context.strokeRect(x * 20, 0, 1, 800);
    // }
    // for (let y = 0; y < 40; y++) {
    //   if (y % 10 === 0) {
    //     context.strokeStyle = '#f0f';
    //   } else {
    //     context.strokeStyle = '#808';
    //   }
    //   context.strokeRect(0, y * 20, 800, 1);
    // }
    this.tiles.forEach(row => row.forEach(tile => {
      tile.draw(context);
    }));
  }
  /**
   * Updates the tiles of the grid per tic
   */
  update() {
    this.tiles.forEach(row => row.forEach(tile => {
      tile.update();
    }));
  }

}