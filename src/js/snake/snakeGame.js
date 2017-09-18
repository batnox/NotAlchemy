class SnakeGame extends Game {
  constructor() {
    super();
    this.TICK_PER_SECOND = 10;
    this.GRID_NUMBER = 30;
    this.GRID_SIZE = 30;
    //this.STEP_SIZE = 30;

    this.wallSprites = new SpriteGroup();
    this.foodSprites = new SpriteGroup();
    this.spoiledSprites = new SpriteGroup();

    this.score = 0;
    this.worm = new Snake(this.GRID_SIZE);

    /**
     * Determines the direction that the Snake will go
     */
    addEventListener('keydown', event => this.onKeyDown(event));
    this.addContent('images', 'json/snake_elements.json');

    this.currentLevel = 0; // 0 and 1
    this.maximumLevel = 1;
    this.condition = [500];//condition for go to next level
    this.wallMaterial = [];
    this.foodMaterial = [];
    this.spoiledMaterial = [];

    this.canvas.width = this.GRID_NUMBER * this.GRID_SIZE;
    this.canvas.height = this.GRID_NUMBER * this.GRID_SIZE;

    this.spriteLayer.addDrawable(this.worm);
    this.spriteLayer.addDrawable(this.wallSprites);
    this.spriteLayer.addDrawable(this.foodSprites);

    this.scoreDisplay = new TextDisplay(this.canvas.width - 140, this.canvas.height - 28, 100);
    this.scoreDisplay.fontSize = 20;
    this.scoreDisplay.fontName = 'Courier';
    this.scoreDisplay.fontColor = '#fff';
    this.scoreDisplay.text = `Score: ${this.score}`;
    this.overlayLayer.addDrawable(this.scoreDisplay);

    this.loadContent()
      .then(() => {
        this.buildMap();
        this.worm.setPosition(60, 60);
        this.start();
      });

  }

  newLevel() {
    this.wallSprites.clear();

    this.score = 0;
    //this.worm = new Snake(this.GRID_SIZE); //
    this.worm.killBody();
    this.worm.setPosition(60, 60);
    this.worm.direction = Direction.RIGHT;
    //this.spriteLayer.removeDrawable(1); //
    //this.worm.snakeTail = this.worm.snakeHead; //

    this.currentLevel++;

    this.buildMap();
    // this.spriteLayer.addDrawable(this.worm);
    // this.spriteLayer.addDrawable(this.wallSprites);
    // this.spriteLayer.addDrawable(this.foodSprites);
    // this.spriteLayer.addDrawable(this.spoiledSprites);

    this.canvas.width = this.GRID_NUMBER * this.GRID_SIZE;
    this.canvas.height = this.GRID_NUMBER * this.GRID_SIZE;
  }

  buildMap() {
    if (this.currentLevel === 0) {
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
    } else {
      this.spoiledSprites.add(this.spoiledMaterial[0]);

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
          this.worm.setHeadImage(data['images'].snakes[0].img);
          this.worm.setBodyImage(data['images'].snakes[1].img);

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
          tmp.setSize(this.GRID_SIZE, this.GRID_SIZE);
          tmp.setPosition(8 * this.GRID_SIZE, 8 * this.GRID_SIZE);
          this.foodMaterial.push(tmp);

          //load spoiled food material
          let spoiled = new Sprite();
          spoiled.setImage(data['images'].spoiled);
          spoiled.setSize(this.GRID_SIZE, this.GRID_SIZE);
          spoiled.setPosition(5 * this.GRID_SIZE, 10 * this.GRID_SIZE);
          this.spoiledMaterial.push(spoiled);
        }
      );
  }

  replaceFood() {
    this.foodSprites.removeIndex(0);
    for (let tmpFood of this.foodMaterial) {
      let position = this.emptyCheck();
      tmpFood.setPosition(position[0], position[1]);
      this.foodSprites.add(tmpFood);
    }
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
    for (let tmpSpoiled of this.spoiledMaterial) {
      let position = this.spoiledEmptyCheck();
      tmpSpoiled.setPosition(position[0], position[1]);
      this.spoiledSprites.add(tmpSpoiled);
    }
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
        if (this.score >= this.condition[this.currentLevel] &&
          this.currentLevel < this.maximumLevel) {
          this.newLevel();
        }
      } else if (spoiledCollision) {
        //BONUS 1-2  When eaten this causes the snake to shrink.
        //do shrink here

        this.score -= 100;
        this.replaceSpoiled();
      }
      else if (wallCollision || bodyCollision) {
        this.worm.alive = false;
        let gameOver = new TextDisplay(10, 10, this.canvas.width);
        gameOver.text = wallCollision ? 'Game Over' : 'Om Nom';
        gameOver.fontName = 'Courier';
        gameOver.fontSize = 32;
        gameOver.fontColor = '#fff';
        this.overlayLayer.addDrawable(gameOver);
      }
    }
    this.scoreDisplay.text = `Score: ${this.score}`;
  }

  draw() {
    super.draw();
  }
}