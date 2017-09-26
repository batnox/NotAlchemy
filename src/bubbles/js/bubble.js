class Bubble extends Sprite {
  constructor(bubbleType) {
    super();
    this.setSize(20, 20); // TODO Set a bubble size somewhere
    this.type = bubbleType;
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
    }
  }
}