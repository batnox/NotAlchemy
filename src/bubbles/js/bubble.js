class Bubble extends Sprite {
  constructor(x, y, r, bubbleType) {
    super();
    this.bounds = new CircleBounds();
    this.image = new ImageComponent();
    this.image.bounds = new RectangleBounds();
    this.setPosition(x, y);
    this.setRadius(r);
    this.type = bubbleType;
    this.velocityX = 0;
    this.velocityY = 0;
    this.neighbors = [];
    this.animateFrame = 0;

  }

  setPosition(x, y) {
    this.bounds.setPosition(x, y);
    this.image.bounds.setPosition(x, y);
  }

  setRadius(radius) {
    this.bounds.radius = radius;
    this.image.bounds.setSize(radius * 2, radius * 2);
  }

  set type(type) {
    this._type = type;
    switch (this._type) {
      case BubbleType.BLUE:
        this.image.setImage('bubble-blue');
        break;
      case BubbleType.GREEN:
        this.image.setImage('bubble-green');
        break;
      case BubbleType.PURPLE:
        this.image.setImage('bubble-purple');
        break;
      case BubbleType.RED:
        this.image.setImage('bubble-red');
        break;
      case BubbleType.YELLOW:
        this.image.setImage('bubble-yellow');
        break;
      case BubbleType.BATTY:
        this.image.setImage('assets/SpriteSheetBatty.png');
        break;
    }
  }

  move(){
    if (this.velocityX !== 0 || this.velocityY !== 0){
      this.wallRebound();
      this.setPosition(this.bounds.x += this.velocityX, this.bounds.y += this.velocityY);
    }
  }

  wallRebound(){
      let canvas = document.getElementById('alchemy-canvas');
      let cWidth = canvas.width;

      if (this.bounds.x < 0 || this.bounds.x + this.bounds.radius > cWidth ) {
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