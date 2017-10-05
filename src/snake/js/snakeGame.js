let GRID_NUMBER = 30;
let GRID_SIZE = 30;
let SCORE_PER_FOOD = 500;
let TICKS_PER_SECOND = 10;
let FOOD_LIFE = 10 * TICKS_PER_SECOND;

class SnakeGame extends Game {
  constructor() {
    super();
    this.TICK_PER_SECOND = TICKS_PER_SECOND;

    this.wallSprites = new SpriteGroup();
    this.foodSprites = new SpriteGroup();

    this.score = 0;
    if (!localStorage.getItem('high-score')) {
      localStorage.setItem('high-score', 0);
    }
    this.worm = new Snake(GRID_SIZE);

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
    this.spriteLayer.addDrawable(this.wallSprites);
    this.spriteLayer.addDrawable(this.foodSprites);

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
        this.worm.setPosition(3*GRID_SIZE, 3*GRID_SIZE);
        this.start();
      });

  }

  newLevel() {
    this.wallSprites.clear();

    this.worm.killBody();
    this.worm.setPosition(3*GRID_SIZE, 3*GRID_SIZE);
    this.worm.direction = Direction.RIGHT;

    this.currentLevel++;

    this.buildMap();
    this.canvas.width = GRID_NUMBER * GRID_SIZE;
    this.canvas.height = GRID_NUMBER * GRID_SIZE;
  }

  buildMap() {
    if (this.currentLevel === 0) {
      for (let x = 0; x < GRID_NUMBER; x++) {
        for (let y = 0; y < GRID_NUMBER; y++) {
          if (x === 0 || y === 0 || x === GRID_NUMBER - 1 ||
            y === GRID_NUMBER - 1) {
            let random = Math.floor(Math.random() * 4);
            let wall = new Wall(random);
            wall.bounds.setPosition(x * GRID_SIZE, y * GRID_SIZE);
            this.wallSprites.add(wall);
          }
        }
      }
    } else {
      for (let x = 0; x < GRID_NUMBER; x++) {
        for (let y = 0; y < GRID_NUMBER; y++) {
          let random = Math.floor(Math.random() * 4) + 4;
          if (x === 0 || y === 0 || x === (GRID_NUMBER - 1) ||
            y === (GRID_NUMBER - 1)) {
            let wall = new Wall(random);
            wall.bounds.setPosition(x * GRID_SIZE, y * GRID_SIZE);
            this.wallSprites.add(wall);
          } else if (x > Math.floor(GRID_NUMBER / 3) &&
            x < Math.floor(GRID_NUMBER * 2 / 3) &&
            y === Math.floor((GRID_NUMBER) / 2)) {
            let wall = new Wall(random);
            wall.bounds.setPosition(x * GRID_SIZE, y * GRID_SIZE);
            this.wallSprites.add(wall);
          }
          else if (y > Math.floor(GRID_NUMBER / 3) &&
            y < Math.floor(GRID_NUMBER * 2 / 3) &&
            x === Math.floor((GRID_NUMBER) / 2)) {
            let wall = new Wall(random);
            wall.bounds.setPosition(x * GRID_SIZE, y * GRID_SIZE);
            this.wallSprites.add(wall);
          }
        }
      }
    }

    let food = new Food();
    food.bounds.setPosition(8 * GRID_SIZE, 8 * GRID_SIZE);
    this.foodSprites.add(food);
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
    this.foodSprites.removeSprite(deadFood);
    let food = new Food();
    let position = this.emptyCheck();
    food.bounds.setPosition(position[0], position[1]);
    this.foodSprites.add(food);
  }

  emptyCheck() {
    let position = [
      Math.floor(Math.random() * GRID_NUMBER) * GRID_SIZE,
      Math.floor(Math.random() * GRID_NUMBER) * GRID_SIZE];

    for (let checkWall of this.wallSprites.sprites) {
      if (checkWall.bounds.x === position[0] && checkWall.bounds.y === position[1]) {
        return this.emptyCheck();
      }
    }

    let food = new Food();
    food.bounds.setPosition(position[0], position[1]);
    if (this.worm.isCollision(food)) {
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

    if (this.worm.alive) {
      let foodCollision = this.foodSprites.getOverlap(this.worm.snakeHead);
      let wallCollision = this.wallSprites.getOverlap(this.worm.snakeHead);
      let bodyCollision = this.worm.isBodyCollision();

      for (let food of this.foodSprites.sprites) {
        food.update();
      }

      if (foodCollision) {
        let food = foodCollision.sprite;
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
      } else if (wallCollision || bodyCollision) {
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