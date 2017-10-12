class Bubble extends Sprite {
  constructor(x, y, r, bubbleType) {
    super();
    this.setSize(r*2, r*2); // TODO Set a bubble size somewhere
    this.type = bubbleType;
    this.velocityX = 0;
    this.velocityY = 0;
    this.neighbors = [];
    this.x = x;
    this.y = y;
    this.r = r;
    this.animateFrame = 0;

  }

  set type(type) {
    this._type = type;
    switch (this._type) {
      case BubbleType.BLUE:
        this.setImage('bubble-blue');
        break;
      case BubbleType.GREEN:
        this.setImage('bubble-green');
        break;
      case BubbleType.PURPLE:
        this.setImage('bubble-purple');
        break;
      case BubbleType.RED:
        this.setImage('bubble-red');
        break;
      case BubbleType.YELLOW:
        this.setImage('bubble-yellow');
        break;
        case BubbleType.BATTY:
          this.setImage('assets/SpriteSheetBatty.png');
          break;
    }
  }

  move(){
    if (this.velocityX !=0 || this.velocityY != 0){
      this.wallRebound();
      this.x += this.velocityX;
      this.y += this.velocityY;
    }
  }

  wallRebound(){
      let canvas = document.getElementById('alchemy-canvas');
      let cWidth = canvas.width;

      if (this.x < 0 || this.x + this.width > cWidth ) {
          this.velocityX = -this.velocityX;
      }
  }

  setStayPosition(){

    //this.x =  Math.floor(this.x/20)*20 + this.r;
    //this.y =  Math.floor(this.y/20)*20 + this.r;
    /*
    if (this.y%2 !== 0){
      this.y += this.height;
    }
    */
    this.velocityX = 0;
    this.velocityY = 0;
  }

  doExplosion(){
    return imageManager.canOffsetIncrease(this.image);
  }

}