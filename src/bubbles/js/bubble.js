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
    this.matches = [];
  }

  setPosition(x, y) {
    this.bounds.setPosition(x, y);
    this.image.bounds.setPosition(x, y);
  }

  setRadius(radius) {
    this.bounds.radius = radius;
    this.image.bounds.setSize(radius * 2, radius * 2);
  }

  setGridPosition(gridX, gridY, spawned) {
    this.gridX = gridX;
    this.gridY = gridY;

    this.updateNeighbors(spawned);
  }

  updateNeighbors(spawned) {
    this.matches = [];
    let tiles = [];
    let neighbors = [];

    if (this.gridX - 1 >= 0) {
      tiles.push(this.grid.getTile(this.gridX - 1, this.gridY));
      if (this.gridY % 2 === 0) {
        if (this.gridY - 1 >= 0) {
          tiles.push(this.grid.getTile(this.gridX - 1, this.gridY - 1));
        }
        if (this.gridY + 1 < this.grid.height) {
          tiles.push(this.grid.getTile(this.gridX - 1, this.gridY + 1));
        }
      }
    }
    if (this.gridY - 1 >= 0) {
      tiles.push(this.grid.getTile(this.gridX, this.gridY - 1));
    }
    if (this.gridY + 1 < this.grid.height) {
      tiles.push(this.grid.getTile(this.gridX, this.gridY + 1));
    }
    if (this.gridX + 1 < this.grid.width) {
      tiles.push(this.grid.getTile(this.gridX + 1, this.gridY));
      if (this.gridY % 2 === 1) {
        if (this.gridY - 1 >= 0) {
          tiles.push(this.grid.getTile(this.gridX + 1, this.gridY - 1));
        }
        if (this.gridY + 1 < this.grid.height) {
          tiles.push(this.grid.getTile(this.gridX + 1, this.gridY + 1));
        }
      }
    }

    tiles.forEach(tile => {
      if (!tile.isEmpty()) {
        neighbors.push(tile.getSprites()[0]);
      }
    });

    neighbors.forEach(neighbor => {
      if (this.type === neighbor.type) {
        neighbor.matches.forEach(match => {
          if (!match.matches.includes(this)) {
            match.matches.push(this);
          }
          this.matches.push(match);
        });
        if (!neighbor.matches.includes(this)) {
          neighbor.matches.push(this);
        }
        this.matches.push(neighbor);

        if (!spawned && this.matches.length >= BUBBLE_MATCH_COUNT - 1) {
          this.matches.forEach(match => match.explode());
          this.explode();
        }
      }
    });
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
      this.grid.getTile(this.gridX, this.gridY).clear();
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
