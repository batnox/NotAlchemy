let GRID_NUMBER = 30;
let GRID_SIZE = 30;
let SCORE_PER_FOOD = 500;
let TICKS_PER_SECOND = 10;
let FOOD_LIFE = 10 * TICKS_PER_SECOND;

class SnakeGame extends Game {
  constructor() {
    super();
    this.TICK_PER_SECOND = TICKS_PER_SECOND;

    // this.wallSprites = new SpriteGroup();
    // this.foodSprites = new SpriteGroup();
    this.grid = new SnakeGrid(GRID_NUMBER, GRID_NUMBER);

    this.score = 0;
    if (!localStorage.getItem('high-score')) {
      localStorage.setItem('high-score', 0);
    }
    this.worm = new Snake(3, 3, this.grid, GRID_SIZE);

    /**
     * Determines the direction that the Snake will go
     */
    addEventListener('keydown', event => this.onKeyDown(event));
    this.addContent('images', 'snake/json/snake_elements.json');

    this.currentLevel = 0; // 0 and 1
    this.maximumLevel = 1;
    this.condition = [500];//condition for go to next level

    this.canvas.width = GRID_NUMBER * GRID_SIZE;
    this.canvas.height = GRID_NUMBER * GRID_SIZE;

    this.spriteLayer.addDrawable(this.worm);
    this.spriteLayer.addDrawable(this.grid);
    // this.spriteLayer.addDrawable(this.wallSprites);
    // this.spriteLayer.addDrawable(this.foodSprites);

    this.scoreDisplay = new TextDisplay(GRID_SIZE, this.canvas.height -
      18, this.canvas.width - GRID_SIZE / 2);
    this.scoreDisplay.fontSize = 14;
    this.scoreDisplay.fontName = 'Courier';
    this.scoreDisplay.fontColor = '#fff';
    this.scoreDisplay.text = `Score: ${this.score}`;
    this.overlayLayer.addDrawable(this.scoreDisplay);

    this.highScoreDisplay = new TextDisplay(this.canvas.width /
      2, this.canvas.height -
      18, this.canvas.width / 2 - GRID_SIZE);
    this.highScoreDisplay.fontSize = 14;
    this.highScoreDisplay.fontName = 'Courier';
    this.highScoreDisplay.fontColor = '#fff';
    this.highScoreDisplay.text = `High Score: ${this.score}`;
    this.overlayLayer.addDrawable(this.highScoreDisplay);

    this.gameOver = new TextDisplay(GRID_SIZE * 2, GRID_SIZE * 2,
      this.canvas.width);
    this.gameOver.fontName = 'Courier';
    this.gameOver.fontSize = 32;
    this.gameOver.fontColor = '#fff';

    this.loadContent()
      .then(() => {
        this.buildMap();
        this.start();
      });

  }

  newLevel() {
    this.grid.clear();

    this.worm.killBody();
    this.worm.setPosition(3, 3);
    this.worm.direction = Direction.RIGHT;

    this.currentLevel++;

    this.buildMap();
    this.canvas.width = GRID_NUMBER * GRID_SIZE;
    this.canvas.height = GRID_NUMBER * GRID_SIZE;
  }

  buildMap() {
    let tmpMap = sampleMaps.getMap(this.currentLevel+3);
    for (let x = 0; x < tmpMap.length; x++){
      for (let y = 0; y < tmpMap[x].length; y++){
        if (tmpMap[x][y] === 1){
            let random = 0;
            if(this.currentLevel === 0)
                random = Math.floor(Math.random() * 4);
            else
                random = Math.floor(Math.random() * 4) + 4;
            this.grid.addWall(x, y, random);
        }
      }
    }

    /*
    if (this.currentLevel === 0) {
      for (let x = 0; x < GRID_NUMBER; x++) {
        for (let y = 0; y < GRID_NUMBER; y++) {
          if (x === 0 || y === 0 || x === GRID_NUMBER - 1 ||
            y === GRID_NUMBER - 1) {
            let random = Math.floor(Math.random() * 4);
            this.grid.addWall(x, y, random);
          }
        }
      }
    } else {
      for (let x = 0; x < GRID_NUMBER; x++) {
        for (let y = 0; y < GRID_NUMBER; y++) {
          let random = Math.floor(Math.random() * 4) + 4;
          if (x === 0 || y === 0 || x === (GRID_NUMBER - 1) ||
            y === (GRID_NUMBER - 1)) {
            this.grid.addWall(x, y, random);
          } else if (x > Math.floor(GRID_NUMBER / 3) &&
            x < Math.floor(GRID_NUMBER * 2 / 3) &&
            y === Math.floor((GRID_NUMBER) / 2)) {
            this.grid.addWall(x, y, random);
          }
          else if (y > Math.floor(GRID_NUMBER / 3) &&
            y < Math.floor(GRID_NUMBER * 2 / 3) &&
            x === Math.floor((GRID_NUMBER) / 2)) {
            this.grid.addWall(x, y, random);
          }
        }
      }
    }
    */

    this.grid.addFood(8, 8);
  }

  loadContent() {
    return new Promise((resolve, reject) => {
      super.loadContent()
        .then(data => {
          imageManager.addImage('head', data['images'].snake.head);
          imageManager.addImage('body', data['images'].snake.body);
          imageManager.addImage('wall-0', data['images'].walls[0][0]);
          imageManager.addImage('wall-1', data['images'].walls[0][1]);
          imageManager.addImage('wall-2', data['images'].walls[0][2]);
          imageManager.addImage('wall-3', data['images'].walls[0][3]);
          imageManager.addImage('wall-4', data['images'].walls[1][0]);
          imageManager.addImage('wall-5', data['images'].walls[1][1]);
          imageManager.addImage('wall-6', data['images'].walls[1][2]);
          imageManager.addImage('wall-7', data['images'].walls[1][3]);
          imageManager.addImage('food', data['images'].food.normal);
          imageManager.addImage('spoiled', data['images'].food.spoiled);
          resolve();
        });
    });
  }

  replaceFood(deadFood) {
    this.grid.removeFood(deadFood.gridX, deadFood.gridY);
    let position = this.emptyCheck();
    this.grid.addFood(position[0], position[1]);
  }

  emptyCheck() {
    let position = [
      Math.floor(Math.random() * GRID_NUMBER),
      Math.floor(Math.random() * GRID_NUMBER)];

    if (this.grid.getWall(position[0], position[1])) {
      return this.emptyCheck();
    }

    if (this.worm.isCollision(position[0], position[1])) {
      return this.emptyCheck();
    }
    return position;
  }

  /**
   * Handles changing the snake's direction based on user input.
   */
  onKeyDown(event) {
    'use strict';
    switch (event.keyCode) {
      case 37: // Left
        this.worm.direction = Direction.LEFT;
        break;
      case 38: // Up
        this.worm.direction = Direction.UP;
        break;
      case 39: // Right
        this.worm.direction = Direction.RIGHT;
        break;
      case 40: // Down
        this.worm.direction = Direction.DOWN;
        break;
    }
  }

  update() {
    super.update();
    this.worm.update();
    this.grid.update();

    if (this.worm.alive) {
      let head = this.worm.snakeHead;
      let food = this.grid.getFood(head.gridX, head.gridY);
      let wall = this.grid.getWall(head.gridX, head.gridY);
      let bodyCollision = this.worm.isBodyCollision();

      if (food) {
        if (food.spoiled) {
          this.score -= SCORE_PER_FOOD;
          this.worm.removeLink();
        } else {
          this.score += SCORE_PER_FOOD;
          this.worm.addLink();
        }
        this.replaceFood(food);
        if (this.currentLevel < this.maximumLevel &&
          this.score >= this.condition[this.currentLevel]) {
          this.newLevel();
        }
      } else if (wall || bodyCollision) {
        this.worm.alive = false;
      }
    } else if (!this.gameOver.text) {
      this.gameOver.text = 'Game Over';
      this.overlayLayer.addDrawable(this.gameOver);
    }

    this.scoreDisplay.text = `Score: ${this.score}`;

    let highScore = localStorage.getItem('high-score');
    if (this.score > highScore) {
      highScore = this.score;
      localStorage.setItem('high-score', this.score);
    }
    this.highScoreDisplay.text = `High Score: ${highScore}`;
  }

  draw() {
    super.draw();
  }
}