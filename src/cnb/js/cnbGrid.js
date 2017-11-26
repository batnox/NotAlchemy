class CnbGrid extends Grid {

  constructor(width, height, map, robber, cops) {
    super(width, height);
    this.map = map;
    this.robber = robber;
    this.cops = cops;
  }

  addTile(x, y, image) {
    if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
      throw Error(`Invalid tile coordinate (${x}, ${y}).`);
    }
    let sprite = new Sprite();
    sprite.bounds = new RectangleBounds();
    sprite.bounds.setPosition(x * CNB_GRID_SIZE, y * CNB_GRID_SIZE);
    sprite.bounds.setSize(CNB_GRID_SIZE, CNB_GRID_SIZE);
    sprite.image = new ImageComponent();
    sprite.image.setImage(image);
    sprite.image.bounds = sprite.bounds;
    this.getTile(x, y).setSprite(0, sprite);
  }

  addWall(x, y, variant) {
    if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
      throw Error(`Invalid tile coordinate (${x}, ${y}).`);
    }
    this.getTile(x, y)
      .setSprite(0, new Wall(x, y, this, CNB_GRID_SIZE, variant));
  }

  removeTile(x, y) {
    this.getTile(x, y).setSprite(0, null);
  }

  getNeighbors(x, y, opponent) {
    let neighbor = [];
    //LEFT
    if (x - 1 > 0 && (this.map[x - 1][y] === 0 || this.map[x - 1][y] === 6 ||
        this.map[x - 1][y] === 2 || this.map[x - 1][y] === 7)) {
      let overlap = false;
      for (let op of opponent) {
        if (op.gridX === x - 1 && op.gridY === y)
          overlap = true;
      }
      if (!overlap) {
        neighbor.push({
          tile: this.getTile(x - 1, y),
          direction: Direction.LEFT
        });
      }
    }
    //RIGHT
    if (x + 1 < this.map[0].length &&
      (this.map[x + 1][y] === 0 || this.map[x + 1][y] === 6 ||
        this.map[x + 1][y] === 4 || this.map[x + 1][y] === 7)) {
      let overlap = false;
      for (let op of opponent) {
        if (op.gridX === x + 1 && op.gridY === y)
          overlap = true;
      }
      if (!overlap) {
        neighbor.push({
          tile: this.getTile(x + 1, y),
          direction: Direction.RIGHT
        });
      }
    }
    //UP
    if (y - 1 > 0 && (this.map[x][y - 1] === 0 || this.map[x][y - 1] === 6 ||
        this.map[x][y - 1] === 3 || this.map[x][y - 1] === 7)) {
      let overlap = false;
      for (let op of opponent) {
        if (op.gridX === x && op.gridY === y - 1)
          overlap = true;
      }
      if (!overlap) {
        neighbor.push({
          tile: this.getTile(x, y - 1),
          direction: Direction.UP
        });
      }
    }
    //DOWN
    if (y + 1 < this.map.length &&
      (this.map[x][y + 1] === 0 || this.map[x][y + 1] === 6 ||
        this.map[x][y + 1] === 5 || this.map[x][y + 1] === 7)) {
      let overlap = false;
      for (let op of opponent) {
        if (op.gridX === x && op.gridY === y + 1)
          overlap = true;
      }
      if (!overlap) {
        neighbor.push({
          tile: this.getTile(x, y + 1),
          direction: Direction.DOWN
        });
      }
    }

    return neighbor;
  }

}

