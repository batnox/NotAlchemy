class Cop extends Character{
    constructor(gridX, gridY, size, map, image) {
        super(gridX, gridY, size, map, image);
        this.wander = true;
    }

    update(opponent){
        if (this.wander){
            let neighbor = this.availableNext(opponent);
            this.direction = neighbor[Math.floor(Math.random() * neighbor.length)];
            this.moveTo(this.direction);
        }
    }

}