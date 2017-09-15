class Snake {
  constructor(segmentSize) {
    this.cellSize = segmentSize;

    this.snakeHead = new SnakeCell('head', null, 'right');
    this.snakeHead.setPosition(this.x, this.y);
    this.snakeHead.setSize(segmentSize, segmentSize);
    this.snakeTail = this.snakeHead;
    this.direction = Direction.RIGHT;
    this.alive = true;
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
    this.snakeHead.setPosition(this.snakeHead.x + dx, this.snakeHead.y + dy);

    if (this.direction !== this.snakeHead.relativeDirection) {
      this.snakeHead.setRotation(90);
    }
    let temp = this.snakeHead.nextCell;
    while (temp !== null) {
      temp.setPosition(temp.previousCell.x, temp.previousCell.y);
      if (temp.previousCell.isRotated) {
        temp.setRotation(90);
        temp.rotationStatus(true);
        temp.previousCell.rotationStatus(false);
      }
      temp = temp.nextCell;
    }
  }

  addLink() {
    let tailX = this.snakeTail.x;
    let tailY = this.snakeTail.y;
    let tailDirection = this.snakeTail.relativeDirection;
    if (tailDirection === 'right') {
      tailX = tailX - this.cellSize;
    }
    else if (tailDirection === 'left') {
      tailX = tailX + this.cellSize;
    }
    else if (tailDirection === 'up') {
      tailY = tailY + this.cellSize;
    }
    else {
      tailY = tailY - this.cellSize;
    }

    let newCell = new SnakeCell(body, this.snakeTail, this.snakeTail.direction);
    newCell.setPosition(tailX, tailY);
    this.snakeTail.setNextCell(newCell);
    this.setBodyImage(this.snakeTail);
    this.snakeTail = newCell;
    return newCell;

  }

  setBodyImage(currentCell) {
    currentCell.setImage(data['images'].snakes[1].img);
  }

  draw(context) {
    this.snakeHead.draw(context);
  }

}