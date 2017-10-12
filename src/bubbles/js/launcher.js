class Launcher extends Sprite {
  constructor(x, y) {
    super();
    this.leftBound = -70;
    this.rightBound = 70;
    this.isShooting = false;
    this.bounds = new RectangleBounds();
    this.bounds.x = x;
    this.bounds.y = y;
    this.image = new ImageComponent();
    this.image.bounds = this.bounds;
    this.radius = 200;
    this.degree = 60;
    this.bounds.setRotation(this.degree);
    this.bubbleX = this.bounds.x + Math.sin(this.toRadians(this.bounds.rotation)) * this.radius;
    this.bubbleY = this.bounds.y - Math.cos(this.toRadians(this.bounds.rotation)) * this.radius;
    console.log(this.bubbleX);

    addEventListener('keydown', event => this.keyDown(event));
  }

  toRadians(degree) {
    return degree * Math.PI / 180;
  }

  keyDown(event) {
    switch (event.keyCode) {
      case 37: // Left
        if (this.degree > this.leftBound) {
          this.degree -= 2;
        }
        break;
      case 39: // Right
        if (this.degree < this.rightBound) {
          this.degree += 2;
        }
        break;
      case 32: // space
        console.log('space detected');
        this.isShooting = true;
        break;
      default:
        break;
    }
    this.bounds.setRotation(this.degree);
    this.bubbleX = this.bounds.x + Math.sin(this.toRadians(this.bounds.rotation)) * this.radius;
    this.bubbleY = this.bounds.y - Math.cos(this.toRadians(this.bounds.rotation)) * this.radius;
  }

  draw(context) {
    super.draw(context);
  }

}