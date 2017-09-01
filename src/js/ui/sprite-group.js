/**
 *
 * @constructor
 */
function SpriteGroup() {
  this.sprites = [];

  this.add = function(sprite) {
    'use strict';
    this.sprites.push(sprite);
  };

  this.removeIndex = function(index) {
    'use strict';
    return this.sprites.splice(index, 1);
  };

  this.removeSprite = function(sprite) {
    'use strict';
    var index = this.sprites.indexOf(sprite);
    if (index >= 0 && index < this.sprites.length) {
      return this.removeIndex(index);
    }
    return null;
  };

  this.size = function() {
    'use strict';
    return this.sprites.length;
  };

  this.getSprite = function(x, y) {
    'use strict';
    console.log('Get Sprite...');
    console.log(JSON.stringify(this.sprites));
    for (var i = 0; i < this.sprites.length; i++) {
      var sprite = this.sprites[i];
      if (sprite.contains(x, y)) {
        return sprite;
      }
    }
    return null;
  };

  this.getOverlap = function(sprite) {
    'use strict';
    console.log('Get Overlap...');
    console.log(JSON.stringify(this.sprites));
    for (var i = 0; i < this.sprites.length; i++) {
      var groupSprite = this.sprites[i];
      console.log('-----------------------');
      console.log(JSON.stringify(groupSprite));
      console.log(JSON.stringify(sprite));
      if (groupSprite.overlaps(sprite)) {
        console.log('Overlap!');
        return {
          sprite: groupSprite,
          index: i
        };
      }
    }
    return null;
  };
}