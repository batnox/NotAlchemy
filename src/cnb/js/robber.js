class Robber extends Sprite {
    constructor(gridX, gridY, size) {
        super();
        this.size = size;
        this.bounds = new RectangleBounds();
        this.bounds.setPosition(gridX * this.size, gridY * this.size);
        this.bounds.setSize(this.size, this.size);
        this.image = new ImageComponent();
        this.image.bounds = this.bounds;
        this.image.setImage('robber');
        this.score = 0;
        this.points = 500;

        this.setPosition(gridX, gridY);
        this.nextCell = null;
        this.direction = null;
        this.gameOver = false;
    }

    getScore(){
        return this.score;
    }

    update(map, grid) {
        if (map[this.gridX][this.gridY] === 6){
            this.score += this.points;
            map[this.gridX][this.gridY] = 0;
            grid.removeTile(this.gridX, this.gridY);
            console.log(this.getScore());
        }
        let newX = this.gridX, newY = this.gridY;

        let neighbor = this.getNeighbor(this.gridX, this.gridY, map, grid);
        if (neighbor.length == 0){
            this.gameOver = true;
        }
        else{
            if (neighbor.indexOf(this.direction) >=0){
                this.moveTo(this.direction);
            }
        }
        /*
        switch (this.direction) {
            case Direction.LEFT:
                newX = this.gridX-1;
                if (map[newX][newY] === 2 || map[newX][newY] === 0 || map[newX][newY] === 6){
                    this.gridX = newX;
                }
                this.direction = null;
                break;
            case Direction.RIGHT:
                newX = this.gridX+1;
                if (map[newX][newY] === 4 || map[newX][newY] === 0 || map[newX][newY] === 6){
                    this.gridX = newX;
                }
                this.direction = null;
                break;
            case Direction.UP:
                newY = this.gridY-1;
                if (map[newX][newY] === 3 || map[newX][newY] === 0 || map[newX][newY] === 6){
                    this.gridY = newY;
                }
                this.direction = null;
                break;
            case Direction.DOWN:
                newY = this.gridY+1;
                if (map[newX][newY] === 5 || map[newX][newY] === 0 || map[newX][newY] === 6){
                    this.gridY = newY;
                }
                this.direction = null;
                break;
        }*/
        this.setPosition(this.gridX, this.gridY);
    }

    draw(context) {
        super.draw(context);
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

    getNeighbor(x, y, map, grid){
        let neighbor = [];
        if (x-1 > 0 && (map[x-1][y] === 0 || map[x-1][y] === 6 || map[x-1][y] === 2) ){
            let sprites = grid.getTile(x-1, y).getSprites();
            if (sprites.length <= 0)
                neighbor.push(Direction.LEFT);
            else if (sprites[0]&&sprites[0].image.name!== 'cop')
                neighbor.push(Direction.LEFT);
            else if (!sprites[0])
                neighbor.push(Direction.LEFT);
        }
        if (x+1 < map[0].length && (map[x+1][y] === 0 || map[x+1][y] === 6 || map[x+1][y] === 4)) {
            let sprites = grid.getTile(x + 1, y).getSprites();
            if (sprites.length <= 0)
                neighbor.push(Direction.RIGHT);
            else if (sprites[0] && sprites[0].image.name !== 'cop')
                neighbor.push(Direction.RIGHT);
            else if (!sprites[0])
                neighbor.push(Direction.RIGHT);
        }



        if (y-1 > 0 && (map[x][y-1] === 0 || map[x][y-1] === 6 || map[x][y-1] === 3)){
            let sprites = grid.getTile(x, y-1).getSprites();
            if (sprites.length <= 0)
                neighbor.push(Direction.UP);
            else if (sprites[0]&&sprites[0].image.name!== 'cop')
                neighbor.push(Direction.UP);
            else if (!sprites[0])
                neighbor.push(Direction.UP);
        }
        if (y+1 < map.length && (map[x][y+1] === 0 || map[x][y+1] === 6 || map[x][y+1] === 5)){
            let sprites = grid.getTile(x, y+1).getSprites();
            if (sprites.length <= 0)
                neighbor.push(Direction.DOWN);
            else if (sprites[0]&&sprites[0].image.name!== 'cop')
                neighbor.push(Direction.DOWN);
            else if (!sprites[0])
                neighbor.push(Direction.DOWN);
        }

        return neighbor;
    }

    setPosition(x, y) {
        this.gridX = x;
        this.gridY = y;
        this.bounds.setPosition(x * this.size, y * this.size);
    }

}