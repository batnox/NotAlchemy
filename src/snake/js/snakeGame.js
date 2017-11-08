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
    this.worm1 = new Snake(GRID_SIZE);
    this.worm2 = new Snake(GRID_SIZE);
    // this.worm_2= new Snake(GRID_SIZE);

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

    this.spriteLayer.addDrawable(this.worm1);
    this.spriteLayer.addDrawable(this.worm2);
    this.spriteLayer.addDrawable(this.wallSprites);
    this.spriteLayer.addDrawable(this.foodSprites);

    this.scoreDisplay = new TextDisplay(GRID_SIZE, this.canvas.height -
      18, this.canvas.width - GRID_SIZE / 2);
    this.scoreDisplay.fontSize = 14;
    this.scoreDisplay.fontName = 'Courier';
    this.scoreDisplay.fontColor = '#fff';
    this.scoreDisplay.text = `Score: ${this.worm1.getScore()}`;
    this.overlayLayer.addDrawable(this.scoreDisplay);

    this.highScoreDisplay = new TextDisplay(this.canvas.width /
      2, this.canvas.height -
      18, this.canvas.width / 2 - GRID_SIZE);
    this.highScoreDisplay.fontSize = 14;
    this.highScoreDisplay.fontName = 'Courier';
    this.highScoreDisplay.fontColor = '#fff';
    this.highScoreDisplay.text = `High Score: ${this.worm1.getScore()}`;
    this.overlayLayer.addDrawable(this.highScoreDisplay);

    this.gameOver = new TextDisplay(GRID_SIZE * 2, GRID_SIZE * 2,
      this.canvas.width);
    this.gameOver.fontName = 'Courier';
    this.gameOver.fontSize = 32;
    this.gameOver.fontColor = '#fff';

    this.loadContent()
      .then(() => {
        this.buildMap();
        this.worm1.setPosition(3 * GRID_SIZE, 3 * GRID_SIZE);
        this.worm2.setPosition(9 * GRID_SIZE, 3 * GRID_SIZE);
        this.start();
      });

  }

  newLevel() {
    this.wallSprites.clear();

    this.worm1.killBody();
    this.worm1.setPosition(3 * GRID_SIZE, 3 * GRID_SIZE);
    this.worm1.direction = Direction.RIGHT;

    this.worm2.killBody();
    this.worm2.setPosition(9 * GRID_SIZE, 3 * GRID_SIZE);
    this.worm2.direction = Direction.LEFT;

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
      if (checkWall.bounds.x === position[0] &&
        checkWall.bounds.y === position[1]) {
        return this.emptyCheck();
      }
    }

    let food = new Food();
    food.bounds.setPosition(position[0], position[1]);
    if (this.worm1.isCollision(food) || this.worm2.isCollision(food)) {
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
        this.worm1.direction = Direction.LEFT;
        break;
      case 38: // Up
        this.worm1.direction = Direction.UP;
        break;
      case 39: // Right
        this.worm1.direction = Direction.RIGHT;
        break;
      case 40: // Down
        this.worm1.direction = Direction.DOWN;
        break;
    }
  }

  update() {
    super.update();
    this.worm1.update();
    this.worm2.update();
    for (let tempworm of [this.worm1, this.worm2]) {
      if (tempworm.alive) {
        let foodCollision = this.foodSprites.getOverlap(tempworm.snakeHead);
        let wallCollision = this.wallSprites.getOverlap(tempworm.snakeHead);
        let bodyCollision = tempworm.isBodyCollision();
        let otherSnakeCollision = false;
        // console.log(Object.is(tempworm,  this.worm1));
        if(Object.is(tempworm,  this.worm1)) {
            otherSnakeCollision = this.worm2.isSnakeCollision(this.worm1.snakeHead);
            // console.log(otherSnakeCollision);
        }
        else {
            otherSnakeCollision = this.worm1.isSnakeCollision(tempworm.snakeHead);
        }


        for (let food of this.foodSprites.sprites) {
          food.update();
        }

        if (foodCollision) {
          let food = foodCollision.sprite;
          if (food.spoiled) {
            tempworm.score -= SCORE_PER_FOOD;
            tempworm.removeLink();
          } else {
            tempworm.score += SCORE_PER_FOOD;
            tempworm.addLink();
          }
          this.replaceFood(food);
          if (this.currentLevel < this.maximumLevel &&
            tempworm.score >= this.condition[this.currentLevel]) {
            this.newLevel();
          }
        } else if (wallCollision || bodyCollision || otherSnakeCollision) {
          tempworm.alive = false;
        }
      } else if (!this.gameOver.text) {
        this.gameOver.text = 'Game Over';
        this.overlayLayer.addDrawable(this.gameOver);
      }
    }

    this.scoreDisplay.text = `Score: ${this.worm1.getScore()}`;

    let highScore = localStorage.getItem('high-score');
    if (this.worm1.getScore() > highScore) {
      highScore = this.worm1.getScore();
      localStorage.setItem('high-score', this.worm1.getScore());
    }
    this.highScoreDisplay.text = `High Score: ${highScore}`;
  }

  draw() {
    super.draw();
  }
}