class SnakeGame extends Game {
  constructor() {
    super();
    this.worm = new Snake();
    this.currentDirection = 'right';
    this.score = 0;
    this.snakeSprites = new SpriteGroup();
    this.wallSprites = new SpriteGroup();
    this.foodSprites = new SpriteGroup();
    this.stepsize = 10;
    /**
     * Determines the direction that the Snake will go
     */
    addEventListener('keydown', event => this.onKeyDown(event));
    this.addContent('images', 'json/snake_elements.json');

    this.GRID_NUMBER = 30;
    this.GRID_SIZE = 20;
    this.currentLevel = 1; //0 and 1
    this.wallMaterial = [];

    this.MAP1 = [];
    this.MAP2 = [];
    this.canvas.width = this.GRID_NUMBER * this.GRID_SIZE;
    this.canvas.height = this.GRID_NUMBER * this.GRID_SIZE;

    this.spriteLayer.addDrawable(this.worm);

    this.loadContent()
      .then(() => {
        this.buildMap();
        this.worm.x = 100;
        this.worm.y = 100;
        this.start();
      });
  }

  buildMap() {
    for (let x = 0; x < this.GRID_NUMBER; x++) {
      this.MAP1[x] = [];
      for (let y = 0; y < this.GRID_NUMBER; y++) {
        if (x === 0 || y === 0 || x === this.GRID_NUMBER - 1 ||
          y === this.GRID_NUMBER - 1) {
          this.MAP1[x][y] = 1;
          let random = Math.floor(Math.random() * 4);
          let tmpSprite = Object.assign(Object.create(Object.getPrototypeOf(
            this.wallMaterial[this.currentLevel][random])),
            this.wallMaterial[this.currentLevel][random]);
          tmpSprite.setPosition(x * this.GRID_SIZE, y * this.GRID_SIZE);
          this.spriteLayer.addDrawable(tmpSprite);
        } else {
          this.MAP1[x][y] = 0;
        }
      }
    }

    for (let x = 0; x < this.GRID_NUMBER; x++) {
      this.MAP2[x] = [];
      for (let y = 0; y < this.GRID_NUMBER; y++) {
        if (x === 0 || y === 0 || x === (this.GRID_NUMBER - 1) ||
          y === (this.GRID_NUMBER - 1)) {
          this.MAP2[x][y] = 1;
          let random = Math.floor(Math.random() * 4);
          let tmpSprite = Object.assign(Object.create(Object.getPrototypeOf(
            this.wallMaterial[this.currentLevel][random])),
            (this.wallMaterial[this.currentLevel][random]));
          tmpSprite.setPosition(x * this.GRID_SIZE, y * this.GRID_SIZE);
          this.spriteLayer.addDrawable(tmpSprite);
        } else if (x > Math.floor(this.GRID_NUMBER / 3) &&
          x < Math.floor(this.GRID_NUMBER * 2 / 3) &&
          y === Math.floor((this.GRID_NUMBER) / 2)) {
          this.MAP2[x][y] = 1;
          let random = Math.floor(Math.random() * 4);
          let tmpSprite = Object.assign(Object.create(Object.getPrototypeOf(
            this.wallMaterial[this.currentLevel][random])),
            (this.wallMaterial[this.currentLevel][random]));
          tmpSprite.setPosition(x * this.GRID_SIZE, y * this.GRID_SIZE);
          this.spriteLayer.addDrawable(tmpSprite);
        }
        else if (y > Math.floor(this.GRID_NUMBER / 3) &&
          y < Math.floor(this.GRID_NUMBER * 2 / 3) &&
          x === Math.floor((this.GRID_NUMBER) / 2)) {
          this.MAP2[x][y] = 1;
          let random = Math.floor(Math.random() * 4);
          let tmpSprite = Object.assign(Object.create(Object.getPrototypeOf(
            this.wallMaterial[this.currentLevel][random])),
            (this.wallMaterial[this.currentLevel][random]));
          tmpSprite.setPosition(x * this.GRID_SIZE, y * this.GRID_SIZE);
          this.spriteLayer.addDrawable(tmpSprite);
        }
        else {
          this.MAP2[x][y] = 0;
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
              /*
              let tmp = new Sprite();
              tmp.setImage(data['snake_elements'].walls[i].material[j]);
              tmp.setSize(this.GRID_SIZE, this.GRID_SIZE);
              this.wallMaterial.push(tmp);
              */
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
    //up
    if (event.keyCode === '38') {
      // this.setDirection(Directions.UP);
      this.currentDirection = 'up';
      //down
    } else if (event.keyCode === '40') {
      // this.setDirection(Directions.DOWN);
      this.currentDirection = 'down';
      //left
    } else if (event.keyCode === '37') {
      // this.setDirection(Directions.LEFT);
      this.currentDirection = 'left';
      //right
    } else if (event.keyCode === '39') {
      // this.setDirection(Directions.RIGHT);
      this.currentDirection = 'right';
    }
  }

  update() {
    super.update();
    this.worm.moveSnake(this.currentDirection, this.stepsize);
    let foodcheck = this.foodSprites.getOverlap(this.worm.snakeHead) !== null;
    let wallcheck = this.wallSprites.getOverlap(this.worm.snakeHead) !== null;
    let bodycheck = this.snakeSprites.getOverlap(this.worm.snakeHead) !== null;
    let tempCell = new SnakeCell(null, null, null);
    if (foodcheck) {
      tempCell = this.worm.addlink(stepsize);
      this.spriteLayer.addDrawable(tempCell);
      this.snakeSprites.add(tempCell);
      this.score += 100;
    } else if (wallcheck || bodycheck) {
      //snek is ded
      //bye snek
      //u will b missed snek
    }
  }

  draw() {
    super.draw();
  }
}