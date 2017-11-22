/**
 * Represents an animation of sprites for the game
 */
class AnimationComponent {
  /**
   * Basic constructor of an animation conponent
   * @param repeat the Sprite sheet of animation to use
   */
  constructor(repeat) {
    /**
     * The shared bounds of the set of animation cells
     * @type (bounds-component)
     */
    this.bounds = null;
    /**
     * Whether or not the animation set is visible
     * @type {boolean}
     */
    this.visible = true;
    /**
     * Whether or not the animation is being performed
     * @type {boolean}
     */
    this.running = false;
    /**
     * The Animation spritesheet to repeat
     */
    this.repeat = repeat;
    /**
     *
     * @type {null}
     */
    this.onEnd = null;
    /**
     * The index of the current image in the animation sprite sheet
     * @type {number}
     */
    this.currentImage = -1;
    /**
     * How much time is remaining to run the animation
     * @type {number}
     */
    this.timeRemaining = -1;
    /**
     * The sequence of sprites to show in an animation
     * @type {Array}
     */
    this.sequence = [];
  }
  /**
   * Adds a sprite image to the animation based on its name and how long to run it
   * @param name the name of the sprite image
   * @param time the amount of time to display the sprite image
   */
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
  /**
   * Sets the visibility of an object
   * @param visible (boolean)
   */
  setVisible(visible) {
    this.visible = visible;
  }
  /**
   * Starts running the animation by setting 'running' to true
   */
  start() {
    this.running = true;
  }
  /**
   * Ends the running of the animation by setting 'running' to false
   */
  end() {
    this.running = false;
  }
  /**
   * Updates the animation based on the amount of time remaining
   */
  update() {
    if (this.running) {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.currentImage++;
        if (this.currentImage >= this.sequence.length) {
          if (this.repeat) {
            this.currentImage %= this.sequence.length;
          } else {
            this.running = false;
          }
          if (this.onEnd) {
            this.onEnd();
            return;
          }
        }
        this.timeRemaining = this.sequence[this.currentImage].time;
      }
    }
  }

  /**
   * Draws the animation onto the game screen
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