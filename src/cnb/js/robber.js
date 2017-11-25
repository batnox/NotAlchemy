class Robber extends Sprite{
    constructor(gridX, gridY, grid, head, type) {
        super();
        this.type = type;
        this.bounds = new RectangleBounds();
        this.bounds.setPosition(gridX * GRID_SIZE, gridY * GRID_SIZE);
        this.bounds.setSize(GRID_SIZE, GRID_SIZE);
        this.image = new ImageComponent();
        this.image.bounds = this.bounds;
        this.score = 0;

        this.setPosition(gridX, gridY);
        this.grid = grid;
        this.head = head;
        this.nextCell = null;
        this.direction = Direction.RIGHT;
    }

    draw(context) {
        super.draw(context);
        if (this.nextCell) {
            this.nextCell.draw(context);
        }
    }

    setPosition(x, y) {
        this.gridX = x;
        this.gridY = y;
        this.bounds.setPosition(x * GRID_SIZE, y * GRID_SIZE);
    }

    updatePosition(x, y, dir) {
        let prevX = this.gridX;
        let prevY = this.gridY;
        let prevDir = this.direction;

        this.setPosition(x, y);
        this.direction = dir;
        if (this.nextCell) {
            this.nextCell.updatePosition(prevX, prevY, prevDir);
        }
    }

}