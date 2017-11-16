class PathTrace extends Grid {
    constructor(width, height) {
        super(width, height);
        this.gameOver = false;
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

    lineTracing(Object, theta) {
        let objectsOnLine = [];
        let initX = Object.bounds.x;
        let initY = Object.bounds.y;
        let initVelocityX = Object.velocityX;
        let initVelocityY = Object.velocityY;
        let canvasWidth = 800;
        let canvasHeight = 800;
        let newX = 0.0;
        let newY = 0.0;
        if(initVelocityX != 0.0) {
            let slope = initVelocityX/initVelocityY;
            let tempNewX = 0.0;
            let tempNewY = this.yOnLine(initX, initY, slope, 0);
            let tempNewX2 = this.width;
            let tempNewY2 = this.yOnLine(initX, initY, slope, canvasWidth);

            let tempNewX3 = this.xOnLine(initX, initY, slope, 0);
            let tempNewY3 = 0.0;

            let tempNewX4 = this.xOnLine(initX, initY, slope, canvasHeight);
            let tempNewY4 = this.height;
            if(((tempNewY - initY)/ (tempNewX - initX)) === slope && tempNewX >= 0 && tempNewY <= canvasHeight){
                newX = tempNewX;
                newY = tempNewY;
            }
            else if(((tempNewY2 - initX)/ (tempNewX2 - initY)) === slope && tempNewY2 >= 0 && tempNewY2 <= canvasHeight){
                newX = tempNewX2;
                newY = tempNewY2;
            }
            else if(((tempNewY3 - initX)/ (tempNewX3 - initY)) === slope && tempNewX3 >= 0 && tempNewX3 <= canvasWidth){
                newX = tempNewX3;
                newY = tempNewY3;
            }
            else if(((tempNewY4 - initX)/ (tempNewX4 - initY)) === slope && tempNewX4 >= 0 && tempNewX4 <= canvasWidth) {
                newX = tempNewX4;
                newY = tempNewY4;
            } else{
                let newX = initX;

                if(initVelocityY < 0.0){
                    newY = 0.0;
                }
                else{
                    newY = canvasHeight;
                }
            }
            let dirX = initX - newX;
            let dirY = initY - newY;
            for(let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.height; j++) {
                    let rectangleH = this.getRectangle(i,j).bounds.x;
                    let rectangleK = this.getRectangle(i,j).bounds.y;

                    let fvecX = initX - this.getRectangle(i,j).x;
                    let fvecY = initY - this.getRectangle(i,j).y;

                    let quadA = this.twoDdot(dirX, dirY, dirX, dirY);
                    let quadB = 2 * (this.twoDdot(dirX, dirY, fvecX, fvecY));
                    let quadC = this.twoDdot(fvecX, fvecY, fvecX, fvecY) - this.getRectangle(i,j).bounds.width * this.getRectangle(i,j).bounds.height;
                    let discriminant = quadB*quadB - 4*quadA*quadC;

                    if(discriminant >= 0.0) {
                        discriminant = Math.sqrt(discriminant);
                        let t1 = (-quadB - discriminant) / (2 * quadA);
                        // let t2 = (-b + discriminant)/(2*);
                        if (t1 >= 0 || t1 <= 1) {
                            objectsOnLine.push(this.getRectangle(i, j))
                        }
                    }
                }
            }
        }
        return objectsOnLine;
    }
}
