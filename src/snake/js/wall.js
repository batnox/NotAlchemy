class Wall extends Sprite {
  constructor(variant) {
    super();
    this.bounds = new RectangleBounds();
    this.image = new ImageComponent();
    this.image.bounds = this.bounds;
    this.bounds.setSize(GRID_SIZE, GRID_SIZE);
    this.variant = variant;
  }

  set variant(value) {
    this._variant = value;
    this.image.setImage('wall-' + this._variant)
  }
}