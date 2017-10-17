class Bubble extends Sprite {
  constructor(x, y, r, bubbleType, grid) {
    super();
    this.bounds = new CircleBounds();
    this.image = new ImageComponent();
    this.image.bounds = new RectangleBounds();
    this.setPosition(x, y);
    this.setRadius(r);

    this.grid = grid;
    this.gridX = 0;
    this.gridY = 0;
    this.type = bubbleType;
    this.velocityX = 0;
    this.velocityY = 0;
    this.neighbors = [this];
    this.matches = [this];
  }

  setPosition(x, y) {
    this.bounds.setPosition(x, y);
    this.image.bounds.setPosition(x, y);
  }

  setRadius(radius) {
    this.bounds.radius = radius;
    this.image.bounds.setSize(radius * 2, radius * 2);
  }

  setGridPosition(gridX, gridY) {
    this.gridX = gridX;
    this.gridY = gridY;
  }

  updateNeighbor(x, y, spawned) {
    if (0 < x && x < this.width - 1) {
      if (0 < y && y < this.height - 1) {
        let neighbor = this.getBubble(x, y);
        if (neighbor) {
          this.neighbors.push(neighbor);
        }
      }
    }
  }

  updateNeighbors(spawned) {
    this.neighbors = [];
    this.updateNeighbor(x - 1, y, spawned);
    if (y % 2 === 0) {
      this.updateNeighbor(x - 1, y - 1, spawned);
      this.updateNeighbor(x - 1, y + 1, spawned);
    }
    this.updateNeighbor(x, y - 1, spawned);
    this.updateNeighbor(x, y + 1, spawned);
    this.updateNeighbor(x + 1, y, spawned);
    if (y % 2 === 1) {
      this.updateNeighbor(x + 1, y - 1, spawned);
      this.updateNeighbor(x + 1, y + 1, spawned);
    }
  }

  set type(type) {
    this._type = type;
    switch (this._type) {
      case BubbleType.BLUE:
        this.image.setImage('bubble-blue');
        break;
      case BubbleType.GREEN:
        this.image.setImage('bubble-green');
        break;
      case BubbleType.PURPLE:
        this.image.setImage('bubble-purple');
        break;
      case BubbleType.RED:
        this.image.setImage('bubble-red');
        break;
      case BubbleType.YELLOW:
        this.image.setImage('bubble-yellow');
        break;
      case BubbleType.BATTY:
        this.image.setImage('batty');
        break;
      case BubbleType.SKULL:
        this.image.setImage('skull');
        break;
      case BubbleType.JACK:
        this.image.setImage('jack');
        break;
      case BubbleType.CLOWN:
        this.image.setImage('clown');
        break;
    }
  }

  get type() {
    return this._type;
  }

  explode() {
    BUBBLE_SCORE += BUBBLE_EXPLOSION_SCORE;
    this.image = new AnimationComponent(false);
    this.image.bounds = new RectangleBounds();
    this.image.bounds.setPosition(
      this.bounds.x,
      this.bounds.y
    );
    this.image.bounds.setSize(
      this.bounds.radius * 2,
      this.bounds.radius * 2
    );

    if (this._type === BubbleType.BATTY) {
      this.image.addImage('batty', 15);
      this.image.addImage('batty-1', 15);
      this.image.addImage('batty-2', 15);
      this.image.addImage('batty-3', 15);
      this.image.addImage('batty-4', 15);
    } else if (this._type === BubbleType.SKULL) {
      this.image.addImage('skull', 15);
      this.image.addImage('skull-1', 15);
      this.image.addImage('skull-2', 15);
      this.image.addImage('skull-3', 15);
      this.image.addImage('skull-4', 15);
    } else if (this._type === BubbleType.JACK) {
      this.image.addImage('jack', 15);
      this.image.addImage('jack-1', 15);
      this.image.addImage('jack-2', 15);
      this.image.addImage('jack-3', 15);
      this.image.addImage('jack-4', 15);
    } else if (this._type === BubbleType.CLOWN) {
      this.image.addImage('clown', 15);
      this.image.addImage('clown-1', 15);
      this.image.addImage('clown-2', 15);
      this.image.addImage('clown-3', 15);
      this.image.addImage('clown-4', 15);
    }

    this.image.onEnd = () => {
      this.grid.removeBubble(this.gridX, this.gridY);
    };
    this.image.start();
  }

  update() {
    super.update();
    if (this.velocityX !== 0 || this.velocityY !== 0) {
      this.setPosition(
        this.bounds.x + this.velocityX,
        this.bounds.y + this.velocityY
      );

      let canvas = document.getElementById('alchemy-canvas');

      if (this.bounds.x < 0 ||
        this.bounds.x > canvas.width - this.bounds.radius * 2) {
        this.velocityX = -this.velocityX;
      }
    }
  }

}
