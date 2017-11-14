class SnakeGrid extends Grid {

  constructor(width, height) {
    super(width, height);
  }

  addWall(x, y, variant) {
    if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
      throw Error(`Invalid tile coordinate (${x}, ${y}).`);
    }
    this.getTile(x, y).setSprite(0, new Wall(x, y, this, GRID_SIZE, variant));
  }

  addFood(x, y) {
    if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
      throw Error(`Invalid tile coordinate (${x}, ${y}).`);
    }
    this.getTile(x, y).setSprite(1, new Food(x, y, this, GRID_SIZE));
  }

  getWall(x, y) {
    if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
      throw Error(`Invalid tile coordinate (${x}, ${y}).`);
    }
    return this.getTile(x, y).getSprites()[0];
  }

  getFood(x, y) {
    if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
      throw Error(`Invalid tile coordinate (${x}, ${y}).`);
    }
    return this.getTile(x, y).getSprites()[1];
  }

  removeWall(x, y) {
    this.getTile(x, y).setSprite(0, null);
  }

  removeFood(x, y) {
    this.getTile(x, y).setSprite(1, null);
  }

}