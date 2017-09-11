class Game {
  constructor() {
    /**
     * The number of game loops every second.
     * @type {number}
     */
    this.TICK_PER_SECOND = 30;

    /**
     * The HTML canvas on the web page.
     * @type {Element}
     */
    this.canvas = document.getElementById('alchemy-canvas');

    /**
     * The position of the mouse on the canvas.
     * @type {{x: number, y: number}}
     */
    this.mouse = {};

    this.sprites = [];

    addEventListener('mousemove', event => this.onMouseMove(event));
  }

  start() {
    setInterval(() => {
      this.update();
      this.draw();
    }, 1000 / this.TICK_PER_SECOND);
  }

  update() {

  }

  draw() {
    this.canvas.width = $(window).width();
    this.canvas.height = $(window).height();
    this.canvas.style.width = $(window).width();
    this.canvas.style.height = $(window).height();
    let ctx = this.canvas.getContext('2d');

    for (let sprite of this.sprites) {
      sprite.draw(ctx);
    }
  }

  /**
   * Loads all content.
   * @returns {*} A promise.
   */
  loadContent() {

  }

  /**
   * On the mouse being moved, the mouse position is updated. Converts the coordinates in the
   * mouse event to the coordinates on the canvas.
   * @param event {Event} The mouse event.
   */
  onMouseMove(event) {
    this.mouse.x = event.x - this.canvas.getBoundingClientRect().left;
    this.mouse.y = event.y - this.canvas.getBoundingClientRect().top;
  }
}