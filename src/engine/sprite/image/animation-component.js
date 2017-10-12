class AnimationComponent {
  constructor() {
    this.bounds = null;
    this.visible = true;

    this.currentImage = -1;
    this.timeRemaining = -1;
    this.sequence = [];
  }

  addImage(name, time) {
    this.sequence.push({
      name: name,
      time: time
    });
    if (this.sequence.length === 1) {
      this.currentImage = 0;
      this.timeRemaining = time;
    }
  }

  setVisible(visible) {
    this.visible = visible;
  }

  update() {
    this.timeRemaining--;
    if (this.timeRemaining <= 0) {
      this.currentImage++;
      this.currentImage %= this.sequence.length;
      this.timeRemaining = this.sequence[this.currentImage].time;
    }
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  draw(context) {
    if (this.visible && this.currentImage >= 0) {
      let current = this.sequence[this.currentImage].name;
      let i = imageManager.getImage(current);
      if (!i) {
        throw Error('No image: ' + current);
      }
      let image = imageManager.getImage(current).image;
      let imageOffset = imageManager.getImage(current).offset;
      context.save();
      context.translate(
        this.bounds.x + this.bounds.width / 2,
        this.bounds.y + this.bounds.height / 2
      );
      context.rotate(this.bounds.rotation * Math.PI / 180);
      if (!image || !image.src) {
        throw Error(`No image \'${current.name}\'.`);
      }
      context.drawImage(
        image,
        imageOffset, 0,
        image.height, image.height,
        -this.bounds.width / 2, -this.bounds.height / 2,
        this.bounds.width, this.bounds.height
      );

      context.restore();
    }
  }
}