class Food extends Sprite {
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

  set spoiled(value) {
    this._spoiled = value;
    this.image.setImage(this._spoiled ? 'spoiled' : 'food');
  }

  get spoiled() {
    return this._spoiled;
  }

  setPosition(gridX, gridY) {
    this.gridX = gridX;
    this.gridY = gridY;
    this.bounds.setPosition(gridX * GRID_SIZE, gridY * GRID_SIZE);
  }

  update() {
    this.timeLeft--;

    if (this.timeLeft === 0) {
      this.spoiled = true;
    }
  }
}