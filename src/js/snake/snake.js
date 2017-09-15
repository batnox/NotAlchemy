class Snake extends Game {
  constructor() {
    super();
    this.worm = new SnakeSegment();
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
    //down
    } else if (event.keyCode == '40') {
     this.setDirection(Directions.DOWN);
    //left
    } else if (event.keyCode == '37') {
      this.setDirection(Directions.LEFT);
    //right
    } else if (event.keyCode == '39') {
      this.setDirection(Directions.RIGHT);
    }
  }
  
  update() {
    super.update();
    worm.moveSegment();
  }
  
  draw() {
   super.draw(); 
  }
}
