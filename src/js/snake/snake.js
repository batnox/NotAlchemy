class Snake {
  constructor(segmentSize) {
    this.cellSize = segmentSize;

    this.snakeHead = new SnakeCell('head', null, 'right');
    this.snakeHead.setPosition(this.x, this.y);
    this.snakeHead.setSize(segmentSize, segmentSize);
    this.snakeTail = this.snakeHead;
    this.direction = Direction.RIGHT;
    this.alive = true;
    this.bodyImage = null;
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

    this.snakeHead.updatePosition(this.snakeHead.x + dx, this.snakeHead.y + dy);
    // if (this.direction !== this.snakeHead.relativeDirection) {
    //   this.snakeHead.setRotation(90);
    // }
    // let current = this.snakeHead.nextCell;
    // while (current !== null) {
    //   previous.x = current.x;
    //   previous.y = current.y;
    //   current.setPosition(current.previousCell.x, current.previousCell.y);
      // if (current.previousCell.isRotated) {
        // current.setRotation(90);
        // current.rotationStatus(true);
        // current.previousCell.rotationStatus(false);
      // }
      // current = current.nextCell;
    // }
  }

  addLink() {
    console.log('Add Link');
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

    console.log(`H (${this.snakeHead.x}, ${this.snakeHead.y})`);
    console.log(`T (${tailX}, ${tailY})`);
    let newCell = new SnakeCell('body', this.snakeTail, this.snakeTail.direction);
    newCell.setPosition(tailX, tailY);
    newCell.setSize(this.cellSize, this.cellSize);
    newCell.setImage(this.bodyImage);
    this.snakeTail.setNextCell(newCell);
    this.snakeTail = newCell;
    return newCell;
  }

  setBodyImage(bodyImage) {
    this.bodyImage = bodyImage;
  }

  draw(context) {
    this.snakeHead.draw(context);
  }

}