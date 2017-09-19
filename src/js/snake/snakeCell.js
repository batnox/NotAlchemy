class SnakeCell extends Sprite {
  constructor() {
    super();
    this.nextCell = null;
    this.direction = Direction.RIGHT;
  }

  update() {
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
    // context.fillStyle = '#f0f';
    // context.fillRect(this.x, this.y, this.width, this.height);
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