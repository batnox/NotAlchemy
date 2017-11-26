let GRID_NUMBER = 30;
let GRID_SIZE = 30;
let SCORE_PER_FOOD = 500;
let TICKS_PER_SECOND = 3;
let FOOD_LIFE = 10 * (15 / TICKS_PER_SECOND);

const socket = io();

class SnakeGame extends Game {
  constructor(gameType) {
    super();
    this.TICK_PER_SECOND = TICKS_PER_SECOND;
    this.gameType = gameType;
    this.serverReady = false;
    this.clientReady = false;

    if (this.gameType === SnakeGameType.ONLINE_MULTIPLAYER) {
      this.sendUpdate = setInterval(() => {
        let msg = 'UPDATE';

        msg += '_';
        let current = this.worm2.snakeHead;
        while (current) {
          msg += `${current.gridX}.${current.gridY}.${current.direction}`;
          current = current.nextCell;
          if (current) {
            msg += '-';
          }
        }

        msg += '_';
        current = this.worm1.snakeHead;
        while (current) {
          msg += `${current.gridX}.${current.gridY}.${current.direction}`;
          current = current.nextCell;
          if (current) {
            msg += '-';
          }
        }

        socket.emit('message', msg);
      }, 1000);

      socket.on('message', (msg) => {
        console.log(`Server: ${msg}`);
        switch (msg) {
          case 'START_GAME_0':
            this.mainClient = true;
            this.serverReady = true;
            this.checkStart();
            break;
          case 'START_GAME_1':
            this.mainClient = false;
            this.worm1.setPosition(6, 6);
            this.worm2.setPosition(3, 3);
            this.serverReady = true;
            this.checkStart();
            break;
          case 'UP':
            this.worm2.direction = Direction.UP;
            break;
          case 'DOWN':
            this.worm2.direction = Direction.DOWN;
            break;
          case 'LEFT':
            this.worm2.direction = Direction.LEFT;
            break;
          case 'RIGHT':
            this.worm2.direction = Direction.RIGHT;
            break;
          case 'LEVEL':
            this.newLevel();
            break;
          case 'OVER':
            this.gameOver();
            break;
          default:
            let tokens = msg.split('_');
            if (tokens.length < 1) {
              throw Error('Invalid message.')
            }
            if (tokens[0] === 'UPDATE' && !this.mainClient) {
              let snakeToken1 = tokens[1].split('-');
              let c = this.worm1.snakeHead;
              for (let cellToken of snakeToken1) {
                if (!c) {
                  c = this.worm1.addLink();
                }
                let cellTokens = cellToken.split('.');
                let x = cellTokens[0];
                let y = cellTokens[1];
                let dir = cellTokens[2];

                c.setPosition(x, y);
                c.direction = dir;
                c = c.nextCell;
              }

              let snakeToken2 = tokens[2].split('-');
              c = this.worm2.snakeHead;
              for (let cellToken of snakeToken2) {
                if (!c) {
                  c = this.worm1.addLink();
                }
                let cellTokens = cellToken.split('.');
                let x = cellTokens[0];
                let y = cellTokens[1];
                let dir = cellTokens[2];

                c.setPosition(Number.parseInt(x), Number.parseInt(y));
                c.direction = dir;
                c = c.nextCell;
              }
            } else if (tokens[0] === 'FOOD') {
              this.grid.addFood(Number.parseInt(tokens[1]), Number.parseInt(tokens[2]));
            }
        }
      });

      socket.emit('message', 'START_MP_SNAKE');
    }

    // this.wallSprites = new SpriteGroup();
    // this.foodSprites = new SpriteGroup();
    this.grid = new SnakeGrid(GRID_NUMBER, GRID_NUMBER);

    if (!localStorage.getItem('high-score')) {
      localStorage.setItem('high-score', 0);
    }

    this.worm1 = new Snake(3, 3, this.grid, GRID_SIZE, SnakeType.RED);
    if (this.gameType === SnakeGameType.LOCAL_MULTIPLAYER ||
      this.gameType === SnakeGameType.ONLINE_MULTIPLAYER) {
      this.worm2 = new Snake(6, 6, this.grid, GRID_SIZE, SnakeType.BLUE);
    }

    /**
     * Determines the direction that the Snake will go
     */
    addEventListener('keydown', event => this.onKeyDown(event));
    this.addContent('images', 'snake/json/snake_elements.json');

    this.currentLevel = 0; // 0 and 1
    this.maximumLevel = 4;
    this.condition = [500, 1500, 3000, 5000];//condition for go to next level

    this.canvas.width = GRID_NUMBER * GRID_SIZE;
    this.canvas.height = GRID_NUMBER * GRID_SIZE;

    this.spriteLayer.addDrawable(this.worm1);
    if (this.gameType === SnakeGameType.LOCAL_MULTIPLAYER ||
      this.gameType === SnakeGameType.ONLINE_MULTIPLAYER) {
      this.spriteLayer.addDrawable(this.worm2);
    }
    this.spriteLayer.addDrawable(this.grid);
    // this.spriteLayer.addDrawable(this.wallSprites);
    // this.spriteLayer.addDrawable(this.foodSprites);

    this.scoreDisplay1 = new TextDisplay(GRID_SIZE, this.canvas.height -
      18 * 2, this.canvas.width - GRID_SIZE / 2);
    this.scoreDisplay1.fontSize = 14;
    this.scoreDisplay1.fontName = 'Courier';
    this.scoreDisplay1.fontColor = '#fff';
    this.scoreDisplay1.text = `Score 1: ${this.worm1.getScore()}`;
    this.overlayLayer.addDrawable(this.scoreDisplay1);

    if (this.gameType === SnakeGameType.LOCAL_MULTIPLAYER ||
      this.gameType === SnakeGameType.ONLINE_MULTIPLAYER) {
      this.scoreDisplay2 = new TextDisplay(GRID_SIZE, this.canvas.height -
        18, this.canvas.width - GRID_SIZE / 2);
      this.scoreDisplay2.fontSize = 14;
      this.scoreDisplay2.fontName = 'Courier';
      this.scoreDisplay2.fontColor = '#fff';
      this.scoreDisplay2.text = `Score 2: ${this.worm2.getScore()}`;
      this.overlayLayer.addDrawable(this.scoreDisplay2);
    }

    this.highScoreDisplay = new TextDisplay(this.canvas.width /
      2, this.canvas.height -
      18, this.canvas.width / 2 - GRID_SIZE);
    this.highScoreDisplay.fontSize = 14;
    this.highScoreDisplay.fontName = 'Courier';
    this.highScoreDisplay.fontColor = '#fff';

    let highScore = this.worm1.getScore();
    if (this.gameType === SnakeGameType.LOCAL_MULTIPLAYER ||
      this.gameType === SnakeGameType.ONLINE_MULTIPLAYER) {
      highScore = Math.max(this.worm1.getScore(), this.worm2.getScore());
    }
    this.highScoreDisplay.text = `High Score: ${highScore}`;
    this.overlayLayer.addDrawable(this.highScoreDisplay);

    this.gameOver = new TextDisplay(GRID_SIZE * 2, GRID_SIZE * 2,
      this.canvas.width);
    this.gameOver.fontName = 'Courier';
    this.gameOver.fontSize = 32;
    this.gameOver.fontColor = '#fff';

    this.loadContent()
      .then(() => {
        this.buildMap();
        if (this.gameType !== SnakeGameType.ONLINE_MULTIPLAYER) {
          this.start();
        } else {
          console.log('Waiting for other player...');
          this.spriteLayer.drawLayer = false;
          this.overlayLayer.drawLayer = false;
          let connectionLayer = new Layer();
          this.layers[2] = connectionLayer;

          let connectionText = new TextDisplay(100, 100, this.canvas.width);
          connectionText.text = 'Waiting for other player...';
          connectionText.fontSize = 32;
          connectionText.fontColor = '#fff';
          connectionLayer.addDrawable(connectionText);
          this.draw();

          this.clientReady = true;
          this.checkStart();
        }
      });
  }

  stop() {
    super.stop();
    clearInterval(this.sendUpdate);
  }

  checkStart() {
    if (this.clientReady && this.serverReady) {
      this.layers[2].drawLayer = false;
      this.spriteLayer.drawLayer = true;
      this.overlayLayer.drawLayer = true;
      this.start();
    }
  }

  newLevel() {
    this.grid.clear();

    this.worm1.killBody();
    this.worm1.setPosition(3, 3);
    this.worm1.direction = Direction.RIGHT;

    if (this.gameType === SnakeGameType.LOCAL_MULTIPLAYER ||
      this.gameType === SnakeGameType.ONLINE_MULTIPLAYER) {
      this.worm2.killBody();
      this.worm2.setPosition(10, 10);
      this.worm2.direction = Direction.LEFT;

      if (this.mainClient) {
        this.worm1.setPosition(10, 10);
        this.worm1.direction = Direction.LEFT;
        this.worm2.setPosition(3, 3);
        this.worm2.direction = Direction.RIGHT;
      }
    }

    this.currentLevel++;

    this.buildMap();
    this.canvas.width = GRID_NUMBER * GRID_SIZE;
    this.canvas.height = GRID_NUMBER * GRID_SIZE;
  }

  buildMap() {
    let tmpMap = sampleMaps.getMap(this.currentLevel);
    for (let x = 0; x < tmpMap.length; x++) {
      for (let y = 0; y < tmpMap[x].length; y++) {
        if (tmpMap[x][y] === 1) {
          let random = 0;
          if (this.currentLevel === 0)
            random = Math.floor(Math.random() * 4);
          else
            random = Math.floor(Math.random() * 4) + 4;
          this.grid.addWall(x, y, random);
        }
      }
    }
    this.grid.addFood(8, 8);
  }

  loadContent() {
    return new Promise((resolve, reject) => {
      super.loadContent()
        .then(data => {
          imageManager.addImage('head-red', data['images'].snake.head.red);
          imageManager.addImage('head-blue', data['images'].snake.head.blue);
          imageManager.addImage('body-red', data['images'].snake.body.red);
          imageManager.addImage('body-blue', data['images'].snake.body.blue);
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
    socket.emit('message', `FOOD_${position[0]}_${position[1]}`);
  }

  emptyCheck() {
    let position = [
      Math.floor(Math.random() * GRID_NUMBER),
      Math.floor(Math.random() * GRID_NUMBER)];

    if (this.grid.getWall(position[0], position[1])) {
      return this.emptyCheck();
    }

    if (this.worm1.isCollision(position[0], position[1])) {
      return this.emptyCheck();
    }

    if ((this.gameType === SnakeGameType.LOCAL_MULTIPLAYER ||
        this.gameType === SnakeGameType.ONLINE_MULTIPLAYER) &&
      this.worm2.isCollision(position[0], position[1])) {
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
        if (this.gameType === SnakeGameType.ONLINE_MULTIPLAYER) {
          socket.emit('message', 'LEFT');
        }
        break;
      case 38: // Up
        this.worm1.direction = Direction.UP;
        if (this.gameType === SnakeGameType.ONLINE_MULTIPLAYER) {
          socket.emit('message', 'UP');
        }
        break;
      case 39: // Right
        this.worm1.direction = Direction.RIGHT;
        if (this.gameType === SnakeGameType.ONLINE_MULTIPLAYER) {
          socket.emit('message', 'RIGHT');
        }
        break;
      case 40: // Down
        this.worm1.direction = Direction.DOWN;
        if (this.gameType === SnakeGameType.ONLINE_MULTIPLAYER) {
          socket.emit('message', 'DOWN');
        }
        break;
    }

    if (this.gameType === SnakeGameType.LOCAL_MULTIPLAYER) {
      switch (event.keyCode) {
        case 65: // Left
          this.worm2.direction = Direction.LEFT;
          break;
        case 87: // Up
          this.worm2.direction = Direction.UP;
          break;
        case 68: // Right
          this.worm2.direction = Direction.RIGHT;
          break;
        case 83: // Down
          this.worm2.direction = Direction.DOWN;
          break;

      }
    }

  }

  update() {
    super.update();
    this.worm1.update();
    if (this.gameType === SnakeGameType.LOCAL_MULTIPLAYER ||
      this.gameType === SnakeGameType.ONLINE_MULTIPLAYER) {
      this.worm2.update();
    }
    this.grid.update();

    this.updateWorm(this.worm1);
    if (this.gameType === SnakeGameType.LOCAL_MULTIPLAYER ||
      this.gameType === SnakeGameType.ONLINE_MULTIPLAYER) {
      this.updateWorm(this.worm2);
    }

    this.scoreDisplay1.text = `Score 1: ${this.worm1.getScore()}`;

    if (this.gameType === SnakeGameType.LOCAL_MULTIPLAYER ||
      this.gameType === SnakeGameType.ONLINE_MULTIPLAYER) {
      this.scoreDisplay2.text = `Score 2: ${this.worm2.getScore()}`;
    }

    let highScore = localStorage.getItem('high-score');
    if (this.worm1.getScore() > highScore) {
      highScore = this.worm1.getScore();
      localStorage.setItem('high-score', this.worm1.getScore());
    }
    if ((this.gameType === SnakeGameType.LOCAL_MULTIPLAYER ||
        this.gameType === SnakeGameType.ONLINE_MULTIPLAYER) &&
      this.worm2.getScore() > highScore) {
      highScore = this.worm2.getScore();
      localStorage.setItem('high-score', this.worm2.getScore());
    }
    this.highScoreDisplay.text = `High Score: ${highScore}`;
  }

  updateWorm(worm) {
    if (worm.alive) {
      let head = worm.snakeHead;
      let food = this.grid.getFood(head.gridX, head.gridY);
      let wall = this.grid.getWall(head.gridX, head.gridY);
      let bodyCollision = worm.isBodyCollision();

      let otherSnakeCollision = false;
      if (this.gameType === SnakeGameType.LOCAL_MULTIPLAYER ||
        this.gameType === SnakeGameType.ONLINE_MULTIPLAYER) {
        otherSnakeCollision =
          this.worm2.isSnakeCollision(this.worm1.snakeHead) ||
          this.worm1.isSnakeCollision(this.worm2.snakeHead);
      }

      if (food) {
        if (food.spoiled) {
          worm.score -= SCORE_PER_FOOD;
          worm.removeLink();
        } else {
          worm.score += SCORE_PER_FOOD;
          worm.addLink();
        }
        this.replaceFood(food);
        if (this.currentLevel < this.maximumLevel &&
          worm.score >= this.condition[this.currentLevel]) {
          socket.emit('message', 'LEVEL');
          this.newLevel();
        }
      } else if (wall || bodyCollision || otherSnakeCollision) {
        this.worm1.alive = false;
        if (this.gameType === SnakeGameType.LOCAL_MULTIPLAYER ||
          this.gameType === SnakeGameType.ONLINE_MULTIPLAYER) {
          this.worm2.alive = false;
        }
      }
    } else if (!this.gameOver.text) {
      socket.emit('message', 'OVER');
      this.gameOver();
    }
  }

  gameOver() {
    this.gameOver.text = 'Game Over';
    this.overlayLayer.addDrawable(this.gameOver);
    clearInterval(this.sendUpdate);
  }

  draw() {
    super.draw();
  }
}

// socket.on('message', function(data) {
//     console.log(data);
// });