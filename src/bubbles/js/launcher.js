class Launcher extends Sprite {
  constructor(x, y) {
    super();
    this.LEFT_BOUND = -70;
    this.RIGHT_BOUND = 70;
    this.RADIUS = 200;

    this.bounds = new RectangleBounds();
    this.bounds.x = x;
    this.bounds.y = y;
    this.image = new ImageComponent();
    this.image.setImage('guide');
    this.image.bounds = this.bounds;

    this.state = LauncherState.EMPTY;
    this.loadedBubble = null;
    this.setLaunchRotation(0);
  }

  loadBubble(bubble) {
    this.loadedBubble = bubble;
    this.state = LauncherState.LOADED;
  }

  turnLeft() {
    if (this.degree > this.LEFT_BOUND) {
      this.setLaunchRotation(this.degree - 2);
    }
  }

  turnRight() {
    if (this.degree < this.RIGHT_BOUND) {
      this.setLaunchRotation(this.degree + 2);
    }
  }

  launch() {
    this.loadedBubble.velocityX =
      (this.bubbleX - this.bounds.x) / 80;
    this.loadedBubble.velocityY =
      (this.bubbleY - this.bounds.y) / 80;
    this.state = LauncherState.FIRED;
  }

  setLaunchRotation(degree) {
    this.degree = degree;
    this.bounds.setRotation(degree);
    this.bubbleX = this.bounds.x + Math.sin(this.toRadians(degree)) *
      this.RADIUS;
    this.bubbleY = this.bounds.y - Math.cos(this.toRadians(degree)) *
      this.RADIUS;

    if (this.loadedBubble) {
      this.loadedBubble.setPosition(this.bubbleX, this.bubbleY);
    }
  }

  toRadians(degree) {
    return degree * Math.PI / 180;
  }

  draw(context) {
    super.draw(context);
    if (this.loadedBubble) {
      this.loadedBubble.draw(context);
    }
  }

  update() {
    switch (this.state) {
      case LauncherState.EMPTY:
        console.log('E');
        let randomBubble = new Bubble(
          this.bubbleX, this.bubbleY,
          BUBBLE_RADIUS, BubbleType.GREEN
        );
        this.loadBubble(randomBubble);
        break;
      case LauncherState.LOADED:
        console.log(`L: ${this.loadedBubble} - (${this.bubbleX}, ${this.bubbleY})`);
        this.loadedBubble.setPosition(this.bubbleX, this.bubbleY);
        break;
      case LauncherState.FIRED:
        console.log('F');
        this.loadedBubble.update();
        break;
    }
  }

}