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
    let cx = bubble.bounds.x;
    let cy = bubble.bounds.y;
    console.log(`${cx}, ${cy}`);

    if (cy % 2 === 1) {
      cx -= bubble.bounds.radius;
    }
    let tileX = Math.round(cx / (bubble.bounds.radius * 2));
    let tileY = Math.round(cy / (bubble.bounds.radius * 1.7));
    console.log(`${tileX}, ${tileY}`);
    bubble.velocityX = 0;
    bubble.velocityY = 0;
    this.addBubble(tileX, tileY, bubble);
  }

  draw(context) {
    for (let x = 0; x < 40; x++) {
      for (let y = 0; y < 40; y++) {
        if (x % 10 === 0 || y % 10 === 0) {
          context.strokeStyle = '#f0f';
        } else {
          context.strokeStyle = '#808';
        }
        context.strokeRect(x * 20, y * 20, 20, 20);
      }
    }
    this.bubbles.forEach(row => row.forEach(bubble => {
      bubble.draw(context);
    }));
  }
}