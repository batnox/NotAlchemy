/**
 * This manages information on known elements, unknown elements, and their combinations.
 */
class Alchemy extends Game {
  /**
   * Creates an instance of alchemy information.
   */
  constructor() {
    super();

    /**
     * The pixel size of the displayed sprites.
     * @type {number}
     */
    this.IMAGE_SIZE = 80;

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
     * All possible elements.
     * @type {GameElement[]}
     */
    this.elements = [];

    /**
     * All known elements.
     * @type {GameElement[]}
     */
    this.knownElements = [];

    /**
     * All combinations of elements.
     * @type {Combination[]}
     */
    this.combinations = [];

    // Adds all of the event listeners
    this.canvas.addEventListener('mousedown',
      (event) => this.onMouseDown(event));
    this.canvas.addEventListener('mouseup', (event) => this.onMouseUp(event));

    // Loads content and then sets the game loop
    this.loadContent()
      .then(() => this.start());
  }

  /**
   * Returns the element with the given ID.
   * @param id {string} The ID to match.
   * @returns {GameElement} The corresponding element or <code>null</code> if none match.
   */
  getElement(id) {
    for (let i = 0; i < this.elements.length; i++) {
      let element = this.elements[i];
      if (element.id === id) {
        return element;
      }
    }
    return null;
  }

  isKnown(id) {
    for (let element of this.knownElements) {
      if (id === element.id) {
        return true;
      }
    }
    return false;
  }

  /**
   * Combines the two given elements and returns the resulting element. Order is ignored.
   * @param element1 {GameElement} The first element in the combination.
   * @param element2 {GameElement} The second element in the combination.
   * @returns {GameElement} The resulting element or <code>null</code> if the two elements cannot be combined.
   */
  combine(element1, element2) {
    for (let i = 0; i < this.combinations.length; i++) {
      let combination = this.combinations[i];
      let forwardMatch = element1.id === combination.element1
        && element2.id === combination.element2;
      let backwardMatch = element2.id === combination.element1
        && element1.id === combination.element2;

      if (forwardMatch || backwardMatch) {
        let res = this.getElement(combination.result);
        if (!this.isKnown(combination.result)) {
          this.knownElements.push(
            Object.assign(Object.create(Object.getPrototypeOf(res)), res));
        }
        return Object.assign(Object.create(Object.getPrototypeOf(res)), res);
      }
    }
    return null;
  }

  /**
   * Loads all content.
   * @returns {*} A promise.
   */
  loadContent() {
    return this.loadElements()
      .then(() => this.loadImages())
      .then(() => this.loadKnownElements())
      .then(() => this.loadCombinations());
  }

  /**
   * Loads all elements and adds them to the array.
   * @returns {*} A promise.
   */
  loadElements() {
    return $.getJSON('json/elements.json').then((data) => {
      data.elements.forEach((element) => {
        this.elements.push(new GameElement(element.id, element.name));
      });
    });
  }

  /**
   * Loads all images. Goes through each element and gets the image
   * associated with its ID.
   * @returns {*} A promise.
   */
  loadImages() {
    return $.getJSON('json/alchemy-icons.json').then((data) => {
      for (let element of this.elements) {
        element.setImage('data:image/png;base64,' + data[element.id]);
      }
    });
  }

  /**
   * Loads all known elements and adds them to the array.
   * @returns {*} A promise.
   */
  loadKnownElements() {
    return $.getJSON('json/known-elements.json').then((data) => {
      for (let elementID of data.elements) {
        this.knownElements.push(this.getElement(elementID));
      }
    });
  }

  /**
   * Loads all combinations, converts IDs to the element objects, and adds the combinations to the array.
   * @returns {*} A promise.
   */
  loadCombinations() {
    return $.getJSON('json/combinations.json').then((data) => {
      for (let combination of data.combinations) {
        this.combinations.push(
          new Combination(
            combination.element1,
            combination.element2,
            combination.result
          )
        );
      }
    });
  }

  /**
   * Updates the game data to the current state. Redraws all known elements to ensure that the
   * displayed sprites are updated. Also sets the currently held sprite to be at the mouse position.
   * @override
   */
  update() {
    super.update();
    let x = 0;
    let y = 0;
    this.displaySprites = new SpriteGroup();
    for (let element of this.knownElements) {
      element.setPosition(x, y);
      element.setSize(this.IMAGE_SIZE, this.IMAGE_SIZE);
      this.displaySprites.add(element);
      x += this.IMAGE_SIZE;

      if (x + this.IMAGE_SIZE > this.canvas.width) {
        x = 0;
        y += this.IMAGE_SIZE;
      }
    }

    if (this.heldSprite && this.mouse) {
      this.heldSprite.setPosition(
        this.mouse.x - this.heldSprite.width / 2,
        this.mouse.y - this.heldSprite.height / 2
      );
    }

    this.sprites = [];
    for (let sprite of this.droppedSprites.sprites || []) {
      this.sprites.push(sprite);
    }
    for (let sprite of this.displaySprites.sprites || []) {
      this.sprites.push(sprite);
    }
    if (this.heldSprite) {
      this.sprites.push(this.heldSprite);
    }
  }

  /**
   * Draws the canvas. Outlines the canvas and draws all display sprites, dropped sprites, and the held sprite.
   * @override
   */
  draw() {
    super.draw();
  }

  /**
   * On the mouse being pressed, selects the element grabbed (if there is one).
   */
  onMouseDown() {
    let display = this.displaySprites.getSprite(this.mouse.x, this.mouse.y);
    if (display) {
      this.heldSprite = Object.assign(
        Object.create(Object.getPrototypeOf(display)), display);
    } else {
      let dropped = this.droppedSprites.getSprite(this.mouse.x, this.mouse.y);
      if (dropped) {
        this.heldSprite = dropped;
        this.droppedSprites.removeSprite(dropped);
      }
    }
  }

  /**
   * On the mouse being released, drops the element held (if there is one). It also
   * checks if the dropped element overlaps any other elements. If it overlaps one of
   * the display sprites, it is removed from the canvas. If it overlaps one of the
   * other dropped sprites, it attempts to combine the two elements.
   */
  onMouseUp() {
    'use strict';
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
      let result = this.combine(this.heldSprite, droppedOverlap.sprite);

      if (result) {
        this.heldSprite = null;
        result.setPosition(droppedOverlap.sprite.x, droppedOverlap.sprite.y);
        result.setSize(droppedOverlap.sprite.width,
          droppedOverlap.sprite.height);
        this.droppedSprites.removeIndex(droppedOverlap.index);
        this.droppedSprites.add(result);
        return;
      }
    }

    this.droppedSprites.add(this.heldSprite);
    this.heldSprite = null;
  }
}