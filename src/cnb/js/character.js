class Character extends Sprite{
    constructor(gridX, gridY, size, map, image, grid) {
        super();
        this.gridX = gridX;
        this.gridY = gridY;
        this.size = size;
        this.map = map;
        this.grid = grid;

        this.direction = null;

        this.bounds = new RectangleBounds();
        this.bounds.setPosition(gridX * this.size, gridY * this.size);
        this.bounds.setSize(this.size, this.size);
        this.image = new ImageComponent();
        this.image.bounds = this.bounds;
        this.image.setImage(image);

        this.setPosition(this.gridX, this.gridY);
    }

    setPosition(x, y) {
        this.gridX = x;
        this.gridY = y;
        this.bounds.setPosition(this.gridX * this.size, this.gridY * this.size);
    }

    moveTo(dir){
        switch (dir) {
            case Direction.LEFT:
                this.gridX-=1;
                break;
            case Direction.RIGHT:
                this.gridX+=1;
                break;
            case Direction.UP:
                this.gridY-=1;
                break;
            case Direction.DOWN:
                this.gridY+=1;
                break;
        }
        this.setPosition(this.gridX, this.gridY);
        this.direction = null;
    }

    availableNext(opponent){
        let neighbor = [];
        //LEFT
        if (this.gridX-1 > 0 && (this.map[this.gridX-1][this.gridY] === 0 || this.map[this.gridX-1][this.gridY] === 6 || this.map[this.gridX-1][this.gridY] === 2 || this.map[this.gridX-1][this.gridY] === 7) ){
            let overlap = false;
            for (let op of opponent) {
                if (op.bounds.contains((this.gridX - 1)*this.size, this.gridY*this.size))
                    overlap = true;
            }
            if (!overlap) {
                neighbor.push({
                  tile: this.grid.getTile(this.gridX - 1, this.gridY),
                  direction: Direction.LEFT
                });
            }
        }
        //RIGHT
        if (this.gridX+1 < this.map[0].length && (this.map[this.gridX+1][this.gridY] === 0 || this.map[this.gridX+1][this.gridY] === 6 || this.map[this.gridX+1][this.gridY] === 4 || this.map[this.gridX+1][this.gridY] === 7)) {
            let overlap = false;
            for (let op of opponent) {
                if (op.bounds.contains((this.gridX + 1)*this.size, this.gridY*this.size))
                    overlap = true;
            }
            if (!overlap) {
              neighbor.push({
                tile: this.grid.getTile(this.gridX + 1, this.gridY),
                direction: Direction.RIGHT
              });
            }
        }
        //UP
        if (this.gridY-1 > 0 && (this.map[this.gridX][this.gridY-1] === 0 || this.map[this.gridX][this.gridY-1] === 6 || this.map[this.gridX][this.gridY-1] === 3 || this.map[this.gridX][this.gridY-1] === 7)){
            let overlap = false;
            for (let op of opponent) {
                if (op.bounds.contains(this.gridX*this.size, (this.gridY - 1)*this.size))
                    overlap = true;
            }
            if (!overlap) {
              neighbor.push({
                tile: this.grid.getTile(this.gridX, this.gridY - 1),
                direction: Direction.UP
              });
            }
        }
        //DOWN
        if (this.gridY+1 < this.map.length && (this.map[this.gridX][this.gridY+1] === 0 || this.map[this.gridX][this.gridY+1] === 6 || this.map[this.gridX][this.gridY+1] === 5 || this.map[this.gridX][this.gridY+1] === 7)){
            let overlap = false;
            for (let op of opponent) {
                if (op.bounds.contains(this.gridX*this.size, (this.gridY + 1)*this.size))
                    overlap = true;
            }
            if (!overlap) {
              neighbor.push({
                tile: this.grid.getTile(this.gridX, this.gridY + 1),
                direction: Direction.DOWN
              });
            }
        }

        return neighbor;
    }


}