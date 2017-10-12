class BubbleGrid {
  constructor(width, height) {
    this.bubbles = [];
    this.width = width;
    this.height = height;
    for (let i = 0; i < height; i++) {
      this.bubbles.push([]);
    }
  }

  addBubble(x, y, bubble) {
    this.bubbles[x][y] = bubble;
    let bx = x * bubble.bounds.radius * 2;
    let by = y * bubble.bounds.radius * Math.sqrt(3);

    if (y % 2 === 1) {
      bx += bubble.bounds.radius;
    }
    bubble.setPosition(bx, by);
  }

  getBubble(x, y) {
    return this.bubbles[x][y];
  }

  alignBubble(bubble) {
    let tileX = bubble.bounds.x / (bubble.bounds.radius * 2);
    let tileY = bubble.bounds.y / (bubble.bounds.radius * 2);
    this.addBubble(tileX, tileY, bubble);
  }

  draw(context) {
    this.bubbles.forEach(row => row.forEach(bubble => {
      bubble.draw(context);
    }));
  }
}