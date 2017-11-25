class Cop extends Sprite{
    constructor(gridX, gridY, size, grid) {
        super();
        /*
        this.size = size;
        this.bounds = new RectangleBounds();
        this.bounds.setPosition(gridX * this.size, gridY * this.size);
        this.bounds.setSize(this.size, this.size);
        this.image = new ImageComponent();
        this.image.bounds = this.bounds;
        this.image.setImage('cop');
        this.score = 0;
        this.points = 500;
        this.setPosition(gridX, gridY);
        this.grid = grid;
        */
        this.grid = grid;
        this.grid.addTile(gridX, gridY, 'cop');
        //this.nextCell = null;
        this.direction = null;
        //this.gameOver = false;
        console.log("create cop");
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