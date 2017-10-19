class BubbleGrid {
  constructor(width, height) {
    this.bubbles = [];
    this.width = width;
    this.height = height;
    for (let i = 0; i < height; i++) {
      this.bubbles.push([]);
    }
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

    if (0 < x) {
      this.updateNeighbor(bubble, this.getBubble(x - 1, y), spawned);
      if (y % 2 === 0) {
        if (0 < y) {
          this.updateNeighbor(bubble, this.getBubble(x - 1, y - 1), spawned);
        }
        if (y + 1 < this.height) {
          this.updateNeighbor(bubble, this.getBubble(x - 1, y + 1), spawned);
        }
      }
    }
    if (0 < y) {
      this.updateNeighbor(bubble, this.getBubble(x, y - 1), spawned);
    }
    if (y + 1 < this.height) {
      this.updateNeighbor(bubble, this.getBubble(x, y + 1), spawned);
    }
    if (x + 1 < this.width) {
      this.updateNeighbor(bubble, this.getBubble(x + 1, y), spawned);
      if (y % 2 === 1) {
        if (0 < y) {
          this.updateNeighbor(bubble, this.getBubble(x + 1, y - 1), spawned);
        }
        if (y + 1 < this.height) {
          this.updateNeighbor(bubble, this.getBubble(x + 1, y + 1), spawned);
        }
      }
    }
  }

  updateNeighbor(bubble, neighbor, spawned) {
    if (neighbor) {
      bubble.neighbors.push(neighbor);
      neighbor.neighbors.push(bubble);

      if (bubble.type === neighbor.type) {
        for (let b of neighbor.matches) {
          bubble.matches.push(b);
        }
        neighbor.matches.push(bubble);
        console.log(bubble.type + ' - ' + bubble.matches.length);

        if (!spawned && bubble.matches.length >= BUBBLE_MATCH_COUNT) {
          console.log('MATCH');
          for (let matchedBubble of bubble.matches) {
            matchedBubble.explode();
          }
        }
      }
    }
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

    xOnLine(x0, y0, m, y) {
        return (x0 + m * (y - y0));
    }

    yOnLine(x0, y0, m, x) {
        return (y0 + (1 / m) * (x - x0));
    }

    twoDdot(x0, y0, x1, y1){
        return x0*x1 + y0*y1;
    }

    bubbleLineTracing(launchedBubble, theta){
        let bubblesOnLine = [];
        let launchX0 = launchedBubble.bounds.x;
        let launchY0 = launchedBubble.bounds.y;
        let vX0 = launchedBubble.velocityX;
        let vY0 = launchedBubble.velocityY;
        let canvaswidth = 800;
        let canvasheight = 800;
        if(vX0 != 0){
            let slope = vY0 / vX0;

            let tempx1 = 0.0;
            let tempy1 = this.yOnLine(launchY0, launchY0, slope, 0);

            let tempx2 = this.width;
            let tempy2 = this.yOnLine(launchY0, launchY0, slope, canvaswidth);

            let tempx3 = this.xOnLine(launchX0, launchY0, slope, 0);
            let tempy3 = 0.0;

            let tempx4 = this.xOnLine(launchX0, launchY0, slope, canvasheight);
            let tempy4 = this.height;

            if(((tempy1 - launchY0)/ (tempx1 - launchX0)) === slope && tempy1 >= 0 && tempy1 <= canvasheight){
                let launchX1 = tempx1;
                let launchY1 = tempy1;
            }
            else if(((tempy2 - launchY0)/ (tempx2 - launchX0)) === slope && tempy2 >= 0 && tempy2 <= canvasheight){
                let launchX1 = tempx2;
                let launchY1 = tempy2;
            }
            else if(((tempy3 - launchY0)/ (tempx3 - launchX0)) === slope && tempx3 >= 0 && tempx3 <= canvaswidth){
                let launchX1 = tempx3;
                let launchY1 = tempy3;
            }
            else if(((tempy4 - launchY0)/ (tempx4 - launchX0)) === slope && tempx4 >= 0 && tempx4 <= canvaswidth){
                let launchX1 = tempx4;
                let launchY1 = tempy4;
            }
        }

        else{
            let launchX1 = launchX0;

            if(velocityY < 0.0){
                let launchY0 = 0.0;
            }
            else{
                let launchY0 = canvasheight;
            }
        }

        let dirX = launchX1 - launchX0;
        let dirY = launchY1 - launchY0;

        for(var i = 0; i < this.width; i++){
            for(var j=0; j< this.height; j++){
                let circleH = this.getBubble(i,j).bounds.x;
                let circleK = this.getBubble(i,j).bounds.y;

                let fvecX = launchX0 - this.getBubble(i,j).x;
                let fvecY = launchY0 - this.getBubble(i,j).y;

                let quadA = this.twoDdot(dirX, dirY, dirX, dirY);
                let quadB = 2 * (this.twoDdot(dirX, dirY, fvecX, fvecY));
                let quadC = this.twoDdot(fvecX, fvecY, fvecX, fvecY) - this.getBubble(i,j).bounds.radius * this.getBubble(i,j).bounds.radius;

                let discriminant = quadB*quadB - 4*quadA*quadC;

                if(discriminant >= 0.0){
                    discriminant = Math.sqrt(discriminant);
                    let t1 = (-quadB - discriminant)/(2*quadA);
                    // let t2 = (-b + discriminant)/(2*);
                    if(t1 >= 0 || t1 <= 1){
                        bubblesOnLine.push(this.getBubble(i,j));
                    }
                }
            }

        }

        return bubblesOnLine;
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
    // for (let x = 0; x < 40; x++) {
    //   for (let y = 0; y < 40; y++) {
    //     if (x % 10 === 0 || y % 10 === 0) {
    //       context.strokeStyle = '#f0f';
    //     } else {
    //       context.strokeStyle = '#808';
    //     }
    //     context.strokeRect(x * 20, y * 20, 20, 20);
    //   }
    // }
    this.bubbles.forEach(row => row.forEach(bubble => {
      if (bubble) {
        bubble.draw(context);
      }
    }));
  }
}