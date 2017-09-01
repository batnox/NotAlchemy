$(function() {
  /**
   * The pixel size of the displayed sprites.
   * @type {number}
   */
  var IMAGE_SIZE = 80;
  /**
   * The number of game loops every second.
   * @type {number}
   */
  var TICK_PER_SECOND = 30;

  /**
   * The HTML canvas on the webpage.
   * @type {Element}
   */
  var canvas = document.getElementById('alchemy-canvas');

  /**
   * The sprite group of all known element sprites. Display elements always
   * remain on the page and can be copied but not moved.
   * @type {SpriteGroup}
   */
  var displaySprites = new SpriteGroup();

  /**
   * The sprite group of all dropped element sprites. Dropped elements can
   * be moved around the page.
   * @type {SpriteGroup}
   */
  var droppedSprites = new SpriteGroup();

  /**
   * The sprite currently held by the mouse while being drag-and-dropped.
   * @type Sprite
   */
  var heldSprite = null;

  /**
   * The position of the mouse on the canvas.
   * @type {{x: number, y: number}}
   */
  var mouse = {};

  /**
   * Updates the game data to the current state. Redraws all known elements to ensure that the
   * displayed sprites are updated. Also sets the currently held sprite to be at the mouse position.
   */
  function update() {
    'use strict';
    var x = 0;
    var y = 0;
    displaySprites = new SpriteGroup();
    knownElements.forEach(function(element) {
      var sprite = new Sprite(x, y, IMAGE_SIZE, IMAGE_SIZE, element.imageSrc,
        element.id);
      displaySprites.add(sprite);
      x += IMAGE_SIZE;

      if (x + IMAGE_SIZE > canvas.width) {
        x = 0;
        y += IMAGE_SIZE;
      }
    });

    if (heldSprite && mouse) {
      heldSprite.x = mouse.x - heldSprite.width / 2;
      heldSprite.y = mouse.y - heldSprite.height / 2;
    }
  }

  /**
   * Draws the canvas. Outlines the canvas and draws all display sprites, dropped sprites, and the held sprite.
   */
  function draw() {
    'use strict';
    canvas.width = $(window).width();
    canvas.height = $(window).height();
    canvas.style.width = $(window).width();
    canvas.style.height = $(window).height();
    var ctx = canvas.getContext('2d');

    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    displaySprites.sprites.forEach(function(sprite) {
      ctx.drawImage(sprite.image, sprite.x, sprite.y, sprite.width,
        sprite.height);
      ctx.strokeRect(sprite.x, sprite.y, sprite.width, sprite.height);
    });
    droppedSprites.sprites.forEach(function(sprite) {
      ctx.drawImage(sprite.image, sprite.x, sprite.y, sprite.width,
        sprite.height);
    });
    if (heldSprite) {
      ctx.drawImage(heldSprite.image, heldSprite.x, heldSprite.y,
        heldSprite.width, heldSprite.height);
    }
  }

  /**
   * Returns the sprite located at the given coordinates.
   * @param x {number} The x-coordinate.
   * @param y {number} The y-coordinate.
   * @returns {Sprite} The sprite at the given coordinates or <code>null<code> if none is found.
   */
  function getSprite(x, y) {
    'use strict';
    var displaySprite = displaySprites.getSprite(x, y);
    if (displaySprite) {
      return displaySprite;
    }

    var droppedSprite = droppedSprites.getSprite(x, y);
    if (droppedSprite) {
      return droppedSprite;
    }

    return null;
  }

  /**
   * On the mouse being pressed, selects the element grabbed (if there is one).
   * @param event {Event} The mouse event.
   */
  function onMouseDown(event) {
    'use strict';
    var pos = getMousePosition(event);
    heldSprite = getSprite(pos.x, pos.y);
    droppedSprites.removeSprite(heldSprite);
  }

  /**
   * On the mouse being released, drops the element held (if there is one). It also
   * checks if the dropped element overlaps any other elements. If it overlaps one of
   * the display sprites, it is removed from the canvas. If it overlaps one of the
   * other dropped sprites, it attempts to combine the two elements.
   * @param event {Event} The mouse event.
   */
  function onMouseUp(event) {
    'use strict';
    var pos = getMousePosition(event);

    if (!heldSprite) {
      return;
    }

    var displayOverlap = displaySprites.getOverlap(heldSprite);
    if (displayOverlap) {
      heldSprite = null;
      return;
    }

    var droppedOverlap = droppedSprites.getOverlap(heldSprite);
    if (droppedOverlap) {
      var heldElement = getElement(heldSprite.data);
      var droppedElement = getElement(droppedOverlap.sprite.data);
      var result = combine(heldElement, droppedElement);

      if (result) {
        heldSprite = null;
        var resultSprite = new Sprite(
          droppedOverlap.sprite.x,
          droppedOverlap.sprite.y,
          droppedOverlap.sprite.width,
          droppedOverlap.sprite.height,
          result.imageSrc,
          result.id
        );
        droppedSprites.removeIndex(droppedOverlap.index);
        droppedSprites.add(resultSprite);
        return;
      }
    }

    droppedSprites.add(heldSprite);
    heldSprite = null;
  }

  /**
   * On the mouse being moved, the mouse position is updated.
   * @param event {Event} The mouse event.
   */
  function onMouseMove(event) {
    'use strict';
    mouse = getMousePosition(event);
  }

  /**
   * Converts the coordinates in the mouse event to the coordinates on the canvas.
   * @param event {Event} The mouse event
   * @returns {{x: number, y: number}}
   */
  function getMousePosition(event) {
    'use strict';
    return {
      x: event.x - canvas.getBoundingClientRect().left,
      y: event.y - canvas.getBoundingClientRect().top
    };
  }

  // Adds all of the event listeners
  addEventListener('mousedown', onMouseDown);
  addEventListener('mouseup', onMouseUp);
  addEventListener('mousemove', onMouseMove);

  // Loads content and then sets the game loop
  loadContent()
    .then(function() {
      setInterval(function() {
        update();
        draw();
      }, 1000 / TICK_PER_SECOND);
    });
});