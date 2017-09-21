class SnakeCell extends Sprite {
  constructor(head) {
    super();
    this.head = head;
    this.nextCell = null;
    this.direction = Direction.RIGHT;
  }

  update() {
    this.setImage(this.head ? 'head' : 'body');

    switch (this.direction) {
      case Direction.LEFT:
        this.rotation = 270;
        break;
      case Direction.RIGHT:
        this.rotation = 90;
        break;
      case Direction.UP:
        this.rotation = 0;
        break;
      case Direction.DOWN:
        this.rotation = 180;
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
    let prevX = this.x;
    let prevY = this.y;
    let prevDir = this.direction;

    this.x = x;
    this.y = y;
    this.direction = dir;
    if (this.nextCell) {
      this.nextCell.updatePosition(prevX, prevY, prevDir);
    }
  }
}