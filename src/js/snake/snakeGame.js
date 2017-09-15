class SnakeGame extends Game {
  constructor() {
    super();
    this.GRID_NUMBER = 30;
    this.GRID_SIZE = 20;
    this.STEP_SIZE = 20;

    this.snakeSprites = new SpriteGroup();
    this.wallSprites = new SpriteGroup();
    this.foodSprites = new SpriteGroup();

    this.score = 0;
    this.worm = new Snake(this.STEP_SIZE);

    /**
     * Determines the direction that the Snake will go
     */
    addEventListener('keydown', event => this.onKeyDown(event));
    this.addContent('images', 'json/snake_elements.json');

    this.currentLevel = 1; // 0 and 1
    this.wallMaterial = [];

    this.MAP_1 = [];
    this.MAP_2 = [];
    this.canvas.width = this.GRID_NUMBER * this.GRID_SIZE;
    this.canvas.height = this.GRID_NUMBER * this.GRID_SIZE;

    this.spriteLayer.addDrawable(this.worm);
    this.spriteLayer.addDrawable(this.snakeSprites);
    this.spriteLayer.addDrawable(this.wallSprites);
    this.spriteLayer.addDrawable(this.foodSprites);

    this.loadContent()
      .then(() => {
        this.buildMap();
        this.worm.setPosition(50, 50);
        this.start();
      });
  }

  buildMap() {
    for (let x = 0; x < this.GRID_NUMBER; x++) {
      this.MAP_1[x] = [];
      for (let y = 0; y < this.GRID_NUMBER; y++) {
        if (x === 0 || y === 0 || x === this.GRID_NUMBER - 1 ||
          y === this.GRID_NUMBER - 1) {
          this.MAP_1[x][y] = 1;
          let random = Math.floor(Math.random() * 4);
          let tmpSprite = Object.assign(Object.create(Object.getPrototypeOf(
            this.wallMaterial[this.currentLevel][random])),
            this.wallMaterial[this.currentLevel][random]);
          tmpSprite.setPosition(x * this.GRID_SIZE, y * this.GRID_SIZE);
          this.wallSprites.add(tmpSprite);
        } else {
          this.MAP_1[x][y] = 0;
        }
      }
    }

    for (let x = 0; x < this.GRID_NUMBER; x++) {
      this.MAP_2[x] = [];
      for (let y = 0; y < this.GRID_NUMBER; y++) {
        if (x === 0 || y === 0 || x === (this.GRID_NUMBER - 1) ||
          y === (this.GRID_NUMBER - 1)) {
          this.MAP_2[x][y] = 1;
          let random = Math.floor(Math.random() * 4);
          let tmpSprite = Object.assign(Object.create(Object.getPrototypeOf(
            this.wallMaterial[this.currentLevel][random])),
            (this.wallMaterial[this.currentLevel][random]));
          tmpSprite.setPosition(x * this.GRID_SIZE, y * this.GRID_SIZE);
          this.wallSprites.add(tmpSprite);
        } else if (x > Math.floor(this.GRID_NUMBER / 3) &&
          x < Math.floor(this.GRID_NUMBER * 2 / 3) &&
          y === Math.floor((this.GRID_NUMBER) / 2)) {
          this.MAP_2[x][y] = 1;
          let random = Math.floor(Math.random() * 4);
          let tmpSprite = Object.assign(Object.create(Object.getPrototypeOf(
            this.wallMaterial[this.currentLevel][random])),
            (this.wallMaterial[this.currentLevel][random]));
          tmpSprite.setPosition(x * this.GRID_SIZE, y * this.GRID_SIZE);
          this.wallSprites.add(tmpSprite);
        }
        else if (y > Math.floor(this.GRID_NUMBER / 3) &&
          y < Math.floor(this.GRID_NUMBER * 2 / 3) &&
          x === Math.floor((this.GRID_NUMBER) / 2)) {
          this.MAP_2[x][y] = 1;
          let random = Math.floor(Math.random() * 4);
          let tmpSprite = Object.assign(Object.create(Object.getPrototypeOf(
            this.wallMaterial[this.currentLevel][random])),
            (this.wallMaterial[this.currentLevel][random]));
          tmpSprite.setPosition(x * this.GRID_SIZE, y * this.GRID_SIZE);
          this.wallSprites.add(tmpSprite);
        }
        else {
          this.MAP_2[x][y] = 0;
        }
      }
    }
  }

  loadContent() {
    return super.loadContent()
      .then(data => {
          this.worm.snakeHead.setImage(data['images'].snakes[0].img);
          this.snakeSprites.add(this.worm.snakeHead);
          let currentCell = this.worm.snakeHead.nextCell;
          while (currentCell !== null) {
            currentCell.setImage(data['images'].snakes[1].img);
            this.snakeSprites.add(currentCell);
            currentCell = currentCell.nextCell;
          }

          //load all wall material
          for (let i in data['images'].walls) {
            this.wallMaterial[i] = [];
            for (let j in  data['images'].walls[i].material) {
              this.wallMaterial[i][j] = new Sprite();
              this.wallMaterial[i][j].setImage(
                data['images'].walls[i].material[j]);
              this.wallMaterial[i][j].setSize(this.GRID_SIZE, this.GRID_SIZE);
            }
          }
          //load food material

          let tmp = new Sprite();
          tmp.setImage(data['images'].food);
          console.log(data['images'].food);
          tmp.setSize(this.GRID_SIZE, this.GRID_SIZE);
          tmp.setPosition(2 * this.GRID_SIZE, 2 * this.GRID_SIZE);
          this.spriteLayer.addDrawable(tmp);
        }
      );
  }

  /**
   * Handles changing the snake's direction based on user input.
   */
  onKeyDown(event) {
    'use strict';
    console.log(event.keyCode);
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
    this.worm.moveSnake();
    let foodCollision = this.foodSprites.getOverlap(this.worm.snakeHead) !==
      null;
    let wallCollision = this.wallSprites.getOverlap(this.worm.snakeHead) !==
      null;
    let bodyCollision = this.snakeSprites.getOverlap(this.worm.snakeHead) !==
      null;
    let tempCell = new SnakeCell(null, null, null);
    if (foodCollision) {
      tempCell = this.worm.addLink(stepsize);
      this.spriteLayer.addDrawable(tempCell);
      this.snakeSprites.add(tempCell);
      this.score += 100;
    } else if (wallCollision || bodyCollision) {
      //snek is ded
      //bye snek
      //u will b missed snek
    }
  }

  draw() {
    super.draw();
  }
}