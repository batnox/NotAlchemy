class AStar {

    Astar(startx, starty, destx, desty, pathlength, nextTileToMove) {
        let open = [];
        let closed = [];
        for (let i = 0; i < this.grid.width; i++) {
            for (let j = 0; j < this.grid.height; j++) {
                closed[i][j] = false;
                this.grid.getTile(i, j).heuristicCost = 0;
                this.grid.getTile(i, j).finalCost = 0;
                this.grid.getTile(i, j).parent = null;
            }
        }

        open.push(this.grid.getTile(startx, starty));

        let current;
        while (true) {
            current = open.shift();
            if (current === null) {
                break;
            }
            closed[current.x][current.y] = true;
            if (current === this.grid.getTile(destx, desty)) {
                break;
            }

            let tempneighbour = this.robbers.getSpriteByIndex(0).getNeighbor(current.x, current.y, this.map.getMap(this.currentLevel), this.grid);
            for (let i = 0; i < tempneighbour.length; i++) {
                this.updateCost(current, tempneighbour[i], current.finalCost + 1, open, closed, destx, desty);
            }


        }

        let tempPathLength = 0;
        let pathCurrent;

        if (closed[destx][desty]) {
            //Trace back the path
            //System.out.println("Path: ");
            pathCurrent = this.grid.getTile(destx, desty);
            // System.out.print(current);
            tempPathLength += 1;
            while (pathCurrenturrent.parent != null) {
                tempPathLength += 1;
                if (pathCurrent.parent() === this.grid.getTile(startx, starty)) {
                    nextTileToMove = pathCurrent;
                }
                pathCurrent = pathCurrent.parent;
            }

        }

        pathlength = tempPathLength;


    }

    computeHeuristicCost(x, y, destx, desty) {
        return Math.abs(destx - x) + Math.abs(desty - y);
    }


    updateCost(currentTile, tempTile, cost, open, closed, destx, desty) {
        if (closed[tempTile.x][tempTile.y]) {
            return;
        }

        tempTile.heuristicCost = this.computeHeuristicCost(tempTile.x, tempTile.y, destx, desty);
        let temp_final_cost = tempTile.heuristicCost + cost;
        let inOpen = open.includes(t);
        if (!inOpen || temp_final_cost < tempTile.finalCost) {
            tempTile.finalCost = t_final_cost;
            tempTile.parent = currentTile;
            if (!inOpen) open.add(tempTile);
        }
    }

}