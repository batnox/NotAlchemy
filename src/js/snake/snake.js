class Snake {
  constructor(segmentSize) {
    this.cellSize = segmentSize;

    this.snakeHead = new SnakeCell('head', null, 'right');
    this.snakeHead.setSize(segmentSize, segmentSize);
    this.snakeTail = this.snakeHead;
    this.direction = Direction.RIGHT;
    this.alive = true;
    this.bodyImage = null;
  }

  isCollision(sprite) {
    let current = this.snakeHead;
    while (current) {
      if (current.isCollision(sprite)) {
        return true;
      }
      current = current.nextCell;
    }
    return false;
  }

  isBodyCollision() {
    let current = this.snakeHead;
    while (current.nextCell) {
      current = current.nextCell;
      if (current.isCollision(this.snakeHead)) {
        return true;
      }
    }
    return false;
  }

  setPosition(x, y) {
    this.snakeHead.setPosition(x, y);
  }

  update() {
    if (this.alive) {
      this.moveSnake();
    }
  }

  //moves snake
  moveSnake() {
    let dx = 0;
    let dy = 0;
    switch (this.direction) {
      case Direction.LEFT:
        dx = -this.cellSize;
        break;
      case Direction.RIGHT:
        dx = this.cellSize;
        break;
      case Direction.UP:
        dy = -this.cellSize;
        break;
      case Direction.DOWN:
        dy = this.cellSize;
        break;
    }
    this.snakeHead.updatePosition(this.snakeHead.x + dx, this.snakeHead.y + dy, this.direction);
  }

  addLink() {
    let tailX = this.snakeTail.x;
    let tailY = this.snakeTail.y;
    let tailDirection = this.snakeTail.direction;
    if (tailDirection === Direction.RIGHT) {
      tailX = tailX - this.cellSize;
    } else if (tailDirection === Direction.LEFT) {
      tailX = tailX + this.cellSize;
    } else if (tailDirection === Direction.RIGHT) {
      tailY = tailY + this.cellSize;
    } else {
      tailY = tailY - this.cellSize;
    }

    let newCell = new SnakeCell('body', this.snakeTail,
      this.snakeTail.direction);
    newCell.setPosition(tailX, tailY);
    newCell.setSize(this.cellSize, this.cellSize);
    newCell.setImage(this.bodyImage);
    this.snakeTail.nextCell = newCell;
    this.snakeTail = newCell;
    return newCell;
  }

  setHeadImage(headImage) {
    this.snakeHead.setImage(headImage);
  }

  setBodyImage(bodyImage) {
    let current = this.snakeHead.nextCell;
    while (current) {
      current.setImage(bodyImage);
      current = current.nextCell;
    }
  }

  draw(context) {
    this.snakeHead.draw(context);
  }

}