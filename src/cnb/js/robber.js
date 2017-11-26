const RobberState = Object.freeze({
  CAUGHT: 'caught',
  THINKING: 'thinking',
  COPSTURN: 'copsTurn',
  WIN: 'win'

});

class Robber extends Character {
  constructor(gridX, gridY, size, map, image, grid) {
    super(gridX, gridY, size, map, image, grid);
    this.getTreasure = false;
    this.state = RobberState.THINKING;
    this.grid = grid;
  }

  getState() {
    return this.state;
  }

  update(opponent) {
    if (this.getTreasure === false && this.map[this.gridX][this.gridY] === 6) {
      this.map[this.gridX][this.gridY] = 0;
      this.getTreasure = true;
      this.grid.getTile(this.gridX, this.gridY).clear();
    }

    let neighborArray = this.availableNext(opponent);
    let neighbor = [];
    for (let n of neighborArray) {
      neighbor.push(n.direction);
    }
    if (neighbor.length === 0) {
      this.state = RobberState.CAUGHT;
    }
    else if (neighbor.indexOf(this.direction) >= 0) {
      this.moveTo(this.direction);
      this.state = RobberState.COPSTURN;
    }
    else if (this.getTreasure === true && this.gridX === 1 &&
      this.gridY === 1) {
      this.state = RobberState.WIN;
    }
    else {
      this.state = RobberState.THINKING;
    }
  }

}