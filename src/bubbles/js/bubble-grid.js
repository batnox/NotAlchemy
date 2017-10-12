class BubbleGrid {
  constructor() {
    this.bubbles = [][];
  }

  addBubble(x, y, bubble) {
    this.bubbles[x][y] = bubble;
    bubble.bounds.x = x * bubble.bounds.radius * 2;
    bubble.bounds.y = y * bubble.bounds.radius * 2;
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
    this.bubbles.forEach(row => row.forEach(bubble => bubble.draw(context)));
  }
}