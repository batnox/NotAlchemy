class SnakeCell extends Sprite {
  constructor(head) {
    super();
    this.bounds = new RectangleBounds();
    this.image = new ImageComponent();
    this.image.bounds = this.bounds;
    this.head = head;
    this.nextCell = null;
    this.direction = Direction.RIGHT;
  }

  update() {
    this.image.setImage(this.head ? 'head' : 'body');

    switch (this.direction) {
      case Direction.LEFT:
        this.bounds.rotation = 270;
        break;
      case Direction.RIGHT:
        this.bounds.rotation = 90;
        break;
      case Direction.UP:
        this.bounds.rotation = 0;
        break;
      case Direction.DOWN:
        this.bounds.rotation = 180;
        break;
    }
  }

  draw(context) {
    super.draw(context);
    if (this.nextCell) {
      this.nextCell.draw(context);
    }
  }

  updatePosition(x, y, dir) {
    let prevX = this.bounds.x;
    let prevY = this.bounds.y;
    let prevDir = this.direction;

    this.bounds.x = x;
    this.bounds.y = y;
    this.direction = dir;
    if (this.nextCell) {
      this.nextCell.updatePosition(prevX, prevY, prevDir);
    }
  }
}