class SnakeGame extends Game {
  constructor() {
    super();
    this.TICK_PER_SECOND = 10;
    this.GRID_NUMBER = 30;
    this.GRID_SIZE = 20;
    //this.STEP_SIZE = 30;

    this.wallSprites = new SpriteGroup();
    this.foodSprites = new SpriteGroup();
    this.spoiledSprites = new SpriteGroup();

    this.score = 0;
    if (!localStorage.getItem('high-score')) {
      localStorage.setItem('high-score', 0);
    }
    this.worm = new Snake(this.GRID_SIZE);

    /**
     * Determines the direction that the Snake will go
     */
    addEventListener('keydown', event => this.onKeyDown(event));
    this.addContent('images', 'snake/json/snake_elements.json');

    this.currentLevel = 0; // 0 and 1
    this.maximumLevel = 1;
    this.condition = [500];//condition for go to next level

    this.canvas.width = this.GRID_NUMBER * this.GRID_SIZE;
    this.canvas.height = this.GRID_NUMBER * this.GRID_SIZE;

    this.spriteLayer.addDrawable(this.worm);
    this.spriteLayer.addDrawable(this.wallSprites);
    this.spriteLayer.addDrawable(this.foodSprites);

    this.scoreDisplay = new TextDisplay(this.GRID_SIZE, this.canvas.height -
      18, this.canvas.width - this.GRID_SIZE / 2);
    this.scoreDisplay.fontSize = 14;
    this.scoreDisplay.fontName = 'Courier';
    this.scoreDisplay.fontColor = '#fff';
    this.scoreDisplay.text = `Score: ${this.score}`;
    this.overlayLayer.addDrawable(this.scoreDisplay);

    this.highScoreDisplay = new TextDisplay(this.canvas.width /
      2, this.canvas.height -
      18, this.canvas.width / 2 - this.GRID_SIZE);
    this.highScoreDisplay.fontSize = 14;
    this.highScoreDisplay.fontName = 'Courier';
    this.highScoreDisplay.fontColor = '#fff';
    this.highScoreDisplay.text = `High Score: ${this.score}`;
    this.overlayLayer.addDrawable(this.highScoreDisplay);

    this.loadContent()
      .then(() => {
        this.buildMap();
        this.worm.setPosition(60, 60);
        this.start();
      });

  }

  newLevel() {
    this.wallSprites.clear();

    this.worm.killBody();
    this.worm.setPosition(60, 60);
    this.worm.direction = Direction.RIGHT;

    this.currentLevel++;

    this.buildMap();
    this.canvas.width = this.GRID_NUMBER * this.GRID_SIZE;
    this.canvas.height = this.GRID_NUMBER * this.GRID_SIZE;
  }

  buildMap() {
    if (this.currentLevel === 0) {
      for (let x = 0; x < this.GRID_NUMBER; x++) {
        for (let y = 0; y < this.GRID_NUMBER; y++) {
          if (x === 0 || y === 0 || x === this.GRID_NUMBER - 1 ||
            y === this.GRID_NUMBER - 1) {
            let random = Math.floor(Math.random() * 4);
            let wall = new Sprite();
            wall.setImage('wall-0-' + random);
            wall.setSize(this.GRID_SIZE, this.GRID_SIZE);
            wall.setPosition(x * this.GRID_SIZE, y * this.GRID_SIZE);
            this.wallSprites.add(wall);
          }
        }
      }
    } else {
      for (let x = 0; x < this.GRID_NUMBER; x++) {
        for (let y = 0; y < this.GRID_NUMBER; y++) {
          if (x === 0 || y === 0 || x === (this.GRID_NUMBER - 1) ||
            y === (this.GRID_NUMBER - 1)) {
            let random = Math.floor(Math.random() * 4);
            let wall = new Sprite();
            wall.setImage('wall-1-' + random);
            wall.setSize(this.GRID_SIZE, this.GRID_SIZE);
            wall.setPosition(x * this.GRID_SIZE, y * this.GRID_SIZE);
            this.wallSprites.add(wall);
          } else if (x > Math.floor(this.GRID_NUMBER / 3) &&
            x < Math.floor(this.GRID_NUMBER * 2 / 3) &&
            y === Math.floor((this.GRID_NUMBER) / 2)) {
            let random = Math.floor(Math.random() * 4);
            let wall = new Sprite();
            wall.setImage('wall-1-' + random);
            wall.setSize(this.GRID_SIZE, this.GRID_SIZE);
            wall.setPosition(x * this.GRID_SIZE, y * this.GRID_SIZE);
            this.wallSprites.add(wall);
          }
          else if (y > Math.floor(this.GRID_NUMBER / 3) &&
            y < Math.floor(this.GRID_NUMBER * 2 / 3) &&
            x === Math.floor((this.GRID_NUMBER) / 2)) {
            let random = Math.floor(Math.random() * 4);
            let wall = new Sprite();
            wall.setImage('wall-1-' + random);
            wall.setSize(this.GRID_SIZE, this.GRID_SIZE);
            wall.setPosition(x * this.GRID_SIZE, y * this.GRID_SIZE);
            this.wallSprites.add(wall);
          }
        }
      }
    }

    let food = new Sprite();
    food.setImage('food');
    food.setSize(this.GRID_SIZE, this.GRID_SIZE);
    food.setPosition(8 * this.GRID_SIZE, 8 * this.GRID_SIZE);
    this.foodSprites.add(food);
  }

  loadContent() {
    return new Promise((resolve, reject) => {
      super.loadContent()
        .then(data => {
          imageManager.addImage('head', data['images'].snake.head);
          imageManager.addImage('body', data['images'].snake.body);
          imageManager.addImage('wall-0-0', data['images'].walls[0][0]);
          imageManager.addImage('wall-0-1', data['images'].walls[0][1]);
          imageManager.addImage('wall-0-2', data['images'].walls[0][2]);
          imageManager.addImage('wall-0-3', data['images'].walls[0][3]);
          imageManager.addImage('wall-1-0', data['images'].walls[1][0]);
          imageManager.addImage('wall-1-1', data['images'].walls[1][1]);
          imageManager.addImage('wall-1-2', data['images'].walls[1][2]);
          imageManager.addImage('wall-1-3', data['images'].walls[1][3]);
          imageManager.addImage('food', data['images'].food.normal);
          imageManager.addImage('spoiled', data['images'].food.spoiled);
          resolve();
        });
    });
  }

  replaceFood() {
    this.foodSprites.removeIndex(0);
    let food = new Sprite();
    let position = this.emptyCheck();
    food.setImage('food');
    food.setSize(this.GRID_SIZE, this.GRID_SIZE);
    food.setPosition(position[0], position[1]);
    this.foodSprites.add(food);
  }

  emptyCheck() {
    let position = [
      Math.floor(Math.random() * this.GRID_NUMBER) * this.GRID_SIZE,
      Math.floor(Math.random() * this.GRID_NUMBER) * this.GRID_SIZE];

    for (let checkWall of this.wallSprites.sprites) {
      if (checkWall.x === position[0] && checkWall.y === position[1]) {
        return this.emptyCheck();
      }
    }

    let sprite = new Sprite();
    sprite.setPosition(position[0], position[1]);
    sprite.setSize(this.GRID_SIZE, this.GRID_SIZE);
    if (this.worm.isCollision(sprite)) {
      return this.emptyCheck();
    }
    return position;
  }

  replaceSpoiled() {
    this.foodSprites.removeIndex(0);
    let food = new Sprite();
    let position = this.spoiledEmptyCheck();
    food.setImage('spoiled');
    food.setSize(this.GRID_SIZE, this.GRID_SIZE);
    food.setPosition(position[0], position[1]);
    this.spoiledSprites.add(food);
  }

  spoiledEmptyCheck() {
    let position = this.emptyCheck();
    for (let checkFood of this.foodSprites.sprites) {
      if (checkFood.x === position[0] && checkFood.y === position[1]) {
        return this.spoiledEmptyCheck();
      }
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
      let spoiledCollision = this.spoiledSprites.getOverlap(
        this.worm.snakeHead);

      //BONUS 1-1 Spoiled food that stays on the level for some amount of time
      if (this.currentLevel === 1) {
        if (this.spoiledSprites.size() > 0) {
          let time = Math.random();
          if (time > 0.96) {
            this.spoiledSprites.removeIndex(this.spoiledSprites.size() - 1);
          }
        }
        else {
          let time = Math.random();
          if (time > 0.96) {
            this.replaceSpoiled();
          }
        }
      }

      if (foodCollision) {
        this.score += 100;
        this.worm.addLink();
        this.replaceFood();
        if (this.currentLevel < this.maximumLevel &&
          this.score >= this.condition[this.currentLevel]) {
          this.newLevel();
        }
      } else if (spoiledCollision) {
        //BONUS 1-2  When eaten this causes the snake to shrink.
        //do shrink here
        this.score -= 100;
        this.worm.removeLink();
        this.replaceSpoiled();
      }
      else if (wallCollision || bodyCollision) {
        this.worm.alive = false;
        let gameOver = new TextDisplay(this.GRID_SIZE * 2, this.GRID_SIZE * 2,
          this.canvas.width);
        gameOver.text = wallCollision ? 'Game Over' : 'Om Nom';
        gameOver.fontName = 'Courier';
        gameOver.fontSize = 32;
        gameOver.fontColor = '#fff';
        this.overlayLayer.addDrawable(gameOver);
      }
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