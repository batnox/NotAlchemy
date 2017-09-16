class SnakeSegment {
    constructor(){
        this.snakeHead = new SnakeCell("head", null, right);
        this.snakeTail = snakeHead;
        snakeHead.setPosition(20,20);

    }

    //moves snake
    moveSnake(direction, stepsize){
        if(direction=="right"){
                snakeHead.setPosition(x-stepsize, y);
                direction = "left";

        }
        else if(direction=="left"){
                snakeHead.setPosition(x + stepsize, y);
                direction = "right";

        }
        else if(direction == "up"){
                snakeHead.setPosition(x, y + stepsize);
                direction = "down";

        }
        else if(direction == "down"){

                snakeHead.setPosition(x, y - stepsize);
                direction = "up";

        }

        if(direction!=snakeHead.relativeDirection) {
            snakeHead.setRotation(90);
        }
        temp = head.nextCell;
        while(temp!=null){
            temp.setPosition(temp.previousCell.x,temp.previousCell.y);
            if(temp.previousCell.isRotated){
                temp.setRotation(90);
                temp.rotationStatus(true);
                temp.previousCell.rotationStatus(false);
            }
            temp=temp.nextCell;
        }
    }

    addlink(stepsize){
        tailx = snakeTail.x;
        taily = snakeTail.y;
        tailDirection = snakeTail.relativeDirection;
        if(tailDirection == "right"){
            tailx = tailx - stepsize;
        }
        else if(tailDirection == "left"){
            tailx = tailx + stepsize;
        }
        else if(tailDirection == "up"){
            taily = taily + stepsize;
        }
        else{
            taily = taily - stepsize;
        }

        newCell = new SnakeCell(body, snakeTail, snakeTail.direction);
        newCell.setPosition(tailx, taily);
        snakeTail.setNextCell(newCell);
        this.setBodyImage(snakeTail);
        snakeTail = newCell;
        return newCell;

    }

    setBodyImage(currentCell){
        currentCell.setImage(data['images'].snakes[1].img);
    }

}