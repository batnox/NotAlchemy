class Game {
  constructor() {
    /**
     * The pixel size of the displayed sprites.
     * @type {number}
     */
    this.IMAGE_SIZE = 80;
    /**
     * The number of game loops every second.
     * @type {number}
     */
    this.TICK_PER_SECOND = 30;

    /**
     * The HTML canvas on the webpage.
     * @type {Element}
     */
    this.canvas = document.getElementById('alchemy-canvas');

    /**
     * The sprite group of all known element sprites. Display elements always
     * remain on the page and can be copied but not moved.
     * @type {SpriteGroup}
     */
    this.displaySprites = new SpriteGroup();

    /**
     * The sprite group of all dropped element sprites. Dropped elements can
     * be moved around the page.
     * @type {SpriteGroup}
     */
    this.droppedSprites = new SpriteGroup();

    /**
     * The sprite currently held by the mouse while being drag-and-dropped.
     * @type Sprite
     */
    this.heldSprite = null;

    /**
     * The position of the mouse on the canvas.
     * @type {{x: number, y: number}}
     */
    this.mouse = {};

    this.alchemy = new Alchemy();

    // Adds all of the event listeners
    this.canvas.addEventListener('mousedown',
      (event) => this.onMouseDown(event));
    this.canvas.addEventListener('mouseup', (event) => this.onMouseUp(event));
    this.canvas.addEventListener('mousemove',
      (event) => this.onMouseMove(event));

    // Loads content and then sets the game loop
    this.alchemy.loadContent()
      .then(() => {
        setInterval(() => {
          this.update();
          this.draw();
        }, 1000 / this.TICK_PER_SECOND);
      });
  }

  /**
   * Updates the game data to the current state. Redraws all known elements to ensure that the
   * displayed sprites are updated. Also sets the currently held sprite to be at the mouse position.
   */
  update() {
    let x = 0;
    let y = 0;
    this.displaySprites = new SpriteGroup();
    this.alchemy.knownElements.forEach((element) => {
      let sprite = new Sprite(x, y, this.IMAGE_SIZE, this.IMAGE_SIZE,
        element.imageSrc, element.id);
      this.displaySprites.add(sprite);
      x += this.IMAGE_SIZE;

      if (x + this.IMAGE_SIZE > this.canvas.width) {
        x = 0;
        y += this.IMAGE_SIZE;
      }
    });

    if (this.heldSprite && this.mouse) {
      this.heldSprite.x = this.mouse.x -
        this.heldSprite.width / 2;
      this.heldSprite.y = this.mouse.y -
        this.heldSprite.height / 2;
    }
  }

  /**
   * Draws the canvas. Outlines the canvas and draws all display sprites, dropped sprites, and the held sprite.
   */
  draw() {
    this.canvas.width = $(window).width();
    this.canvas.height = $(window).height();
    this.canvas.style.width = $(window).width();
    this.canvas.style.height = $(window).height();
    let ctx = this.canvas.getContext('2d');

    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    this.displaySprites.sprites.forEach((sprite) => {
      ctx.drawImage(sprite.image, sprite.x, sprite.y, sprite.width,
        sprite.height);
      ctx.strokeRect(sprite.x, sprite.y, sprite.width, sprite.height);
    });
    this.droppedSprites.sprites.forEach((sprite) => {
      ctx.drawImage(sprite.image, sprite.x, sprite.y, sprite.width,
        sprite.height);
    });
    if (this.heldSprite) {
      ctx.drawImage(this.heldSprite.image, this.heldSprite.x, this.heldSprite.y,
        this.heldSprite.width, this.heldSprite.height);
    }
  }

  /**
   * Returns the sprite located at the given coordinates.
   * @param x {number} The x-coordinate.
   * @param y {number} The y-coordinate.
   * @returns {Sprite} The sprite at the given coordinates or <code>null<code> if none is found.
   */
  getSprite(x, y) {
    let displaySprite = this.displaySprites.getSprite(x, y);
    if (displaySprite) {
      return displaySprite;
    }

    let droppedSprite = this.droppedSprites.getSprite(x, y);
    if (droppedSprite) {
      return droppedSprite;
    }

    return null;
  }

  /**
   * On the mouse being pressed, selects the element grabbed (if there is one).
   * @param event {Event} The mouse event.
   */
  onMouseDown(event) {
    let pos = this.getMousePosition(event);
    this.heldSprite = this.getSprite(pos.x, pos.y);
    this.droppedSprites.removeSprite(this.heldSprite);
  }

  /**
   * On the mouse being released, drops the element held (if there is one). It also
   * checks if the dropped element overlaps any other elements. If it overlaps one of
   * the display sprites, it is removed from the canvas. If it overlaps one of the
   * other dropped sprites, it attempts to combine the two elements.
   * @param event {Event} The mouse event.
   */
  onMouseUp(event) {
    'use strict';
    let pos = this.getMousePosition(event);

    if (!this.heldSprite) {
      return;
    }

    let displayOverlap = this.displaySprites.getOverlap(this.heldSprite);
    if (displayOverlap) {
      this.heldSprite = null;
      return;
    }

    let droppedOverlap = this.droppedSprites.getOverlap(this.heldSprite);
    if (droppedOverlap) {
      let heldElement = this.alchemy.getElement(this.heldSprite.data);
      let droppedElement = this.alchemy.getElement(droppedOverlap.sprite.data);
      let result = this.alchemy.combine(heldElement, droppedElement);

      if (result) {
        this.heldSprite = null;
        let resultSprite = new Sprite(
          droppedOverlap.sprite.x,
          droppedOverlap.sprite.y,
          droppedOverlap.sprite.width,
          droppedOverlap.sprite.height,
          result.imageSrc,
          result.id
        );
        this.droppedSprites.removeIndex(droppedOverlap.index);
        this.droppedSprites.add(resultSprite);
        return;
      }
    }

    this.droppedSprites.add(this.heldSprite);
    this.heldSprite = null;
  }

  /**
   * On the mouse being moved, the mouse position is updated.
   * @param event {Event} The mouse event.
   */
  onMouseMove(event) {
    this.mouse = this.getMousePosition(event);
  }

  /**
   * Converts the coordinates in the mouse event to the coordinates on the canvas.
   * @param event {Event} The mouse event
   * @returns {{x: number, y: number}}
   */
  getMousePosition(event) {
    return {
      x: event.x - this.canvas.getBoundingClientRect().left,
      y: event.y - this.canvas.getBoundingClientRect().top
    };
  }
}