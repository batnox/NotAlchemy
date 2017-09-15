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

    set roationStatus(status){
        this.isRotated = status;
    }
}