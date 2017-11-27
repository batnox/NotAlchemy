class Cop extends Character {
  constructor(gridX, gridY, size, map, image, grid, robber) {
    super(gridX, gridY, size, map, image, grid, robber);
    this.robber = robber;
    this.wander = false;
  }

  update(opponent) {
    if (this.wander) {
      let neighbor = this.availableNext(opponent);
      if (neighbor.length > 0) {
        this.direction = neighbor[Math.floor(Math.random() *
          neighbor.length)].direction;
        this.moveTo(this.direction);
      }
    } else {
      let path = this.Astar(this.gridX, this.gridY, this.grid.robber.gridX,
        this.grid.robber.gridY);
      if (path) {
        let next = path.nextTile;
        if (next.x !== this.grid.robber.gridX ||
          next.y !== this.grid.robber.gridY) {
          this.setPosition(next.x, next.y);
        }
      } else {
        path = this.Astar(
          this.gridX, this.gridY,
          this.grid.robberBuddy.gridX, this.grid.robberBuddy.gridY
        );

        if (path) {
          let next = path.nextTile;
          if (next.x !== this.grid.robber.gridX ||
            next.y !== this.grid.robber.gridY) {
            this.setPosition(next.x, next.y);
          }
        }
      }
      // If there is no path, wait for one to open
    }
  }

  Astar(startX, startY, destX, destY) {
    let open = [];
    let closed = [];
    for (let i = 0; i < this.grid.width; i++) {
      closed[i] = [];
      for (let j = 0; j < this.grid.height; j++) {
        closed[i][j] = false;
        this.grid.getTile(i, j).heuristicCost = 0;
        this.grid.getTile(i, j).finalCost = 0;
        this.grid.getTile(i, j).parent = null;
      }
    }

    open.push(this.grid.getTile(startX, startY));

    let current;
    let temp;
    while (true) {
      current = open.shift();
      if (!current) {
        return null;
      }
      if (current === this.grid.getTile(destX, destY)) {
        break;
      }

      let tiles = this.grid.getNeighbors(current.x, current.y, this.grid.cops);

      for (let i = 0; i < tiles.length; i++) {
        this.updateCost(
          current, tiles[i].tile,
          current.finalCost + 1,
          open, closed,
          destX, destY
        );
      }
      closed[current.x][current.y] = true;
    }

    let length = 0;
    let pathCurrent;
    let nextTile = null;

    //Trace back the path
    //System.out.println("Path: ");
    pathCurrent = this.grid.getTile(destX, destY);
    // System.out.print(current);
    length += 1;
    while (pathCurrent.parent !== null) {
      length += 1;
      if (pathCurrent.parent === this.grid.getTile(startX, startY)) {
        nextTile = pathCurrent;
      }
      pathCurrent = pathCurrent.parent;
    }

    return {
      nextTile: nextTile,
      length: length
    };
  }

  computeHeuristicCost(x, y, destX, destY) {
    return Math.abs(destX - x) + Math.abs(destY - y);
  }

  updateCost(currentTile, tempTile, cost, open, closed, destX, destY) {
    if (closed[tempTile.x][tempTile.y]) {
      return;
    }

    tempTile.heuristicCost = this.computeHeuristicCost(tempTile.x, tempTile.y,
      destX, destY);
    let temp_final_cost = tempTile.heuristicCost + cost;
    let inOpen = open.includes(tempTile);
    if (!inOpen || temp_final_cost < tempTile.finalCost) {
      tempTile.finalCost = temp_final_cost;
      tempTile.parent = currentTile;
      if (!inOpen) open.push(tempTile);
    }
  }

}