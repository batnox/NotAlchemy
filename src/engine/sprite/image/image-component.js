class ImageComponent {
  constructor() {
    this.bounds = null;
    this.name = null;
    this.visible = true;
  }

  setImage(name) {
    this.name = name;
  }

  setVisible(visible) {
    this.visible = visible;
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  draw(context) {
    if (this.visible && this.name) {
      context.save();
      context.translate(
        this.bounds.x + this.bounds.width / 2,
        this.bounds.y + this.bounds.height / 2
      );
      context.rotate(this.bounds.rotation * Math.PI / 180);
      let image = imageManager.getImage(this.name);
      if (!image) {
        throw Error(`No image \'${this.name}\'.`)
      }
      context.drawImage(
        image,
        -this.bounds.width / 2, -this.bounds.height / 2,
        this.bounds.width, this.bounds.height
      );
      context.restore();
    }
  }
}