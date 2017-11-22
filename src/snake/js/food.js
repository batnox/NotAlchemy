/**
 * Represents the food displayed on the grid
 */
class Food extends Sprite {
  /**
   * Constructor for the food
   * @param gridX the x-coordinate of the game grid's center
   * @param gridY the y-coordinate of the game grid's center
   * @param grid the grid that the food is on
   * @param size the size of the boundary of the food
   */
  constructor(gridX, gridY, grid, size) {
    super();
    this.bounds = new RectangleBounds();
    this.image = new ImageComponent();
    this.image.bounds = this.bounds;
    this.bounds.setSize(size, size);
    this.setPosition(gridX, gridY);
    this.grid = grid;
    this.spoiled = false;
    this.timeLeft = FOOD_LIFE;
  }
  /**
   * Sets whether or not the food is spoiled
   * @param value(boolean)
   */
  set spoiled(value) {
    this._spoiled = value;
    this.image.setImage(this._spoiled ? 'spoiled' : 'food');
  }
  /**
   * Returs the indication that this food is spoiled
   * @returns {*}
   */
  get spoiled() {
    return this._spoiled;
  }
  /**
   * Sets a food's position based on a grid's x and y coordinates
   * @param gridX
   * @param gridY
   */
  setPosition(gridX, gridY) {
    this.gridX = gridX;
    this.gridY = gridY;
    this.bounds.setPosition(gridX * GRID_SIZE, gridY * GRID_SIZE);
  }
  /**
   * Updates the food until the food becomes spoiled
   */
  update() {
    this.timeLeft--;

    if (this.timeLeft === 0) {
      this.spoiled = true;
    }
  }
}