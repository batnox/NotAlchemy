class Wall extends Sprite {
  constructor(gridX, gridY, grid, size, variant) {
    super();
    this.bounds = new RectangleBounds();
    this.bounds.setPosition(gridX * size, gridY * size);
    this.image = new ImageComponent();
    this.image.bounds = this.bounds;
    this.bounds.setSize(size, size);
    this.variant = variant;
  }

  set variant(value) {
    this._variant = value;
    this.image.setImage('wall-' + this._variant)
  }
}