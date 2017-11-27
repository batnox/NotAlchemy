class Tile {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sprites = [];
        this.isWall = 0;
        this.finalCost = 0;
        this.heuristicCost = 0;
        this.parent = null;
    }

    addSprite(sprite) {
        this.sprites.push(sprite);
    }

    setSprite(index, sprite) {
        this.sprites[index] = sprite;
    }

    getSprites() {
        return this.sprites;
    }

    clear() {
        this.sprites = [];
    }

    isEmpty() {
        return this.sprites.length === 0;
    }

    draw(context) {
        this.sprites.forEach(sprite => {
            if (sprite) {
                sprite.draw(context);
            }
        });
    }

    update() {
        this.sprites.forEach(sprite => {
            if (sprite) {
                sprite.update();
            }
        });
    }

    setIsWall() {
        this.isWall = 1;
    }

    getWallStats() {
        return this.isWall;
    }

}


