class Tile {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sprites = [];
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

}