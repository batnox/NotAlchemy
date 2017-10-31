class BubbleGrid extends Grid {
  constructor(width, height) {
    super(width, height);
    this.gameOver = false;
  }

  addBubble(x, y, bubble, spawned) {
    this.getTile(x, y).addSprite(bubble);
    let bx = x * bubble.bounds.radius * 2;
    let by = y * bubble.bounds.radius * Math.sqrt(3);

    if (y % 2 === 1) {
      bx += bubble.bounds.radius;
    }
    bubble.setPosition(bx, by);
    bubble.setGridPosition(x, y);
    bubble.updateNeighbors(spawned);
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

}