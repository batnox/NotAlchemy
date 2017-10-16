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
        this.image.setImage('batty');
        break;
      case BubbleType.SKULL:
        this.image.setImage('skull');
        break;
      case BubbleType.JACK:
        this.image.setImage('jack');
        break;
      case BubbleType.CLOWN:
        this.image.setImage('clown');
        break;
    }
  }

  explode() {
    this.image = new AnimationComponent();
    this.image.bounds = new RectangleBounds();
    this.image.bounds.setPosition(
      this.bounds.x,
      this.bounds.y
    );
    this.image.bounds.setSize(
      this.bounds.radius * 2,
      this.bounds.radius * 2
    );
    
    if (this._type == BubbleType.BATTY) {
      this.image.addImage('batty', 15);
      this.image.addImage('batty-1', 15);
      this.image.addImage('batty-2', 15);
      this.image.addImage('batty-3', 15);
      this.image.addImage('batty-4', 15);
    } else if (this._type == BubbleType.SKULL) {
      this.image.addImage('skull', 15);
      this.image.addImage('skull-1', 15);
      this.image.addImage('skull-2', 15);
      this.image.addImage('skull-3', 15);
      this.image.addImage('skull-4', 15);
    } else if (this._type == BubbleType.JACK) {
      this.image.addImage('jack', 15);
      this.image.addImage('jack-1', 15);
      this.image.addImage('jack-2', 15);
      this.image.addImage('jack-3', 15);
      this.image.addImage('jack-4', 15);
    } else if (this._type == BubbleType.CLOWN) {
      this.image.addImage('clown', 15);
      this.image.addImage('clown-1', 15);
      this.image.addImage('clown-2', 15);
      this.image.addImage('clown-3', 15);
      this.image.addImage('clown-4', 15);
    }
  }

  update() {
    this.setPosition(
      this.bounds.x + this.velocityX,
      this.bounds.y + this.velocityY
    );

    let canvas = document.getElementById('alchemy-canvas');

    if (this.bounds.x < 0 ||
      this.bounds.x > canvas.width - this.bounds.radius * 2) {
      this.velocityX = -this.velocityX;
    }
  }

}
