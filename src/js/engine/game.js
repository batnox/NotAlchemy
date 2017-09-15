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

    /**
     * All layers to be drawn, starting with index 0. This results in the highest
     * indexed layer being drawn last, and therefore on top of all other layers.
     * @type {Layer[]}
     */
    this.layers = [];

    /**
     * The sprite layer for in-game objects.
     * @type {Layer}
     */
    this.spriteLayer = new Layer();
    this.layers[0] = this.spriteLayer;
    /**
     * The overlay layer for HUD objects.
     * @type {Layer}
     */
    this.overlayLayer = new Layer();
    this.layers[1] = this.overlayLayer;

    this.content = [];

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
    let ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.strokeStyle = '#fff';
    ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.layers.length; i++) {
      this.layers[i].draw(ctx);
    }
  }

  addContent(name, path) {
    for (let content of this.content) {
      if (content.name === name) {
        throw Error(`Name \'${name}\' is taken by \'${content.path}\'.`);
      }
    }
    this.content.push({
      name: name,
      path: path
    });
  }

  /**
   * Loads all content.
   * @returns {*} A promise.
   */
  loadContent() {
    $.ajaxSetup({
      beforeSend: (xhr) => {
        if (xhr.overrideMimeType) {
          xhr.overrideMimeType('application/json');
        }
      }
    });

    return new Promise((resolve, reject) => {
      let loaded = {};
      let running = 0;
      for (let content of this.content) {
        running++;
        $.getJSON(content.path).then(data => {
          running--;
          loaded[content.name] = data;
          if (running === 0) {
            resolve(loaded);
          }
        });
      }
    });
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