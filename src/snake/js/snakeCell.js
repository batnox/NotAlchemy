class SnakeCell extends Sprite {
  constructor(gridX, gridY, grid, head, type) {
    super();
    this.type = type;
    this.bounds = new RectangleBounds();
    this.bounds.setPosition(gridX * GRID_SIZE, gridY * GRID_SIZE);
    this.bounds.setSize(GRID_SIZE, GRID_SIZE);
    this.image = new ImageComponent();
    this.image.bounds = this.bounds;

    this.setPosition(gridX, gridY);
    this.grid = grid;
    this.head = head;
    this.nextCell = null;
    this.direction = Direction.RIGHT;
  }

  update() {
    switch (this.type) {
      case SnakeType.RED:
        this.image.setImage(this.head ? 'head-red' : 'body-red');
        break;
      case SnakeType.BLUE:
        this.image.setImage(this.head ? 'head-blue' : 'body-blue');
        break;
    }

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

  setPosition(x, y) {
    this.gridX = x;
    this.gridY = y;
    this.bounds.setPosition(x * GRID_SIZE, y * GRID_SIZE);
  }

  updatePosition(x, y, dir) {
    let prevX = this.gridX;
    let prevY = this.gridY;
    let prevDir = this.direction;

    this.setPosition(x, y);
    this.direction = dir;
    if (this.nextCell) {
      this.nextCell.updatePosition(prevX, prevY, prevDir);
    }
  }
}