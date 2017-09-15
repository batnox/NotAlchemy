class SnakeSegment {
  constructor() {
    this.snakeHead = new SnakeCell('head', null, 'right');
    this.snakeTail = this.snakeHead;
    this.snakeHead.setPosition(50, 50);
    this.snakeHead.setSize(20, 20);
  }

  //moves snake
  moveSnake(direction, stepsize) {
    // if (direction === 'right') {
    //   this.snakeHead.setPosition(this.snakeHead.x + stepsize, this.snakeHead.y);
    //   // direction = 'left';
    // }
    // else if (direction === 'left') {
    //   this.snakeHead.setPosition(this.snakeHead.x - stepsize, this.snakeHead.y);
    //   // direction = 'right';
    // }
    // else if (direction === 'up') {
    //   this.snakeHead.setPosition(this.snakeHead.x, this.snakeHead.y - stepsize);
    //   // direction = 'down';
    // }
    // else if (direction === 'down') {
    //   this.snakeHead.setPosition(this.snakeHead.x, this.snakeHead.y + stepsize);
    //   // direction = 'up';
    // }

    if (direction !== this.snakeHead.relativeDirection) {
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

  addlink(stepsize) {
    let tailx = this.snakeTail.x;
    let taily = this.snakeTail.y;
    let tailDirection = this.snakeTail.relativeDirection;
    if (tailDirection === 'right') {
      tailx = tailx - stepsize;
    }
    else if (tailDirection === 'left') {
      tailx = tailx + stepsize;
    }
    else if (tailDirection === 'up') {
      taily = taily + stepsize;
    }
    else {
      taily = taily - stepsize;
    }

    let newCell = new SnakeCell(body, this.snakeTail, this.snakeTail.direction);
    newCell.setPosition(tailx, taily);
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