class Cop extends Sprite{
    constructor(gridX, gridY, size, grid, map) {
        super();
        this.grid = grid;
        this.grid.addTile(gridX, gridY, 'cop');
        this.direction = Direction.LEFT;
        this.gridX = gridX;
        this.gridY = gridY;
        this.size = size;
        this.wander = true;
        this.map = map;
    }

    draw(context) {
        super.draw(context);
    }

    setPosition(x, y) {
        this.grid.addTile(this.gridX, this.gridY, 'cop');
        console.log(x + " " + y);
    }

    update(){
        super.update();
        if (this.wander){
            this.getNext();
            this.moveTo(this.gridX, this.gridY);
        }
    }

    getNext(){
        let neighbor = this.getNeighbor();
        this.direction = neighbor[Math.floor(Math.random() * neighbor.length)];
        this.moveTo(this.direction);
    }

    getNeighbor(){
        let neighbor = [];
        if (this.gridX -1 > 0 && this.map[this.gridX-1][this.gridY] != 1 ){
            neighbor.push(Direction.LEFT);
        }
        if (this.gridX +1 < this.map[0].length && this.map[this.gridX+1][this.gridY] != 1 ){
            neighbor.push(Direction.RIGHT);
        }
        if (this.gridY -1 > 0 && this.map[this.gridX][this.gridY-1] != 1 ){
            neighbor.push(Direction.UP);
        }
        if (this.gridY +1 < this.map.length && this.map[this.gridX][this.gridY+1] != 1 ){
            neighbor.push(Direction.DOWN);
        }
        return neighbor;
    }

    moveTo(dir){
        this.grid.removeTile(this.gridX, this.gridY);
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



}