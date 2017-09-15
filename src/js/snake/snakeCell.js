class SnakeCell extends Sprite {
  constructor() {
    super();
    this.nextCell = null;
    this.direction = Direction.RIGHT;

  }

  setNextCell(nextCell) {
    this.nextCell = nextCell;
  }

  draw(context) {
    super.draw(context);
    context.fillStyle = '#f0f';
    context.fillRect(this.x, this.y, this.width, this.height);
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