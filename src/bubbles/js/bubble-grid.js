class BubbleGrid extends Grid {
    constructor(width, height) {
        super(width, height);
        this.gameOver = false;
    }

    addBubble(x, y, bubble, spawned) {
        /*
        if (!this.getTile(x, y).isEmpty()) {
          console.log(this.getTile(x, y));
          throw Error('Cannot add bubble to filled position.')
        }
        */
        this.getTile(x, y).addSprite(bubble);
        let bx = x * bubble.bounds.radius * 2;
        let by = y * bubble.bounds.radius * Math.sqrt(3);

        if (y % 2 === 1) {
            bx += bubble.bounds.radius;
        }
        bubble.setPosition(bx, by);
        bubble.setGridPosition(x, y, spawned);
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

        this.positionCheck(tileX, tileY, bubble);

        this.addBubble(bubble.bounds.x, bubble.bounds.y, bubble);
    }

    positionCheck(x, y, bubble){
        if (!this.getTile(x, y).isEmpty()){
            if (y + 1 >=this.height){
                this.gameOver = true;
                return;
            }

            if(this.getTile(x, y+1).isEmpty()){
                bubble.setPosition(x, y+1);
                return;
            }
            if(x% 2 === 1){
                if(this.getTile(x+1, y+1).isEmpty()){
                    bubble.setPosition(x+1, y+1);
                    return;
                }
            }
            else {
                if(this.getTile(x-1, y+1).isEmpty()){
                    bubble.setPosition(x-1, y+1);
                    return;
                }
            }
            /*
            if(this.getTile(x-1, y).isEmpty()){
                bubble.setPosition(x-1, y);
                return;
            }
            if(this.getTile(x+1, y).isEmpty()){
                bubble.setPosition(x+1, y);
                return;
            }
            */
            throw Error('position check error, 2 neighbors is not empty');
        }
        else {
            bubble.setPosition(x, y);
        }
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
        let launchX1 = 0.0;
        let launchY1 = 0.0;
        if(vX0 != 0.0){
            let slope = vY0 / vX0;

            let tempx1 = 0.0;
            let tempy1 = this.yOnLine(launchX0, launchY0, slope, 0);

            let tempx2 = this.width;
            let tempy2 = this.yOnLine(launchX0, launchY0, slope, canvaswidth);

            let tempx3 = this.xOnLine(launchX0, launchY0, slope, 0);
            let tempy3 = 0.0;

            let tempx4 = this.xOnLine(launchX0, launchY0, slope, canvasheight);
            let tempy4 = this.height;

            if(((tempy1 - launchY0)/ (tempx1 - launchX0)) === slope && tempy1 >= 0 && tempy1 <= canvasheight){
                launchX1 = tempx1;
                launchY1 = tempy1;
            }
            else if(((tempy2 - launchY0)/ (tempx2 - launchX0)) === slope && tempy2 >= 0 && tempy2 <= canvasheight){
                launchX1 = tempx2;
                launchY1 = tempy2;
            }
            else if(((tempy3 - launchY0)/ (tempx3 - launchX0)) === slope && tempx3 >= 0 && tempx3 <= canvaswidth){
                launchX1 = tempx3;
                launchY1 = tempy3;
            }
            else if(((tempy4 - launchY0)/ (tempx4 - launchX0)) === slope && tempx4 >= 0 && tempx4 <= canvaswidth){
                launchX1 = tempx4;
                launchY1 = tempy4;
            }
        }

        else{
            let launchX1 = launchX0;

            if(velocityY < 0.0){
                launchY1 = 0.0;
            }
            else{
                launchY1 = canvasheight;
            }
        }

        let dirX = launchX1 - launchX0;
        let dirY = launchY1 - launchY0;

        for(let i = 0; i < this.width; i++){
            for(let j=0; j< this.height; j++){
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

}