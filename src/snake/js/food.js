class Food extends Sprite {
  constructor() {
    super();
    this.setSize(GRID_SIZE, GRID_SIZE);
    this.spoiled = false;
    this.timeLeft = FOOD_LIFE;
  }

  set spoiled(value) {
    this._spoiled = value;
    this.setImage(this._spoiled ? 'spoiled' : 'food');
  }

  get spoiled() {
    return this._spoiled;
  }

  update() {
    this.timeLeft--;

    if (this.timeLeft === 0) {
      this.spoiled = true;
    }
  }
}