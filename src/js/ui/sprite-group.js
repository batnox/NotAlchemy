/**
 * Creates a sprite group.
 * @constructor
 */
function SpriteGroup() {
  this.sprites = [];

  /**
   * Adds the sprite to the group.
   * @param sprite {Sprite} The sprite to add.
   */
  this.add = function(sprite) {
    'use strict';
    this.sprites.push(sprite);
  };

  /**
   * Removes the sprite from the group.
   * @param index {number} The index to remove.
   * @returns {Sprite} The sprite removed.
   */
  this.removeIndex = function(index) {
    'use strict';
    return this.sprites.splice(index, 1)[0];
  };

  /**
   * Removes the sprite from the group.
   * @param sprite {Sprite} The sprite to remove.
   * @returns {Sprite} The sprite removed or <code>null</code> if the sprite was not part of the group.
   */
  this.removeSprite = function(sprite) {
    'use strict';
    var index = this.sprites.indexOf(sprite);
    if (index >= 0 && index < this.sprites.length) {
      return this.removeIndex(index);
    }
    return null;
  };

  /**
   * Returns the number of sprites in the group.
   * @returns {Number} the number of sprites in the group.
   */
  this.size = function() {
    'use strict';
    return this.sprites.length;
  };

  /**
   * Returns the sprite at the given coordinates.
   * @param x {Number} The x-coordinate.
   * @param y {Number} The y-coordinate.
   * @returns {Sprite} The sprite at the coordinates or <code>null</code> if there is no sprite at the coordinates.
   */
  this.getSprite = function(x, y) {
    'use strict';
    for (var i = 0; i < this.sprites.length; i++) {
      var sprite = this.sprites[i];
      if (sprite.contains(x, y)) {
        return sprite;
      }
    }
    return null;
  };

  /**
   * Returns the sprite overlapping with the given sprite.
   * @param sprite {Sprite} The sprite to check against.
   * @returns {Sprite} The overlapping sprite or <code>null</code> if there is no overlapping sprite.
   */
  this.getOverlap = function(sprite) {
    'use strict';
    for (var i = 0; i < this.sprites.length; i++) {
      var groupSprite = this.sprites[i];
      if (groupSprite.overlaps(sprite)) {
        return {
          sprite: groupSprite,
          index: i
        };
      }
    }
    return null;
  };
}