class CnbGrid extends Grid{
    constructor(width, height){
        super(width, height);
    }

    addTile(x, y, image) {
        if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
            throw Error(`Invalid tile coordinate (${x}, ${y}).`);
        }
        this.getTile(x, y).setSprite(0, imgae);
    }

    addWall(x, y, variant) {
        if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
            throw Error(`Invalid tile coordinate (${x}, ${y}).`);
        }
        this.getTile(x, y).setSprite(0, new Wall(x, y, this, GRID_SIZE, variant));
    }

    removeTile(x, y) {
        this.getTile(x, y).setSprite(0, null);
    }
}

