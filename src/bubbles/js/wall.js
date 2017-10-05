class BubblesWall extends Sprite {
  constructor(x, y, width, height) {
    super();
    this.bounds = new RectangleBounds();
    this.image = new ImageComponent();
    this.image.bounds = this.bounds;
    this.bounds.setPosition(x, y);
    this.bounds.setSize(width, height);
    this.image.setImage('stone-wall');
  }
}