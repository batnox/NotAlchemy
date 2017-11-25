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
        }
        this.setPosition(this.gridX, this.gridY);
    }

    draw(context) {
        super.draw(context);
    }

    setPosition(x, y) {
        this.gridX = x;
        this.gridY = y;
        this.bounds.setPosition(x * this.size, y * this.size);
    }

}