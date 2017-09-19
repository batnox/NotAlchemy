class Wall extends Sprite {
  constructor(variant) {
    super();
    this.setSize(GRID_SIZE, GRID_SIZE);
    this.variant = variant;
  }

  set variant(value) {
    this._variant = value;
    this.setImage('wall-' + this._variant)
  }
}