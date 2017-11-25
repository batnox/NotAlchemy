class CnbGrid extends Grid{
    constructor(width, height){
        super(width, height);
    }

    addTile(x, y, image) {
        if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
            throw Error(`Invalid tile coordinate (${x}, ${y}).`);
        }
        let sprite = new Sprite();
        sprite.bounds = new RectangleBounds();
        sprite.bounds.setPosition(x * CNB_GRID_SIZE, y * CNB_GRID_SIZE);
        sprite.bounds.setSize(CNB_GRID_SIZE, CNB_GRID_SIZE);
        sprite.image = new ImageComponent();
        sprite.image.setImage(image);
        sprite.image.bounds = sprite.bounds;
        this.getTile(x, y).setSprite(0, sprite);
    }

    addWall(x, y, variant) {
        if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
            throw Error(`Invalid tile coordinate (${x}, ${y}).`);
        }
        this.getTile(x, y).setSprite(0, new Wall(x, y, this, CNB_GRID_SIZE, variant));
    }

    removeTile(x, y) {
        this.getTile(x, y).setSprite(0, null);
    }
}

