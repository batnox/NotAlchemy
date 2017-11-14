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

    this.addContent('images', 'alchemy/json/alchemy-icons.json');
    this.addContent('combinations', 'alchemy/json/combinations.json');
    this.addContent('elements', 'alchemy/json/elements.json');
    this.addContent('known-elements', 'alchemy/json/known-elements.json');

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
          this.knownElements.push(new GameElement(res.id, res.name));
        }
        return new GameElement(res.id, res.name);
      }
    }
    return null;
  }

  /**
   * Loads all content.
   * @returns {*} A promise.
   */
  loadContent() {
    return new Promise((resolve, reject) => {
      super.loadContent()
        .then(data => {
          for (let element of data['elements'].elements) {
            let gameElement = new GameElement(element.id, element.name);
            this.elements.push(gameElement);
          }

          for (let elementID of data['known-elements'].elements) {
            this.knownElements.push(this.getElement(elementID));
          }

          for (let combination of data['combinations'].combinations) {
            this.combinations.push(new Combination(
              combination.element1,
              combination.element2,
              combination.result
            ));
          }

          let loading = 0;
          let done = false;
          for (let key in data['images']) {
            if (data['images'].hasOwnProperty(key)) {
              loading++;
              imageManager.addImage(key, data.images[key])
                .then(() => {
                  loading--;
                  if (done && loading === 0) {
                    resolve();
                  }
                });
            }
          }
          done = true;
        });
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

    this.canvas.width = $(window).width();
    this.canvas.style.width = $(window).width();
    this.canvas.height = $(window).height();
    this.canvas.style.height = $(window).height();

    this.displaySprites = new SpriteGroup();
    for (let element of this.knownElements) {
      element.bounds.setPosition(x, y);
      element.bounds.setSize(this.IMAGE_SIZE, this.IMAGE_SIZE);
      this.displaySprites.add(element);
      x += this.IMAGE_SIZE;

      if (x + this.IMAGE_SIZE > this.canvas.width) {
        x = 0;
        y += this.IMAGE_SIZE;
      }
    }

    if (this.heldSprite && this.mouse) {
      this.heldSprite.bounds.setPosition(
        this.mouse.x - this.heldSprite.bounds.width / 2,
        this.mouse.y - this.heldSprite.bounds.height / 2
      );
    }

    this.spriteLayer.clear();
    for (let sprite of this.droppedSprites.sprites || []) {
      this.spriteLayer.addDrawable(sprite);
    }
    for (let sprite of this.displaySprites.sprites || []) {
      this.spriteLayer.addDrawable(sprite);
    }
    if (this.heldSprite) {
      this.spriteLayer.addDrawable(this.heldSprite);
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
      this.heldSprite = new GameElement(display.id, display.name);
      this.heldSprite.bounds.x = display.bounds.x;
      this.heldSprite.bounds.y = display.bounds.y;
      this.heldSprite.bounds.width = display.bounds.width;
      this.heldSprite.bounds.height = display.bounds.height;
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
        result.bounds.setPosition(
          droppedOverlap.sprite.bounds.x,
          droppedOverlap.sprite.bounds.y
        );
        result.bounds.setSize(
          droppedOverlap.sprite.bounds.width,
          droppedOverlap.sprite.bounds.height
        );
        this.droppedSprites.removeIndex(droppedOverlap.index);
        this.droppedSprites.add(result);
        return;
      }
    }

    this.droppedSprites.add(this.heldSprite);
    this.heldSprite = null;
  }
}