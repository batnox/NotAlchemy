class SnakeCell extends Sprite {
    constructor(cellType, previousCell, direction){
        super();
        this.cellType =  cellType;
        this.previousCell = previousCell;
        this.nextCell = null;
        this.relativeDirection = direction;
        this.isRotated = false;

    }

    setNextCell(nextCell){
        this.nextCell=nextCell;
    }

    set rotationStatus(status){
        this.isRotated = status;
    }

  draw(context) {
    super.draw(context);
    console.log(`Cell (${this.x}, ${this.y})`);
    context.fillStyle = '#f0f';
    context.fillRect(this.x, this.y, this.width, this.height);
    if (this.nextCell) {
        this.nextCell.draw(context);
    }
  }
}