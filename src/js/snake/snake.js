class Snake extends Game {
  constructor() {
    super();
    this.worm = new SnakeSegment();
    this.currentDirection = "right";
    this.scorecount = 0;
    /**
     * Determines the direction that the Snake will go
     */
    addEventListener('keydown', event => this.onKeyDown(event));
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
    if(//Collides with food) {
      worm.addlink(10);
      scorecount++;
    } else if( //collides with wall or collides with self // ) {
      //Score message
    }
  }
  
  draw() {
   super.draw(); 
  }
}
