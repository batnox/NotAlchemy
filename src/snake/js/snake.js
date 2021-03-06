class Snake {
  constructor(gridX, gridY, grid, segmentSize, type) {
    this.cellSize = segmentSize;
    this.type = type;

    this.snakeHead = new SnakeCell(gridX, gridY, grid, true, type);
    this.snakeTail = this.snakeHead;
    this.direction = Direction.RIGHT;
    this.alive = true;
    this.bodyImage = null;
    this.score = 0;
  }

  isCollision(gridX, gridY) {
    let current = this.snakeHead;
    while (current) {
      if (current.gridX === gridX || current.gridY === gridY) {
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
      if (current.bounds.isCollision(this.snakeHead)) {
        return true;
      }
    }
    return false;
  }

  isSnakeCollision(otherHead) {
      let current = this.snakeHead;
      while (current) {
          if (current.bounds.isCollision(otherHead)) {
              return true;
          }
          current = current.nextCell;
      }
      return false;
  }

  setPosition(x, y) {
    this.snakeHead.setPosition(x, y);
  }

  update() {
    if (this.alive) {
      this.moveSnake();
      let current = this.snakeHead;
      while (current) {
        current.update();
        current = current.nextCell;
      }
    }
  }

  //moves snake
  moveSnake() {
    let dx = 0;
    let dy = 0;
    switch (this.direction) {
      case Direction.LEFT:
        dx = -1;
        break;
      case Direction.RIGHT:
        dx = 1;
        break;
      case Direction.UP:
        dy = -1;
        break;
      case Direction.DOWN:
        dy = 1;
        break;
    }
    this.snakeHead.updatePosition(
      Number.parseInt(this.snakeHead.gridX) + dx,
      Number.parseInt(this.snakeHead.gridY) + dy,
      this.direction
    );
  }

  addLink() {
    let tailX = this.snakeTail.gridX;
    let tailY = this.snakeTail.gridY;
    let tailDirection = this.snakeTail.direction;
    if (tailDirection === Direction.RIGHT) {
      tailX--;
    } else if (tailDirection === Direction.LEFT) {
      tailX++;
    } else if (tailDirection === Direction.RIGHT) {
      tailY++;
    } else {
      tailY--;
    }

    let newCell = new SnakeCell(tailX, tailY, this.snakeHead.grid, false, this.type);
    this.snakeTail.nextCell = newCell;
    this.snakeTail = newCell;
    return newCell;
  }

  removeLink() {
    if (this.snakeHead === this.snakeTail) {
      this.alive = false;
      return;
    }

    let current = this.snakeHead;
    while (current) {
      if (current.nextCell === this.snakeTail) {
        current.nextCell = null;
        this.snakeTail = current;
        return;
      }
      current = current.nextCell;
    }
  }

  killBody() {
    this.snakeHead.nextCell = null;
    this.snakeTail = this.snakeHead;
  }

  addScore(scoreToAdd){
    this.score = this.score + scoreToAdd;
  }

  getScore(){
    return this.score;
  }

  draw(context) {
    this.snakeHead.draw(context);
  }

}