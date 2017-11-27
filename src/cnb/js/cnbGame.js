let CNB_GRID_NUM = 9;
let CNB_GRID_SIZE = 80;

class CnbGame extends Game {
  constructor() {
    super();
    this.TICK_PER_SECOND = TICKS_PER_SECOND;

    this.map = new MapReader('cnb/json/cnb-maps.json');
    this.currentLevel = 0; // 0 and 1
    this.maximumLevel = this.map.getMapLength() - 1;

    this.grid = new CnbGrid(
      GRID_NUMBER, GRID_NUMBER,
      this.map.getMap(this.currentLevel),
      this.robbers, this.cops
    );

    this.robbers = new Robber(
      1, 1, CNB_GRID_SIZE,
      this.map.getMap(this.currentLevel), 'robber', this.grid,
      RobberState.THINKING
    );
    this.robberBuddy = new Robber(
      1, 7, CNB_GRID_SIZE,
      this.map.getMap(this.currentLevel), 'robber-buddy', this.grid,
      RobberState.WAITING
    );
    this.grid.robber = this.robbers;
    this.grid.robberBuddy = this.robberBuddy;

    this.cops = [];
    this.cops.push(
      new Cop(
        7, 1, CNB_GRID_SIZE,
        this.map.getMap(this.currentLevel), 'cop', this.grid
      )
    );
    this.cops.push(
      new Cop(
        7, 7, CNB_GRID_SIZE,
        this.map.getMap(this.currentLevel), 'cop', this.grid
      )
    );
    this.grid.cops = this.cops;

    addEventListener('keydown', event => this.onKeyDown(event));
    this.addContent('images', 'cnb/json/cnb-elements.json');

    this.canvas.width = CNB_GRID_NUM * CNB_GRID_SIZE;
    this.canvas.height = CNB_GRID_NUM * CNB_GRID_SIZE;

    this.spriteLayer.addDrawable(this.grid);
    this.spriteLayer.addDrawable(this.robbers);
    this.spriteLayer.addDrawable(this.robberBuddy);
    this.spriteLayer.addDrawable(this.cops[0]);
    this.spriteLayer.addDrawable(this.cops[1]);

    this.scoreDisplay1 = new TextDisplay(GRID_SIZE, this.canvas.height -
      18 * 2, this.canvas.width - GRID_SIZE / 2);
    this.scoreDisplay1.fontSize = 16;
    this.scoreDisplay1.fontName = 'Courier';
    this.scoreDisplay1.fontColor = '#fff';
    this.scoreDisplay1.text = '1. Don\'t get caught  2. Get the treasure  3. Get out';
    this.overlayLayer.addDrawable(this.scoreDisplay1);

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

  buildMap() {
    let m = this.map.getMap(this.currentLevel);
    for (let x = 0; x < m.length; x++) {
      for (let y = 0; y < m[x].length; y++) {
        switch (m[x][y]) {
          case 1://walls
            let random = Math.floor(Math.random() * 4);
            this.grid.addWall(x, y, random);
            break;
          case 2://left
            this.grid.addTile(x, y, 'left');
            break;
          case 3://up
            this.grid.addTile(x, y, 'up');
            break;
          case 4://right
            this.grid.addTile(x, y, 'right');
            break;
          case 5://down
            this.grid.addTile(x, y, 'down');
            break;
          case 6://treasure
            this.grid.addTile(x, y, 'treasure');
            break;
          case 7://out
            this.grid.addTile(x, y, 'out');
          default:
            break;
        }
      }
    }
  }

  loadContent() {
    return new Promise((resolve, reject) => {
      super.loadContent()
        .then(data => {
          imageManager.addImage('cop', data['images'].cop);
          imageManager.addImage('robber', data['images'].robber);
          imageManager.addImage('robber-buddy', data['images'].robberbuddy);
          imageManager.addImage('wall-0', data['images'].walls[0]);
          imageManager.addImage('wall-1', data['images'].walls[1]);
          imageManager.addImage('wall-2', data['images'].walls[2]);
          imageManager.addImage('wall-3', data['images'].walls[3]);
          imageManager.addImage('treasure', data['images'].treasure);
          imageManager.addImage('down', data['images'].down);
          imageManager.addImage('left', data['images'].left);
          imageManager.addImage('right', data['images'].right);
          imageManager.addImage('up', data['images'].up);
          imageManager.addImage('out', data['images'].out);
          resolve();
        });
    });
  }

  /**
   * Handles changing the snake's direction based on user input.
   */
  onKeyDown(event) {
    'use strict';
    switch (event.keyCode) {
      case 37: // Left
        if (this.robbers.state === RobberState.THINKING) {
          this.robbers.direction = Direction.LEFT;
        }
        if (this.robberBuddy.state === RobberState.THINKING) {
          this.robberBuddy.direction = Direction.LEFT;
        }
        break;
      case 38: // Up
        if (this.robbers.state === RobberState.THINKING) {
          this.robbers.direction = Direction.UP;
        }
        if (this.robberBuddy.state === RobberState.THINKING) {
          this.robberBuddy.direction = Direction.UP;
        }
        break;
      case 39: // Right
        if (this.robbers.state === RobberState.THINKING) {
          this.robbers.direction = Direction.RIGHT;
        }
        if (this.robberBuddy.state === RobberState.THINKING) {
          this.robberBuddy.direction = Direction.RIGHT;
        }
        break;
      case 40: // Down
        if (this.robbers.state === RobberState.THINKING) {
          this.robbers.direction = Direction.DOWN;
        }
        if (this.robberBuddy.state === RobberState.THINKING) {
          this.robberBuddy.direction = Direction.DOWN;
        }
        break;
      case 78:// N --> quick level check
        if (this.currentLevel < this.maximumLevel)
          this.nextLevel();
        else {
          this.gameOver.text = 'You Win';
          this.overlayLayer.addDrawable(this.gameOver);
        }
        break;

    }
  }

  update() {
    super.update();

    let a = [];
    a.push(this.robbers);
    a.push(this.robberBuddy);
    a.push(this.cops[0]);
    a.push(this.cops[1]);

    this.robbers.update(a);
    this.robberBuddy.update(a);
    if (this.robbers.state === RobberState.DONE &&
      this.robberBuddy.state === RobberState.DONE) {
      this.robbers.state = RobberState.COPSTURN;
      this.robberBuddy.state = RobberState.COPSTURN;
    }

    switch (this.robbers.getState()) {
      case 'done':
        if (this.robberBuddy.state === 'waiting') {
          this.robberBuddy.state = RobberState.THINKING;
        }
        break;
      case 'caught':
        this.gameOver.text = 'Game Over';
        this.overlayLayer.addDrawable(this.gameOver);
        break;
      case 'win':
        if (this.currentLevel < this.maximumLevel)
          this.nextLevel();
        else {
          this.gameOver.text = 'You Win';
          this.overlayLayer.addDrawable(this.gameOver);
        }
        break;
      case 'copsTurn':
        for (let cop of this.cops) {
          a = [];
          a.push(this.robbers);
          a.push(this.robberBuddy);
          a.push(this.cops[0]);
          a.push(this.cops[1]);
          cop.update(a);
        }
        break;
    }

    if (this.robberBuddy.state === RobberState.WIN) {
      if (this.currentLevel < this.maximumLevel)
        this.nextLevel();
      else {
        this.gameOver.text = 'You Win';
        this.overlayLayer.addDrawable(this.gameOver);
      }
    }
  }

  nextLevel() {
    this.spriteLayer.clear();

    this.gameOver.text = '';

    this.currentLevel++;
    this.grid = new CnbGrid(GRID_NUMBER, GRID_NUMBER,
      this.map.getMap(this.currentLevel), this.robbers, this.cops);
    this.buildMap();

    this.robbers = new Robber(
      1, 1, CNB_GRID_SIZE,
      this.map.getMap(this.currentLevel), 'robber', this.grid,
      RobberState.THINKING
    );
    this.robberBuddy = new Robber(
      1, 7, CNB_GRID_SIZE,
      this.map.getMap(this.currentLevel), 'robber-buddy', this.grid,
      RobberState.WAITING
    );
    this.grid.robber = this.robbers;
    this.grid.robberBuddy = this.robberBuddy;

    this.cops = [];
    this.cops.push(
      new Cop(
        7, 1, CNB_GRID_SIZE,
        this.map.getMap(this.currentLevel), 'cop', this.grid
      )
    );
    this.cops.push(
      new Cop(
        7, 7, CNB_GRID_SIZE,
        this.map.getMap(this.currentLevel), 'cop', this.grid
      )
    );
    this.grid.cops = this.cops;

    this.spriteLayer.addDrawable(this.grid);
    this.spriteLayer.addDrawable(this.robbers);
    this.spriteLayer.addDrawable(this.robberBuddy);
    this.spriteLayer.addDrawable(this.cops[0]);
    this.spriteLayer.addDrawable(this.cops[1]);

  }

}