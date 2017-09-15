class Snake extends Game {
  constructor() {
    super();
    this.worm = new SnakeSegment();
    this.currentDirection = "right";
    this.scorecount = 0;
    this.snakeSprites = new SpriteGroup();
    this.wallSprites = new SpriteGroup();
    this.stepsize=10;
    /**
     * Determines the direction that the Snake will go
     */
    addEventListener('keydown', event => this.onKeyDown(event));
    this.addContent('images','json/snake_elements.json');
    this.loadContent()
        .this(() => this.start());
  }

  loadContent(){
      return super.loadContent()
          .then(data => {
              this.worm.snakeHead.setImage(data['images'].snakes[0].img);
              this.snakeSprites.add(this.worm.snakeHead);
              currentCell = this.worm.snakeHead.nextCell;
              while(currentCell!=null){
                currentCell.setImage(data['images'].snakes[1].img);
                  this.snakeSprites.add(currentCell);
                  currentCell = currentCell.nextCell;
              }
              }
          );
  }

  /**
   * Handles changing the snake's direction based on user input. 
   */
  onKeyDown(event) {
    'use strict';
    //up
    if(event.keyCode == '38') {
      this.setDirection(Directions.UP);
      this.currentDirection = "up";
    //down
    } else if (event.keyCode == '40') {
     this.setDirection(Directions.DOWN);
      this.currentDirection = "down";
    //left
    } else if (event.keyCode == '37') {
      this.setDirection(Directions.LEFT);
      this.currentDirection = "left";
    //right
    } else if (event.keyCode == '39') {
      this.setDirection(Directions.RIGHT);
      this.currentDirection = "right";
    }
  }
  
  update() {
    super.update();
    worm.moveSegment(currentDirection, 10);
    let foodcheck = foodSprites.isCollision();
    let wallcheck = wallSprites.isCollision();
    let bodycheck = snakeSprites.isCollision();
    if(foodcheck) {
      worm.addlink(stepsize);
      scorecount++;
    } else if(wallcheck || bodycheck) {
      scorecount = scorecount * 100;
    }
  }
  
  draw() {
   super.draw(); 
  }
}
