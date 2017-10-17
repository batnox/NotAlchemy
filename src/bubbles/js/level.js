/*
 * Written by Wan-Yi Yeh (wyeh2), but Nikolas McGovern (nmcgove).
 * Committed by Nikolas McGovern due to GitHub being down at the time.
 */
class Level {
  constructor(width, height, r) {
    this.width = width;
    this.height = height;
    this.r = r;
    this.level = [];
    this.level.push(this.createLevel(0));
    this.level.push(this.createLevel(1));
    this.level.push(this.createLevel(2));
  }

  createLevel(difficulty) {
    let types = Object.values(BubbleType);

    let bubbleOnGrid = new BubbleGrid(this.width, this.height);
    //first line
    for (let x = 0; x < this.width; x++) {
      let index = Math.floor(Math.random() * types.length);
      let color = types[index];
      bubbleOnGrid.addBubble(x, 0, new Bubble(0, 0, this.r, color, bubbleOnGrid), true);
    }
    //console.log(bubbleOnGrid);

    //difficulty
    for (let y = 1; y < 9; y++) {
      for (let x = 0; x < this.width; x++) {
        //1. separate neighbor colors and other colors
        let neighbors = [];
        let others = [];
        //1-1 neighbor
        neighbors.push(bubbleOnGrid.getBubble(x, y - 1)._type);
        if (x > 0) {
          neighbors.push(bubbleOnGrid.getBubble(x - 1, y)._type);
        }

        let text = "";
        //1-2 others
        for (let ct of types) {
          let exist = false;
          for (let n of neighbors) {
            if (ct === n)
              exist = true;
          }
          if (exist)
            continue;
          others.push(ct);
          text += " " + ct;
        }
        console.log(text);


        //2. decide draw which color based by difficulty
        if (difficulty < 1) {//easy
          bubbleOnGrid.addBubble(x, y, new Bubble(x, y, this.r, neighbors[0], bubbleOnGrid), true);
        }
        else if (difficulty < 2) {//middle
          if (y % 3 === 0) {
            bubbleOnGrid.addBubble(x, y, new Bubble(x, y, this.r, others[Math.floor(Math.random() * others.length)], bubbleOnGrid), true);
          }
          else {
            bubbleOnGrid.addBubble(x, y, new Bubble(x, y, this.r, neighbors[0], bubbleOnGrid), true);
          }
        }
        else {//hard
          let rad = Math.random();

          if (rad < 0.5) {
            bubbleOnGrid.addBubble(x, y, new Bubble(x, y, this.r, neighbors[Math.floor(Math.random() * neighbors.length)], bubbleOnGrid), true);
          }
          else {

            bubbleOnGrid.addBubble(x, y, new Bubble(x, y, this.r, others[Math.floor(Math.random() * others.length)], bubbleOnGrid), true);

          }
        }
      }
    }
    return bubbleOnGrid;
  }
}

