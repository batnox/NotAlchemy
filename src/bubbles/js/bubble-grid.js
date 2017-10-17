class BubbleGrid {
  constructor(width, height) {
    this.bubbles = [];
    this.width = width;
    this.height = height;
    this.gameOver = false;
    for (let i = 0; i < height; i++) {
      this.bubbles.push([]);
    }
  }

  isEmpty() {
    for (let x = 0; x < this.width; x++) {
      for (let  y = 0; y < this.height; y++) {
        if (this.getBubble(x, y)) {
          return false;
        }
      }
    }
    return true;
  }

  addBubble(x, y, bubble, spawned) {
    this.bubbles[x][y] = bubble;
    let bx = x * bubble.bounds.radius * 2;
    let by = y * bubble.bounds.radius * Math.sqrt(3);

    if (y % 2 === 1) {
      bx += bubble.bounds.radius;
    }
    bubble.setPosition(bx, by);
    bubble.setGridPosition(x, y);
    bubble.updateNeighbors(spawned);
  }

  getBubble(x, y) {
    return this.bubbles[x][y];
  }

  removeBubble(x, y) {
    this.bubbles[x][y] = null;
  }

  alignBubble(bubble) {
    let cx = bubble.bounds.x;
    let cy = bubble.bounds.y;

    if (cy % 2 === 1) {
      cx -= bubble.bounds.radius;
    }
    let tileX = Math.round(cx / (bubble.bounds.radius * 2));
    let tileY = Math.round(cy / (bubble.bounds.radius * Math.sqrt(3)));
    bubble.velocityX = 0;
    bubble.velocityY = 0;

    if (tileY >= this.height) {
      this.gameOver = true;
    }
    this.addBubble(tileX, tileY, bubble);

    console.log(`Align (${cx}, ${cy}) => (${tileX}, ${tileY}) => (${bubble.bounds.x}, ${bubble.bounds.y})`);
  }

  update() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let bubble = this.getBubble(x, y);
        if (bubble) {
          bubble.update();
        }
      }
    }
  }

  draw(context) {
    for (let x = 0; x < 40; x++) {
      if (x % 10 === 0) {
        context.strokeStyle = '#f0f';
      } else {
        context.strokeStyle = '#808';
      }
      context.strokeRect(x * 20, 0, 1, 800);
    }
    for (let y = 0; y < 40; y++) {
      if (y % 10 === 0) {
        context.strokeStyle = '#f0f';
      } else {
        context.strokeStyle = '#808';
      }
      context.strokeRect(0, y * 20, 800, 1);
    }
    this.bubbles.forEach(row => row.forEach(bubble => {
      if (bubble) {
        bubble.draw(context);
      }
    }));
  }
}