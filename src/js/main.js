$(function() {
  var canvas = document.getElementById('alchemy-canvas');

  var displaySprites = new SpriteGroup();
  var droppedSprites = new SpriteGroup();
  /**
   * @type Sprite
   */
  var heldSprite = null;

  var mouse = null;

  var TICK_PER_SECOND = 30;

  function update() {
    'use strict';
    var x = 0;
    var y = 0;
    displaySprites = new SpriteGroup();
    knownElements.forEach(function(element) {
      var sprite = new Sprite(x, y, 80, 80, element.imageSrc, element.id);
      displaySprites.add(sprite);
      x += 80;

      if (x + 80 > canvas.width) {
        x = 0;
        y += 80;
      }
    });

    if (heldSprite && mouse) {
      heldSprite.x = mouse.x - heldSprite.image.width / 2;
      heldSprite.y = mouse.y - heldSprite.image.height / 2;
    }
  }

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
      ctx.drawImage(sprite.image, sprite.x, sprite.y, sprite.width, sprite.height);
    });
    if (heldSprite) {
      ctx.drawImage(heldSprite.image, heldSprite.x, heldSprite.y, heldSprite.width, heldSprite.height);
    }
  }

  function getSprite(x, y) {
    'use strict';
    var displaySprite = displaySprites.getSprite(x, y);
    if (displaySprite) {
      console.log('Display Sprite: ' + JSON.stringify(displaySprite));
      return displaySprite;
    }

    var droppedSprite = droppedSprites.getSprite(x, y);
    if (droppedSprite) {
      console.log('Dropped Sprite: ' + JSON.stringify(droppedSprite));
      return droppedSprite;
    }

    console.log('R - Null');
    return null;
  }

  function onMouseDown(event) {
    'use strict';
    var pos = getMousePosition(event);
    console.log('Click (' + pos.x + ', ' + pos.y + ')');
    heldSprite = getSprite(pos.x, pos.y);
    droppedSprites.removeSprite(heldSprite);
    console.log('HS: ' + heldSprite);
  }

  function onMouseUp(event) {
    'use strict';
    var pos = getMousePosition(event);
    console.log('*** MOUSE UP – Click (' + pos.x + ', ' + pos.y + ')');

    if (!heldSprite) {
      console.log('*** No Held Sprite ***');
      return;
    }

    var displayOverlap = displaySprites.getOverlap(heldSprite);
    if (displayOverlap) {
      console.log('*** Display Overlap ***');
      heldSprite = null;
      return;
    }

    var droppedOverlap = droppedSprites.getOverlap(heldSprite);
    if (droppedOverlap) {
      console.log('*** Dropped Overlap ***');
      console.log(JSON.stringify(droppedOverlap));

      var heldElement = getElement(heldSprite.data);
      var droppedElement = getElement(droppedOverlap.sprite.data);
      console.log(heldElement);
      console.log(droppedElement);
      var result = combine(heldElement, droppedElement);
      console.log('Result: ' + JSON.stringify(result));

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

    console.log('*** No Restore / Combine ***');
    droppedSprites.add(heldSprite);
    heldSprite = null;
  }

  function onMouseMove(event) {
    'use strict';
    mouse = getMousePosition(event);
  }

  function getMousePosition(event) {
    'use strict';
    return {
      x: event.x - canvas.getBoundingClientRect().left,
      y: event.y - canvas.getBoundingClientRect().top
    };
  }

  addEventListener('mousedown', onMouseDown);
  addEventListener('mouseup', onMouseUp);
  addEventListener('mousemove', onMouseMove);

  console.log('Loading...');
  loadContent()
    .then(function() {
      console.log('Loaded.');
      setInterval(function() {
        update();
        draw();
      }, 1000 / TICK_PER_SECOND);
    });
});