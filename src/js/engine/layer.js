class Layer {
  constructor() {
    this.drawables = [];
  }

  addDrawable(drawable) {
    this.drawables.push(drawable);
  }

  removeDrawable(index) {
    return this.drawables.splice(index, 1);
  }

  clear() {
    this.drawables = [];
  }

  draw(context) {
    for (let drawable of this.drawables) {
      drawable.draw(context);
    }
  }
}