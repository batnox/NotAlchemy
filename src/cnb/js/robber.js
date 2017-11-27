const RobberState = Object.freeze({
  CAUGHT: 'caught',
  WAITING: 'waiting',
  THINKING: 'thinking',
  DONE: 'done',
  COPSTURN: 'copsTurn',
  WIN: 'win'
});

class Robber extends Character {
  constructor(gridX, gridY, size, map, image, grid, startState) {
    super(gridX, gridY, size, map, image, grid);
    this.getTreasure = false;
    this.state = startState;
    this.grid = grid;
    this.startState = startState;
  }

  getState() {
    return this.state;
  }

  draw(context) {
    if (this.state === RobberState.THINKING) {
      context.fillStyle = '#00ffff';
      context.fillRect(this.image.bounds.x, this.image.bounds.y, this.size, this.size);
    }
    super.draw(context);
  }

  update(opponent) {
    if (this.getTreasure === false && this.map[this.gridX][this.gridY] === 6) {
      this.map[this.gridX][this.gridY] = 0;
      this.getTreasure = true;
      this.grid.getTile(this.gridX, this.gridY).clear();
    }
    else if (this.getTreasure === true && this.map[this.gridX][this.gridY] === 7) {
      this.state = RobberState.WIN;
    }

    let neighborArray = this.availableNext(opponent);
    let neighbor = [];
    for (let n of neighborArray) {
      neighbor.push(n.direction);
    }
    if (neighbor.length === 0 && this.state !== RobberState.WIN) {
      this.state = RobberState.CAUGHT;
    }
    else if (neighbor.indexOf(this.direction) >= 0) {
      this.moveTo(this.direction);
      this.state = RobberState.DONE;
      console.log(this.state);
    }
    else if (this.state !== RobberState.DONE && this.state !== RobberState.WIN) {
      this.state = this.startState;
    }
  }

}