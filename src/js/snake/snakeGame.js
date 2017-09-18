class SnakeGame extends Game {
  constructor() {
    super();
    this.TICK_PER_SECOND = 10;
    this.GRID_NUMBER = 30;
    this.GRID_SIZE = 30;
    //this.STEP_SIZE = 30;

    this.snakeSprites = new SpriteGroup();
    this.wallSprites = new SpriteGroup();
    this.foodSprites = new SpriteGroup();

    this.score = 0;
    this.worm = new Snake(this.GRID_SIZE);

    /**
     * Determines the direction that the Snake will go
     */
    addEventListener('keydown', event => this.onKeyDown(event));
    this.addContent('images', 'json/snake_elements.json');

    this.currentLevel = 0; // 0 and 1
    this.maximumLevel = 1;
    this.condition = [500];
    this.wallMaterial = [];
    this.foodMaterial = [];

    this.canvas.width = this.GRID_NUMBER * this.GRID_SIZE;
    this.canvas.height = this.GRID_NUMBER * this.GRID_SIZE;

    this.spriteLayer.addDrawable(this.worm);
    this.spriteLayer.addDrawable(this.snakeSprites);
    this.spriteLayer.addDrawable(this.wallSprites);
    this.spriteLayer.addDrawable(this.foodSprites);

    this.loadContent()
      .then(() => {
        this.buildMap();
        this.worm.setPosition(60, 60);
        this.start();
      });

  }

  newLevel(){
      this.snakeSprites = new SpriteGroup();
      this.wallSprites = new SpriteGroup();

      this.score = 0;
      //this.worm = new Snake(this.GRID_SIZE);
      this.worm.setPosition(60, 60);
      this.worm.direction = Direction.RIGHT;
      //this.worm.snakeTail = this.worm.snakeHead;

      this.currentLevel++;

      this.buildMap();
      this.spriteLayer.addDrawable(this.worm);
      this.spriteLayer.addDrawable(this.snakeSprites);
      this.spriteLayer.addDrawable(this.wallSprites);
      this.spriteLayer.addDrawable(this.foodSprites);

      this.canvas.width = this.GRID_NUMBER * this.GRID_SIZE;
      this.canvas.height = this.GRID_NUMBER * this.GRID_SIZE;
  }


  buildMap() {
      if(this.currentLevel === 0) {
          this.foodSprites.add(this.foodMaterial[this.currentLevel]);

          for (let x = 0; x < this.GRID_NUMBER; x++) {
              for (let y = 0; y < this.GRID_NUMBER; y++) {
                  if (x === 0 || y === 0 || x === this.GRID_NUMBER - 1 ||
                      y === this.GRID_NUMBER - 1) {
                      let random = Math.floor(Math.random() * 4);
                      let tmpSprite = Object.assign(Object.create(Object.getPrototypeOf(
                          this.wallMaterial[this.currentLevel][random])),
                          this.wallMaterial[this.currentLevel][random]);
                      tmpSprite.setPosition(x * this.GRID_SIZE, y * this.GRID_SIZE);
                      this.wallSprites.add(tmpSprite);
                  }
              }
          }
      }else {
          console.log("level" + this.currentLevel);
          for (let x = 0; x < this.GRID_NUMBER; x++) {
              for (let y = 0; y < this.GRID_NUMBER; y++) {
                  if (x === 0 || y === 0 || x === (this.GRID_NUMBER - 1) ||
                      y === (this.GRID_NUMBER - 1)) {
                      let random = Math.floor(Math.random() * 4);
                      let tmpSprite = Object.assign(Object.create(Object.getPrototypeOf(
                          this.wallMaterial[this.currentLevel][random])),
                          this.wallMaterial[this.currentLevel][random]);
                      tmpSprite.setPosition(x * this.GRID_SIZE, y * this.GRID_SIZE);
                      this.wallSprites.add(tmpSprite);
                  } else if (x > Math.floor(this.GRID_NUMBER / 3) &&
                      x < Math.floor(this.GRID_NUMBER * 2 / 3) &&
                      y === Math.floor((this.GRID_NUMBER) / 2)) {
                      let random = Math.floor(Math.random() * 4);
                      let tmpSprite = Object.assign(Object.create(Object.getPrototypeOf(
                          this.wallMaterial[this.currentLevel][random])),
                          this.wallMaterial[this.currentLevel][random]);
                      tmpSprite.setPosition(x * this.GRID_SIZE, y * this.GRID_SIZE);
                      this.wallSprites.add(tmpSprite);
                  }
                  else if (y > Math.floor(this.GRID_NUMBER / 3) &&
                      y < Math.floor(this.GRID_NUMBER * 2 / 3) &&
                      x === Math.floor((this.GRID_NUMBER) / 2)) {
                      let random = Math.floor(Math.random() * 4);
                      let tmpSprite = Object.assign(Object.create(Object.getPrototypeOf(
                          this.wallMaterial[this.currentLevel][random])),
                          this.wallMaterial[this.currentLevel][random]);
                      tmpSprite.setPosition(x * this.GRID_SIZE, y * this.GRID_SIZE);
                      this.wallSprites.add(tmpSprite);
                  }
              }
          }
      }
  }


  loadContent() {
    return super.loadContent()
      .then(data => {
          //load snake images
          this.worm.snakeHead.setImage(data['images'].snakes[0].img);
          this.snakeSprites.add(this.worm.snakeHead);
          let currentCell = this.worm.snakeHead.nextCell;
          while (currentCell !== null) {
            currentCell.setImage(data['images'].snakes[1].img);
            this.snakeSprites.add(currentCell);
            currentCell = currentCell.nextCell;
          }
          this.worm.setBodyImage(data['images'].snakes[1].img);

          //load all wall material
          for (let i in data['images'].walls) {
            this.wallMaterial[i] = [];
            for (let j in  data['images'].walls[i].material) {
              this.wallMaterial[i][j] = new Sprite();
              this.wallMaterial[i][j].setImage(
                data['images'].walls[i].material[j]);
              this.wallMaterial[i][j].setSize(this.GRID_SIZE, this.GRID_SIZE);
              console.log(i + ", " + j);
            }
          }

          //load food material
          let tmp = new Sprite();
          tmp.setImage(data['images'].food);
          tmp.setSize(this.GRID_SIZE, this.GRID_SIZE);
          tmp.setPosition(8 * this.GRID_SIZE, 8 * this.GRID_SIZE);
          this.foodMaterial.push(tmp);
        }
      );
  }

  replaceFood() {
      for (let tmpFood of this.foodMaterial) {
          let position = this.emptyCheck();
          tmpFood.setPosition(position[0], position[1]);
          this.foodSprites.add(tmpFood);
      }
  }

  emptyCheck(){
      let position = [Math.floor(Math.random()*this.GRID_NUMBER) * this.GRID_SIZE,
          Math.floor(Math.random()*this.GRID_NUMBER) * this.GRID_SIZE];

      for (let checkWall of this.wallSprites.sprites){
          if (checkWall.x === position[0] && checkWall.y === position[1]){
              console.log("overlap with wall");
              return this.emptyCheck();
          }
      }

      for (let checkSnake of this.snakeSprites.sprites){
          if (checkSnake.x === position[0] && checkSnake.y === position[1]){
              console.log("overlap with snake");
              return this.emptyCheck();
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

    if (this.currentLevel === 1){
        console.log()
    }

    if (this.worm.alive) {
      let foodCollision = this.foodSprites.getOverlap(this.worm.snakeHead);
      let wallCollision = this.wallSprites.getOverlap(this.worm.snakeHead);
      let bodyCollision = this.worm.isBodyCollision();

      let tempCell = new SnakeCell(null, null, null);
      if (foodCollision) {
        this.score += 100;
        if (this.score >= this.condition[this.currentLevel] && this.currentLevel < this.maximumLevel){
            this.newLevel();
        }
        tempCell = this.worm.addLink();
        this.spriteLayer.addDrawable(tempCell);
        this.snakeSprites.add(tempCell);
        this.foodSprites.removeSprite(foodCollision);
        this.replaceFood();
        console.log(this.snakeSprites.length);//undefine
      } else if (wallCollision || bodyCollision) {
        this.worm.alive = false;
        let gameOver = new TextDisplay(10, 10, this.canvas.width);
        gameOver.text = wallCollision ? 'Game Over' : 'Om Nom';
        gameOver.fontName = 'Courier';
        gameOver.fontSize = 32;
        gameOver.fontColor = '#fff';
        this.overlayLayer.addDrawable(gameOver)
      }
    }
  }

  draw() {
    super.draw();
  }
}